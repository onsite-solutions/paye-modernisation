//@ts-check
'use strict';

const getSubmissionsFromRos = require('./getSubmissionsFromRos');
const getSubmissionsFromPayroll = require('./getSubmissionsFromPayroll');
const copyRpnsToSql = require('./copyRpnsToSql');
const copySubmissionsToSql = require('./copySubmissionsToSql');

/**
 * Runs scheduled database maintenance tasks
 */
async function run() {
  try {
    await getSubmissionsFromRos();

    await getSubmissionsFromPayroll();

    await copyRpnsToSql();

    await copySubmissionsToSql();
  } catch (error) {
    console.error(error);
  }
}

module.exports = { run };
