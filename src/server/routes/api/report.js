//@ts-check

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const js2xmlparser = require('js2xmlparser');

const Rpn = require('../../../models/Rpn');
const RpnResponse = require('../../../models/RpnResponse');

const EmployeeRpnListing = require('../../../reports/employeeRpnListing');

/**
 * GET api/report/rpns/employeePpsn
 * @desc   Return a report of the RPN history for an employee
 * @access Public
 */
router.get('/rpns/:employeePpsn/', (req, res) => {
  // Get the RPN records where the PPSN matches the provided value
  RpnResponse.find(
    { 'rpns.employeeID.employeePpsn': req.params.employeePpsn },
    {
      rpns: {
        $elemMatch: { 'employeeID.employeePpsn': req.params.employeePpsn }
      }
    }
  ).exec((err, results) => {
    if (err) {
      if (!res.headersSent) {
        res
          .status(err.statusCode || 500)
          .send(js2xmlparser.parse('response', JSON.parse(err.message)));
      } else {
        console.log(err);
      }
    } else {
      try {
        let rpns = [];

        // Result may have multiple arrays of RPNs. Loop through these
        for (var i = 0; i < results.length; i++) {
          // Loop through each RPN in the array
          for (var j = 0; j < results[i].rpns.length; j++) {
            // Add the RPN to the response collection
            rpns.push(new Rpn(results[i].rpns[j]));
          }
        }

        // Create the report object
        let report = new EmployeeRpnListing(rpns);

        res.set('Content-Type', 'text/xml');
        res.status(200).send(rpns);
      } catch (error) {
        console.log(error);
      }
    }
  });
});

module.exports = router;
