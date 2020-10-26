const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var employeeWithSalarySchema = new mongoose.Schema({
  email: String,
  password: String
});

employeeWithSalarySchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

employeeWithSalarySchema.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('employeeWithSalary', employeeWithSalarySchema);
