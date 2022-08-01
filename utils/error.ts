import { CustomError } from "../types/error.types";
export const createError = (status: number, message: string) => {
  const err: CustomError = new Error();
  err.status = status;
  err.message = message
  return err
}