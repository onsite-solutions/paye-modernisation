import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
