//@ts-nocheck

const mongoose = require('mongoose');
const moment = require('moment');
const validation = require('../validation');

const PayslipSummary = require('../models/PayslipSummary');

/**
 * Creates a Payslip Summary object for placement on a text report
 * @param {PayslipSummary} payslip the PayslipSummary object from which to construct the report object
 */
function payrollReportItem(payslip) {
  return {
    lineItemId: getString(payslip.lineItemID),
    employeePpsn: getString(payslip.employeeID.employeePpsn),
    employmentId: getString(payslip.employeeID.employmentID),
    employerReference: getString(payslip.employerReference),
    taxOnIncome: getString(payslip.taxOnIncome),
    prsi: getString(payslip.prsi),
    usc: getString(payslip.usc),
    lpt: getString(payslip.lpt)
  };
}

/**
 * Converts the provided value to a string and adds it to the items array
 * @param {any} value the value to be added to the array
 */
function getString(value) {
  if (!validation.isEmpty(value)) {
    return value.toString();
  } else {
    return '';
  }
}

module.exports = payrollReportItem;
