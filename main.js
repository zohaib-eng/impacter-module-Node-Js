//headers
var mongoose = require('mongoose');
require("dotenv").config();
//Database connection
mongoose.connect('mongodb://0.0.0.0:27017/FuelModule', {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;

//Headers

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { error } = require('console');
const app = express();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const routes=require('./routes');
const port =process.env.PORT|| 5000;
app.use(routes);
const multer=require('multer');
const server = require('random-string-alphanumeric-generator');

//Port Configuration

app.listen(port, () => {
  console.log(`app listening at http://0.0.0.0:${port}`)
});

module.exports = app;







