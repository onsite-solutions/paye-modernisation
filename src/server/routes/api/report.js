//@ts-check

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const validation = require('../../../validation');

const js2xmlparser = require('js2xmlparser');

const PayslipSummary = require('../../../models/PayslipSummary');
const Rpn = require('../../../models/Rpn');
const RpnResponse = require('../../../models/RpnResponse');
const PayrollRunResponse = require('../../../models/PayrollRunResponse');

const rpnReportCsv = require('../../../reports/rpnReportCsv');
const rpnReportText = require('../../../reports/rpnReportText.js');

const payrollReportCsv = require('../../../reports/payrollReportCsv');

/**
 * GET api/report/rpnReport/byEmployeePpsn/format/employeePpsn
 * @desc   Return a report of the RPN history for an employee
 * @access Public
 */
router.get('/rpnReport/byEmployeePpsn/:format/:employeePpsn/', (req, res) => {
  // Get the RPN records where the PPSN matches the provided value
  RpnResponse.aggregate([
    {
      $match: {
        'rpns.employeeID.employeePpsn': req.params.employeePpsn
      }
    },
    {
      $addFields: {
        rpns: {
          $filter: {
            input: '$rpns',
            as: 'rpns',
            cond: {
              $eq: ['$$rpns.employeeID.employeePpsn', req.params.employeePpsn]
            }
          }
        }
      }
    }
  ]).exec((err, results) => {
    if (err) {
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
    } else {
      try {
        let rpns = [];

        // Result may have multiple arrays of RPNs. Loop through these
        for (var i = 0; i < results.length; i++) {
          // Loop through each RPN in the array
          for (var j = 0; j < results[i].rpns.length; j++) {
            // Add the RPN to the response collection
            //console.log(new Rpn(results[i].rpns[j]));
            rpns.push(new Rpn(results[i].rpns[j]));
          }
        }

        // Sort the results by RPN Issue Date and then RPN Number
        rpns.sort((a, b) => {
          if (a.rpnIssueDate == b.rpnIssueDate) {
            return a.rpnNumber - b.rpnNumber;
          } else {
            // Sort by date (unary +new to coerce the date value to a number)
            return +new Date(a.rpnIssueDate) - +new Date(b.rpnIssueDate);
          }
        });

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
 * GET api/report/rpnReport/byFileName/format/fileName
 * @desc   Return a report of the RPN history for a file (by File Name)
 * @access Public
 */
router.get('/rpnReport/byFileName/:format/:fileName/', (req, res) => {
  // Get the RPN records where the PPSN matches the provided value
  RpnResponse.findOne({ fileName: req.params.fileName }).exec(
    (err, results) => {
      if (err) {
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
      } else {
        try {
          let rpns = [];

          // Loop through each RPN in the array
          for (var i = 0; i < results.rpns.length; i++) {
            // Add the RPN to the response collection
            rpns.push(new Rpn(results.rpns[i]));
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
          console.error(error);
        }
      }
    }
  );
});

/**
 * GET api/report/payrollReport/byRunReference/format/runReference
 * @desc   Return a report of the Payroll Run history (by Run Reference)
 * @access Public
 */
router.get(
  '/payrollReport/byRunReference/:format/:runReference/',
  (req, res) => {
    // Get the RPN records where the PPSN matches the provided value
    PayrollRunResponse.findOne({
      payrollRunReference: req.params.runReference
    }).exec((err, results) => {
      if (err) {
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
      } else {
        try {
          if (validation.isEmpty(results) || !results.payslipSummaries) {
            res.status(200).send('No records found');
            return;
          }

          let payslips = [];

          // Loop through each RPN in the array
          for (var i = 0; i < results.payslipSummaries.length; i++) {
            // Add the Payslips to the response collection
            payslips.push(new PayslipSummary(results.payslipSummaries[i]));
          }

          res.set('Content-Type', 'text/plain');

          if (req.params.format.toLowerCase() == 'csv') {
            // Send the CSV report
            res.status(200).send(payrollReportCsv(payslips));
          } else if (req.params.format.toLowerCase() == 'text') {
            // Send the text report
            res.status(200).send('text');
          } else {
            res.status(200).send();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
);

module.exports = router;
