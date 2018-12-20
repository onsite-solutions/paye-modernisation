//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');

const client = require('../../../client');
const handshake = require('../../../client/api/handshake');

/**
 * GET api/handshake
 * @desc   Connectivity handshake
 * @access Public
 */
router.get('/', async (req, res) => {
  await client
    .get(handshake.handshake())
    .then(response => {
      res.set('Content-Type', 'text/xml');
      res
        .status(200)
        .send(js2xmlparser.parse('response', JSON.parse(response)));
    })
    .catch(err => {
      if (!res.headersSent) {
        res
          .status(err.statusCode || 500)
          .send(js2xmlparser.parse('response', JSON.parse(err.message)));
      } else {
        console.log(err);
      }
    });
});

module.exports = router;
