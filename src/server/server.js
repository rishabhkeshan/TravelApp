var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Endpoint for all routes
let projectData = {};

// BodyParser install
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

//use dist after build
app.use(express.static('dist'));

//Get home page
app.get('/', function (req, res) {
  res.sendFile('dist/index.html')
})

// Post TravelDat to Update UI
app.post('/TravelData',function (req, res) {
  projectData.destination = req.body.destination;
  projectData.depDate = req.body.depDate;
  projectData.maxTemp = req.body.maxTemp;
  projectData.minTemp= req.body.minTemp;
  projectData.forecast = req.body.forecast;
  projectData.daysToGo = req.body.daysToGo;
  res.send(projectData);
});

// Setup Server
app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})
module.exports = app;