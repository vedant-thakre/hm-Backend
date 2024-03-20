import User from "../models/userModel.js";
import { ValidationError } from "sequelize";

// create a User
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    await User.sync();
    // Validate input data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Create the new user
    const newUser = await User.create({
      email,
      password,
    });

    console.log(newUser);

    res.status(200).json({
      success: true,
      message: "Registration successful",
      data: newUser
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      // Handle validation errors
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
