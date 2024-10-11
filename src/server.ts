import express, { Express } from "express";
import dotenv from "dotenv";
import userRoutes from "../routes/userRouter";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
