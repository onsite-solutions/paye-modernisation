//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const rpn = require('../../../client/api/rpn');
const validation = require('../../../validation');

const RpnResponse = require('../../../models/RpnResponse');

/**
 * GET api/rpn/rpnByEmployer
 * @desc   Lookup RPNs by Employer
 * @access Public
 */
router.get('/rpnByEmployer', async (req, res) => {
  let dateLastUpdated = '';
  let employeeIds = [];

  // Check the provided date. Nullify if it is not a valid date in the format YYYY-MM-DD
  if (validation.isDate(req.query.dateLastUpdated)) {
    dateLastUpdated = req.query.dateLastUpdated.toString();
  } else {
    dateLastUpdated = null;
  }

  // Populate the array of employeeIds if any were provided
  if (!validation.isEmpty(req.query.employeeIDs)) {
    employeeIds = req.query.employeeIDs.replace(/\s+/g, '').split(',');
  } else {
    employeeIds = null;
  }

  await client
    .get(rpn.lookUpRpnByEmployer(dateLastUpdated, employeeIds))
    .then(response => {
      res
        .set('Content-Type', 'text/xml')
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
