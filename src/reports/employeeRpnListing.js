//@ts-check

const mongoose = require('mongoose');
const moment = require('moment');
const validation = require('../validation');

const EmployeeRpn = require('./employeeRpn');
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

  this.setEmployeeRpns();

  this.setRows();

  console.log(this.columns);
  console.log(this.employeeRpns[0]);
}

EmployeeRpnListing.prototype.getReport = function() {
  let report = [];

  report.push(this.header);
  report.push(this.subHeader);

  for (let i = 0; i < this.rows.length; i++) {
    report.push(this.rows[i]);
  }

  return report.join('\r\n');
};

/**
 * Adds a column definition
 * @param {string} name the column name (displayed as header on report)
 * @param {number} length the total character length of the column
 */
EmployeeRpnListing.prototype.addColumn = function(name, length) {
  this.columns.push({
    name: name,
    length: length
  });
};

/**
 * Sets the column properties of the report
 */
EmployeeRpnListing.prototype.setColumns = function() {
  this.columns = [];

  this.addColumn('RPN', 4);
  this.addColumn('PPSN', 10);
  this.addColumn('Employment ID', 4);
  this.addColumn('RPN Issue Date', 10);
  this.addColumn('Employer Reference', 10);
  this.addColumn('First Name', 25);
  this.addColumn('Surname', 25);
  this.addColumn('Previous PPSN', 10);
  this.addColumn('Effective Date', 15);
  this.addColumn('End Date', 11);
  this.addColumn('Income Tax Basis', 11);
  this.addColumn('Exclusion Order', 4);
  this.addColumn('Yearly Tax Credits', 10);
  this.addColumn('Tax Rate 1', 5);
  this.addColumn('Tax Rate 1 Yearly Cut Off', 10);
  this.addColumn('Tax Rate 2', 5);
  this.addColumn('Tax Rate 2 Yearly Cut Off', 10);
  this.addColumn('Pay For Income Tax To Date', 10);
  this.addColumn('Income Tax Deducted To Date', 10);
  this.addColumn('USC Status', 8);
  this.addColumn('USC 1 Rate', 5);
  this.addColumn('USC 1 Yearly Cut Off', 10);
  this.addColumn('USC 2 Rate', 5);
  this.addColumn('USC 2 Yearly Cut Off', 10);
  this.addColumn('USC 3 Rate', 5);
  this.addColumn('USC 3 Yearly Cut Off', 10);
  this.addColumn('USC 4 Rate', 5);
  this.addColumn('USC 4 Yearly Cut Off', 10);
  this.addColumn('Pay For USC To Date', 10);
  this.addColumn('USC Deducted To Date', 10);
  this.addColumn('LPT To Deduct', 10);
  this.addColumn('PRSI Exempt', 3);
  this.addColumn('PRSI Class', 2);
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

/**
 * Populates the employeeRpns array
 */
EmployeeRpnListing.prototype.setEmployeeRpns = function() {
  this.employeeRpns = [];

  for (let i = 0; i < this.rpns.length; i++) {
    this.employeeRpns.push(new EmployeeRpn(this.rpns[i]));
  }
};

/**
 * Populates the rows array
 */
EmployeeRpnListing.prototype.setRows = function() {
  this.rows = [];

  for (let i = 0; i < this.employeeRpns.length; i++) {
    let row = [];

    for (let j = 0; j < this.columns.length; j++) {
      row.push(
        this.employeeRpns[i].items[j].padEnd(this.columns[j].length, ' ')
      );
    }

    this.rows.push(row.join(''));
  }
};

module.exports = EmployeeRpnListing;
