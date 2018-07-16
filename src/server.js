//@ts-check

const express = require('express');
const bodyParser = require('body-parser');

const tests = require('./server/routes/api/tests');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use routes
app.use('/api/tests', tests);

// Testing locally on port 5000
const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
