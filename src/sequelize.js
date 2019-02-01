//@ts-check
'use strict';

const config = require('./config');
const Sequelize = require('sequelize');
const RpnModel = require('./models/sql/rpn');
const RpnResponseModel = require('./models/sql/rpnResponse');

const sequelise = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    dialect: 'mysql',
    host: config.mysql.host,
    logging: config.mysql.logging,
    operatorsAliases: false
  }
);

const Rpn = RpnModel(sequelise, Sequelize);
const RpnResponse = RpnResponseModel(sequelise, Sequelize);

module.exports = { Rpn, RpnResponse };
