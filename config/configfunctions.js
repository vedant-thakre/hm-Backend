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

export const generateSecureToken = (email, id, tokenExpiration) => {
  const token = jwt.sign({ email, id }, process.env.VERIFICATIOIN_SECRET, {
    expiresIn: tokenExpiration,
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


export const ResetPasswordEmail = async (email, name, newOtp) => {
  try {
    await transporter.sendMail({
      from: `H&M Team`,
      to: email,
      subject: "Reset Your Password",
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Reset Password</title>

          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          style="
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background: #ffffff;
            font-size: 14px;
          "
        >
          <div
            style="
              max-width: 680px;
              margin: 0 auto;
              padding: 45px 30px 60px;
              background: #f4f7ff;
              background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
              background-repeat: no-repeat;
              background-size: 800px 452px;
              background-position: top center;
              font-size: 14px;
              color: #434343;
            "
          >
            <header>
              <table style="width: 100%;">
                <tbody>
                  <tr style="height: 0;">
                    <td width="50px">
                      <svg class="IconWrapper-module--icon__1nWiK Header-module--visibleMobile__2fGge IconWrapper-module--normal__2SFZ7" fill="#e50010" viewBox="0 0 370 244" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" focusable="false" role="img" aria-labelledby="id-hm-logo-normal"><title id="id-hm-logo-normal">H&amp;M</title><path d="M259.895 7.413c13.424-6.618 20.087-5.737 20.232.946.19 8.7-1.098 20.23-2.016 28.604-4.983 45.423-13.32 82.543-13.954 129.19 21.94-56.802 40.345-96.278 64.03-144.909 7.53-15.47 12.325-12.593 18.503-15.343 24.082-10.715 24.984-4.133 21.837 8.95-11.686 48.552-41.54 201.376-46.114 224.907-1.328 6.807-8.715 3.923-10.644 1.26-8.57-11.85-18.225-12.036-17.14-19.919 5.37-39.233 24.71-137.666 29.75-160.863-25.719 52.696-52.37 118.566-66.053 155.914-2.907 7.931-8.188 7.35-11.48 1.546-4.63-8.15-13.61-12.312-15.093-21.943-4.702-30.628 5.37-89.003 6.773-125.936-13.994 40.342-37.49 118.67-47.782 154.057-4.256 14.643-18.382 12.253-14.627-2.018 15.642-59.389 49.326-164.425 63.915-202.198 3.427-8.874 12.406-8.569 19.863-12.245zM174.6.115c4.26 1.025 3.913 6.05 1.31 12.912-7.682 20.247-18.335 46.847-30.516 78.212 7.658-.874 11.811-1.17 11.811-1.17 10.994-1.358 13.041 4.139 9.946 9.99-2.466 4.664-5.436 1.554-15.724 16.89-5.796 8.642-15.259 10.924-20.515 12.076-12.662 33.523-26.23 70.916-39.415 110.77-1.919 5.804-7.524 4.532-9.209 2.174-6.192-8.647-10.758-8.933-15.558-15.927-.577-1.132-1.706-2.672-1.027-5.448 3.53-14.425 12.901-44.067 27.156-83.091-17.958 3.892-37.387 8.076-45.408 9.94-9.626 25.445-19.014 50.967-27.908 76.18-5.518 15.64-19.88 12.617-14.84-2.165 8.028-23.548 16.89-48.004 25.776-71.72-9.948-1.063-13.313-8.088-18.873-13.958-2.147-2.267-6.828-1.948-9.12-5.127-4.123-5.711-3.712-8.248 5.81-10.996a955.318 955.318 0 0137.464-9.998c16.09-41.524 30.63-77.144 38.38-96.151C90.114-1.138 105.514.226 99.664 14.674c-11.889 29.363-24.079 59.867-36.11 90.799a880.98 880.98 0 0144.748-8.87 2312.644 2312.644 0 0134.62-83.968c.845-1.937 3.31-4.678 5.878-5.118 8.092-1.385 21.251-8.498 25.8-7.402zm-27.552 190.077c1.265-.773 2.524-1.715 3.767-2.75a756.514 756.514 0 01-2.82-8.468 139.528 139.528 0 00-2.752 3.638c-5.386 7.396-2.197 10.028 1.805 7.58zm7.167-35.065c6.67-7.53-6.516-10.681-3.48.836.17.65.382 1.413.62 2.254a98.19 98.19 0 002.86-3.09zm6.941 22.695c6.602-5.721 12.908-.046 6.38 9.628-1.404 2.08-2.99 4.318-4.729 6.522a193.17 193.17 0 002.146 5.877c3.375 8.654-5.488 10.824-8.345 3.656-.25-.626-.51-1.297-.778-1.995-5.387 4.772-11.618 7.777-18.275 5.707-10.954-3.407-13.74-18.83-3.514-30.711 4.103-4.767 7.191-8.074 9.771-10.716a251.947 251.947 0 01-1.819-6.17c-1.328-4.81-2.527-10.416 2.287-16.13 9.027-10.712 29.971-1.203 19.377 15.289-2.552 3.972-5.535 7.724-8.647 11.527a979.555 979.555 0 003.26 10.18 78.304 78.304 0 012.886-2.664z"></path></svg>
                    </td>
                    <td style="text-align: right;">
                      <span id="currentDate" style="font-size: 16px; line-height: 30px; color: #ffffff;"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </header>

            <main>
              <div
                style="
                  margin: 0;
                  margin-top: 70px;
                  padding: 92px 30px 115px;
                  background: #ffffff;
                  border-radius: 30px;
                  text-align: center;
                "
              >
                <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                  <h1
                    style="
                      margin: 0;
                      font-size: 24px;
                      font-weight: 500;
                      color: #1f1f1f;
                    "
                  >
                    Your OTP
                  </h1>
                  <p
                    style="
                      margin: 0;
                      margin-top: 17px;
                      font-size: 16px;
                      font-weight: 500;
                    "
                  >
                  Hey ${name},
                  </p>
                  <p
                    style="
                      margin: 0;
                      margin-top: 17px;
                      font-weight: 500;
                      letter-spacing: 0.56px;
                    "
                  >
                    Thank you for choosing H&M. Use the following OTP
                    to reset your password. OTP is
                    valid for
                    <span style="font-weight: 600; color: #1f1f1f;">2 minutes</span>.
                    Do not share this code with others, including H&M
                    employees.
                  </p>
                  <p
                    style="
                      margin: 0;
                      margin-top: 60px;
                      font-size: 40px;
                      font-weight: 600;
                      letter-spacing: 25px;
                      color: #ba3d4f;
                    "
                  >
                    ${newOtp}
                  </p>
                </div>
              </div>

              <p
                style="
                  max-width: 400px;
                  margin: 0 auto;
                  margin-top: 90px;
                  text-align: center;
                  font-weight: 500;
                  color: #8c8c8c;
                "
              >
                Need help? Ask at
                <a
                  href="mailto:archisketch@gmail.com"
                  style="color: #499fb6; text-decoration: none;"
                  >archisketch@gmail.com</a
                >
                or visit our
                <a
                  href=""
                  target="_blank"
                  style="color: #499fb6; text-decoration: none;"
                  >Help Center</a
                >
              </p>
            </main>

            <footer
              style="
                width: 100%;
                max-width: 490px;
                margin: 20px auto 0;
                text-align: center;
                border-top: 1px solid #e6ebf1;
              "
            >
              <p
                style="
                  margin: 0;
                  margin-top: 40px;
                  font-size: 16px;
                  font-weight: 600;
                  color: #434343;
                "
              >
                Archisketch Company
              </p>
              <p style="margin: 0; margin-top: 8px; color: #434343;">
                Address 540, City, State.
              </p>
              <div style="margin: 0; margin-top: 16px;">
                <a href="" target="_blank" style="display: inline-block;">
                  <img
                    width="36px"
                    alt="Facebook"
                    src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                  />
                </a>
                <a
                  href=""
                  target="_blank"
                  style="display: inline-block; margin-left: 8px;"
                >
                  <img
                    width="36px"
                    alt="Instagram"
                    src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
                /></a>
                <a
                  href=""
                  target="_blank"
                  style="display: inline-block; margin-left: 8px;"
                >
                  <img
                    width="36px"
                    alt="Twitter"
                    src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
                  />
                </a>
                <a
                  href=""
                  target="_blank"
                  style="display: inline-block; margin-left: 8px;"
                >
                  <img
                    width="36px"
                    alt="Youtube"
                    src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
                /></a>
              </div>
              <p style="margin: 0; margin-top: 16px; color: #434343;">
                Copyright © 2022 Company. All rights reserved.
              </p>
            </footer>
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
