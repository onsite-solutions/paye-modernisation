//@ts-nocheck

const mongoose = require('mongoose');
const moment = require('moment');
const validation = require('../validation');

const Rpn = require('../models/Rpn');

/**
 * Creates an RPN object for placement on a text report
 * @param {Rpn} rpn the RPN objects from which to construct the report object
 */
function EmployeeRpn(rpn) {
  this.items = [];

  this.addItem(rpn.rpnNumber);
  this.addItem(rpn.employeeID.employeePpsn);
  this.addItem(rpn.employeeID.employmentID);
  this.addItem(moment(rpn.rpnIssueDate).format('DD/MM/YYYY'));
  this.addItem(rpn.employerReference);
  this.addItem(rpn.name.firstName);
  this.addItem(rpn.name.familyName);
  this.addItem(rpn.previousEmployeePPSN);
  this.addItem(moment(rpn.effectiveDate).format('DD/MM/YYYY'));
  this.addItem(moment(rpn.endDate).format('DD/MM/YYYY'));
  this.addItem(rpn.incomeTaxCalculationBasis);
  this.addItem(rpn.exclusionOrder ? 'Yes' : 'No');
  this.addItem(rpn.yearlyTaxCredits);
  this.addItem(rpn.taxRates[0].taxRatePercent);
  this.addItem(rpn.taxRates[0].yearlyRateCutOff);
  this.addItem(rpn.taxRates[1].taxRatePercent);
  this.addItem(rpn.taxRates[1].yearlyRateCutOff);
  this.addItem(rpn.payForIncomeTaxToDate);
  this.addItem(rpn.incomeTaxDeductedToDate);
  this.addItem(rpn.uscStatus);
  this.addItem(rpn.uscRates[0].uscRatePercent);
  this.addItem(rpn.uscRates[0].yearlyUSCRateCutOff);
  this.addItem(rpn.uscRates[1].uscRatePercent);
  this.addItem(rpn.uscRates[1].yearlyUSCRateCutOff);
  this.addItem(rpn.uscRates[2].uscRatePercent);
  this.addItem(rpn.uscRates[2].yearlyUSCRateCutOff);
  this.addItem(rpn.uscRates[3].uscRatePercent);
  this.addItem(rpn.uscRates[3].yearlyUSCRateCutOff);
  this.addItem(rpn.payForUSCToDate);
  this.addItem(rpn.uscDeductedToDate);
  this.addItem(rpn.lptToDeduct);
  this.addItem(rpn.prsiExempt);
  this.addItem(rpn.prsiClass);
}

/**
 * Converts the provided value to a string and adds it to the items array
 * @param {any} value the value to be added to the array
 */
EmployeeRpn.prototype.addItem = function(value) {
  if (!validation.isEmpty(value)) {
    this.items.push(value.toString());
  } else {
    this.items.push('');
  }
};

module.exports = EmployeeRpn;
