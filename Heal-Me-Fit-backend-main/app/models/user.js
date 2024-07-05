const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var config = require("../../config");
const { v4: uuidv4 } = require("uuid");
mongoose.ObjectId.get((v) => v.toString());

var UserSchema = new Schema(
  {
    email: { type: String, required: true, index: { unique: true } }, //unique value
    // userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    lastLoginDate: { type: Date, default: Date.now }, //get last date of login
    isSuperUser: { type: String, default: "no" }, //yes | no default

    lastName: { type: String, required: true },
    isStaff: { type: String, default: "no" }, //yes | no default
    isActive: { type: String, default: "no" }, //yes | no default

    dateCreate: { type: Date, default: Date.now }, //date joined
    userCreate: { type: Schema.Types.ObjectId, ref: "User" }, //user joined
    dateBirth: { type: String, required: false },
    address: { type: String, required: false },
    groups: { type: Array, default: [String] }, // [{ permission: "group_basic" }] default
    userPermissions: { type: Array, default: [String] }, //[{permission:"user_basic"}] default, user_driver, user_admin, user_manager
    idBusiness: { type: String, required: true, select: false },
    status: { type: String, defaul: "active" },
    dateUpdated: { type: Date, default: Date.now },
    userUpdated: { type: Schema.Types.ObjectId, ref: "User" },
    typeSmartWatch: { type: String, require: false, default: "fitbit" },
    device: { type: Object, required: false },
    currentDevice: { type: Object, required: false },
    access: { type: Object, required: false },
    driver: { type: Object, required: false },
    phoneNumber: { type: String, required: false },
    phoneNumberCountry: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
    fullName: true,
    toJSON: {
      transform(doc, ret) {
        ret.fullName = ret.firstName + " " + ret.lastName;
        // delete ret._id;
      },
    },
  }
);

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(config.saltRounds, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      console.log("[model] [ user ] [0]:", user.password, err, salt);

      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password) {
  var user = this;
  console.log("[model] [ user ] [2]:", user);

  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model("User", UserSchema);
