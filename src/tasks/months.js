//@ts-check
'use strict';

const moment = require('moment');

/**
 * Gets year, start of month and end of month for the previous month and current month
 */
const periods = [
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

module.exports = periods;
