//@ts-check
'use strict';

const moment = require('moment');
const sequelize = require('../../sequelize');
const SqlRpn = sequelize.Rpn;

/**
 * Transform a MongoDB RPN model instance to a MySQL model instance
 * @param {any} rpnResponse
 * @param {any} rpn
 */
function transform(rpnResponse, rpn) {
  return SqlRpn.build({
    year: rpnResponse.taxYear,
    fileName: rpnResponse.fileName,
    ppsn: rpn.employeeID.employeePpsn,
    rpn: rpn.rpnNumber,
    employmentId: rpn.employeeID.employmentID,
    rpnIssueDate: moment(rpn.rpnIssueDate),
    employerReference: rpn.employerReference,
    firstName: rpn.name.firstName,
    familyName: rpn.name.familyName,
    previousPpsn: rpn.previousEmployeePPSN,
    effectiveDate: moment(rpn.effectiveDate),
    endDate: moment(rpn.endDate),
    incomeTaxCalculationBasis: rpn.incomeTaxCalculationBasis,
    exclusionOrder: rpn.exclusionOrder ? 1 : 0,
    yearlyTaxCredits: rpn.yearlyTaxCredits,
    taxRate1: rpn.taxRates[0].taxRatePercent,
    taxRate1YearlyCutOff: rpn.taxRates[0].yearlyRateCutOff,
    taxRate2: rpn.taxRates[1].taxRatePercent,
    taxRate2YearlyCutOff: rpn.taxRates[1].yearlyRateCutOff,
    payForIncomeTaxToDate: rpn.payForIncomeTaxToDate,
    incomeTaxDeductedToDate: rpn.incomeTaxDeductedToDate,
    uscStatus: rpn.uscStatus,
    uscRate1: rpn.uscRates[0].uscRatePercent,
    uscRate1YearlyCutOff: rpn.uscRates[0].yearlyUSCRateCutOff,
    uscRate2: rpn.uscRates[1].uscRatePercent,
    uscRate2YearlyCutOff: rpn.uscRates[1].yearlyUSCRateCutOff,
    uscRate3: rpn.uscRates[2].uscRatePercent,
    uscRate3YearlyCutOff: rpn.uscRates[2].yearlyUSCRateCutOff,
    uscRate4: rpn.uscRates[3].uscRatePercent,
    uscRate4YearlyCutOff: rpn.uscRates[3].yearlyUSCRateCutOff,
    payForUscToDate: rpn.payForUSCToDate,
    uscDeductedToDate: rpn.uscDeductedToDate,
    lptToDeduct: rpn.lptToDeduct,
    prsiExempt: rpn.prsiExempt ? 1 : 0,
    prsiClass: rpn.prsiClass
  });
}

module.exports = transform;
