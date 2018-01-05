let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let request = require('request-promise');
let db = require('../database-mongo/index.js');
let config = require('../react-client/config.js');
let client = require('twilio')(config.twilio_SID, config.twilio_API);

let app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/saved', function(req, res) {
  console.log('hit /saved endpoint')
  db.selectAll()
    .then((result) => {
      res.json(result);
    })
})

app.post('/directions', function (req, res) {
  let mapsUrl = (`https://www.google.com/maps/dir/?api=1&origin=${req.body.startAddress.split(' ').join('+')}&destination=${req.body.endAddress.split(' ').join('+')}&travelmode=driving`);
  let phoneNumber = req.body.phoneNumber;
  request({
    method: 'POST',
    uri: `https://www.googleapis.com/urlshortener/v1/url?key=${config.google_API}`,
    body: {
      longUrl: mapsUrl
    },
    json: true,
  })
    .then(result => {
      client.messages.create({
        to: `+1${phoneNumber}`,
        from: '+19252471032',
        body: result.id 
      }, 
      (err, message) => {
        console.log('message sent! SID:', message.sid);
        res.sendStatus(200);
      })
    }) // send to twilio
    .catch(err => {
      console.log(err)
    })
});

app.post('/map', function (req, res) {
  db.insert(req.body)
    .then(() => {
      console.log('DB INSERTED YO!');
      res.redirect('/saved');
    })
    .catch((err) => {
      console.log('DB Insert Failed', err.message)
    })
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

