import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";

export interface ParsedParams {
  projectId: number;
}

export interface RequestWithNumericParams extends Request {
  params: ParsedParams & ParamsDictionary;
}

export function validateNumericParams(...paramNames: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const name of paramNames) {
      const value = req.params[name];

      if (value === undefined) {
        return res.status(400).json({ error: `Missing parameter: ${name}` });
      }

      const parsedValue = parseInt(value, 10);

      if (isNaN(parsedValue)) {
        return res
          .status(400)
          .json({ error: `Parameter '${name}' must be a valid number.` });
      }

      (req.params as Record<string, unknown>)[name] = parsedValue;
    }

    next();
  };
}
