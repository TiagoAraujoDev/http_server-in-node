const { Router } = require("express");

const registerUsersController = require("../../controllers/users/registerUsersController");

const usersRoutes = Router();

usersRoutes.post("/register", registerUsersController.handleNewUser);

module.exports = usersRoutes;
