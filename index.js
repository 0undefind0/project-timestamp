// for tunnelling my system to the public
const ngrok = require('ngrok');

// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


/*
Request:
  "/api/{unix or utc}"
  "/api/2015-12-25"
  "/api/1451001600000"
Response, JSON Unix & UTC:
  {
    "unix": 1451001600000,
    "utc": "Fri, 25 Dec 2015 00:00:00 GMT"
  }
*/
app.get("/api/:timestamp?", (req, res) => {
  const timestamp = req.params.timestamp;
  let date;

  if (!timestamp) {
    date = new Date(); // current date now
  } else {
    // timestamp is not empty
    // if timestampt is a number
    if (!isNaN(timestamp)) {
      date = new Date(parseInt(timestamp));
    } else {
      date = new Date(timestamp)
    }
  }

  if (date.toString() === "Invalid Date") {
    res.json({
      error: date.toString()
    });
  } else {
    res.json({
      "unix": date.getTime(),
      "utc": date.toUTCString()
    });
  }
  
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});




// NGROK CONFIG
ngrok.connect({
  proto : 'http',
  addr : process.env.PORT,
}, (err, url) => {
  if (err) {
      console.error('Error while connecting Ngrok',err);
      return new Error('Ngrok Failed');
  }
});