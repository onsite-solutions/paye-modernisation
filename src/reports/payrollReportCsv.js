//@ts-check

const mongoose = require('mongoose');
const moment = require('moment');
const validation = require('../validation');

const payrollReportItem = require('./payrollReportItem');
const PayslipSummary = require('../models/mongodb/PayslipSummary');

/**
 * Constructs a CSV report from the provided list of JSON Payslip Summary items
 * @param {PayslipSummary[]} payslips Collection of Payslip Summary objects to display in the report
 */
function getReport(payslips) {
  let header =
    '"Line Item ID","PPSN","Employment ID","Employer Reference","Tax On Income","PRSI","USC","LPT"';

  let report = [];

  report.push(header);

  for (let i = 0; i < payslips.length; i++) {
    let row = [];
    let slip = payrollReportItem(payslips[i]);

    for (let j in slip) {
      row.push(slip[j]);
    }

    report.push('"' + row.join('","') + '"');
  }

  return report.join('\n');
}

module.exports = getReport;
