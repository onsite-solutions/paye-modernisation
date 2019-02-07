//@ts-check

const mongoose = require('mongoose');
const moment = require('moment');
const validation = require('../validation');

const rpnReportItem = require('./rpnReportItem');
const Rpn = require('../models/mongodb/Rpn');

/**
 * Constructs a CSV report from the provided list of JSON RPNs
 * @param {Rpn[]} rpns Collection of RPN objects to display in the report
 */
function getReport(rpns) {
  let header =
    '"RPN","PPSN","Employment ID","RPN Issue Date","Days Old","Employer Reference","First Name","Surname","Previous PPSN","Effective Date","End Date","Income Tax Basis","Exclusion Order","Yearly Tax Credits","Tax Rate 1","Tax Rate 1 Yearly Cut Off","Tax Rate 2","Tax Rate 2 Yearly Cut Off","Pay For Income Tax To Date","Income Tax Deducted To Date","USC Status","USC 1 Rate","USC 1 Yearly Cut Off","USC 2 Rate","USC 2 Yearly Cut Off","USC 3 Rate","USC 3 Yearly Cut Off","USC 4 Rate","USC 4 Yearly Cut Off","Pay For USC To Date","USC Deducted To Date","LPT To Deduct","PRSI Exempt","PRSI Class"';

  let report = [];

  report.push(header);

  for (let i = 0; i < rpns.length; i++) {
    let row = [];
    let empRpn = rpnReportItem(rpns[i]);

    for (let j in empRpn) {
      row.push(empRpn[j]);
    }

    report.push('"' + row.join('","') + '"');
  }

  return report.join('\n');
}

module.exports = getReport;
