//@ts-check
'use strict';

const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  var RpnFile = sequelize.define(
    'rpn_file',
    {
      fileName: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'file_name'
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false
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
      tableName: 'rpn_file'
    }
  );

  return RpnFile;
};
