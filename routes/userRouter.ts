import express from 'express'
import { getUsers, getUserByID, createUser, updateUser, deleteUser } from '../controllers/userController';

//add code for importing schema later on
import {userValidationSchema} from '../middlewares/userValidationSchema'

const router = express.Router()


router.get("/users", getUsers);
router.get("/users/:id", userValidationSchema("getUserById"), getUserByID);
router.post("/users", userValidationSchema("createUser"), createUser);
router.put("/users/:id", userValidationSchema("updateUser"), updateUser);
router.delete("/users/:id", userValidationSchema("deleteUser"), deleteUser);

export default router;

