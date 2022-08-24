const posenet = require('@tensorflow-models/posenet');
const tfjs = require('@tensorflow/tfjs-node');
toUint8Array = require('base64-to-uint8array');

var imageWidth = 320;
var imageHeight = 240;

  const net = posenet.load({
    architecture: "ResNet50",
    quantBytes: 1,
    outputStride: 16,
    inputResolution: {
      width: imageWidth * 2,
      height: imageHeight * 2
    } 
  });



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

    /*
    const img = base64Data.replace(
        /^data:image\/(png|jpeg);base64,/,
        ""
      );
      const b = new Buffer.from(img, "base64");
    console.log(b);
      const image = tfjs.node.decodeImage(b);
*/

     const imageData = base64Data.replace('data:image/jpeg;base64','')
              .replace('data:image/png;base64','');
    
    const imageArray = toUint8Array(imageData);
    
    const tensor3d = tfjs.node.decodeJpeg( imageArray, numOfChannels );

    console.log(tensor3d);



    const poses = net.estimateMultiplePoses(image, {
        maxDetections: 40,
        nmsRadius: 100
    });

  console.log('got poses: ', poses.length);


    res.end('ok');
    
});


console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
