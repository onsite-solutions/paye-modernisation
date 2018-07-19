//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const rpn = require('../../../client/api/rpn');

/**
 * GET api/rpn/rpnByEmployee
 * @desc   Lookup RPNs by Employee
 * @access Public
 */
router.get('/rpnByEmployee', async (req, res) => {
  let employees = { employees: [] };

  JSON.parse(req.query.rpnList).forEach(emp => {
    employees.employees.push({ employee: emp });
  });

  employees.employees.forEach(emp => {
    console.log(`${new Date().toUTCString()}: ${emp.employee}`);
  });

  //TODO: CHANGE EMPLOYER TO EMPLOYEE
  await client
    .get(rpn.lookUpRpnByEmployer())
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
    })
    .catch(err => {
      res.status(err.statusCode || 500).send(err.message);
    });
});

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
      res.status(err.statusCode || 500).send(err.message);
    });
});

module.exports = router;
