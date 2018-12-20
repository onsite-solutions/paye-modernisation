//@ts-check

const mongoose = require('mongoose');

/**
 * Represents a Revenue Payroll Notification Error
 */
const RPNErrorSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 50,
    pattern: '[A-Za-z0-9_\\-]*'
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
});

const RPNError = mongoose.model('RPNError', RPNErrorSchema);

module.exports = {
  RPNError: RPNError
};
