//@ts-check

const mongoose = require('mongoose');

/**
 * Represents a Revenue Payroll Notification Employee ID
 */
const RPNEmployeeIDSchema = new mongoose.Schema({
  employeePpsn: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
    match: '[0-9A-Za-z]*',
    uppercase: true
  },
  employmentID: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 20,
    match: '[A-Za-z0-9_\\-]*'
  }
});

const RPNEmployeeID = mongoose.model('RPNEmployeeID', RPNEmployeeIDSchema);

module.exports = {
  RPNEmployeeID: RPNEmployeeID
};
