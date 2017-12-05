const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const morgan = require('morgan');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(morgan('dev'))

app.use(routes)

app.listen(3000, () => {
  console.log('App is running on localhost:3000');
})