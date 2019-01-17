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

module.exports = router;
