//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

/**
 * POST api/convert/jsontoxml
 * @desc   Convert the provided json payload to xml
 * @access Public
 */
router.post('/jsontoxml', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.status(200).send(js2xmlparser.parse('response', req.body));
});

module.exports = router;
