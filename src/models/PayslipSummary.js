//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Revenue Payslip Summary
 */
const PayslipSummarySchema = new Schema({
  lineItemID: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 50,
    match: /[A-Za-z0-9_\\-]*/
  },
  employeeID: {
    employeePpsn: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 10,
      match: /[0-9A-Za-z]*/,
      uppercase: true
    },
    employmentID: {
      type: String,
      required: true,
      minLength: 0,
      maxLength: 20,
      match: /[A-Za-z0-9_\\-]*/
    }
  },
  employerReference: {
    type: String,
    minLength: 0,
    maxLength: 50
  },
  taxOnIncome: {
    type: Number,
    required: true
  },
  prsi: {
    type: Number,
    required: true
  },
  usc: {
    type: Number,
    required: true
  },
  lpt: {
    type: Number,
    required: true
  }
});

const PayslipSummary = mongoose.model('payslipsummary', PayslipSummarySchema);

module.exports = PayslipSummary;
