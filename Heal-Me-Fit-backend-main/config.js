
const config= {
  "database": "mongodb+srv://hshuddhalwar1102:HCaDfaOJrCXQQlS4@ec2-user.ywtvbqv.mongodb.net/?retryWrites=true&w=majority&appName=Ec2-User",
  "port": process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  "ip": process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  "secretKey" : "YourSecretKey",
  "saltRounds":10
}

module.exports = config;
