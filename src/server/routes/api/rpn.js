//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const rpn = require('../../../client/api/rpn');
const validation = require('../../../validation');

/**
 * GET api/rpn/rpnByEmployer
 * @desc   Lookup RPNs by Employer
 * @access Public
 */

router.get('/rpnByEmployer', async (req, res) => {
  let dateLastUpdated = req.query.dateLastUpdated.toString();
  let employeeIds = [];

  // Check the provided date. Nullify if it is not a valid date in the format YYYY-MM-DD
  if (!validation.isDate(dateLastUpdated)) {
    dateLastUpdated = null;
  }

  // Populate the array of employeeIds if any were provided
  if (!validation.isEmpty(req.query.employeeIDs)) {
    employeeIds = req.query.employeeIDs.split(',');
  } else {
    employeeIds = null;
  }

  await client
    .get(rpn.lookUpRpnByEmployer(dateLastUpdated, employeeIds))
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
    })
    .catch(err => {
      if (!res.headersSent) {
        res
          .status(err.statusCode || 500)
          .send(js2xmlparser.parse('response', JSON.parse(err.message)));
      } else {
        console.log(err);
      }
    });
});

/**
 * GET api/rpn/rpnByEmployee
 * @desc   Lookup RPNs by Employee PPSN
 * @access Public
 */
router.get('/rpnByEmployee/:employeeId', async (req, res) => {
  await client
    .get(rpn.lookupRpnByEmployee(req.params.employeeId))
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
    })
    .catch(err => {
      if (!res.headersSent) {
        res
          .status(err.statusCode || 500)
          .send(js2xmlparser.parse('response', JSON.parse(err.message)));
      } else {
        console.log(err);
      }
    });
});

/**
 * POST api/rpn/createNewRpn
 * @desc   Create new RPN
 * @access Public
 */
router.post('/createNewRpn', async (req, res) => {
  await client
    .post(rpn.createNewRpn(JSON.stringify(req.body)))
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
      console.log(JSON.stringify(response));
    })
    .catch(err => {
      if (!res.headersSent) {
        res
          .status(err.statusCode || 500)
          .send(js2xmlparser.parse('response', JSON.parse(err.message)));
      } else {
        console.log(JSON.stringify(err));
      }
    });
});

module.exports = router;
