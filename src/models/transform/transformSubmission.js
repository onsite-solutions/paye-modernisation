//@ts-check
'use strict';

const sequelize = require('../../sequelize');
const SqlSubmission = sequelize.Submission;

/**
 * Transform a MongoDB Submission model instance to a MySQL model instance
 * @param {any} submission
 */
function transform(submission) {
  try {
    return SqlSubmission.build({
      year: submission.taxYear,
      payrollRun: submission.payrollRunReference,
      submissionId: submission.submissionID,
      payslipCount: submission.requestBody.payslips.length
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = transform;
