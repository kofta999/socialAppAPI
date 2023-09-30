import { body } from "express-validator";
import { Request } from "express";
import { validationResult } from "express-validator";

export const validationErrorHandler = (req: Request) => {
  const possibleErrors = validationResult(req);
  if (!possibleErrors.isEmpty()) {
    const errors = possibleErrors.array();
    // TODO: Improve error result
    return errors
  }
  return []
}

export const signUpValidator = [
  body("fullName").isAlphanumeric().isLength({ min: 3 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 }),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 }),
]

const contentValidator = [
  body("content").isLength({min: 1})
]

export const postValidator = [...contentValidator];

export const commentValidator = [...contentValidator];