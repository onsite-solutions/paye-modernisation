//@ts-check
'use strict';

const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  var Submission = sequelize.define(
    'submission',
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
      payslips: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'payslips'
      },
      payslipsToDelete: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'payslips_to_delete'
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
