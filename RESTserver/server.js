var sqlite3 = require('sqlite3').verbose();
var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var app = express();
var expressWs = require('express-ws')(app);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);






var server = app.listen(3001, function () {
    console.log("app running on port.", server.address().port);
});
