'use strict';
const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.text());
app.use(express.static('./docroot'));
app.post('/log', function (req, res, next) {
  console.log(req.body);
  res.end();
});
app.listen(9090, ()=> {
  console.log('Express Server 01');
});
