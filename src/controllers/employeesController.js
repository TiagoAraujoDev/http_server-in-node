const data = {
  employees: require("../models/data.json")
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createEmployee = (req, res) => {
  const { name, age, isWorking } = req.body;

  if (!name || !age || !isWorking) {
    res.status(400).send("Missing body information!");
  }

  let id;

  if (data.employees.length === 0) {
    id = 1;
  } else {
    id = data.employees.length + 1;
  }

  const newEmployee = {
    id,
    name,
    age,
    isWorking
  };

  data.employees.push(newEmployee);

  res.status(201).json(newEmployee);
};

const updateEmployeeStatus = (req, res) => {
  const { id } = req.body;

  const isValidId = data.employees.some((employee) => employee.id === id);

  if (!isValidId) {
    res.status(400).send("There's no employee with the given id!");
  }

  const newEmployeesData = data.employees.map((employee) => {
    if (employee.id === id) {
      employee.isWorking = !employee.isWorking;
      return employee;
    }
    return employee;
  });

  data.employees = [...newEmployeesData];

  res.status(201).json(data.employees);
};

const deleteEmployee = (req, res) => {
  const { id } = req.body;

  const isValidId = data.employees.some((employee) => employee.id === id);

  if (!isValidId) {
    res.status(400).send("There's no employee with the given id!");
  }

  const newEmployeesData = data.employees.filter(
    (employee) => employee.id !== id
  );

  data.employees = [...newEmployeesData];

  res.status(204).end();
};

const getEmployee = (req, res) => {
  const { id } = req.params;

  const employee = data.employees.find(
    (employee) => employee.id === parseInt(id)
  );

  if (!employee) {
    res.status(400).send("Employee not found!");
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployee
};
