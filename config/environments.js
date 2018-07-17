//@ts-check
'use strict';

const Config = require('./config');

let test = new Config(
  'softwaretest.ros.ie',
  '/paye-employers/v1/rest',
  2018,
  'CDETB-ROS',
  '0.1.0'
);

const Environments = [{ name: 'test', config: test }];

module.exports = Environments;
