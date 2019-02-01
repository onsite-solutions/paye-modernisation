//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Response that lets the employer view a return for a specific period.
 */
const ReturnPeriodResponseSchema = new Schema({
  employerReg: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 100,
    match: /[0-9]{7,8}[A-Wa-w][A-ITWXZa-itwxz ]?/
  },
  agentTAIN: {
    type: String,
    match: /[0-9]{5}[A-Wa-w]/
  },
  returnPeriod: {
    periodStartDate: {
      type: Date,
      required: true
    },
    periodEndDate: {
      type: Date,
      required: true
    }
  },
  dateLastUpdated: Date,
  version: {
    type: String,
    minLength: 0,
    maxLength: 100
  },
  periodSummary: {
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
  },
  payrollRunDetails: [
    {
      payrollRunReference: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 50,
        match: /[A-Za-z0-9_\\-]*/
      },
      runDate: {
        type: Date,
        required: true
      },
      multiPeriod: {
        type: Boolean,
        required: true,
        default: false
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
  ],
  validationErrors: [
    {
      code: {
        type: String,
        required: true,
        minLength: 0,
        maxLength: 50,
        match: /[A-Za-z0-9_\\-]*/
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

const ReturnPeriodResponse = mongoose.model(
  'returnPeriodResponse',
  ReturnPeriodResponseSchema
);

module.exports = ReturnPeriodResponse;
