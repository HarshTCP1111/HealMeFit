var config = require("../../config.js");
var User = require("../models/user.js");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const fetch = require("cross-fetch");

var secretKey = config.secretKey;
var Nro_idBusiness = "none"; //Obteniendo codigo de negocio
var jsonwebtoken = require("jsonwebtoken");
const { json } = require("body-parser");
const crypto = require("crypto");
const { URLSearchParams } = require("url");
const pkceChallenge = require("pkce-challenge").default;
var FITBIT_CLIENT_ID = "239878";
const { code_verifier: verifier, code_challenge: challenge } =
  pkceChallenge(128);
const cors = require("cors");

const dataCors = require("../../dataCors");

function createToken(user) {
  var token = jsonwebtoken.sign(
    {
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      idBusiness: user.idBusiness,
    },
    secretKey,
    {
      expiresIn: 14409999999999,
    }
  );

  return token;
}
function base64UrlEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "_")
    .replace(/\+/g, "_")
    .replace(/=/g, "");
}
function sha256Hash(buffer) {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest();
}

module.exports = function (app, express, io) {
  var api = express.Router();

  api.get("/fitbitsignin", function (req, res) {
    console.log("[/signinfitbit]: ", "verifier", "------", challenge);
    const search =
      "?" +
      new URLSearchParams({
        client_id: process.env.FITBIT_CLIENT_ID,
        response_type: "code",
        code_challenge: challenge,
        code_challenge_method: "S256",
        expires_in: "31536000",
        scope: `activity cardio_fitness electrocardiogram heartrate location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature weight`,
        // &state=process.env.FITBIT_CLIENT_ID,
      });
    const url = "https://www.fitbit.com/oauth2/authorize" + search;
    res.redirect(url);
  });
  api.post("/fitbitcallback", async function (req, res, next) {
    try {
      console.log(
        "[fitbitcallback]:",
        req.body?.find?._id,
        "challenge, verifier"
      );
      const user = process.env.FITBIT_CLIENT_ID;
      const pass = process.env.FITBIT_CLIENT_SECRET;
      const credentials = Buffer.from(`${user}:${pass}`).toString("base64");
      const tokenUrl = "https://api.fitbit.com/oauth2/token";

      console.log(
        "[API]",
        tokenUrl,
        credentials,
        "|",
        process.env.FITBIT_CLIENT_ID,
        "|",
        req.query.code,
        verifier
      );

      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: FITBIT_CLIENT_ID, // process.env.FITBIT_CLIENT_ID,
          code: req.query.code,
          code_verifier: verifier,
          grant_type: "authorization_code",
          // expires_in: "31536000",
        }).toString(),
      });

      const tokenBody = await tokenResponse.json();

      if (tokenBody.errors) {
        console.error("[tokenBody.errors]", tokenBody.errors[0].message);
        res.status(500).end();
        return;
      }
      console.log("[fitbitcallback] [server] [2] [tokenBody]", tokenBody);

      const userId = "-";
      const date = "today";
      const detailLevel = "1day";

      // const dataUrl =
      //   "https://api.fitbit.com/" +
      //   [
      //     "1",
      //     "user",
      //     userId,
      //     "activities",
      //     "heart",
      //     "date",
      //     date,
      //     "1d",
      //     `${detailLevel}.json`,
      //   ].join("/");
      //update user-begin

      const dataUrl = "https://api.fitbit.com/1/user/-/devices.json";

      const dataResponse = await fetch(dataUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBody["access_token"]}`,
        },
      });
      const dataBody = await dataResponse.json();

      if (dataBody.errors) {
        console.error(dataBody.errors[0].message);
        res.status(500).end();
        return;
      }

      // res
      //   .status(200)
      //   .json({ token: tokenBody["access_token"], data: dataBody }); //, null, 2));
      let dateUpdated = new Date();
      let typeSmartWatch = req.body?.data?.typeSmartWatch || "fitbit";
      let device = dataBody;
      let access = tokenBody["access_token"];
      console.log("[api/fitbitcallback] [access]", new Date(), access);

      let queryUpdate = {
        dateUpdated: dateUpdated,
        typeSmartWatch: typeSmartWatch,
        device: device,
        access: access,
      };

      User.findByIdAndUpdate(
        req.body?.find?._id,
        queryUpdate,
        function (err, users) {
          console.log("[put] [api/user] [find-data]", users, err);
          if (!!err || !users) {
            res.send({
              success: false,
              message: "Error user | " + JSON.stringify(err),
            });
            return;
          } else {
            res.status(200).send({
              success: true,
              message: "User has been updated",
              data: device,
            });
          }
        }
      );

      //update user-end
    } catch (error) {
      res.send({
        success: false,
        message: "No one, " + JSON.stringify(error),
      });
      next(error);
    }
  });
///health here
  api.post("/fitbitcallbackheartrangedate", async function (req, res, next) {
    try {
      var token = req.query["x-access-token"] || req.headers["x-access-token"];
      var dateStart = req.query["datestart"] || req.headers["datestart"];
      var dateEnd = req.query["dateend"] || req.headers["dateend"];
      let userId = req.query["userid"] || req.headers["userid"];
      let urlDevice = `https://api.fitbit.com/1/user/-/activities/heart/date/${dateStart}/${dateEnd}.json`;

      var myHeaders = new fetch.Headers();//new Headers();
      myHeaders.append("Authorization", `Bearer ${token} `);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(urlDevice, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          res.status(200).json(JSON.parse(result)); //, null, 2));
          console.log("[/fitbitcallbackheartrangedate]", result);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      next(error);
    }
  });

  // // // //

  api.post("/signup", function (req, res) {
    console.log("/api/signup : ", req.body, typeof req.body.groups);
    var user = new User({
      password: req.body.password,
      lastLoginDate: req.body.lastLoginDate,
      isSuperUser: req.body.isSuperUser,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      isStaff: req.body.isStaff,
      isActive: req.body.isActive,
      // dateCreate: req.body.dateCreate,
      // userCreate: req.body.userCreate,
      groups: req.body.groups,
      userPermissions: req.body.userPermissions,

      idBusiness: req.body.idBusiness,
      status: req.body.status,

      dateUpdated: req.body.dateUpdated,
      //userUpdated: req.body.userUpdated
    });

    var token = createToken(user);

    user.save(function (err) {
      if (err) {
        console.log(
          "[api] [ /signup ] Error:",
          req.body.idBusiness,
          " user created: " +
            user.firstName +
            " " +
            user.lastName +
            " | " +
            user.email,
          err
        );
        res.json({
          success: false,
          message: "User wasn't created",
        });
        return;
      }
      res.json({
        success: true,
        message: "User has been created",
        token: token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      });

      console.log(
        "[api] [ /signup ] idBusiness:",
        req.body.idBusiness,
        " user created: " + user.firstName + " " + user.lastName
      );
    });
  });
  api.post("/login", function (req, res) {
    console.log("[api] [ /login ] [0]:", req.body);

    User.findOne({
      email: req.body.email,
    })
      .select(
        "firstName lastName password email idBusiness dateBirth address currentDevice typeSmartWatch access driver phoneNumber phoneNumberCountry  _id"
      )
      .exec(function (err, user) {
        if (err) throw err;

        if (!user) {
          res.send({ success: false, message: "User does not exist!" });
        } else if (user) {
          var validPassword = user.comparePassword(req.body.password);

          if (!validPassword) {
            res.send({ success: false, message: "Password not valid!" });
          } else {
            // token
            var token = createToken(user);
            Nro_idBusiness = user.idBusiness;

            console.log(
              "[api] [ /login ] idBusiness:",
              Nro_idBusiness,
              " user connected: ",
              user,
              ">>|>>" + token + "<<|<<",
              user
            );

            res.json({
              change: "OK",
              success: true,
              message: "User connected!",
              token: token,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              idBusiness: Nro_idBusiness,
              fullName: user.firstName + " " + user.lastName,
              _id: user._id,
              dateBirth: user.dateBirth,
              address: user.address,
              driver: user.driver,
              // driver: {
              //   driverNro: "",
              //   truckNro: "",
              //   LicensePlate: "",
              //   InsuranceNro: "",
              // },
              typeSmartWatch: user.typeSmartWatch,
              currentDevice: user.currentDevice,
              access: user.access,
            });
          }
        }
      });
  });
  api.use(cors(), function (req, res, next) {
    //cors(dataCors),
    console.log("[API/(use)]", req.headers, "]]]]]]]]]");
    console.log("[API/(use)]", req, "|||||||");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
    // res.header("Access-Control-Allow-Headers","*")
    //  res.setHeader('Access-Control-Allow-Origin', '*');
    //  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //  res.setHeader('Access-Control-Allow-Headers', 'x-access-token,content-type');
    //  res.setHeader('Access-Control-Allow-Credentials', true);

    var token = req.query["x-access-token"] || req.headers["x-access-token"];

    // check if token exist
    if (token) {
      jsonwebtoken.verify(token, secretKey, function (err, decoded) {
        if (err) {
          res
            .status(403)
            .send({ success: false, message: "Failed to authenticate user" });
          //   next();
        } else {
          req.decoded = decoded;
          Nro_idBusiness = req.decoded.idBusiness;
          console.log(Nro_idBusiness + " > Se conecto el token > ");
          if (Nro_idBusiness === "none" && Nro_idBusiness === "undefined") {
            console.log("Error no se logueo correctamente");
            res.send(err);
            res.status(403).send({
              success: false,
              message: "No token Provided | idBussiness undefined ",
            });
          }
          next();
        }
      });
    } else {
      res.status(403).send({ success: false, message: "No token Provided" });
      next();
    }
  });
  api.post("/fitbithealth", async function (req, res, next) {
    try {
      var token = req.query["token"] || req.headers["token"];
      let userId = req.query["userid"] || req.headers["userid"];
      let urlProfile = "https://api.fitbit.com/1/user/-/profile.json";
      let urlSleep =
        "https://api.fitbit.com/1.2/user/-/sleep/list.json?beforeDate=" +
        moment(new Date()).format("YYYY-MM-DD") +
        "&&sort=desc&&limit=5&&offset=0";
      let urlBmi =
        "https://api.fitbit.com/1/user/-/body/log/weight/date/" +
        moment(new Date()).format("YYYY-MM-DD") +
        "/1m.json";
      let urlHeart =
        "https://api.fitbit.com/1/user/-/activities/heart/date/today/1m.json";
      // moment(new Date()).format("YYYY-MM-DD") +

      var profileData = {};
      var sleepData = {};
      var bmiData = {};
      var heartData = {};
      var stepsData = {};
      var myHeaders = new fetch.Headers(); // new Headers();
      myHeaders.append("Authorization", `Bearer ${token} `);
      // console.log("[token]", token);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      await fetch(urlProfile, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          profileData = JSON.parse(result);
        })
        .catch((error) => console.log("error", error));

      console.log("[urlSleep]", urlSleep);
      await fetch(urlSleep, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          sleepData = JSON.parse(result);
        })
        .catch((error) => console.log("error", error));

      console.log("[urlBmi]", urlBmi);
      await fetch(urlBmi, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          bmiData = JSON.parse(result);
        })
        .catch((error) => console.log("error", error));

      console.log("[urlHeart]", urlHeart);
      await fetch(urlHeart, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          heartData = JSON.parse(result);
        })
        .catch((error) => console.log("error", error));

      res.status(200).json({
        success: !!profileData.user,
        type: "profile",
        data: {
          profile: profileData,
          sleep: sleepData,
          bmi: bmiData,
          heart: heartData,
          steps: profileData?.user?.averageDailySteps || 0,
        },
      }); //, null, 2));
    } catch (error) {
      next(error);
    }
  });

  api.get("/users", function (req, res) {
    try {
      User.find({}, function (err, users) {
        if (!!err) {
          console.log("[api] /users: [01] ", " | error |", err, !!err);
          res.send({
            success: false,
            message: "Error users | " + JSON.stringify(err),
          });
          return;
        } else {
          res.status(200).send({
            success: true,
            data: users,
          });
        }
      });
    } catch (error) {
      console.log("[api] /users: [4] " + error);

      res.status(403).send({
        success: false,
        message: "Error in users " + JSON.stringify(error),
      });
    }
  });
  api
    .route("/user")
    .put(async function (req, res) {
      try {
        let email = req.body?.data?.email;
        let firstName = req.body?.data?.firstName;
        let lastName = req.body?.data?.lastName;
        let lastLoginDate = req.body?.data?.lastLoginDate;
        let isSuperUser = req.body?.data?.isSuperUser;
        let isStaff = req.body?.data?.isStaff;
        let isActive = req.body?.data?.isActive;
        let dateBirth = req.body?.data?.dateBirth;
        let address = req.body?.data?.address;
        let groups = req.body?.data?.groups;
        let userPermissions = req.body?.data?.userPermissions;
        let status = req.body?.data?.status;
        let dateUpdated = req.body?.data?.dateUpdated;
        let userUpdated = req.body?.data?.userUpdated;
        let typeSmartWatch = req.body?.data?.typeSmartWatch;
        let device = req.body?.data?.device;
        let access = req.body?.data?.access;
        let currentDevice = req.body?.data?.currentDevice;
        let driver = req.body?.data?.driver;
        let phoneNumber = req.body?.data?.phoneNumber;
        let phoneNumberCountry = req.body?.data?.phoneNumberCountry;

        let queryUpdate = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          lastLoginDate: lastLoginDate,
          isSuperUser: isSuperUser,
          isStaff: isStaff,
          isActive: isActive,
          dateBirth: dateBirth,
          address: address,
          groups: groups,
          userPermissions: userPermissions,
          status: status,
          dateUpdated: dateUpdated,
          userUpdated: userUpdated,
          typeSmartWatch: typeSmartWatch,
          device: device,
          access: access,
          currentDevice: currentDevice,
          driver: driver,
          phoneNumber: phoneNumber,
          phoneNumberCountry: phoneNumberCountry,
        };

        User.findByIdAndUpdate(
          req.body?.find?._id,
          queryUpdate,
          function (err, users) {
            console.log("[put] [api/user] [find-data]", users);
            if (!!err || !users) {
              res.send({
                success: false,
                message: "Error user | " + JSON.stringify(err),
              });
              return;
            } else {
              res.status(200).send({
                success: true,
                message: "User has been updated",
              });
            }
          }
        );
      } catch (err) {
        console.log("[put][api/user] error:", err);
        res.send({
          success: false,
          message: "No one, " + JSON.stringify(err),
        });
        return;
      }
    })
    .post(async function (req, res) {
      var token = req.query["x-access-token"] || req.headers["x-access-token"];

      User.findOne({
        email: req.body.email,
        _id: req.body._id,
      })
        .select(
          "firstName lastName password email idBusiness dateBirth address currentDevice typeSmartWatch access driver phoneNumber phoneNumberCountry _id"
        )
        .exec(function (err, user) {
          if (err) throw err;

          res.json({
            success: true,
            token: token,
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            idBusiness: Nro_idBusiness,
            fullName: user.firstName + " " + user.lastName,
            dateBirth: user.dateBirth,
            address: user.address,
            driver: user.driver,
            typeSmartWatch: user.typeSmartWatch,
            currentDevice: user.currentDevice,
            access: user.access,
            phoneNumber: user.phoneNumber,
          });
        });
    });

  return api;
};
