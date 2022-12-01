const { Router } = require("express");

const employeesController = require("../../controllers/employeesController");

const employeesRoutes = Router();

employeesRoutes
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createEmployee)
  .put(employeesController.updateEmployeeStatus)
  .delete(employeesController.deleteEmployee);

employeesRoutes.get("/:id", employeesController.getEmployee);

module.exports = employeesRoutes;
