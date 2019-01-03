//@ts-check

const express = require('express');
const mongoose = require('mongoose');

const payroll = require('./server/routes/api/payroll');
const returnsReconciliation = require('./server/routes/api/returns-reconciliation');
const rpn = require('./server/routes/api/rpn');
const convert = require('./server/routes/api/convert');
const handshake = require('./server/routes/api/handshake');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://192.168.0.74:27017/payeModTestDB',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use routes
app.use('/api/payroll', payroll);
app.use('/api/returns_reconciliation', returnsReconciliation);
app.use('/api/rpn', rpn);
app.use('/api/convert', convert);
app.use('/api/handshake/', handshake);

// Testing locally on port 5000
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening at http://localhost:${port}/`));
