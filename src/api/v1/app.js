// Require dependencies
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const path = require('path');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
console.log("dotenv", dotenv);

// Initializations.
const app = express();

// Require route modules
const dataRouter = require('./routes');

//: Middleware Parse as urlencoded and json.
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(morgan(':method \t :url \t :status \t :res[content-length] \t :response-time ms', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.xml({
  limit: '1MB',
  xmlParseOptions: {
    normalize: true,
    normalizeTags: true,
    explicitArray: false
  }
}));

// Set the static files location.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/on-covid-19', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;