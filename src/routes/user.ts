import {userModel} from "../../src/models/user";

const bcrypt = require("bcrypt");
const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.signUp = async (req, res) => {
  const {
    body: { name, email, password, role },
  } = req;

  if (!name || !email || !password || !role) {
    return res.status(400).send("Please provide all information.");
  }

  if (!validateEmail(email)) {
    res.status(400).send("Invalid email");
  }

  const salt = await bcrypt.genSalt(11);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await new userModel({
    name,
    email,
    passwordHash,
    role,
  }).save();

  return res.status(200).send(newUser);
};

exports.signIn = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    return res.status(400).send("Enter email and password.");
  }

  if (!validateEmail(email)) {
    return res.status(400).send("Please enter valid email.");
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user)
      res.send("Account with this email not exist, first create account.");

    const isPasswordCorrect = bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.send("Invalid Password");
    }

    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email,
        role: user.role,
      },
      process.env.SECRET_KEY
    );

    res.cookie("accessToken", jwtToken);

    return res.send({ message: "Logged In Succefully", jwtToken });
  } catch (error) {
    res.send(error);
  }
};