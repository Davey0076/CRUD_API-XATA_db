
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";


dotenv.config();
import { getXataClient } from "./xata";
const xata = getXataClient();


// Inference
const app: Express = express();
const port = process.env.PORT || 3000; // Default to port 3000 if not specified

//midle wares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Get the current directory
const _dirname = path.resolve();


// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});



app.get("/api/v1/users", async (req: Request, res: Response) => {
  try{
    const users = await xata.db.users.getAll()

    if (!users){
       res.status(404).json({
        message: "No users found"
       })
    }

     // Transforming the response to include only relevant fields
     const simplifiedUsers = users.map(user => ({
      displayName: user.displayName,
      userName: user.userName
    }));


    res.status(200).json({
      message: "Users retrieved from db successfully",
      data: simplifiedUsers
    })

  }
  catch(error){
    console.log(error)
    res.status(404).json({
      message: "An error occurred getting users"
    })
  }
  
});

// Routing parameters to get a particular user by id
app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch specific user by ID
    const user = await xata.db.users.read(id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
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
});




//POST Request
app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { displayName, userName } = req.body;

    // Validation checks
    if (!displayName || !userName) {
      res.status(400).json({
        message: "You need to include both username and display name.",
      });
    } else {
      const newUser = await xata.db.users.create({
        displayName,
        userName,
      });

      res.status(201).json({
        message: "User created successfully.",
        data: newUser,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create user. Please try again.",
    });
  }
});

// app.post("/api/v1/users", (req: Request, res: Response) => {
//   //lets destrure the income body req
//   //const body = req.body
//   //const userName = req.body.userName
//   const { body } = req;
//   //if the userData is empty, the id will be 1 else we will add 1  to ther length
//   const newID =
//     userData.length > 0 ? userData[userData.length - 1].userID + 1 : 1;

//   //push the object data to userData
//   const newData = { id: newID, ...body };
//   userData.push(newData);

//   res.status(201).json({
//     message: "Successfull post",
//     payload: newData,
//   });
// });

/**
 * {
    "message": "Successfull post",
    "payload": {
        "id": 5,
        "userName": "alamin",
        "displayName": "alamin254"
    }
}
 */

//PUT requests - will replace the entire resource, 
// the body has everything even if not modified

//PATCH - only the fields need to be changed wuill be in the request body 
// app.put("/api/v1/users/:id", (req: Request, res: Response) => {
//   //get the id from the parameter
//   const { id } = req.params;

//   //get the key-values from the req.body
//   const { body } = req;

//   //parse the incoming id from reqq into a string
//   const parsedID = parseInt(id);

//   //find the user to be updated by gettinbg their indexPositin
//   // for example userData[3] =   { userID: 4, userName: "John", displayName: "john254" },
//   // http://localhost:3000/api/v1/users/3
//   const findUserIndex = userData.findIndex(
//     (userObj) => userObj.userID === parsedID
//   );

//   //minial validations
//   if (isNaN(parsedID)) {
//     res.status(400).json({
//       message: "ID not a number",
//     });
//   }
//   //if the user is not available put error
//   // http://localhost:3000/api/v1/users/33
//   else if (findUserIndex === -1) {
//     res.status(404).json({
//       message: "User unavailable",
//     });
//   } else {
//     //update the data object where userIndex matches the parsed id
//     //update the whole object 
//     userData[findUserIndex] = { id:parsedID, ...body };
//     //return the status back to client
//     res.send(200);
//   }
// });



//PATCH - only the fields need to be changed wuill be in the request body 
// app.patch("/api/v1/users/:id", (req: Request, res: Response) => {
//   //get the id from the parameter
//   const { id } = req.params;

//   //get the key-values from the req.body
//   const { body } = req;

//   //parse the incoming id from reqq into a string
//   const parsedID = parseInt(id);

//   //find the user to be updated by gettinbg their indexPositin
//   // for example userData[3] =   { userID: 4, userName: "John", displayName: "john254" },
//   // http://localhost:3000/api/v1/users/3
//   const findUserIndex = userData.findIndex(
//     (userObj) => userObj.userID === parsedID
//   );

//   //minial validations
//   if (isNaN(parsedID)) {
//     res.status(400).json({
//       message: "ID not a number",
//     });
//   }
//   //if the user is not available put error
//   // http://localhost:3000/api/v1/users/33
//   else if (findUserIndex === -1) {
//     res.status(404).json({
//       message: "User unavailable",
//     });
//   } else {
//     //update the data object where userIndex matches the parsed id
//     //update partially
//     userData[findUserIndex] = { ...userData[findUserIndex], ...body };
//     //return the status back to client
//     res.send(200);
//   }
// });



//delete
//PATCH - only the fields need to be changed wuill be in the request body 
// app.delete("/api/v1/users/:id", (req: Request, res: Response) => {
//   //get the id from the parameter
//   const { id } = req.params;

//   //parse the incoming id from reqq into a string
//   const parsedID = parseInt(id);

//   //find the user to be updated by gettinbg their indexPositin
//   // for example userData[3] =   { userID: 4, userName: "John", displayName: "john254" },
//   // http://localhost:3000/api/v1/users/3
//   const findUserIndex = userData.findIndex(
//     (userObj) => userObj.userID === parsedID
//   );

//   //minial validations
//   if (isNaN(parsedID)) {
//     res.status(400).json({
//       message: "ID not a number",
//     });
//   }
//   //if the user is not available put error
//   // http://localhost:3000/api/v1/users/33
//   else if (findUserIndex === -1) {
//     res.status(404).json({
//       message: "User unavailable",
//     });
//   } else {
//     //use splice to delete from the array 
//     userData.splice(findUserIndex, 1)
//     //return the status back to client
//     res.status(200).json({
//       message: "Data deleted successfully"
//     })
//   }
// });


//put
app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { displayName, userName } = req.body;

    // Validation checks
    if (!displayName || !userName) {
      res.status(400).json({
        message: "You need to include both username and display name.",
      });
    } else {
      const updatedUser = await xata.db.users.update(id, {
        displayName,
        userName,
      });

      if (!updatedUser) {
        res.status(404).json({
          message: "User not found.",
        });
      } else {
        res.status(200).json({
          message: "User updated successfully.",
          data: updatedUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update user. Please try again.",
    });
  }
});


//patch
app.patch("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate if there are any updates
    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        message: "No updates provided.",
      });
    } else {
      const updatedUser = await xata.db.users.update(id, updates);

      if (!updatedUser) {
        res.status(404).json({
          message: "User not found.",
        });
      } else {
        res.status(200).json({
          message: "User updated successfully.",
          data: updatedUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update user. Please try again.",
    });
  }
});


//delete
app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await xata.db.users.delete(id);

    if (!deletedUser) {
      res.status(404).json({
        message: "User not found.",
      });
    } else {
      res.status(200).json({
        message: "User deleted successfully.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete user. Please try again.",
    });
  }
});




// Start the server
app.listen(port, () => {
  console.log(
    `[server]: Server TypeScript is running at http://localhost:${port} 😂😂😂😂`
  );
});


