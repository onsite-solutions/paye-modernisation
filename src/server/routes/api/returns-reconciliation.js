//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const returnsReconciliation = require('../../../client/api/returns-reconciliation');
const utils = require('../../../utils');

/**
 * GET api/returns_reconciliation/payrollByReturnPeriod
 * @desc   Look up payroll by returns period based on a range of dates
 * @access Public
 */
router.get('/payrollByReturnPeriod', async (req, res) => {
  let startDate = req.query.startDate.toString();
  let endDate = req.query.endDate.toString();

  // Check the provided startDate & endDate. Nullify if not a valid date in the format YYYY-MM-DD
  if (!utils.isValidDate(startDate)) {
    startDate = null;
  }

  if (!utils.isValidDate(endDate)) {
    endDate = null;
  }

  await client
    .get(returnsReconciliation.lookupPayrollByReturnPeriod(startDate, endDate))
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
    })
    .catch(err => {
      if (!res.headersSent) {
        res.status(err.statusCode || 500).send(err.message);
      } else {
        console.log(err);
      }
    });
});

module.exports = router;
