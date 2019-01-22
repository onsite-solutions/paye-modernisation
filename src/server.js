//@ts-check
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const convert = require('./server/routes/api/convert');
const db = require('./server/routes/api/db');
const handshake = require('./server/routes/api/handshake');
const payroll = require('./server/routes/api/payroll');
const report = require('./server/routes/api/report');
const returnsReconciliation = require('./server/routes/api/returns-reconciliation');
const rpn = require('./server/routes/api/rpn');
const index = require('./server/index');

const path = require('path');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// Static files
app.use(express.static(path.join(__dirname, './public')));

// Connect to MongoDB
mongoose
  .connect(
    config.mongoUrl,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`Connected to ${config.mongoUrl}`))
  .catch(err => console.log(err));

// Use routes
app.use('/api/convert', convert);
app.use('/api/db/', db);
app.use('/api/handshake/', handshake);
app.use('/api/payroll', payroll);
app.use('/api/report/', report);
app.use('/api/returns_reconciliation', returnsReconciliation);
app.use('/api/rpn', rpn);

app.use('/', index);

app.listen(config.port, () =>
  console.log(`Listening at http://localhost:${config.port}/`)
);
