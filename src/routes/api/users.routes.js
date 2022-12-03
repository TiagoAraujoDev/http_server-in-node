const { Router } = require("express");

const registerUsersController = require("../../controllers/users/registerUsersController");
const authUserController = require("../../controllers/users/authUserController");
const refreshTokenController = require("../../controllers/users/refreshTokenController");

const usersRoutes = Router();

usersRoutes.post("/register", registerUsersController.handleNewUser);
usersRoutes.post("/auth", authUserController.handleAuthUser);
usersRoutes.get("/refresh-token", refreshTokenController.handleRefreshToken);

module.exports = usersRoutes;
