const employeesDB = {
  employees: require("../models/data.json"),
  setEmployees: function (data) {
    this.employees = data;
  }
};

const getAllEmployees = (req, res) => {
  return res.json(employeesDB.employees);
};

const createEmployee = (req, res) => {
  const { name, age, isWorking } = req.body;

  if (!name || !age || !isWorking) {
    return res.status(400).send("Missing body information!");
  }

  let id;

  if (employeesDB.employees.length === 0) {
    id = 1;
  } else {
    id = employeesDB.employees.length + 1;
  }

  const newEmployee = {
    id,
    name,
    age,
    isWorking
  };

  employeesDB.setEmployees([...employeesDB.employees, newEmployee]);

  return res.status(201).json(newEmployee);
};

const updateEmployeeStatus = (req, res) => {
  const { id } = req.body;

  const isValidId = employeesDB.employees.some(
    (employee) => employee.id === id
  );

  if (!isValidId) {
    return res.status(400).send("There's no employee with the given id!");
  }

  const newEmployeesData = employeesDB.employees.map((employee) => {
    if (employee.id === id) {
      employee.isWorking = !employee.isWorking;
      return employee;
    }
    return employee;
  });

  employeesDB.setEmployees([...newEmployeesData]);

  return res.status(201).json(employeesDB.employees);
};

const deleteEmployee = (req, res) => {
  const { id } = req.body;

  const isValidId = employeesDB.employees.some(
    (employee) => employee.id === id
  );

  if (!isValidId) {
    return res.status(400).send("There's no employee with the given id!");
  }

  const newEmployeesData = employeesDB.employees.filter(
    (employee) => employee.id !== id
  );

  employeesDB.setEmployees([...newEmployeesData]);

  return res.status(204).end();
};

const getEmployee = (req, res) => {
  const { id } = req.params;

  const employee = employeesDB.employees.find(
    (employee) => employee.id === parseInt(id)
  );

  if (!employee) {
    return res.status(400).send("Employee not found!");
  }

  return res.json(employee);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployee
};
