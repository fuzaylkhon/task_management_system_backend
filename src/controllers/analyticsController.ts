import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import Task from "../models/Task";
import User from "../models/User";

export const getAnalytics = async (
  _r: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ role: "user" });

    // Total tasks
    const totalTasks = await Task.countDocuments();

    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = await Task.countDocuments({ completed: false });

    // Tasks per user aggregation
    const tasksPerUser = await Task.aggregate([
      {
        $group: {
          _id: "$userId",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: ["$completed", 1, 0] },
          },
          pendingTasks: {
            $sum: { $cond: ["$completed", 0, 1] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          email: "$user.email",
          totalTasks: 1,
          completedTasks: 1,
          pendingTasks: 1,
          completionRate: {
            $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100],
          },
        },
      },
      {
        $sort: { totalTasks: -1 },
      },
    ]);

    // Average completion rate
    const avgCompletionRate =
      tasksPerUser.length > 0
        ? tasksPerUser.reduce((acc, user) => acc + user.completionRate, 0) /
          tasksPerUser.length
        : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tasksOverTime = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTasks,
          completedTasks,
          pendingTasks,
          avgCompletionRate: avgCompletionRate.toFixed(2),
        },
        tasksPerUser,
        tasksOverTime,
      },
    });
  } catch (error) {
    next(error);
  }
};
