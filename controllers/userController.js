import User from "../models/userModel.js";
import pkg from "bcryptjs";
import { ValidationError } from "sequelize";
import { generateSecureToken, sendVerificationEmail, ResetPasswordEmail } from "../config/configfunctions.js";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import Otp from "../models/otpModel.js";
const { hash, compare } = pkg;
import jwt from "jsonwebtoken";


// create a User
export const registerUser = async (req, res) => {
  try {    
    const { email, password, dob } = req.body;
    await User.sync();fda
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
    
    const verificationToken = generateSecureToken(email, newUser.id, "1d");

    console.log(verificationToken);

    await sendVerificationEmail(email, verificationToken);

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

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({ where: { email: email}});

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist please register",
      });
    }

    const matchPass = await bcrypt.compare(password, user.password);

    if(!matchPass){ 
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    if(!user.isVerified){
      return res.status(400).json({
        success: false,
        message: "Please verify your email using the link sent on your registered email address before login",
      });
    }

    let tokenExpiration = "1d";
    if (rememberMe) {
      tokenExpiration = "30d";
    }

    const authToken = generateSecureToken(email, user.id, tokenExpiration);

    const maxAgeDays = parseInt(tokenExpiration) * 24 * 60 * 60 * 1000;

    res.cookie("token", authToken, {
      httpOnly: true,
      maxAge: maxAgeDays,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: authToken,
    });

  } catch (error) {
     if (error instanceof ValidationError) {
       return res.status(400).json({
         success: false,
         message: "Validation error",
         errors: error.errors.map((err) => err.message),
       });
     }

     res.status(500).json({
       success: false,
       message: "Something went wrong",
       error: error.message,
     });
  }
}

export const forgotPassword = async(req, res) => {
   try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not exist please register",
        });
      }

      const expirationMinutes = 0.5;
      const newOtp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      console.log("Generated Otp");

      await Otp.sync();

      let otpRecord = await Otp.findOne({ where: { UserId: user.id } });

      console.log("Finding Record");

      const name = user?.firstName ? user.firstName : "User";

      await ResetPasswordEmail(email, name, newOtp);

      const token = generateSecureToken(email, user.id, "1h");


      if (otpRecord) {
        otpRecord.code = newOtp;
        otpRecord.createdAt = new Date();
        otpRecord.expiresAt = new Date(Date.now() + expirationMinutes * 60000); 

        console.log("createdAt", otpRecord.createdAt);
        console.log("ExpiredAt", otpRecord.expiresAt);

        await otpRecord.save();
      } else {
        console.log("creating Table")
        otpRecord = await Otp.create({
          code: newOtp,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + expirationMinutes * 60000),
          UserId: user.id
        });
      }

      return res.status(200).json({
        success: true,
        token: token,
        message: "OTP has been sent your Email",
      });
   } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
   }
}

export const matchOtp = async(req, res) => {
  try {
    const { otp , email } = req.body;

    const user = await User.findOne({ where : { email: email}});

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const otpRecord = await Otp.findOne({
      where: { UserId: user.id, code: otp },
    });

    const currentTime = new Date();
    if (currentTime > otpRecord.expiresAt) {
      return res.status(401).json({ 
        message: "OTP has expired" 
      });
    }

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP matched successfully",
    });
    
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

export const forgotPasswordEmailLink = async(req, res) => {
  try {
      const { email } = req.params;

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found.",
        });
      }

      const token = jwt.sign({ email, id }, process.env.VERIFICATIOIN_SECRET, {
        expiresIn: "1h",
      });

      
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}