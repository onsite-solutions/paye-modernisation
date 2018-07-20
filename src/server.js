//@ts-check

const express = require('express');
const bodyParser = require('body-parser');

const payroll = require('./server/routes/api/payroll');
const returnsReconciliation = require('./server/routes/api/returns-reconciliation');
const rpn = require('./server/routes/api/rpn');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use routes
app.use('/api/payroll', payroll);
app.use('/api/returns_reconciliation', returnsReconciliation);
app.use('/api/rpn', rpn);

// Testing locally on port 5000
const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
