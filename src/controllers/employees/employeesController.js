const mongoose = require("mongoose");
const { format, differenceInYears } = require("date-fns");

const Employee = require("../../models/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();

  return res.json(employees);
};

const createEmployee = async (req, res) => {
  const { name, birthday, isActive, wage } = req.body;

  if (!name || !birthday) {
    return res.status(400).send("Name and age are required!");
  }

  // Birthday most be received in yyyy/MM/dd format
  const birthdayDate = format(new Date(birthday), "yyyy/MM/dd");
  const currentDate = format(new Date(), "yyyy/MM/dd");

  const age = differenceInYears(new Date(currentDate), new Date(birthdayDate));

  if (age < 18) {
    return res
      .status(400)
      .send("Age not allowed. 18 years old is the minimum!");
  }

  let wageInCents;

  if (wage) {
    wageInCents = wage * 100;
  }

  const employeeAlreadyExist = await Employee.findOne({ name: name }).exec();

  if (employeeAlreadyExist) {
    return res.sendStatus(409);
  }

  const newEmployee = new Employee({
    name,
    birthday: birthdayDate,
    wage: wageInCents,
    isActive
  });

  const result = await newEmployee.save();

  return res.status(201).json(result);
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, wage, isActive } = req.body;

  const isValidId = mongoose.isValidObjectId(id);

  console.log(isValidId);

  if (!isValidId) {
    return res.status(400).json({ message: "Invalid id!" });
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    return res.status(400).send("There's no employee with the given id!");
  }

  let wageInCents;

  if (wage) {
    wageInCents = wage * 100;
  }
  const setActiveStatus = isActive === undefined ? employee.isActive : isActive;

  const updatedEmployee = await Employee.updateOne(
    { name: employee.name },
    {
      $set: {
        name,
        wage: wageInCents,
        isActive: setActiveStatus
      }
    }
  );

  return res.status(201).json(updatedEmployee);
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  const isValidId = mongoose.isValidObjectId(id);

  console.log(isValidId);

  if (!isValidId) {
    return res.status(400).json({ message: "Invalid id!" });
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    return res.status(400).send("There's no employee with the given id!");
  }

  await Employee.findByIdAndRemove(employee._id);

  return res.status(204).end();
};

const getEmployee = async (req, res) => {
  const { id } = req.params;

  const isValidId = mongoose.isValidObjectId(id);

  console.log(isValidId);

  if (!isValidId) {
    return res.status(400).json({ message: "Invalid id!" });
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    return res.status(400).send("Employee not found!");
  }

  return res.json(employee);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
};
