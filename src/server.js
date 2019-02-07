//@ts-check
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cron = require('node-cron');
const dailyTasks = require('./tasks/dailyTasks');

const convert = require('./server/routes/api/convert');
const db = require('./server/routes/api/db');
const handshake = require('./server/routes/api/handshake');
const payroll = require('./server/routes/api/payroll');
const report = require('./server/routes/api/report');
const returnsReconciliation = require('./server/routes/api/returns-reconciliation');
const rpn = require('./server/routes/api/rpn');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    `mongodb://${config.mongodb.user}:${config.mongodb.password}@${
      config.mongodb.host
    }:${config.mongodb.port}/${config.mongodb.database}?authSource=${
      config.mongodb.authDatabase
    }`,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    }
  )
  .then(() => console.log(`Connected to ${config.mongodb.database}`))
  .catch(err => console.log(err));

// Use routes
app.use('/api/convert', convert);
app.use('/api/db/', db);
app.use('/api/handshake/', handshake);
app.use('/api/payroll', payroll);
app.use('/api/report/', report);
app.use('/api/returns_reconciliation', returnsReconciliation);
app.use('/api/rpn', rpn);

app.listen(config.port, () =>
  console.log(`Listening at http://localhost:${config.port}/`)
);

// Daily cron task at 7am
cron.schedule('0 7 * * *', () => {
  dailyTasks.run();
});
