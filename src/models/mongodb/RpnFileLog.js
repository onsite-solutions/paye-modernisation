//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Stores a log of files created by calls to the RPN lookup
 */
const RpnFileLogSchema = new Schema({
  year: {
    type: Number,
    required: true
  },
  dateImported: {
    type: Date,
    required: true,
    default: Date.now
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  fileName: {
    type: Number,
    required: true,
    min: 20180101,
    max: 29999999
  },
  rpnCount: {
    type: Number,
    required: true
  }
});

const RpnFileLog = mongoose.model('rpnfilelog', RpnFileLogSchema);

module.exports = RpnFileLog;
