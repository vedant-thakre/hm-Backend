import Address from "./addressModel.js";
import Otp from "./otpModel.js";
import Request from "./requestModel.js";
import User from "./userModel.js";

// Relation between Schemas
User.hasOne(Otp);
User.hasOne(Request);
User.hasMany(Address);

Otp.belongsTo(User);
Request.belongsTo(User);
Address.belongsTo(User);
