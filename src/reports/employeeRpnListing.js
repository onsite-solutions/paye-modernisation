//@ts-check

const mongoose = require('mongoose');
const moment = require('moment');
const validation = require('../validation');

const Rpn = require('../models/Rpn');

/**
 * Constructs a report from the provided list of JSON RPNs
 * @param {Rpn[]} rpns Collection of RPN objects to display in the report
 * @link https://tools.ietf.org/html/draft-cavage-http-signatures-08#section-4
 */
function EmployeeRpnListing(rpns) {
  this.rpns = rpns;

  this.setColumns();

  this.setHeaders();

  console.log(this.header);
  console.log(this.subHeader);

  this.setRows();

  console.log(this.rows);
}

/**
 * Constructs a column definition
 * @param {number} index the zero-based index of the column
 * @param {string} name the column name (displayed as header on report)
 * @param {number} length the total character length of the column
 */
EmployeeRpnListing.prototype.column = function(index, name, length) {
  return {
    index: index,
    name: name,
    length: length
  };
};

/**
 * Sets the column properties of the report
 */
EmployeeRpnListing.prototype.setColumns = function() {
  this.columns = [];

  this.columns.push(this.column(0, 'RPN', 4));
  this.columns.push(this.column(1, 'PPSN', 10));
  this.columns.push(this.column(2, 'Employment ID', 4));
  this.columns.push(this.column(3, 'RPN Issue Date', 10));
  this.columns.push(this.column(4, 'Employer Reference', 50));
  this.columns.push(this.column(5, 'First Name', 50));
  this.columns.push(this.column(6, 'Surname', 50));
  this.columns.push(this.column(7, 'Previous PPSN', 13));
  this.columns.push(this.column(8, 'Effective Date', 15));
  this.columns.push(this.column(9, 'End Date', 11));
  this.columns.push(this.column(10, 'Income Tax Basis', 10));
  this.columns.push(this.column(11, 'Exclusion Order', 3));
  this.columns.push(this.column(12, 'Yearly Tax Credits', 10));
  this.columns.push(this.column(13, 'Tax Rate 1', 5));
  this.columns.push(this.column(14, 'Tax Rate 1 Yearly Cut Off', 10));
  this.columns.push(this.column(15, 'Tax Rate 2', 5));
  this.columns.push(this.column(16, 'Tax Rate 2 Yearly Cut Off', 10));
  this.columns.push(this.column(17, 'Pay For Income Tax To Date', 10));
  this.columns.push(this.column(18, 'Income Tax Deducted To Date', 10));
  this.columns.push(this.column(19, 'USC Status', 8));
  this.columns.push(this.column(20, 'USC 1 Rate', 5));
  this.columns.push(this.column(21, 'USC 1 Yearly Cut Off', 10));
  this.columns.push(this.column(22, 'USC 2 Rate', 5));
  this.columns.push(this.column(23, 'USC 2 Yearly Cut Off', 10));
  this.columns.push(this.column(24, 'USC 3 Rate', 5));
  this.columns.push(this.column(25, 'USC 3 Yearly Cut Off', 10));
  this.columns.push(this.column(26, 'USC 4 Rate', 5));
  this.columns.push(this.column(27, 'USC 4 Yearly Cut Off', 10));
  this.columns.push(this.column(28, 'Pay For USC To Date', 10));
  this.columns.push(this.column(29, 'USC Deducted To Date', 10));
  this.columns.push(this.column(30, 'LPT To Deduct', 10));
  this.columns.push(this.column(31, 'PRSI Exempt', 3));
  this.columns.push(this.column(32, 'PRSI Class', 2));
};

/**
 * Creates the report Header and Sub-Header
 */
EmployeeRpnListing.prototype.setHeaders = function() {
  this.header = '';
  this.subHeader = '';

  for (let i = 0; i < this.columns.length; i++) {
    let col = this.columns[i];

    this.header = this.header + col.name.padEnd(col.length, ' ');
    this.subHeader = this.subHeader + '-'.repeat(col.length);
  }
};

EmployeeRpnListing.prototype.setRows = function() {
  this.rows = [];

  for (let i = 0; i < this.rpns.length; i++) {
    this.rows.push(this.getRow(this.rpns[i]));
  }
};

/**
 * Adds a data row to the report
 * @param {Rpn} rpn The RPN object from which to build the record
 */
EmployeeRpnListing.prototype.getRow = function(rpn) {
  let row = [];

  row.push(this.pad(rpn.rpnNumber, this.columns[0].length));
  row.push(this.pad(rpn.employeeID.employeePpsn, this.columns[1].length));
  row.push(this.pad(rpn.employeeID.employmentID, this.columns[2].length));
  row.push(
    this.pad(
      moment(rpn.rpnIssueDate).format('DD/MM/YYYY'),
      this.columns[3].length
    )
  );
  row.push(this.pad(rpn.employerReference, this.columns[4].length));
  row.push(this.pad(rpn.name.firstName, this.columns[5].length));
  row.push(this.pad(rpn.name.familyName, this.columns[6].length));
  row.push(this.pad(rpn.previousEmployeePPSN, this.columns[7].length));
  row.push(
    this.pad(
      moment(rpn.effectiveDate).format('DD/MM/YYYY'),
      this.columns[8].length
    )
  );
  row.push(
    this.pad(moment(rpn.endDate).format('DD/MM/YYYY'), this.columns[9].length)
  );
  row.push(this.pad(rpn.incomeTaxCalculationBasis, this.columns[10].length));
  row.push(
    this.pad(rpn.exclusionOrder ? 'Yes' : 'No', this.columns[11].length)
  );
  row.push(this.pad(rpn.yearlyTaxCredits, this.columns[12].length));
  row.push(this.pad(rpn.taxRates[0].taxRatePercent, this.columns[13].length));
  row.push(this.pad(rpn.taxRates[0].yearlyRateCutOff, this.columns[14].length));
  row.push(this.pad(rpn.taxRates[1].taxRatePercent, this.columns[15].length));
  row.push(this.pad(rpn.taxRates[1].yearlyRateCutOff, this.columns[16].length));
  row.push(this.pad(rpn.payForIncomeTaxToDate, this.columns[17].length));
  row.push(this.pad(rpn.incomeTaxDeductedToDate, this.columns[18].length));

  //row.push(this.pad(rpn.____, this.columns[_].length));

  //Pay For Income Tax To Date  10
  //Income Tax Deducted To Date 10
  //USC Status          8
  //USC 1 Rate        5
  //USC 1 Yearly Cut Off  10
  //USC 2 Rate        5
  //USC 2 Yearly Cut Off  10
  //USC 3 Rate        5
  //USC 3 Yearly Cut Off  10
  //USC 4 Rate        5
  //USC 4 Yearly Cut Off  10
  //Pay For USC To Date   10
  //USC Deducted To Date  10
  //LPT To Deduct     10
  //PRSI Exempt       3
  //PRSI Class        2

  return row.join('');
};

EmployeeRpnListing.prototype.pad = function(value, length) {
  if (validation.isEmpty(value)) {
    let res = '';
    return res.padEnd(length, ' ');
  } else if (value.length < length) {
    return value.padEnd(length, ' ');
  } else {
    return value;
  }
};

EmployeeRpnListing.prototype.formatBool;

module.exports = EmployeeRpnListing;
