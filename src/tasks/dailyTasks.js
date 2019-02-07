//@ts-check
'use strict';

const moment = require('moment');
const getReturnPeriod = require('./getReturnPeriod');
const getPayrollRun = require('./getPayrollRun');
const getPayrollSubmission = require('./getPayrollSubmission');
const copyRpnsToSql = require('./copyRpnsToSql');
const copySubmissionsToSql = require('./copySubmissionsToSql');

/**
 * Gets year, start of month and end of month for the previous month and current month
 */
function getPeriods() {
  return [
    {
      year: moment()
        .subtract(1, 'months')
        .year(),
      startDate: moment()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD')
    },
    {
      year: moment().year(),
      startDate: moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .endOf('month')
        .format('YYYY-MM-DD')
    }
  ];
}

/**
 * Queries API and updates ReturnPeriods, PayrollRuns and PayrollSubmissions to Mongo
 * Run for the last period and the current period
 */
async function updateSubmissionsMongo() {
  const periods = getPeriods();

  try {
    for (let i = 0; i < periods.length; i++) {
      const returnPeriod = await getReturnPeriod(
        periods[i].startDate,
        periods[i].endDate
      );

      for (let j = 0; j < returnPeriod.payrollRunDetails.length; j++) {
        let payrollRunReference =
          returnPeriod.payrollRunDetails[j].payrollRunReference;

        let runResponse = await getPayrollRun(
          periods[i].year,
          payrollRunReference
        );

        for (let k = 0; k < runResponse.submissions.length; k++) {
          let submissionId = runResponse.submissions[k].submissionID;

          getPayrollSubmission(
            periods[i].year,
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
 * Runs scheduled database maintenance tasks
 */
async function run() {
  try {
    await updateSubmissionsMongo();

    await copyRpnsToSql();

    await copySubmissionsToSql();
  } catch (error) {
    console.error(error);
  }
}

module.exports = { run };
