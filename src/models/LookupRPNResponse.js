//@ts-check

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RPN = require('./RPN');
const RPNEmployeeID = require('./RPNEmployeeID');
const RPNError = require('./RPNError');

/**
 * Employer's Lookup RPN Response. Will either return RPN detail or details of validation errors.
 */
const LookupRPNResponseSchema = new mongoose.Schema({
  employerName: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 100
  },
  employerRegistrationNumber: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 100
  },
  agentTain: {
    type: String,
    match: '[0-9]{5}[A-Wa-w]'
  },
  taxYear: {
    type: Number,
    required: true,
    min: 2000.0,
    max: 2100.0
  },
  totalRPNCount: {
    type: Number,
    required: true
  },
  dateTimeEffective: {
    type: Date,
    required: true
  },
  rpns: [
    {
      type: Schema.Types.ObjectId,
      ref: 'RPN'
    }
  ],
  noRPNs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'RPNEmployeeID'
    }
  ],
  validationErrors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'RPNError'
    }
  ]
});

const LookupRPNResponse = mongoose.model(
  'LookupRPNResponse',
  LookupRPNResponseSchema
);

module.exports = {
  LookupRPNResponse: LookupRPNResponse
};
