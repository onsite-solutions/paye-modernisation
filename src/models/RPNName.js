//@ts-check

const mongoose = require('mongoose');

/**
 * Represents a Revenue Payroll Notification Employee Name
 */
const RPNNameSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 100
  },
  familyName: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 100
  }
});

const RPNName = mongoose.model('RPNName', RPNNameSchema);

module.exports = {
  RPNName: RPNName
};
