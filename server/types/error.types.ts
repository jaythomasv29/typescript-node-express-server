
export interface CustomError extends Error{
  status?: number;
  message: string;
}

export interface ErrorRequestHandler {
  status?: number;
  message?: string;
  stack?: string;
}