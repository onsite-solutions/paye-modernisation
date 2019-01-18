//@ts-check
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const js2xmlparser = require('js2xmlparser');
const fs = require('fs');
const validation = require('./validation');
const ftp = require('ftp');
const client = require('./client');
const rpn = require('./client/api/rpn');

const config = require(`./config/${process.env.NODE_ENV || 'development'}`);
//const config = require(`../config/production`);

const RpnResponse = require('./models/RpnResponse');
const RpnFileLog = require('./models/RpnFileLog');

function getNewRpns() {
  return new Promise((resolve, reject) => {
    let today = moment()
      .startOf('day')
      .toDate();

    let newFileLog = new RpnFileLog({
      year: moment().year(),
      dateImported: Date.now(),
      fromDate: today,
      toDate: today,
      fileName: moment().format('YYYYMMDD'),
      rpnCount: 0
    });

    // Get the most recent RpnLogFile in the database
    RpnFileLog.findOne({}, {}, { sort: { toDate: -1 } }, (err, lastFileLog) => {
      if (err) {
        reject(err.message);
        return;
      }

      if (!validation.isEmpty(lastFileLog)) {
        // Set the new fromDate to match the most recent toDate
        newFileLog.fromDate = lastFileLog.toDate;

        let lastFromDate = moment(lastFileLog.fromDate);

        if (lastFromDate.isSame(today)) {
          // We are rerunning the current day, so remove the earlier file
          RpnResponse.findOneAndRemove(
            { fileName: lastFileLog.fileName },
            err => {
              if (err) {
                reject(err.message);
                return;
              }
            }
          );
        }
      }

      // Get the file contents
      client
        .get(
          rpn.lookUpRpnByEmployer(
            moment(newFileLog.fromDate).format('YYYY-MM-DD')
          )
        )
        .then(response => {
          let rpnResponse = new RpnResponse(JSON.parse(response));
          rpnResponse.fileName = newFileLog.fileName;
          newFileLog.rpnCount = rpnResponse.totalRPNCount;

          // Save the new RpnFileLog
          newFileLog.save(err => {
            if (err) {
              reject(err.message);
              return;
            }
          });

          // Save the new RpnResponse
          rpnResponse.save(err => {
            if (err) {
              reject(err.message);
              return;
            }
          });

          // Now we need to create the file on the payroll server

          resolve(response);
          return;
        })
        .catch(err => {
          console.log(`B ${err.message}`);
          reject(err.message);
          return;
        });
    });

    /*
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
      let xmlFileName = fileName.replace('.json', '.xml').toUpperCase();

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
      c.connect({
        host: config.ftpHost,
        user: config.ftpUser,
        password: config.ftpPassword
      });

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
  */
  });
}

module.exports = { getNewRpns };
