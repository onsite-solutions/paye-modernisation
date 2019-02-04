//@ts-check
'use strict';

const client = require('../client');
const payroll = require('../client/api/payroll');

const PayrollSubmissionResponse = require('../models/mongodb/PayrollSubmissionResponse');

/**
 * Get the PayrollSubmissionResponse for the payroll Run Reference and Submission ID,
 * saving the result to the database.
 * @param {number} year the year
 * @param {string} payrollRunReference the Payroll Run Reference
 * @param {string} submissionId the Submission ID
 */
async function getPayrollSubmission(year, payrollRunReference, submissionId) {
  let response;

  try {
    response = await client.get(
      payroll.checkPayrollSubmission(payrollRunReference, submissionId)
    );
  } catch (error) {
    throw Error(error);
  }
  let submissionResponse = new PayrollSubmissionResponse(JSON.parse(response));

  submissionResponse.year = year;
  submissionResponse.payrollRunReference = payrollRunReference;

  // If there is already a file for this payrollRunReference, remove it
  await PayrollSubmissionResponse.findOneAndRemove(
    {
      year: year,
      payrollRunReference: payrollRunReference,
      submissionID: submissionId
    },
    error => {
      if (error) {
        console.log(error);
      }
    }
  );

  // Save the record
  try {
    await submissionResponse.save();
  } catch (error) {
    throw Error(error);
  }

  return submissionResponse;
}

module.exports = getPayrollSubmission;
