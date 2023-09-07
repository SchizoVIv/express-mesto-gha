const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000, MY_DB = 'mongodb://127.0.0.1:27017/vycohort69' } = process.env;

mongoose.connect(MY_DB, {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
}).catch(() => {
  console.log('error db');
});

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '64f60801f0b16e039dcc3606'
  };
  next();
});

app.use(bodyParser.json());

app.use(router);

app.listen(PORT, () => {
  console.log('hi port 3000');
});
