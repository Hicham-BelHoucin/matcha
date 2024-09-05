import { plainToClass, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

function validateRequest(dtoClass: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);

    validate(dto).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}).join(", "))
          .join(", ");

        res.status(400).json({
          success: false,
          message: messages,
        });
      } else {
        next();
      }
    });
  };
}

export default validateRequest;
