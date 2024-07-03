const dataCors = {
  origin: [
    "https://healmefit.io",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://s3buckethealmefitwebsite.s3-website-us-east-1.amazonaws.com",
    "http://buckethealmefit.s3-website-us-west-1.amazonaws.com",
    "http://buckethealmefit.s3-website-us-west-1.amazonaws.com",
    "http://healmefit.io.s3-website-us-west-1.amazonaws.com",
  ],
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: 'Content-Type , application/json , x-access-token , token',
  // credentials:'true'

  //  allowedHeaders: [
  //   "Content-Type",
  //   "application/json",
  //   "Origin",
  //   "X-Requested-With",
  //   "Accept",
  //   "x-client-key",
  //   "x-client-token",
  //   "x-client-secret",
  //   "x-access-token",
  //   "Authorization",
  // ],
  // credentials: true,
};

module.exports = dataCors;
