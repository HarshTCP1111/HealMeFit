const mongoose = require("mongoose");
const { v4 :uuidv4 } = require("uuid");

var Schema = mongoose.Schema;

var SettingSchema = new Schema({
  idBusiness: { type: String, required: true, index: { unique: false } }, //business initial
  status:{ type: String, required: true, index: { unique: false } },//active | deactive 
  dateCreate: { type: Date, default: Date.now },//date now current
  userCreate: { type: Schema.Types.ObjectId, ref: "User" }, //user current creator
  dateUpdated: { type: Date, default: Date.now },//date current updated
  userUpdated: { type: Schema.Types.ObjectId, ref: "User" }, //user current updated
 
}

// ,
// {
//  timestamps: true,
//  versionKey: false,
//  idSetting: true,
//  toJSON: {
//    transform(doc, ret) {
//      ret.idSetting = ret._id;
//      delete ret._id;
//     },
//  },
// }

);

module.exports = mongoose.model("Setting", SettingSchema);
