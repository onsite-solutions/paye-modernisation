//@ts-nocheck
'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const validation = require('../validation');

const Rpn = require('../models/mongodb/Rpn');

/**
 * Creates an RPN object for placement on a text report
 * @param {Rpn} rpn the RPN objects from which to construct the report object
 */
function rpnReportItem(rpn) {
  return {
    rpnNumber: getString(rpn.rpnNumber),
    employeePpsn: getString(rpn.employeeID.employeePpsn),
    employmentId: getString(rpn.employeeID.employmentID),
    rpnIssueDate: getString(moment(rpn.rpnIssueDate).format('DD/MM/YYYY')),
    rpnIssuedDays: getString(moment().diff(moment(rpn.rpnIssueDate), 'days')),
    employerReference: getString(rpn.employerReference),
    firstName: getString(rpn.name.firstName),
    familyName: getString(rpn.name.familyName),
    previousEmployeePpsn: getString(rpn.previousEmployeePPSN),
    effectiveDate: getString(moment(rpn.effectiveDate).format('DD/MM/YYYY')),
    endDate: getString(moment(rpn.endDate).format('DD/MM/YYYY')),
    incomeTaxCalculationBasis: getString(rpn.incomeTaxCalculationBasis),
    exclusionOrder: getString(rpn.exclusionOrder ? 'Yes' : 'No'),
    yearlyTaxCredits: getString(rpn.yearlyTaxCredits),
    taxRate1: getString(rpn.taxRates[0].taxRatePercent),
    taxRate1YearlyCutOff: getString(rpn.taxRates[0].yearlyRateCutOff),
    taxRate2: getString(rpn.taxRates[1].taxRatePercent),
    taxRate2YearlyCutOff: getString(rpn.taxRates[1].yearlyRateCutOff),
    payForIncomeTaxToDate: getString(rpn.payForIncomeTaxToDate),
    incomeTaxDeductedToDate: getString(rpn.incomeTaxDeductedToDate),
    uscStatus: getString(rpn.uscStatus),
    usc1Rate: getString(rpn.uscRates[0].uscRatePercent),
    usc1YearlyCutOff: getString(rpn.uscRates[0].yearlyUSCRateCutOff),
    usc2Rate: getString(rpn.uscRates[1].uscRatePercent),
    usc2YearlyCutOff: getString(rpn.uscRates[1].yearlyUSCRateCutOff),
    usc3Rate: getString(rpn.uscRates[2].uscRatePercent),
    usc3YearlyCutOff: getString(rpn.uscRates[2].yearlyUSCRateCutOff),
    usc4Rate: getString(rpn.uscRates[3].uscRatePercent),
    usc4YearlyCutOff: getString(rpn.uscRates[3].yearlyUSCRateCutOff),
    payForUSCToDate: getString(rpn.payForUSCToDate),
    uscDeductedToDate: getString(rpn.uscDeductedToDate),
    lptToDeduct: getString(rpn.lptToDeduct),
    prsiExempt: getString(rpn.prsiExempt),
    prsiClass: getString(rpn.prsiClass),
    dateUploaded: getString(
      moment(rpn.dateUploaded).format('DD/MM/YYYY HH:mm')
    ),
    dateInitialised: getString(
      moment(rpn.dateInitialised).format('DD/MM/YYYY HH:mm')
    )
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

module.exports = rpnReportItem;
