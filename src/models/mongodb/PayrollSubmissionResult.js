//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Acknowledges the receipt of an Employer's PAYE Payroll Submission Request or Validation Errors if validation failed.
 */
const PayrollSubmissionResultSchema = new Schema({
  acknowledgementStatus: {
    type: String,
    required: true,
    enum: ['ACKNOWLEDGED', 'REJECTED']
  },
  acknowledgementID: {
    type: String,
    minLength: 0,
    maxLength: 50,
    match: /[A-Za-z0-9_\\-]*/
  },
  validationErrors: [
    {
      code: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 50,
        pattern: /[A-Za-z0-9_\\-]*/
      },
      path: {
        type: String,
        minLength: 0,
        maxLength: 500
      },
      description: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 500
      }
    }
  ]
});

const PayrollSubmissionResult = mongoose.model(
  'payrollSubmissionResult',
  PayrollSubmissionResultSchema
);

module.exports = PayrollSubmissionResult;
