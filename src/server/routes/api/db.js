//@ts-check

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const js2xmlparser = require('js2xmlparser');

const Rpn = require('../../../models/Rpn');
const RpnResponse = require('../../../models/RpnResponse');

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
        if (!res.headersSent) {
          res
            .status(err.statusCode || 500)
            .send(js2xmlparser.parse('response', JSON.parse(err.message)));
        } else {
          console.log(err);
        }
      } else {
        // Set the dateInitialised field, save and return success
        try {
          results.dateInitialised = Date.now();
          results.save();
          res.status(200).send(js2xmlparser.parse('response', 'success'));
        } catch (error) {
          if (!res.headersSent) {
            res
              .status(error.statusCode || 500)
              .send(js2xmlparser.parse('response', JSON.parse(error.message)));
          } else {
            console.log(error);
          }
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
      if (!res.headersSent) {
        res
          .status(err.statusCode || 500)
          .send(js2xmlparser.parse('response', JSON.parse(err.message)));
      } else {
        console.log(err);
      }
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

module.exports = router;
