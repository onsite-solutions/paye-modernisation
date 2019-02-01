//@ts-check

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const js2xmlparser = require('js2xmlparser');
const upload = require('../../../upload');

const RpnResponse = require('../../../models/mongodb/RpnResponse');

/**
 * POST /api/db/rpns/dateInitialised/fileName
 * @desc   Update the DateInitialised value for an RPN response file
 * @access Public
 */
router.post('/rpns/dateInitialised/:fileName', (req, res) => {
  // Find the record
  RpnResponse.findOne({ fileName: req.params.fileName }).exec(
    (err, results) => {
      if (err) {
        res
          .status(err.statusCode || 500)
          .send(js2xmlparser.parse('response', JSON.parse(err.message)));
      } else {
        // Set the dateInitialised field, save and return success
        try {
          results.dateInitialised = Date.now();
          results.save();
          res.status(200).send(js2xmlparser.parse('response', 'success'));
        } catch (error) {
          res
            .status(error.statusCode || 500)
            .send(js2xmlparser.parse('response', JSON.parse(error.message)));
        }
      }
    }
  );
});

/**
 * POST /api/db/rpns/dateUploaded/ppsn/rpn/empNo
 * @desc   Update the DateInitialised value for an RPN response file
 * @access Public
 */
router.post('/rpns/dateUploaded/:ppsn/:rpn/:empNo', (req, res) => {
  RpnResponse.find({
    'rpns.employeeID.employeePpsn': req.params.ppsn,
    'rpns.rpnNumber': req.params.rpn
  }).exec((err, results) => {
    if (err) {
      res
        .status(err.statusCode || 500)
        .send(js2xmlparser.parse('response', JSON.parse(err.message)));
    } else {
      for (let i = 0; i < results.length; i++) {
        let rpn = new RpnResponse(results[i]);

        for (let j = 0; j < rpn.rpns.length; j++) {
          // Find any record(s) that contain the relevant RPNs
          if (
            rpn.rpns[j].employeeID.employeePpsn == req.params.ppsn &&
            rpn.rpns[j].rpnNumber == req.params.rpn
          ) {
            // Update and save the RPN Response
            rpn.rpns[j].dateUploaded = Date.now();
            rpn.rpns[j].employerReference = req.params.empNo;
            rpn.save();
          }
        }
      }

      res.status(200).send(js2xmlparser.parse('response', 'success'));
    }
  });
});

/**
 * POST /api/db/rpns/getNewRpns
 * @desc   Looks up RPNs since date last update, saves to database and transfers to Payroll
 * @access Public
 */
router.post('/rpns/getNewRpns', async (req, res) => {
  await upload
    .getNewRpns()
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res.status(200).send(response);
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
