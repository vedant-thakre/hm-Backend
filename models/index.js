import Address from "./addressModel";
import Otp from "./otpModel";
import User from "./userModel";



// Relation between Schemas
User.hasMany(Otp);
User.hasMany(Address);

Otp.belongsTo(User);

Address.belongsTo(User);