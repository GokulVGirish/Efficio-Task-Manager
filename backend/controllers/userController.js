import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateRandomOTP } from "../functions/generateOtp.js";
import otpModel from "../models/otpModel.js";
import { createTransport } from "nodemailer";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
const otpSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateRandomOTP(4);

    var transporter = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: "alok.yadav6000@gmail.com",
      to: email,
      subject: "Reset Password",
      html: `<h1>Signup Using Otp</h1><h2>this is your otp</h2><h3>${otp}</h3>`,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    await otpModel.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 2 * 60 * 1000),
    });
    res.status(200).json({ message: "Sucessfuly sent" });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otpUser = await otpModel.findOne({ email: email });
    if (!otpUser) return res.status(400).json({ message: "register again" });
    if (new Date() > otpUser.otpExpires)
      return res.status(400).json({ message: "otp expired" });
    if (otpUser.otp !== otp)
      return res.status(400).json({ message: "Wrong otp" });

    const newUser = new userModel({
      name: otpUser.name,
      email: otpUser.email,
      password: otpUser.password,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.find({ _id: id });
    res.status(200).json({ user: user[0] });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};

export { loginUser, registerUser, getUser, otpSignup };
