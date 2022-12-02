const { Router } = require("express");

const registerUsersController = require("../../controllers/users/registerUsersController");
const authUserController = require("../../controllers/users/authUserController");

const usersRoutes = Router();

usersRoutes.post("/register", registerUsersController.handleNewUser);
usersRoutes.post("/auth", authUserController.handleAuthUser);

module.exports = usersRoutes;
