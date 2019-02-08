//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const payroll = require('../../../client/api/payroll');

/**
 * POST api/payroll/createPayrollSubmission/:payrollRunReference/:submissionId
 * @desc   Lookup RPNs by Employee
 * @access Public
 */
router.post(
  '/createPayrollSubmission/:payrollRunReference/:submissionId',
  async (req, res) => {
    await client
      .post(
        payroll.createPayrollSubmission(
          req.params.payrollRunReference,
          req.params.submissionId,
          JSON.stringify(req.body)
        )
      )
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
  }
);

/**
 * GET api/payroll/checkPayrollSubmission/:payrollRunReference/:submissionId
 * @desc   Check the current status of a payroll submission
 * @access Public
 */
router.get(
  '/checkPayrollSubmission/:payrollRunReference/:submissionId',
  async (req, res) => {
    await client
      .get(
        payroll.checkPayrollSubmission(
          req.params.payrollRunReference,
          req.params.submissionId
        )
      )
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
  }
);

/**
 * GET api/payroll/checkPayrollRun/:payrollRunReference
 * @desc   Check the current status of a payroll run
 * @access Public
 */
router.get('/checkPayrollRun/:payrollRunReference', async (req, res) => {
  await client
    .get(payroll.checkPayrollRun(req.params.payrollRunReference))
    .then(async response => {
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
