const { Router } = require("express");

const employeesRoutes = Router();

const data = {};
data.employees = require("../../../data/data.json");

employeesRoutes
  .route("/")
  .get((req, res) => {
    res.json(data.employees);
  })
  .post((req, res) => {
    const { name, age, isWorking } = req.body;

    const id = data.employees.length + 1;

    const newEmployee = {
      id,
      name,
      age,
      isWorking
    };

    data.employees.push(newEmployee);

    res.status(201).json(newEmployee);
  })
  .put((req, res) => {
    const { id } = req.body;

    const newEmployeesData = data.employees.map((employee) => {
      if (employee.id === id) {
        employee.isWorking = !employee.isWorking;
        return employee;
      }
      return employee;
    });

    data.employees = [...newEmployeesData];

    res.status(201).json(data.employees);
  })
  .delete((req, res) => {
    const { id } = req.body;

    const newEmployeesData = data.employees.filter(
      (employee) => employee.id !== id
    );

    data.employees = [...newEmployeesData];

    res.status(204).end();
  });

employeesRoutes.get("/:id", (req, res) => {
  const { id } = req.params;

  const employee = data.employees.find((employee) => employee.id == id);

  res.json(employee);
});

module.exports = employeesRoutes;
