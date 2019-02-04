//@ts-check
'use strict';

const moment = require('moment');
const config = require('../config');
const client = require('../client');
const returnsReconciliation = require('../client/api/returns-reconciliation');
const ReturnPeriodResponse = require('../models/mongodb/ReturnPeriodResponse');

/**
 * Gets all completed monthly returns for the current year
 */
async function getLastReturnPeriod() {
  const startDate = moment()
    .subtract(1, 'months')
    .startOf('month')
    .format('YYYY-MM-DD');

  const endDate = moment()
    .subtract(1, 'months')
    .endOf('month')
    .format('YYYY-MM-DD');

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

module.exports = getLastReturnPeriod;
