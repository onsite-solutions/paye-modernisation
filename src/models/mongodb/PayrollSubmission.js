//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Employer's PAYE Payroll Submission Request
 */
const PayrollSubmissionSchema = new Schema({
  requestType: {
    type: String,
    required: true,
    enum: ['payrollSubmission']
  },
  employerRegistrationNumber: {
    type: String,
    required: true
  },
  taxYear: {
    type: Number,
    required: true
  },
  softwareUsed: {
    type: String,
    required: true
  },
  softwareVersion: {
    type: String,
    required: true
  },
  payrollRunReference: String,
  submissionID: String,
  requestBody: {
    payslips: [
      {
        lineItemID: {
          type: String,
          required: true,
          minLength: 0,
          maxLength: 50,
          match: /[A-Za-z0-9_\\-]*/
        },
        previousLineItemID: {
          type: String,
          minLength: 0,
          maxLength: 50,
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
        address: {
          addressLines: [{ type: String }],
          county: {
            type: String,
            enum: [
              'ANTRIM',
              'ARMAGH',
              'CARLOW',
              'CAVAN',
              'CLARE',
              'CORK',
              'DERRY',
              'DONEGAL',
              'DOWN',
              'DUBLIN',
              'FERMANAGH',
              'GALWAY',
              'KERRY',
              'KILDARE',
              'KILKENNY',
              'LAOIS',
              'LEITRIM',
              'LIMERICK',
              'LONGFORD',
              'LOUTH',
              'MAYO',
              'MEATH',
              'MONAGHAN',
              'OFFALY',
              'ROSCOMMON',
              'SLIGO',
              'TIPPERARY',
              'TYRONE',
              'WATERFORD',
              'WEXFORD',
              'WESTMEATH',
              'WICKLOW'
            ]
          },
          eircode: {
            type: String,
            minLength: 7,
            maxLength: 8,
            match: /[A-Za-z0-9 ]*/
          },
          countryCode: {
            type: String,
            match: /[A-Za-z]{3}/,
            uppercase: true
          }
        },
        dateOfBirth: Date,
        startDate: Date,
        leaveDate: Date,
        director: {
          type: String,
          enum: ['PROPRIETARY', 'NON_PROPRIETARY']
        },
        shadowPayroll: {
          type: Boolean,
          default: false
        },
        payFrequency: {
          type: String,
          required: true,
          enum: [
            'WEEKLY',
            'FORTNIGHTLY',
            'MONTHLY',
            'FOUR_WEEKLY',
            'TWICE_MONTHLY',
            'QUARTERLY',
            'BI_ANNUAL',
            'WK_BASED_MONTHLY',
            'ANNUAL',
            'OTHER'
          ]
        },
        numberOfPayPeriods: Number,
        rpnNumber: {
          type: String,
          minLength: 0,
          maxLength: 20,
          pattern: /[A-Za-z0-9_\\-]*/
        },
        taxCredits: Number,
        taxRates: [
          {
            index: {
              type: Number,
              required: true
            },
            rateCutOff: {
              type: Number,
              required: true
            }
          }
        ],
        incomeTaxCalculationBasis: {
          type: String,
          enum: ['CUMULATIVE', 'WEEK_1', 'EMERGENCY']
        },
        exclusionOrder: {
          type: Boolean,
          default: false
        },
        payDate: {
          type: Date,
          required: true
        },
        grossPay: {
          type: Number,
          required: true
        },
        payForIncomeTax: {
          type: Number,
          required: true
        },
        incomeTaxPaid: {
          type: Number,
          required: true
        },
        payForEmployeePRSI: {
          type: Number,
          required: true
        },
        payForEmployerPRSI: {
          type: Number,
          required: true
        },
        prsiExempt: {
          type: Boolean,
          required: true,
          default: false
        },
        prsiExemptionReason: {
          type: String,
          enum: [
            'A_1_PORTABLE_DOCUMENT',
            'CERTIFICATE_OF_COVERAGE',
            'POSTED_WORKER_OTHER_NOTIFICATION',
            'FAMILY_MEMBER',
            'UNDER_16',
            'SOCIAL_WELFARE_SCHEME',
            'OTHER'
          ]
        },
        prsiClassDetails: [
          {
            prsiClass: {
              type: String,
              required: true,
              match: /[A-Za-z][0-9A-Za-z ]?/
            },
            insurableWeeks: Number
          }
        ],
        employeePRSIPaid: Number,
        employerPRSIPaid: Number,
        payForUSC: {
          type: Number,
          required: true
        },
        uscStatus: {
          type: String,
          required: true,
          enum: ['ORDINARY', 'EXEMPT']
        },
        uscPaid: Number,
        lptDeducted: Number,
        grossMedicalInsurance: Number,
        shareBasedRemuneration: Number,
        taxableBenefits: Number,
        taxableLumpSum: Number,
        nonTaxableLumpSum: Number,
        pensionTracingNumbers: [
          {
            pensionTracingNumber: {
              type: String,
              minLength: 8,
              maxLength: 8
            }
          }
        ],
        employerRBS: Number,
        employeeRBS: Number,
        employerPRSA: Number,
        employeePRSA: Number,
        employeeRAC: Number,
        employeeAVC: Number
      }
    ],
    lineItemIDsToDelete: [
      {
        lineItem: {
          type: String,
          minLength: 0,
          maxLength: 50,
          match: /[A-Za-z0-9_\\-]*/
        }
      }
    ]
  }
});

PayrollSubmissionSchema.index(
  { taxYear: 1, payrollRunReference: 1, submissionID: 1 },
  { unique: true }
);

const PayrollSubmission = mongoose.model(
  'payrollSubmission',
  PayrollSubmissionSchema
);

module.exports = PayrollSubmission;
