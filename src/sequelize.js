//@ts-check
'use strict';

const config = require('./config');
const Sequelize = require('sequelize');
const PayslipModel = require('./models/sql/payslip');
const RpnModel = require('./models/sql/rpn');
const RpnResponseModel = require('./models/sql/rpnResponse');
const SubmissionModel = require('./models/sql/submission');

const sequelise = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    dialect: 'mysql',
    host: config.mysql.host,
    logging: config.mysql.logging,
    operatorsAliases: false,
    define: {
      charset: 'latin1',
      collate: 'latin1_general_ci'
    }
  }
);

const Payslip = PayslipModel(sequelise, Sequelize);
const Rpn = RpnModel(sequelise, Sequelize);
const RpnResponse = RpnResponseModel(sequelise, Sequelize);
const Submission = SubmissionModel(sequelise, Sequelize);

module.exports = { Payslip, Rpn, RpnResponse, Submission };
