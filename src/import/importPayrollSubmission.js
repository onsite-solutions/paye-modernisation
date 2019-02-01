//@ts-check
'use strict';

const fs = require('fs');
const path = require('path');

const config = require('../config');
const mongoose = require('mongoose');

const PayrollSubmission = require('../models/mongodb/PayrollSubmission');

/**
 * Gets a list of all files with the provided extension in the provided directory
 * @param {string} directory The path to the directory
 * @param {string} extension The file extension by which to filter
 */
function getFiles(directory, extension) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.filter(file => file.endsWith(extension)));
      }
    });
  });
}

/**
 * Gets the file body for the provided file path
 * @param {string} filePath The full file path
 */
function getFileBody(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.toString());
      }
    });
  });
}

/**
 * Saves the provided JSON as a PayrollSubmission
 * @param {string} body
 */
async function saveSubmission(body) {
  try {
    let submission = new PayrollSubmission(body);

    // Delete the submission if it already exists
    await PayrollSubmission.findOneAndRemove(
      {
        payrollRunReference: submission.payrollRunReference,
        submissionID: submission.submissionID
      },
      error => {
        if (error) {
          console.log(error);
        }
      }
    );

    await submission.save();
  } catch (error) {
    return Error(error);
  }
}

/**
 * Imports payroll submission files the uploads directory
 */
async function importPayrollSubmission() {
  // Connect to MongoDB
  try {
    mongoose.connect(
      config.mongoUrl,
      { useNewUrlParser: true }
    );
  } catch (error) {
    throw Error(error);
  }

  let files = await getFiles(path.join(__dirname, '../uploads/'), '.json');

  files.forEach(async file => {
    try {
      let body = await getFileBody(path.join(__dirname, '../uploads/', file));

      saveSubmission(JSON.parse(body));
    } catch (err) {
      console.error(err);
    }
  });

  console.log(`${files.length} file(s) imported`);
}

importPayrollSubmission();
