var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;
//app.use(methodOverride());
//app.use(errorHandler());
//app.use(bodyParser());
//app.use(require('connect').bodyParser());


app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());




app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
      res.redirect("/index.html");
});

app.post('/sendFrame', function(req, res){
    var base64Data = req.body[Object.keys(req.body)[0]];
    base64Data = base64Data.split("------")[0];
    console.log(base64Data);
    console.log()
  //  var buf = new Buffer(req.body.data.replace(/^data:image\/\w+;base64,/, ""),'base64');
    res.end('ok');
    
});


console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
