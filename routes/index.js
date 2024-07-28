
var express = require('express');
var router = express.Router();
const apis = require("./student/apis");

console.log("router")
router.use('/', apis);
module.exports = router;

