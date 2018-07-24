//@ts-check

const mongoose = require('mongoose');

/**
 * Return the current status of an Employer's PAYE Payroll Submission.
 *
 * If processed, includes summary totals of valid payslips and validation errors for invalid payslips.
 */
const CheckPayrollSubmissionResponseSchema = new mongoose.Schema({
  submissionID: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 50,
    pattern: '[A-Za-z0-9_\\-]*'
  },
  status: {
    type: String,
    enum: ['NOT_ACKNOWLEDGED', 'PENDING', 'COMPLETED', 'PROCESSED']
  },
  batchCount: Number,
  batchStatuses: [
    {
      index: {
        type: Number,
        required: true
      },
      processingStatus: {
        type: String,
        required: true,
        enum: ['NOT_ACKNOWLEDGED', 'PENDING', 'COMPLETED', 'PROCESSED']
      }
    }
  ],
  submissionSummary: {
    taxOnIncome: {
      type: Number,
      required: true
    },
    prsi: {
      type: Number,
      required: true
    },
    usc: {
      type: Number,
      required: true
    },
    lpt: {
      type: Number,
      required: true
    },
    payslipCount: {
      type: Number,
      required: true
    },
    payslipToDeleteCount: {
      type: Number,
      required: true
    }
  },
  invalidPayslips: [
    {
      lineItemID: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 50,
        pattern: '[A-Za-z0-9_\\-]*'
      },
      errors: [
        {
          code: {
            type: String,
            required: true,
            minLength: 0,
            maxLength: 50,
            match: '[A-Za-z0-9_\\-]*'
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
    }
  ],
  payslipWarnings: [
    {
      lineItemID: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 50,
        match: '[A-Za-z0-9_\\-]*'
      },
      warnings: [
        {
          code: {
            type: String,
            required: true,
            minLength: 0,
            maxLength: 50,
            match: '[A-Za-z0-9_\\-]*'
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
    }
  ],
  validationErrors: [
    {
      code: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 50,
        match: '[A-Za-z0-9_\\-]*'
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

const CheckPayrollSubmissionResponse = mongoose.model(
  'CheckPayrollSubmissionResponse',
  CheckPayrollSubmissionResponseSchema
);

module.exports = {
  CheckPayrollSubmissionResponse: CheckPayrollSubmissionResponse
};
