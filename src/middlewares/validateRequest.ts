import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { BadRequestError } from "../error/apiError";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      // Check if the error is an instance of ZodError
      console.log("Validation error:", error);
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => err.message);

        next(new BadRequestError(errorMessages.join(", ")));
      } else {
        next(error);
      }
    }
  };
};
