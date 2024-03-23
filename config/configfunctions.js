import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
});

export const generateSecureToken = (email) => {
  const token = jwt.sign({ email }, process.env.VERIFICATIOIN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export const verifySecurityToken = async (req, res) => {
  try {
    const { token } = req.params;

    let decodedmail;
    try {
      decodedmail = jwt.verify(token, process.env.VERIFICATIOIN_SECRET);
    } catch (error) {
      res.status(500).json({
        message: "Email verification failed please try again",
      });
    }

    const findUser = await User.findOne({
      where: { email: decodedmail.email },
    });

    if (!findUser) {
      res.status(400).json({
        message: "Verification link has expired or is invalid",
      });
    }

    // Update isVerified property and save the user
    findUser.isVerified = true;
    await findUser.save();

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
                      <a href='http://localhost:8080/api/v1/verify-email/${token}' class="btn">Verify Email</a>
                      <p class="content">Once you verify your account, you may login to view your account status, API usage activity, and account settings.</p>
                      <p class="footer">Best regards,<br> The H&M Team</p>
                    </div>
                  </body>
                  </html>
          `,
    });
    console.log("verificatioin email has been sent");
  } catch (error) {
    console.log("Error" , error);
  }
};
