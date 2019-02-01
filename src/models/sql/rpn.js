//@ts-check
'use strict';

const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  var Rpn = sequelize.define(
    'rpn',
    {
      id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      fileName: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'file_name',
        references: {
          model: 'rpn_file',
          key: 'file_name'
        }
      },
      ppsn: {
        type: DataTypes.STRING(9),
        allowNull: false
      },
      rpn: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      employmentId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'employment_id'
      },
      rpnIssueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'rpn_issue_date'
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
        field: 'surname'
      },
      previousPpsn: {
        type: DataTypes.STRING(9),
        allowNull: true,
        field: 'previous_ppsn'
      },
      effectiveDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'effective_date'
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'end_date'
      },
      incomeTaxCalculationBasis: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'income_tax_basis'
      },
      exclusionOrder: {
        type: DataTypes.TINYINT,
        allowNull: false,
        field: 'exclusion_order'
      },
      yearlyTaxCredits: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'yearly_tax_credits'
      },
      taxRate1: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'tax_rate_1'
      },
      taxRate1YearlyCutOff: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'tax_rate_1_yearly_cut_off'
      },
      taxRate2: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'tax_rate_2'
      },
      taxRate2YearlyCutOff: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'tax_rate_2_yearly_cut_off'
      },
      payForIncomeTaxToDate: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'pay_for_income_tax_to_date'
      },
      incomeTaxDeductedToDate: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'income_tax_deducted_to_date'
      },
      uscStatus: {
        type: DataTypes.STRING(8),
        allowNull: false,
        field: 'usc_status'
      },
      uscRate1: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'usc_1_rate'
      },
      uscRate1YearlyCutOff: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'usc_1_yearly_cut_off'
      },
      uscRate2: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'usc_2_rate'
      },
      uscRate2YearlyCutOff: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'usc_2_yearly_cut_off'
      },
      uscRate3: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'usc_3_rate'
      },
      uscRate3YearlyCutOff: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'usc_3_yearly_cut_off'
      },
      uscRate4: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'usc_4_rate'
      },
      uscRate4YearlyCutOff: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'usc_4_yearly_cut_off'
      },
      payForUscToDate: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'pay_for_usc_to_date'
      },
      uscDeductedToDate: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: true,
        field: 'usc_deducted_to_date'
      },
      lptToDeduct: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
        field: 'lpt_to_deduct'
      },
      prsiExempt: {
        type: DataTypes.TINYINT,
        allowNull: false,
        field: 'prsi_exempt'
      },
      prsiClass: {
        type: DataTypes.STRING(2),
        allowNull: true,
        field: 'prsi_class'
      }
    },
    {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      tableName: 'rpn'
    }
  );

  return Rpn;
};
