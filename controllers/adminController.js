import { generateSecureToken, sendVerificationEmail } from "../config/configfunctions.js";
import User from "../models/userModel.js";
import Request from "../models/requestModel.js";
import pkg from "bcryptjs";
import { ValidationError } from "sequelize";
const { hash, compare } = pkg;


export const registerAdmin = async (req, res) => {
    console.log("Controller triggered");
  try {
    const { email, password, firstName, lastName } = req.body;
    await User.sync();
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill All details",
      });
    }

    const hashPass = await hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      email,
      password: hashPass,
      firstName,
      lastName,
      role: "admin",
    });

    await Request.sync();

    const newRequest = await Request.create({
        UserId : newUser.id
    })

    // console.log(newRequest);

    const verificationToken = generateSecureToken(email, newUser.id, "1d");

    console.log("verificationToken", verificationToken);

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
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

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist please register",
      });
    }

    const matchPass = await bcrypt.compare(password, user.password);

    if (!matchPass) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Please verify your email using the link sent on your registered email address before login",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Please verify your email using the link sent on your registered email address before login",
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
    
  }
}