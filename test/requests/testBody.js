//@ts-check
'use strict';

const testBody = {
  payslips: [
    {
      lineItemID: 'E1-v1',
      employeeID: {
        employeePpsn: '00000008P',
        employmentID: '1'
      },
      name: {
        firstName: 'Ann',
        familyName: 'Doe'
      },
      payFrequency: 'WEEKLY',
      rpnNumber: '5',
      taxCredits: 63.46,
      taxRates: [
        {
          index: 1,
          rateCutOff: 650
        }
      ],
      calculationBasis: 'CUMULATIVE',
      payDate: '2019-02-01',
      grossPay: 307.5,
      payForIncomeTax: 307.5,
      incomeTaxPaid: 0,
      payForEmployeePRSI: 307.5,
      payForEmployerPRSI: 307.5,
      prsiExempt: false,
      prsiClassDetails: [
        {
          prsiClass: 'A0',
          insurableWeeks: 5
        }
      ],
      employeePRSIPaid: 0,
      employerPRSIPaid: 33.06,
      payForUSC: 307.5,
      uscStatus: 'ORDINARY',
      uscPaid: 3.07,
      lptDeducted: 3.67
    }
  ]
};

module.exports = testBody;
