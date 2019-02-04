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
async function getMonthlyReturns() {
  const months = getMonths(config.year);

  for (let month of months) {
    if (moment(month.end) < moment()) {
      let response = await client
        .get(
          returnsReconciliation.lookupPayrollByReturnPeriod(
            month.start,
            month.end
          )
        )
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
    }
  }
}

function getMonths(year) {
  let months = [];

  for (let i = 0; i < 12; i++) {
    months.push({
      start: moment([year, i]).format('YYYY-MM-DD'),
      end: moment([year, i])
        .endOf('month')
        .format('YYYY-MM-DD')
    });
  }

  return months;
}

module.exports = getMonthlyReturns;
