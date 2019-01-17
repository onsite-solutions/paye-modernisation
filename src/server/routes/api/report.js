//@ts-check

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const js2xmlparser = require('js2xmlparser');

const Rpn = require('../../../models/Rpn');
const RpnResponse = require('../../../models/RpnResponse');

const rpnReportCsv = require('../../../reports/rpnReportCsv');
const rpnReportText = require('../../../reports/rpnReportText.js');

/**
 * GET api/report/rpnReport/byEmployeePpsn/format/employeePpsn
 * @desc   Return a report of the RPN history for an employee
 * @access Public
 */
router.get('/rpnReport/byEmployeePpsn/:format/:employeePpsn/', (req, res) => {
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

        res.set('Content-Type', 'text/plain');

        if (req.params.format.toLowerCase() == 'csv') {
          // Send the CSV report
          res.status(200).send(rpnReportCsv(rpns));
        } else if (req.params.format.toLowerCase() == 'text') {
          // Send the text report
          let report = new rpnReportText(rpns);

          res.status(200).send(report.getReport());
        } else {
          res.status(200).send();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
});

/**
 * GET api/report/rpnReport/byObjectId/format/employeePpsn
 * @desc   Return a report of the RPN history for a file (by MongoDB Object ID)
 * @access Public
 */
router.get('/rpnReport/byObjectId/:objectId/', (req, res) => {
  // Get the RPN records where the PPSN matches the provided value
  RpnResponse.findOne({ _id: req.params.objectId }).exec((err, results) => {
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

        // Loop through each RPN in the array
        for (var i = 0; i < results.rpns.length; i++) {
          // Add the RPN to the response collection
          rpns.push(new Rpn(results.rpns[i]));
        }

        console.log(results);

        // Send the CSV report
        res.set('Content-Type', 'text/plain');
        res.status(200).send(rpnReportCsv(rpns));
      } catch (error) {
        console.log(error);
      }
    }
  });
});

module.exports = router;
