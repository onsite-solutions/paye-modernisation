//@ts-check
'use strict';

const client = require('../client');
const months = require('./months');
const payroll = require('../client/api/payroll');
const returnsReconciliation = require('../client/api/returns-reconciliation');
const PayrollRunResponse = require('../models/mongodb/PayrollRunResponse');
const PayrollSubmissionResponse = require('../models/mongodb/PayrollSubmissionResponse');
const ReturnPeriodResponse = require('../models/mongodb/ReturnPeriodResponse');

/**
 * Queries ROS API and updates ReturnPeriods, PayrollRuns and PayrollSubmissions to Mongo
 * Run for the last period and the current period
 */
async function getSubmissionsFromRos() {
  try {
    for (let i = 0; i < months.length; i++) {
      const returnPeriod = await getReturnPeriod(
        months[i].startDate,
        months[i].endDate
      );

      for (let j = 0; j < returnPeriod.payrollRunDetails.length; j++) {
        let payrollRunReference =
          returnPeriod.payrollRunDetails[j].payrollRunReference;

        let runResponse = await getPayrollRun(
          months[i].year,
          payrollRunReference
        );

        for (let k = 0; k < runResponse.submissions.length; k++) {
          let submissionId = runResponse.submissions[k].submissionID;

          getPayrollSubmission(
            months[i].year,
            payrollRunReference,
            submissionId
          );
        }
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the PayrollRunResponse for the payroll Run Reference, saving result to database
 * @param {number} year the year
 * @param {string} payrollRunReference the Payroll Run Reference
 */
async function getPayrollRun(year, payrollRunReference) {
  let response;

  try {
    response = await client.get(payroll.checkPayrollRun(payrollRunReference));
  } catch (error) {
    throw Error(error);
  }
  let payrollRunResponse = new PayrollRunResponse(JSON.parse(response));

  payrollRunResponse.year = year;
  payrollRunResponse.payrollRunReference = payrollRunReference;

  // If there is already a file for this payrollRunReference, remove it
  await PayrollRunResponse.findOneAndRemove(
    {
      year: year,
      payrollRunReference: payrollRunReference
    },
    error => {
      if (error) {
        console.log(error);
      }
    }
  );

  // Save the record
  try {
    await payrollRunResponse.save();
  } catch (error) {
    throw Error(error);
  }

  return payrollRunResponse;
}

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

/**
 * Gets all completed monthly returns for the current year
 * @param {string} startDate Period start date in the format YYYY-MM-DD
 * @param {string} endDate Period end date in the format YYYY-MM-DD
 */
async function getReturnPeriod(startDate, endDate) {
  let response = await client
    .get(returnsReconciliation.lookupPayrollByReturnPeriod(startDate, endDate))
    .catch(error => {
      console.error(error);
    });

  let returnPeriodResponse = new ReturnPeriodResponse(JSON.parse(response));

  // Delete the ReturnPeriodResponse if it already exists
  await ReturnPeriodResponse.findOneAndRemove(
    {
      returnPeriod: returnPeriodResponse.returnPeriod
    },
    error => {
      if (error) {
        console.log(error);
      }
    }
  );

  // Save the response to MongoDB
  returnPeriodResponse.save();

  return returnPeriodResponse;
}

module.exports = getSubmissionsFromRos;
