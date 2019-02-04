//@ts-check
'use strict';

const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  var Submission = sequelize.define(
    'submission',
    {
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true
      },
      payrollRun: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
        field: 'payroll_run'
      },
      submissionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
        field: 'submission_id'
      },
      payslipCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'payslip_count'
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
      tableName: 'submission'
    }
  );

  return Submission;
};
