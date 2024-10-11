import { body, param } from "express-validator";

export const userValidationSchema = (method: string) => {
  switch (method) {
    case "getUserById":
    case "deleteUser": {
      return [param("id").isString().withMessage("ID must be a valid string")];
    }
    case "createUser":
    case "updateUser": {
      return [
        body("displayName")
          .isLength({ min: 3, max: 15 })
          .withMessage("Display name must be at least 3 characters long"),
        body("userName").notEmpty().withMessage("Username is required"),
      ];
    }
    default: {
      return [];
    }
  }
};

