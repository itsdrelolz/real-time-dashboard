import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { Request, Response, NextFunction } from "express";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export function sanitizeFields(fieldNames: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
      fieldNames.forEach((fieldName) => {
        if (typeof req.body[fieldName] === "string") {
          req.body[fieldName] = purify.sanitize(req.body[fieldName]);
        }
      });
    }
    next();
  };
}
