const { Router } = require("express");

const rootRoutes = require("./root.routes");
const employeesRoutes = require("./api/employees.routes");
const usersRoutes = require("./api/users.routes");

const router = Router();

router.use("^/$", rootRoutes);
router.use("/api/employees", employeesRoutes);
router.use("/users", usersRoutes);

module.exports = router;
