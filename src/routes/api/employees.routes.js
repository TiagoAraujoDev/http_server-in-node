const { Router } = require("express");

const ensureAuthenticate = require("../../middleware/authentication");
const ensureRoles = require("../../middleware/ensureRoles");

const ROLES_LIST = require("../../config/rolesList");

const employeesController = require("../../controllers/employees/employeesController");

const employeesRoutes = Router();

employeesRoutes.use(ensureAuthenticate);

employeesRoutes
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    ensureRoles(ROLES_LIST.editor, ROLES_LIST.admin),
    employeesController.createEmployee
  );

employeesRoutes.put(
  "/:id",
  ensureRoles(ROLES_LIST.editor, ROLES_LIST.admin),
  employeesController.updateEmployee
);

employeesRoutes.delete(
  "/:id",
  ensureRoles(ROLES_LIST.admin),
  employeesController.deleteEmployee
);

employeesRoutes.get("/:id", employeesController.getEmployee);

module.exports = employeesRoutes;
