//@ts-check
'use strict';

const config = require('../config');
const ssh = require('ssh2');
const ftp = require('ftp');
const months = require('./months');
const PayrollSubmission = require('../models/mongodb/PayrollSubmission');
const PayrollSubmissionResponse = require('../models/mongodb/PayrollSubmissionResponse');
const ReturnPeriodResponse = require('../models/mongodb/ReturnPeriodResponse');

/**
 * Gets an array of PayrollRunReferences for the current and previous months
 */
function getPayrollRuns() {
  try {
    return ReturnPeriodResponse.find({
      $or: [
        { 'returnPeriod.periodStartDate': months[0].startDate },
        { 'returnPeriod.periodStartDate': months[1].startDate }
      ]
    }).distinct('payrollRunDetails.payrollRunReference');
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Get submission responses for all payroll runs in the current month and previous month
 * @param {string[]} payrollRuns the array of payroll runs
 */
function getPayrollSubmissionResponses(payrollRuns) {
  try {
    return PayrollSubmissionResponse.find({
      payrollRunReference: {
        $in: payrollRuns
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Gets payroll submissions already imported from payroll
 * @param {string[]} payrollRuns the array of payroll runs
 */
function getPayrollSubmissions(payrollRuns) {
  try {
    return PayrollSubmission.find({
      payrollRunReference: {
        $in: payrollRuns
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Checks if submission exists in the array of existing submissions
 * @param {any} submissions The array of submissions to check against
 * @param {any} submissionResponse The submission response being checked
 */
function submissionExists(submissions, submissionResponse) {
  const exists = submissions.filter(s => {
    return (
      s.taxYear == submissionResponse.year &&
      s.payrollRunReference == submissionResponse.payrollRunReference &&
      s.submissionID == submissionResponse.submissionID
    );
  });
  return exists.length > 0;
}

function getSubmissionFilePath(payrollRunReference, submissionId) {
  let client = new ssh.Client();
  let command = `locate "${payrollRunReference}-${submissionId}.json"`;
  let result = '';

  return new Promise((resolve, reject) => {
    client
      .on('ready', () => {
        client.exec(command, (err, channel) => {
          if (err) throw err;
          channel
            .on('close', (code, signal) => {
              client.end();
              resolve(result);
            })
            .on('data', data => {
              result += data;
            })
            .stderr.on('data', err => {
              reject(err);
            });
        });
      })
      .on('error', e => {
        reject(e);
      })
      .connect({
        host: config.ftp.host,
        username: config.ftp.user,
        password: config.ftp.password
      });
  });
}

/**
 * Gets the submission file body from the linux server
 * @param {string} filePath
 */
function getSubmissionFileBody(filePath) {
  return new Promise((resolve, reject) => {
    let client = new ftp();

    client.on('ready', function () {
      client.get(filePath, (err, stream) => {
        if (err) throw err;
        let content = '';
        stream.on('data', chunk => {
          content += chunk.toString();
        });
        stream.on('end', () => {
          client.end();
          resolve(content.toString());
        });
        stream.on('error', err => {
          reject(err);
        });
      });
    });

    client.connect({
      host: config.ftp.host,
      user: config.ftp.user,
      password: config.ftp.password
    });
  });
}

/**
 * Uploads the submission file to MongoDB
 * @param {string} fileBody
 */
async function createSubmissionMongo(fileBody) {
  let submission = new PayrollSubmission(JSON.parse(fileBody));

  submission.dateUploaded = Date.now();

  // If there is already a file for this PayrollSubmission, remove it
  await PayrollSubmission.findOneAndRemove(
    {
      taxYear: submission.taxYear,
      payrollRunReference: submission.payrollRunReference,
      submissionID: submission.submissionID
    },
    error => {
      if (error) {
        console.log(error);
      }
    }
  );

  // Save the record
  try {
    await submission.save();
  } catch (error) {
    throw Error(error);
  }
}

/**
 * Identifies payroll submissions files to be uploaded to MongoDB and imports them from
 * payroll
 */
async function getSubmissionsFromPayroll() {
  let payrollRuns = await getPayrollRuns();
  let allSubmissions = await getPayrollSubmissionResponses(payrollRuns);
  let existingSubmissions = await getPayrollSubmissions(payrollRuns);

  for (const submission of allSubmissions) {
    if (!submissionExists(existingSubmissions, submission)) {
      let filePath = await getSubmissionFilePath(
        submission.payrollRunReference,
        submission.submissionID
      );

      if (filePath.length > 0) {
        let fileBody = await getSubmissionFileBody(filePath);

        createSubmissionMongo(fileBody);
      }
    }
  }
}

module.exports = getSubmissionsFromPayroll;
