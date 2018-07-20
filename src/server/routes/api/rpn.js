//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const rpn = require('../../../client/api/rpn');
const utils = require('../../../utils');

const payload = require('../../../client/api/test-payloads/newRpn');

/**
 * GET api/rpn/rpnByEmployer
 * @desc   Lookup RPNs by Employer
 * @access Public
 */
router.get('/rpnByEmployer', async (req, res) => {
  //TODO: Add parameters

  let dateLastUpdated = req.query.dateLastUpdated.toString();
  let employeeIds = null;

  // Check the provided date. Nullify if it is not a valid date in the format YYYY-MM-DD
  if (!utils.isValidDate(dateLastUpdated)) {
    dateLastUpdated = null;
  }

  await client
    .get(rpn.lookUpRpnByEmployer(dateLastUpdated, req.query.employeeIds))
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
    })
    .catch(err => {
      if (!res.headersSent) {
        res.status(err.statusCode || 500).send(err.message);
      } else {
        console.log(err);
      }
    });
});

/**
 * GET api/rpn/rpnByEmployee
 * @desc   Lookup RPNs by Employee PPSN
 * @access Public
 */
router.get('/rpnByEmployee/:employeeId', async (req, res) => {
  await client
    // TODO: Change this to employee once ROS fix on their end
    //.get(rpn.lookupRpnByEmployee(req.params.employeeId))
    .get(rpn.lookUpRpnByEmployer())
    .then(response => {
      let json = getEmployeeResponseJson(
        JSON.parse(response),
        req.params.employeeId
      );
      let xml = js2xmlparser.parse('response', json);

      res.set('Content-Type', 'text/xml');
      res.status(200).send(xml);
    })
    .catch(err => {
      if (!res.headersSent) {
        res.status(err.statusCode || 500).send(err.message);
      } else {
        console.log(err);
      }
    });
});

/**
 * TEMPORARY FUNCTION WHILE ROS WEB SERVICE IS NOT RETURNING RESULTS
 */
function getEmployeeResponseJson(json, ppsn) {
  json.rpns[0].employeeID.employeePpsn = ppsn;
  return json;
}

/**
 * POST api/rpn/createNewRpn
 * @desc   Create new RPN
 * @access Public
 */
router.post('/createNewRpn', async (req, res) => {
  await client
    .post(rpn.createNewRpn(JSON.stringify(payload)))
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
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
