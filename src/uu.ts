import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { body, matchedData, param, validationResult } from "express-validator"; // Import express-validator

dotenv.config();
import { getXataClient } from "./xata";
const xata = getXataClient();

// Inference
const app: Express = express();
const port = process.env.PORT || 3000; // Default to port 3000 if not specified

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Get the current directory
const _dirname = path.resolve();

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// GET All Users
app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const users = await xata.db.users.getMany();

    res.status(200).json({
      message: "Users retrieved from db successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred getting users",
    });
  }
  
});

// GET One User by ID
app.get(
  "/api/v1/users/:id",
  [
    param("id").isString().withMessage("ID must be a valid String"), // Validate user ID
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = matchedData<{
      id: string;
    }>(req);

    try {
      // Fetch specific user by ID
      const user = await xata.db.users.read(id);

      if (!user) {
        res.status(404).json({
          message: "user not found",
        });
      } else {
        const transformedUser = {
          displayName: user.displayName,
          userName: user.userName,
        };
        res.status(200).json({
          message: "User data retrieved successfully",
          data: transformedUser,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred while retrieving user",
      });
    }
  }
);

// POST Request
app.post(
  "/api/v1/users",
  [
    body("displayName")
      .isLength({ min: 3, max: 15 })
      .withMessage("Display name must be at least 3 characters long"), // Validate displayName
    body("userName").notEmpty().withMessage("Username is required"), // Validate userName
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    } else {
    const { displayName, userName } = matchedData<{
      displayName: string;
      userName: string;
    }>(req);

    try {
      const newUser = await xata.db.users.create({
        displayName,
        userName,
      });

      res.status(201).json({
        message: "User created successfully.",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to create user. Please try again.",
      });
    }
  }
  }
);

// PUT Request
app.put(
  "/api/v1/users/:id",
  [
    param("id").isString().withMessage("ID must be a valid String"), // Validate user ID
    body("displayName")
      .isLength({ min: 3 })
      .withMessage("Display name must be at least 3 characters long"),
    body("userName").notEmpty().withMessage("Username is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    } else{

      const { id, displayName, userName } = matchedData<{
      id: string;
      displayName: string;
      userName: string;
    }>(req);

    try {
      const exists = await xata.db.users.read(id)

      if(!exists){
        res.status(404).json({
          message: "User not found"
        })
      }
      else{

      

      const updatedUser = await xata.db.users.createOrReplace(id, {
        displayName,
        userName,
      });

      if (!updatedUser) {
        res.status(404).json({
          message: "User not found.",
        });
      }

      res.status(200).json({
        message: "User updated successfully.",
        data: updatedUser,
      });
    }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to update user. Please try again.",
      });
    }
  }
}
);

// PATCH Request
app.patch(
  "/api/v1/users/:id",
  [
    param("id").isString().withMessage("ID must be a valid String"),
    body("displayName")
      .isLength({ min: 3 })
      .withMessage("Display name must be at least 3 characters long"),
    body("userName").notEmpty().withMessage("Username is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    } else{
    const { id, displayName, userName } = matchedData<{
      id: string;
      displayName: string;
      userName: string;
    }>(req);

    try {
      const updatedUser = await xata.db.users.update(id, {
        displayName,
        userName,
      });

      if (!updatedUser) {
        res.status(404).json({
          message: "User not found.",
        });
      }

      res.status(200).json({
        message: "User updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to update user. Please try again.",
      });
    }
  }
  }
);

// DELETE Request
app.delete(
  "/api/v1/users/:id",
  [param("id").isString().withMessage("ID must be a valid String")], // Validate user ID
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    } else{

    const { id } = matchedData<{
      id: string;
    }>(req);

    try {
      const deletedUser = await xata.db.users.delete(id);

      if (!deletedUser) {
        res.status(404).json({
          message: "User not found.",
        });
      }

      res.status(200).json({
        message: "User deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to delete user. Please try again.",
      });
    }
  }
}
);

// Start the server
app.listen(port, () => {
  console.log(
    `[server]: Server TypeScript is running at http://localhost:${port}`
  );
});
