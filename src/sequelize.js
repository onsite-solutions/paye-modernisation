//@ts-check
'use strict';

const config = require('./config');
const Sequelize = require('sequelize');
const RpnModel = require('./models/sql/rpn');
const RpnFileModel = require('./models/sql/rpnFile');

const sequelise = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    dialect: 'mysql',
    host: config.mysql.host,
    logging: false,
    operatorsAliases: false
  }
);

const Rpn = RpnModel(sequelise, Sequelize);
const RpnFile = RpnFileModel(sequelise, Sequelize);

module.exports = { Rpn, RpnFile };
