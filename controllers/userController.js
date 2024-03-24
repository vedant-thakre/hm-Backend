import User from "../models/userModel.js";
import pkg from "bcryptjs";
import { ValidationError } from "sequelize";
import { generateSecureToken, sendVerificationEmail, ResetPasswordEmail, transporter } from "../config/configfunctions.js";
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
      const { email } = req.body;

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

      await transporter.sendMail({
        from: `H&M Team`,
        to: email,
        subject: "Your H&M Verification Link",
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Welcome to H&M!</title>
                  <style>
                    body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      background-color: #f8f9fa;
                      margin: 0;
                      padding: 0;
                    }
                    .container {
                      max-width: 600px;
                      margin: 50px auto;
                      padding: 20px;
                      background-color: #fff;
                      border-radius: 8px;
                      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    .logo {
                      display: block;
                      margin: 0 auto;
                      width: 150px;
                    }
                    .heading {
                      text-align: center;
                      margin-top: 20px;
                      color: #333;
                      font-size: 28px;
                      border-bottom: 1px solid #cacaca;
                      padding-bottom: 10px;
                    }
                    .content {
                      margin-top: 20px;
                      font-size: 16px;
                      line-height: 1.6;
                      color: #666;
                    }
                    .btn {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: #fff;
                      text-align: center;
                      text-decoration: none;
                      border-radius: 5px;
                      margin-top: 20px;
                      font-size: 16px;
                      transition: background-color 0.3s ease;
                    }
                    .btn:hover {
                      background-color: #0056b3;
                    }
                    .footer {
                      margin-top: 20px;
                      font-size: 14px;
                      color: #999;
                      text-align: center;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1 class="heading">Welcome to H&M</h1>
                    <p class="content">You're just a click away from unlocking a treasure trove of powerful APIs.</p>
                    <p class="content">Please click the following link to verify your email address:</p>
                    <a href='http://localhost:8080/api/v1/user/forgot-password/change_password_using_email/link/${token}' class="btn">Change Password</a>
                    <p class="content">Once you verify your account, you may login to view your account status, API usage activity, and account settings.</p>
                    <p class="footer">Best regards,<br> The H&M Team</p>
                  </div>
                </body>
                </html>
        `,
      });

      return res.status(200).json({
        success: true,
        message: "Check email to change the password",
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

export const forgotPasswordVerifyAndChangePassword = async(req, res) => {
  try {
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.VERIFICATIOIN_SECRET);
    } catch (error) {
      res.status(500).json({
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

    const hashPass = await hash(password, 10);

    findUser.password = hashPass;

    await findUser.save();

    res.status(400).json({
      success: true,
      message: "Password changed successfully",
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