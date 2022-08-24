var net = null;
const posenet = require('@tensorflow-models/posenet');
const tfjs = require('@tensorflow/tfjs-node');
const toUint8Array = require('base64-to-uint8array');
const base64_to_tensor = require('base64-to-tensor');

var imageWidth = 320;
var imageHeight = 240;

var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.post('/sendFrame', function(req, res){
    var base64Data = decodeURIComponent(req.body[Object.keys(req.body)[0]]);
    base64Data = base64Data.split("------")[0];

    const image = base64_to_tensor.convert(base64Data);


    const poses = net.estimateMultiplePoses(image, {
        maxDetections: 40,
        nmsRadius: 100
    }).then(function(poses){
        console.log(new Date());
        res.end(JSON.stringify(poses));
    });

    
});


net = posenet.load({
    architecture: "ResNet50",
    quantBytes: 1,
    outputStride: 16,
    inputResolution: {
    width: imageWidth * 2,
    height: imageHeight * 2
    } 
  }).then(function(n){
    net = n;
    console.log(net);
    console.log("Simple static server listening at http://" + hostname + ":" + port);
    app.listen(port);
  });

