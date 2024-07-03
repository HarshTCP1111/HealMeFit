/* ***************************************************** */
/* *autor:Harsh_Tech Concierge Pro.  ************************ */
/* *github: https://github.com/HarshTCP1111/Heal-Me-Fit  ******* */
/* *mail: harsh@techconciergepro.com  ******************** */
/* ***************************************************** */



const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("./config");
const mongoose = require("mongoose");
const app = express();
mongoose.set("strictQuery", true);
const http = require("http").Server(app);
const https = require("https");

// const io = require("socket.io")(http);
require("dotenv/config");
const multer = require("multer");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const fetch = require("node-fetch");
// const fs = require("fs");

const dataCors = require("./dataCors");

// const file = fs.readFileSync("./92BFC4E809B3B53BC0D51B997B9333BF.txt");
// const key = fs.readFileSync("/home/ec2-user/heal-me-fit-backend/private.key");
// const cert = fs.readFileSync("/home/ec2-user/heal-me-fit-backend/certificate.crt");
// const key = fs.readFileSync("./private.key");
// const cert = fs.readFileSync("./certificate.crt");
// const cred = { key, cert };

// Database begin
const options = {
  //   socketOptions: {
  //     autoReconnect: true,
  //     noDelay: true,
  //     keepAlive: 0,
  //     connectTimeoutMS: 0,
  //     socketTimeoutMS: 0,
  //   },
  //   reconnectTries: 30,
  //   reconnectInterval: 1000,
  //   monitoring: true,
  //   haInterval:10000
  maxPoolSize: 50,
  wtimeoutMS: 0,
  useNewUrlParser: true,
};

// app.get(
//   "/.well-known/pki-validation/92BFC4E809B3B53BC0D51B997B9333BF.txt",
//   (req, res) => {
//     res.sendFile("/home/ec2-user/heal-me-fit-backend/92BFC4E809B3B53BC0D51B997B9333BF.txt");
//   }
// );

mongoose.connect(config.database, options, function (err) {
  if (err) {
    console.log("[Server] Not connected! ...");
    console.log(err);
  } else {
    console.log("[Server] Nice connected to data! ...");
  }
});

// Database end
//Upload s3 begin
//configure the aws environment
aws.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_ID,
//   secretAccessKey: process.env.AWS_SECRET,
// });

//initialize s3
const s3 = new aws.S3();

//constant params
const constantParams = {
  Bucket: process.env.AWS_BUCKET_NAME,
};
// res.header('Access-Control-Allow-Origin', 'https://healmefit.io');
// res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// res.header('Access-Control-Allow-Headers', 'Content-Type');

//dataCors
app.use(cors());

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const limits = {
  limits: {
    fieldNameSize: 255,
    fileSize: 500000,
    files: 1,
    fields: 1,
  },
};

const upload = multer({ storage, limits }).single("file");

app.post("/upload", upload, (req, res) => {
  // console.log("[Server] req: ", req);

  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME + "/files",
    Key: `${uuidv4()}.${fileType}`,
    Body: req.file.buffer,
    ACL: "public-read",
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    console.log("[Server]", "uploading file: ", error, data);
    res.status(200).send({
      key: data?.key?.replaceAll('"', "'"),
      url: data?.Location?.replaceAll('"', "'"),
      bucket: data?.Bucket?.replaceAll('"', "'"),
    });
  });
});

//Upload s3 end
//Download s3 object - begin
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.post("/download", (req, res) => {
  console.log("[Server] [/download] req.body: ", req.body);

  var urlDownloaded = "";
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "files/7ac791b5-97a4-4b8e-8a2c-7c5c1b912de8.png",
  };

  s3.getSignedUrl("getObject", params, function (err, url) {
    console.log("The URL is", params, url);
    urlDownloaded = url;
  });

  // {"key":"files/7ac791b5-97a4-4b8e-8a2c-7c5c1b912de8.png"}
  const downloadParams = {
    Key: "files/7ac791b5-97a4-4b8e-8a2c-7c5c1b912de8.png", //req?.body?.key,
    ...constantParams,
  };
  res.status(200).send({
    url: urlDownloaded,
    // file: s3.getObject(downloadParams).createReadStream(),
  });
});
//Download s3 object - end
// app.use(express.static(__dirname + "/public"));
// var api = require("./app/routes/api")(app, express, io);

var api = require("./app/routes/api")(app, express);
app.use("/api", api);
// api.use( function (req, res, next) {
// });
// app.use(cors(dataCors));

app.get("/", function (req, res) {
  res.send("<p>Ok Nice done!1!</p>");
});

http.listen(config.port, function (err) {
  if (err) {
    console.log("[Server] Error not listening! ...");
  } else {
    console.log("[Server] Listing port ...", config.port);
  }
});

// const httpsServer = https.createServer(cred, app);
// let portHttps = 8443;
// console.log("[httpsServer]", "cert");
// httpsServer.listen(portHttps, function (err) {
//   if (err) {
//     console.log("[Server https] Error not listening! ...");
//   } else {
//     console.log("[Server https ] Listing port ...", portHttps);
//   }
// });
