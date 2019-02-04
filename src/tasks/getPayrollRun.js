//@ts-check
'use strict';

const client = require('../client');
const payroll = require('../client/api/payroll');

const PayrollRunResponse = require('../models/mongodb/PayrollRunResponse');

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

module.exports = getPayrollRun;
