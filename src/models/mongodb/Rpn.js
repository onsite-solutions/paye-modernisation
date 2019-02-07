//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Revenue Payroll Notification.
 */
const RpnSchema = new Schema({
  rpnNumber: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 20,
    match: /[A-Za-z0-9_\\-]*/
  },
  employeeID: {
    employeePpsn: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 10,
      match: /[0-9A-Za-z]*/,
      uppercase: true
    },
    employmentID: {
      type: String,
      minLength: 0,
      maxLength: 20,
      match: /[A-Za-z0-9_\\-]*/
    }
  },
  rpnIssueDate: {
    type: Date,
    required: true
  },
  employerReference: {
    type: String,
    minLength: 0,
    maxLength: 50
  },
  name: {
    firstName: {
      type: String,
      required: true,
      minLength: 0,
      maxLength: 100,
      match: /[A-Za-z0-9áéíóúÁÉÍÓÚ =_^,~!/'@:;£€$#%&\"'<>\\\\.*()\\[\\]{}+-?|]*/
    },
    familyName: {
      type: String,
      required: true,
      minLength: 0,
      maxLength: 100,
      match: /[A-Za-z0-9áéíóúÁÉÍÓÚ =_^,~!/'@:;£€$#%&\"'<>\\\\.*()\\[\\]{}+-?|]*/
    }
  },
  previousEmployeePPSN: {
    type: String,
    minLength: 8,
    maxLength: 10,
    match: /[0-9A-Za-z]*/,
    uppercase: true
  },
  effectiveDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  incomeTaxCalculationBasis: {
    type: String,
    required: true,
    enum: ['CUMULATIVE', 'WEEK_1', 'EMERGENCY']
  },
  exclusionOrder: {
    type: Boolean,
    default: false
  },
  yearlyTaxCredits: {
    type: Number,
    required: true
  },
  taxRates: [
    {
      index: {
        type: Number,
        required: true
      },
      taxRatePercent: {
        type: Number,
        required: true
      },
      yearlyRateCutOff: Number
    }
  ],
  payForIncomeTaxToDate: {
    type: Number,
    required: true
  },
  incomeTaxDeductedToDate: {
    type: Number,
    required: true
  },
  uscStatus: {
    type: String,
    required: true,
    enum: ['ORDINARY', 'EXEMPT']
  },
  uscRates: [
    {
      index: {
        type: Number,
        required: true
      },
      uscRatePercent: {
        type: Number,
        required: true
      },
      yearlyUSCRateCutOff: Number
    }
  ],
  payForUSCToDate: Number,
  uscDeductedToDate: Number,
  lptToDeduct: Number,
  prsiExempt: {
    type: Boolean,
    default: false
  },
  prsiClass: {
    type: String,
    match: /[A-Za-z][0-9A-Za-z ]?/
  }
});

const Rpn = mongoose.model('rpn', RpnSchema);

module.exports = Rpn;
