//@ts-check
'use strict';

const mysql = require('mysql');
const mongoose = require('mongoose');
const config = require('../config');
const util = require('util');
const client = require('../client');
const payroll = require('../client/api/payroll');

const PayrollRunResponse = require('../models/mongodb/PayrollRunResponse');

const connection = mysql.createConnection(config.mysql);

const query = util.promisify(connection.query).bind(connection);

/**
 * Gets all the PayrollRunReferences from the payroll database
 * This is based on cycles already run in the current year
 */
async function getCycles() {
  try {
    const result = await query('call get_cycles();');
    return result[0];
  } catch (error) {
    throw Error(error);
  }
}

/**
 * Query the PayrollRunResponse for the cycle, update the result to database
 * @param {string} cycle the Payroll Run Reference
 */
async function saveCycle(cycle) {
  let response;

  try {
    response = await client.get(payroll.checkPayrollRun(cycle));
  } catch (error) {
    throw Error(error);
  }

  let payrollRunResponse = new PayrollRunResponse(JSON.parse(response));

  payrollRunResponse.year = config.year;
  payrollRunResponse.payrollRunReference = cycle;

  // If there is already a file for this payrollRunReference, remove it
  try {
    await PayrollRunResponse.findOneAndRemove({
      payrollRunReference: cycle
    });
  } catch (error) {
    throw Error(error);
  }

  // Save the record
  try {
    await payrollRunResponse.save();
  } catch (error) {
    throw Error(error);
  }
}

/**
 * Update all PayrollRuns in MongoDB
 */
async function getPayrollRuns() {
  // Connect to MongoDB
  try {
    mongoose.connect(
      config.mongoUrl,
      { useNewUrlParser: true }
    );
  } catch (error) {
    throw Error(error);
  }

  let cycles;

  try {
    cycles = await getCycles();
  } catch (error) {
    throw Error(error);
  }

  await cycles.forEach(cycle => {
    try {
      saveCycle(cycle.cycle);
    } catch (error) {
      console.error(error);
    }
  });

  connection.end();
}

module.exports = getPayrollRuns;
