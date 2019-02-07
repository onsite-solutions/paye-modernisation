//@ts-check
'use strict';

const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  var Payslip = sequelize.define(
    'payslip',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      payrollRun: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'payroll_run'
      },
      submissionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'submission_id'
      },
      lineItemId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
        field: 'line_item'
      },
      previousLineItemId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'previous_line_item'
      },
      ppsn: {
        type: DataTypes.STRING(9),
        allowNull: false,
        field: 'ppsn'
      },
      employmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'employment_id'
      },
      employerReference: {
        type: DataTypes.STRING(6),
        allowNull: true,
        field: 'employer_reference'
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'first_name'
      },
      familyName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'family_name'
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'date_of_birth'
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'start_date'
      },
      leaveDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'leave_date'
      },
      payFrequency: {
        type: DataTypes.STRING(16),
        allowNull: false,
        field: 'pay_frequency'
      },
      payPeriods: {
        type: DataTypes.TINYINT,
        allowNull: false,
        field: 'pay_periods'
      },
      rpnNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rpn'
      },
      taxCredits: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'tax_credits'
      },
      taxRate1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'tax_rate1'
      },
      taxRate1CutOff: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'tax_rate1_cutoff'
      },
      taxRate2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'tax_rate2'
      },
      taxRate2CutOff: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'tax_rate2_cutoff'
      },
      taxBasis: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: 'tax_basis'
      },
      payDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'pay_date'
      },
      grossPay: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'gross_pay'
      },
      payForIncomeTax: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'pay_for_income_tax'
      },
      incomeTaxPaid: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'income_tax_paid'
      },
      payForEmployeePrsi: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'pay_for_employee_prsi'
      },
      payForEmployerPrsi: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'pay_for_employer_prsi'
      },
      employeePrsiPaid: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'employee_prsi_paid'
      },
      employerPrsiPaid: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'employer_prsi_paid'
      },
      payForUsc: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'pay_for_usc'
      },
      uscStatus: {
        type: DataTypes.STRING(8),
        allowNull: false,
        field: 'usc_status'
      },
      uscPaid: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'usc_paid'
      },
      lptDeducted: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'lpt_deducted'
      },
      createdAt: {
        type: DataTypes.DATE(3),
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE(3),
        defaultValue: sequelize.literal(
          'CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'
        ),
        allowNull: false,
        field: 'updated_at'
      }
    },
    {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      tableName: 'payslip'
    }
  );

  return Payslip;
};
