const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateUser/:id", userController.updateUserProfile);
userRouter.delete("/deleteUser/:id", userController.deleteUserProfile);
userRouter.post("/user/toggleStar", userController.toggleStar);
userRouter.get("/starredRepos/:userId", userController.getStarredRepos);

module.exports = userRouter;