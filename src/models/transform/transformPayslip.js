//@ts-check
'use strict';

const moment = require('moment');
const validation = require('../../validation');
const sequelize = require('../../sequelize');
const SqlPayslip = sequelize.Payslip;

/**
 * Transform a MongoDB Payslip model instance to a MySQL model instance
 * @param {any} submission
 * @param {any} payslip
 */
function transform(submission, payslip) {
  let dateOfBirth = null;
  let startDate = null;
  let leaveDate = null;
  let taxRate1 = null; // payslip.taxRates[0].index,
  let taxRate1CutOff = null; //payslip.taxRates[0].rateCutOff,
  let taxRate2 = null; //payslip.taxRates[1].index,
  let taxRate2CutOff = null; //payslip.taxRates[1].rateCutOff,

  if (!validation.isEmpty(payslip.dateOfBirth)) {
    dateOfBirth = moment(payslip.dateOfBirth);
  }

  if (!validation.isEmpty(payslip.startDate)) {
    startDate = moment(payslip.startDate);
  }

  if (!validation.isEmpty(payslip.leaveDate)) {
    leaveDate = moment(payslip.leaveDate);
  }

  if (!validation.isEmpty(payslip.taxRates[0])) {
    taxRate1 = payslip.taxRates[0].index;
    taxRate1CutOff = payslip.taxRates[0].rateCutOff;
  }

  if (!validation.isEmpty(payslip.taxRates[1])) {
    taxRate2 = payslip.taxRates[1].index;
    taxRate2CutOff = payslip.taxRates[1].rateCutOff;
  }

  return SqlPayslip.build({
    year: submission.taxYear,
    payrollRun: submission.payrollRunReference,
    submissionId: submission.submissionID,
    lineItemId: payslip.lineItemID,
    previousLineItemId: payslip.previousLineItemID,
    ppsn: payslip.employeeID.employeePpsn,
    employmentId: payslip.employeeID.employmentID,
    employerReference: payslip.employerReference,
    firstName: '',
    familyName: '',
    dateOfBirth: dateOfBirth,
    startDate: startDate,
    leaveDate: leaveDate,
    payFrequency: payslip.payFrequency,
    payPeriods: payslip.numberOfPayPeriods,
    rpnNumber: payslip.rpnNumber,
    taxCredits: payslip.taxCredits,
    taxRate1: taxRate1,
    taxRate1CutOff: taxRate1CutOff,
    taxRate2: taxRate2,
    taxRate2CutOff: taxRate2CutOff,
    taxBasis: payslip.incomeTaxCalculationBasis,
    payDate: moment(payslip.payDate),
    grossPay: payslip.grossPay,
    payForIncomeTax: payslip.payForIncomeTax,
    incomeTaxPaid: payslip.incomeTaxPaid,
    payForEmployeePrsi: payslip.payForEmployeePRSI,
    payForEmployerPrsi: payslip.payForEmployerPRSI,
    employeePrsiPaid: payslip.employeePRSIPaid,
    employerPrsiPaid: payslip.employerPRSIPaid,
    payForUsc: payslip.payForUSC,
    uscStatus: payslip.uscStatus,
    uscPaid: payslip.uscPaid,
    lptDeducted: payslip.lptDeducted
  });
}

module.exports = transform;
