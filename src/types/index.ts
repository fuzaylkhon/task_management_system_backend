import { Types } from "mongoose";
import { Request } from "express";

// Base interfaces without _id (for creating documents)
export interface IUserBase {
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskBase {
  title: string;
  description: string;
  completed: boolean;
  userId: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaces with _id (for use in application)
export interface IUser extends IUserBase {
  _id: Types.ObjectId | string;
}

export interface ITask extends ITaskBase {
  _id: Types.ObjectId | string;
}

// JWT and Auth types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}

// Response types for API
export interface UserResponse {
  id: string;
  email: string;
  role: "user" | "admin";
}

export interface TaskResponse {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string | { _id: string; email: string };
  createdAt: string;
  updatedAt: string;
}
