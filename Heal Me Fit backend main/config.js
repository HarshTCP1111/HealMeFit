
const config= {
  "database": "mongodb+srv://davidgarciamyplusone:V!ctor!V!ctor!@clustermyplusone.yinq63z.mongodb.net/healmefit?retryWrites=true&w=majority",
  "port": process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  "ip": process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  "secretKey" : "YourSecretKey",
  "saltRounds":10
}

module.exports = config;
