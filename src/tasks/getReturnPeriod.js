//@ts-check
'use strict';

const moment = require('moment');
const config = require('../config');
const client = require('../client');
const returnsReconciliation = require('../client/api/returns-reconciliation');
const ReturnPeriodResponse = require('../models/mongodb/ReturnPeriodResponse');

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

module.exports = getReturnPeriod;
