//@ts-check
'use strict';

const months = require('./months');
const moment = require('moment');
const ReturnPeriodResponse = require('../models/mongodb/ReturnPeriodResponse');
const PayrollSubmissionResponse = require('../models/mongodb/PayrollSubmissionResponse');

/**
 * Gets ReturnPeriodResponses from the current month and previous month
 */
function getReturnPeriodResponses() {
  try {
    return ReturnPeriodResponse.find({
      $or: [
        { 'returnPeriod.periodStartDate': months[0].startDate },
        { 'returnPeriod.periodStartDate': months[1].startDate }
      ]
    }).distinct('payrollRunDetails.payrollRunReference');
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Get submission responses for the provided payroll run references
 * @param {string[]} payrollRuns payroll run references
 */
function getPayrollSubmissionResponses(payrollRuns) {
  try {
    return PayrollSubmissionResponse.find({
      payrollRunReference: {
        $in: payrollRuns
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Gets PayrollSubmissions for the current month and previous month
 */
function getPayrollSubmissions() {}

async function getSubmissionsFromPayroll() {
  let returnPeriodResponses = await getReturnPeriodResponses();

  let payrollSubmissionResponses = await getPayrollSubmissionResponses(
    returnPeriodResponses
  );

  //let submissions = await getNewPayrollSubmisison

  //let payrollRuns = returnPeriodResponses.map(x =>
  //x.payrollRunDetails.map(y => y.payrollRunReference)
  //);

  console.log(returnPeriodResponses);
}

module.exports = getSubmissionsFromPayroll;
