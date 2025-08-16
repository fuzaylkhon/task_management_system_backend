import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  _r: Request,
  res: Response,
  _n: NextFunction
): void => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
