//@ts-check

const mongoose = require('mongoose');

/**
 * RPN details for new employee(s)
 */
const NewRPNSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 50,
    match: '[A-Za-z0-9_\\-]*'
  },
  newEmployeeDetails: [
    {
      employeeID: {
        required: true,
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
      name: {
        required: true,
        firstName: {
          type: String,
          required: true,
          minLength: 0,
          maxLength: 100
        },
        familyName: {
          type: String,
          required: true,
          minLength: 0,
          maxLength: 100
        }
      },
      employmentStartDate: Date
    }
  ]
});

const NewRPN = mongoose.model('NewRPN', NewRPNSchema);

module.exports = {
  NewRPN: NewRPN
};
