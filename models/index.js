import Address from "./addressModel";
import Otp from "./otpModel";
import User from "./userModel";

// Relation between Schemas
User.hasOne(Otp);
User.hasMany(Address);

Otp.belongsTo(User, { foreignKey: "UserId" });
Address.belongsTo(User);