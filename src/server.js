const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
var path = __dirname + '/views/';
const app = express();
const port = 5000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/', (req, res) => res.status(200).json('CDETB ROS API'));

app.get('/', (req, res) => res.sendFile(path + 'index.html'));

app.listen(port, () => console.log(`Server running on port ${port}`));
