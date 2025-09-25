import { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { ZodSchema, ZodError } from "zod";

type Schemas = {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

export function validateRequest(schemas: Schemas) {
  return (
    req: Request<ParamsDictionary, any, any, any>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "ValidationError",
          issues: err.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
            code: i.code,
          })),
        });
      }
      return res.status(400).json({ error: "Invalid request" });
    }
  };
}
