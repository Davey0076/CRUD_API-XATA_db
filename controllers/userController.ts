import { Request, Response} from "express"
import { validationResult, matchedData } from "express-validator"
import dotenv  from 'dotenv'

dotenv.config();
import { getXataClient } from "../src/xata";
const xata = getXataClient();

export const getUsers = async (req: Request, res: Response) => {
    try{
        const users = await xata.db.users.getMany()
        res.status(200).json({
            message: "User data retrieved successfully",
            data: users
        })
    }
    catch(error){
        res.status(500).json({
            message: "An unknown error has occurred while getting users"
        })
    }
}

export const getUserByID = async (req: Request, res: Response): Promise<void>=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: "Validation failed", errors: errors.array() });
    } else{
    const { id } = matchedData<{
        id: string;
    }>(req)

    try{
        const user = await xata.db.users.read(id)

        if(!user){
            res.status(400).json({
                message: "No such user exists"
            })
        }
        else{
            res.status(200).json({
                message: "User retrieved successfully",
                data: user
            })
        }

    }
    catch(error){
        res.status(500).json({
            message: "Error encountered getting specified user"
        })
    }
  }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
   res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }else{

  const {displayName, userName } = matchedData<{
    displayName: string;
    userName: string;
  }>(req)
  try{
    const newUser = await xata.db.users.create({displayName, userName})
    res.status(200).json({
        message: "User created successfully",
        data: newUser
    })
  }
  
  catch(error){
    res.status(500).json({
        message: "An unknown error was encountered while trying to create a new user"
    })
  }
}
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }
  else{

  const { id, displayName, userName } = matchedData<{
    id: string;
    displayName: string;
    userName: string;
  }>(req)

  try{
    const exists = await xata.db.users.read(id)

    if(!exists){
        res.status(400).json({
            message: "User does not exist"
        })
    }
    else{
        const updatedUser = await xata.db.users.createOrReplace({displayName, userName})

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        })
    }

  }
  catch(error){
    res.status(500).json({
        message: "An unknown error occured while tring to update the user"
    })
  }
}
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }else{

  const { id } = matchedData<{
    id: string;
  }>(req)

  try{
    const deletedUser = await xata.db.users.delete(id)

    if(!deletedUser){
        res.status(400).json({
            message: "Specified user to be deleted could not be found"
        })
    }
    else{
        res.status(200).json({
            message: "User deleted successfully....\n Please check GET for updated list of users...."
        })
    }


  }
  catch(error){
    res.status(500).json({
        message: "Unable to delete.\n Please try again..."
    })
  }
}
}

