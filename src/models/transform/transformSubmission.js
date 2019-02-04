//@ts-check
'use strict';

const sequelize = require('../../sequelize');
const SqlSubmission = sequelize.Submission;

/**
 * Transform a MongoDB Submission model instance to a MySQL model instance
 * @param {any} submission
 */
function transform(submission) {
  return SqlSubmission.build({
    year: submission.taxYear,
    payrollRun: submission.payrollRunReference,
    submissionId: submission.submissionID,
    payslipCount: submission.payslips.length
  });
}

module.exports = transform;
