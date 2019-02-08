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
      payslips: submission.requestBody.payslips.length,
      payslipsToDelete: submission.requestBody.lineItemIDsToDelete.length
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = transform;
