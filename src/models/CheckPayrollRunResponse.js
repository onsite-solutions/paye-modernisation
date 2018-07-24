//@ts-check

const mongoose = require('mongoose');

/**
 * Return the current status of an Employer's PAYE Payroll Run. Includes list of submissions that make up the payroll run and includes summary details of processed submissions.
 */
const CheckPayrollRunResponseSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['NOT_ACKNOWLEDGED', 'PENDING', 'COMPLETED', 'PROCESSED']
  },
  taxOnIncome: Number,
  prsi: Number,
  usc: Number,
  lpt: Number,
  submissions: [
    {
      submissionID: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 50,
        match: '[A-Za-z0-9_\\-]*'
      },
      status: {
        type: String,
        required: true,
        enum: ['NOT_ACKNOWLEDGED', 'PENDING', 'COMPLETED', 'PROCESSED']
      },
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
      }
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
  ],
  payslipSummaries: [
    {
      lineItemID: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 50,
        match: '[A-Za-z0-9_\\-]*'
      },
      employeeID: {
        employeePpsn: {
          type: String,
          required: true,
          minLength: 8,
          maxLength: 10,
          match: '[0-9A-Za-z]*',
          uppercase: true
        },
        employmentID: {
          type: String,
          required: true,
          minLength: 0,
          maxLength: 20,
          match: '[A-Za-z0-9_\\-]*'
        }
      },
      employerReference: {
        type: String,
        minLength: 0,
        maxLength: 50
      },
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
      }
    }
  ]
});

const CheckPayrollRunResponse = mongoose.model(
  'CheckPayrollRunResponse',
  CheckPayrollRunResponseSchema
);

module.exports = {
  CheckPayrollRunResponse: CheckPayrollRunResponse
};
