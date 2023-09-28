import { body } from "express-validator";

export const signUpValidator = [
  body("fullName").isAlphanumeric().isLength({ min: 3 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 }),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 }),
]