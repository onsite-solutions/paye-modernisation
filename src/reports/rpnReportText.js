//@ts-check

const mongoose = require('mongoose');
const moment = require('moment');
const validation = require('../validation');

const rpnReportItem = require('./rpnReportItem');
const Rpn = require('../models/mongodb/Rpn');

/**
 * Constructs a report from the provided list of JSON RPNs
 * @param {Rpn[]} rpns Collection of RPN objects to display in the report
 */
function EmployeeRpnReportText(rpns) {
  this.rpns = rpns;
}

EmployeeRpnReportText.prototype.getReport = function() {
  let report = [];

  report.push(
    'CDETB Revenue Payroll Notification Report' +
      ' '.repeat(30) +
      moment().format('D MMM, YYYY')
  );

  report.push('');

  report.push(`Total RPN Count: ${this.rpns.length}`);

  report.push('-'.repeat(80));
  report.push('');

  for (let i = 0; i < this.rpns.length; i++) {
    report.push(this.getRow(this.rpns[i]));
  }

  return report.join('\n');
};

EmployeeRpnReportText.prototype.getRow = function(rpn) {
  let item = rpnReportItem(rpn);
  let row = [];

  row.push(
    //@ts-ignore padEnd is an ES2017 feature and raising a TypeScript error
    `Name: ${(item.familyName + ' ' + item.firstName).padEnd(29)} ` +
      `RPN: ${item.rpnNumber.padEnd(19)} Issue Date: ${item.rpnIssueDate} `
  );
  //@ts-ignore padEnd is an ES2017 feature and raising a TypeScript error
  row.push(`${''.padEnd(60)} (${item.rpnIssuedDays} days old)`);

  row.push(
    `PPSN: ${item.employeePpsn.padEnd(29)} ` +
      `Staff No: ${item.employerReference.padEnd(14)} ` +
      `Employment ID: ${item.employmentId.padEnd(1)}`
  );

  row.push(
    `Effective Date: ${item.effectiveDate.padEnd(19)} ` +
      `End Date: ${item.endDate.padEnd(10)} `
  );

  row.push('');

  row.push(
    `Pay For Income Tax To Date: ${item.payForIncomeTaxToDate.padEnd(7)} ` +
      `Income Tax Deducted To Date: ${item.incomeTaxDeductedToDate}`
  );

  row.push(
    `Pay For USC To Date: ${item.payForUSCToDate.padEnd(14)} ` +
      `USC Deducted To Date: ${item.uscDeductedToDate}`
  );

  row.push(
    `Income Tax Basis: ${item.incomeTaxCalculationBasis.padEnd(17)} ` +
      `Exclusion Order: ${item.exclusionOrder.padEnd(7)} ` +
      `PRSI Class: ${item.prsiClass}`
  );

  row.push(
    `Yearly Tax Credits: ${item.yearlyTaxCredits.padEnd(15)} ` +
      `USC Status: ${item.uscStatus.padEnd(13)}` +
      `LPT To Deduct: ${item.lptToDeduct}`
  );

  row.push('');

  row.push('Tax Rate      Yearly Cut Off        USC Rate      Yearly Cut Off');

  row.push(
    `${item.taxRate1.padEnd(14)}${item.taxRate1YearlyCutOff.padEnd(22)}` +
      `${item.usc1Rate.padEnd(14)}${item.usc1YearlyCutOff} `
  );

  row.push(
    `${item.taxRate2.padEnd(14)}${item.taxRate2YearlyCutOff.padEnd(22)}` +
      `${item.usc2Rate.padEnd(14)}${item.usc2YearlyCutOff} `
  );

  row.push(
    ' '.repeat(36) + `${item.usc3Rate.padEnd(14)}${item.usc3YearlyCutOff} `
  );

  row.push(
    ' '.repeat(36) + `${item.usc4Rate.padEnd(14)}${item.usc4YearlyCutOff} `
  );

  row.push('-'.repeat(80));
  row.push('');

  return row.join('\n');
};

module.exports = EmployeeRpnReportText;
