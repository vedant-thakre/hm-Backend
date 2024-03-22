import User from "../models/userModel.js";
import pkg from "bcryptjs";
import { ValidationError } from "sequelize";
const { hash, compare } = pkg;
import { generateSecureToken, sendVerificationEmail } from "../config/configfunctions.js";

// create a User
export const registerUser = async (req, res) => {
    const { email, password, dob } = req.body;
    await User.sync();
  try {    
    if (!email || !password || !dob) {
      return res.status(400).json({
        success: false,
        message: "Please fill All details",
      });
    }

    const hashPass = await hash(password, 10);
    const newDob = new Date(dob);

    
    // Create the new user
    const newUser = await User.create({
      email,
      password: hashPass,
      dob: newDob,
    });
    
    const verificationToken = generateSecureToken(email);

    await sendVerificationEmail(email, verificationToken, res);

    console.log(newUser);

    res.status(200).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => err.message),
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
