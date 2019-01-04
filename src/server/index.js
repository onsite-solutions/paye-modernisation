//@ts-check

const express = require('express');
const router = express.Router();
const js2xmlparser = require('js2xmlparser');
const path = require('path');
const RpnResponse = require('./../models/RpnResponse');
const multer = require('multer');
const fs = require('fs');
const validation = require('../validation');
const Client = require('ftp');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

/**
 * GET /
 * @desc   Upload JSON RPN file to Payroll
 * @access Public
 */
router.get('/', (req, res) => {
  var filePath = path.join(__dirname, '../views/index.html');
  res.sendFile(filePath);
});

/**
 * POST /upload/
 * @desc   Upload JSON RPN file to Payroll
 * @access Public
 */
router.post('/', upload.single('file-to-upload'), (req, res) => {
  fs.readFile(req.file.path, 'utf8', (err, data) => {
    let fileBody = '';
    let fileName = req.file.originalname;

    // Check if we have been passed a .json file extension
    if (
      fileName
        .split('.')
        .pop()
        .toUpperCase() !== 'JSON'
    ) {
      return res
        .status(400)
        .json({ error: 'File must have the .json extension' });
    }

    // Check if the provided file is JSON
    try {
      fileBody = JSON.parse(data.toString());
    } catch (err) {
      // the provided file is not JSON
      return res.status(400).json({ error: 'File is not valid JSON' });
    }

    // Create an RpnResponse object from the JSON
    let newRpnResponse = new RpnResponse(fileBody);

    // Make sure we have an RPN file
    if (validation.isEmpty(newRpnResponse.employerName)) {
      return res
        .status(400)
        .json({ error: 'The provided file is not an RPN file' });
    }

    // Save the data to the database
    newRpnResponse.save();

    // Create the xml file body
    let xmlBody = js2xmlparser.parse('root', fileBody);
    let xmlFileName = fileName.replace('.json', '.xml');

    // Create the xml version of the file

    fs.writeFile(req.file.destination + xmlFileName, xmlBody, err => {
      if (err) {
        return res.status(400).json({ error: 'Failed to create XML file' });
      }
    });

    // FTP the file to payrolls server
    let c = new Client();
    c.on('ready', function() {
      c.put(
        xmlBody,
        '/usr/synergy_live/payrolls/shared/' + xmlFileName,
        function(err) {
          if (err) throw err;
          c.end();
        }
      );
    });
    // connect to payroll server and transfer file
    c.connect({ host: '192.168.0.55', user: 'mikeigoe', password: 'Tr1fy1pt' });

    // Delete the local files
    fs.unlink(req.file.path, err => {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Unable to delete the temporary file' });
      }
    });

    fs.unlink(req.file.destination + xmlFileName, err => {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Unable to delete the temporary file' });
      }
    });

    // Errors returned to front end || confirmation of success

    res.redirect('/');
  });
});

module.exports = router;
