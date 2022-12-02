const { Router } = require("express");

const ensureAuthenticate = require("../../middleware/authentication");

const employeesController = require("../../controllers/employeesController");

const employeesRoutes = Router();

employeesRoutes.use(ensureAuthenticate);

employeesRoutes
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createEmployee)
  .put(employeesController.updateEmployeeStatus)
  .delete(employeesController.deleteEmployee);

employeesRoutes.get("/:id", employeesController.getEmployee);

module.exports = employeesRoutes;
