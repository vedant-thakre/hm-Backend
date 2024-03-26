import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import { verificationEmail } from "./emails/verificationEmail.js";
import { resetPasswordEmail } from "./emails/resetpasswordEmail.js";
import { requestEmail } from "./emails/requestEmail.js";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
});

export const generateSecureToken = (email, id, tokenExpiration) => {
  const token = jwt.sign({ email, id }, process.env.VERIFICATIOIN_SECRET, {
    expiresIn: tokenExpiration,
  });
  return token;
};

export const verifySecurityToken = async (req, res) => {
  console.log("Verifying the Security Token using Email");
  try {
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.VERIFICATIOIN_SECRET);
    } catch (error) {
      res.status(400).json({
        message: "Email verification failed please try again",
      });
    }

    const findUser = await User.findOne({
      where: { email: decoded.email },
    });

    if (!findUser) {
      res.status(400).json({
        message: "Verification link has expired or is invalid",
      });
    }

    // Update isVerified property and save the user
    findUser.isVerified = true;
    await findUser.save();

    if(findUser.role === "admin"){
       const superadmin = await User.findOne({
         where: {
          role: "superadmin"
         }
       })
       const mailInfo = await transporter.sendMail({
         from: `H&M Team`,
         to: superadmin.email,
         subject: "Requested admin access",
         html: requestEmail(findUser.firstName, findUser.lastName),
       });
       if(mailInfo){
        console.log("Request email has been sent");
       }
    }

    console.log("done");

    return res.status(200).json({
      success: true,
      message: "Verification successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendVerificationEmail = async (email, token) => {
  try {
    await transporter.sendMail({
      from: `H&M Team`,
      to: email,
      subject: "Your H&M Verification Link",
      html: verificationEmail(token),
    });
    console.log("verificatioin email has been sent");
  } catch (error) {
    console.log("Error" , error);
  }
};

export const ResetPasswordEmail = async (email, name, newOtp) => {
  try {
    await transporter.sendMail({
      from: `H&M Team`,
      to: email,
      subject: "Reset Your Password",
      html: resetPasswordEmail(name, newOtp),
    });
    console.log("verificatioin email has been sent");
  } catch (error) {
    console.log("Error" , error);
  }
};

export const SuperAdminAccess = async(req, res, next) => {
  try {
    const { token } = req.cookies;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.VERIFICATIOIN_SECRET);
    } catch (error) {
      res.status(400).json({
        message: "Invalid Token",
      });
    }

    const user = await User.findOne({
      where: {
        email: decoded.email,
        role: "superadmin",
      },
    });

    if(!user){
       res.status(400).json({
        success: false,
        message: "Your not authorize to access this route",
       });
    }
    next();

   } catch (error) {
     console.log(error);
     res.status(500).json({
       message: "Internal server error",
     });
  }
}
