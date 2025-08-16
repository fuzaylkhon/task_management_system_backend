import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { ITaskBase } from "../types";

export interface ITaskDocument extends ITaskBase, Document {
  userId: Types.ObjectId;
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must belong to a user"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_d, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ completed: 1 });

TaskSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const Task: Model<ITaskDocument> = mongoose.model<ITaskDocument>(
  "Task",
  TaskSchema
);

export default Task;
