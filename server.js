var http = require('http');
var url = require('url');
var moment = require('moment');

var port = process.env.PORT || 5000;

var processTime = (req,res) => {

  // parse url
  var parsedUrl = url.parse(req.url, true);

  // if it's not the root, display 404
  if(parsedUrl.pathname === '/') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    var err = {error: 'Date not provided - please provide an unix or natural language date'};
    return res.end(JSON.stringify(err));
  }

  // timeInput: remove slash from path
  var timeInput = decodeURI(parsedUrl.pathname.slice(1));

  // time will receive text or unix seconds that should
  // be multiplied by 1000 to instantiate moment unix milis
  var time = isNaN(timeInput) ? moment(timeInput) : moment(Number(timeInput) * 1000);

  // unix and natural language result
  var result = time.isValid() ?
    {
      unix: Number(time.format('X')),
      natural: time.format('MMMM D, YYYY')
    } : { unix: null, natural: null};
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(result));

};

var server = http.createServer((req,res) => {

  // microservice - always only process time
  // no frameworks, neither routes lib needed
  processTime(req,res);

});
server.listen(port);
console.log('Server started on port ' + port + '...');