//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const rpn = require('../../../client/api/rpn');

const payload = require('../../../client/api/test-payloads/newRpn');

/**
 * GET api/rpn/rpnByEmployer
 * @desc   Lookup RPNs by Employer
 * @access Public
 */
router.get('/rpnByEmployer', async (req, res) => {
  //TODO: Add parameters

  await client
    .get(rpn.lookUpRpnByEmployer())
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

/**
 * GET api/rpn/rpnByEmployee
 * @desc   Lookup RPNs by Employee
 * @access Public
 */
router.get('/rpnByEmployee', async (req, res) => {
  let employees = [];

  JSON.parse(req.query.rpnList).forEach(emp => {
    employees.push(emp);
  });

  console.log(employees[0]);

  await client
    .get(rpn.lookupRpnByEmployee(employees[0].toString()))
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

/**
 * POST api/rpn/createNewRpn
 * @desc   Create new RPN
 * @access Public
 */
router.post('/createNewRpn', async (req, res) => {
  await client
    .post(rpn.createNewRpn(JSON.stringify(payload)))
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
