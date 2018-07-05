//@ts-check
'use strict';

const postRpnNewPayload = {
  requestId: '1',
  newEmployeeDetails: [
    {
      employeeID: {
        employeePpsn: '7010829LA',
        employmentID: '1'
      },
      name: {
        firstName: 'Concepcion',
        familyName: 'Adams'
      },
      employmentStartDate: '2018-07-05'
    }
  ]
};

module.exports = postRpnNewPayload;
