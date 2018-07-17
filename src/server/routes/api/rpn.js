//@ts-check

const express = require('express');
const router = express.Router();
const xml = require('xml');

/**
 * GET api/rpn/rpnByEmployee
 * @desc   Lookup RPNs by Employee
 * @access Public
 */
router.get('/rpnByEmployee', (req, res) => {
  let employees = { employees: [] };

  JSON.parse(req.query.rpnList).forEach(emp => {
    employees.employees.push({ employee: emp });
  });

  console.log(employees);

  res.set('Content-Type', 'text/xml');
  res.send(xml(employees));
});

module.exports = router;
