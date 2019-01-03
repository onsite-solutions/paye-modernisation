//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');
const path = require('path');
const RpnResponse = require('./../models/RpnResponse');

/**
 * GET /upload/rpns
 * @desc   Upload JSON RPN file to Payroll
 * @access Public
 */
router.get('/', (req, res) => {
  var filePath = path.join(__dirname, '../views/index.html');
  res.sendFile(filePath);
});

/**
 * POST api/upload/rpns
 * @desc   Upload JSON RPN file to Payroll
 * @access Public
 */
router.post('/', (req, res) => {
  console.log(req.body);

  // Save response to MongoDB
  //new RpnResponse(req.body).save();
});

module.exports = router;
