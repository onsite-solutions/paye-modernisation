//@ts-check

const express = require('express');
const router = express.Router();
const xml = require('xml');

const client = require('../../../client');
const clientSync = require('../../../clientSync');
const Message = require('../../../message');
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

  let rosResponse;

  await clientSync.getMessage(rpn.lookUpRpnByEmployer()).then(res => {
    rosResponse = res;
  });

  console.log(JSON.stringify(rosResponse));
  console.log(`request received at ${new Date().toUTCString()}`);

  res.set('Content-Type', 'text/xml');
  res.status(200).send(xml(rosResponse));
  //res.send('hello');
});

module.exports = router;
