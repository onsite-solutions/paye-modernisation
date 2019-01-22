//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const returnsReconciliation = require('../../../client/api/returns-reconciliation');
const validation = require('../../../validation');

const PayrollByReturnPeriodResponse = require('../../../models/PayrollByReturnPeriodResponse');

/**
 * GET api/returns_reconciliation/payrollByReturnPeriod
 * @desc   Look up payroll by returns period based on a range of dates
 * @access Public
 */
router.get('/payrollByReturnPeriod', async (req, res) => {
  let startDate = req.query.startDate.toString();
  let endDate = req.query.endDate.toString();

  // Check the provided startDate & endDate. Nullify if not a valid date in the format YYYY-MM-DD
  if (!validation.isDate(startDate)) {
    startDate = null;
  }

  if (!validation.isDate(endDate)) {
    endDate = null;
  }

  await client
    .get(returnsReconciliation.lookupPayrollByReturnPeriod(startDate, endDate))
    .then(response => {
      // Save the response to MongoDB
      new PayrollByReturnPeriodResponse(JSON.parse(response)).save();

      // Return XML response to the client
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
    })
    .catch(err => {
      if (!res.headersSent) {
        try {
          res
            .status(err.statusCode || 500)
            .send(js2xmlparser.parse('response', err.message));
        } catch (sendError) {
          console.error(sendError);
        }
      } else {
        console.error(err);
      }
    });
});

module.exports = router;
