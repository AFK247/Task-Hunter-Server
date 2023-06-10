const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * @desc - Register new user
 * @public
 * @funtion
 * @route /users/register
 * @param {string} email_password_name_phone_userName
 * @returns {Promise}
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, phone, userName } = req.body;
  console.log(email);
  if (!email || !password || !name || !phone || !userName) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    name,
    userName,
    email,
    phone,
    photo:
      "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg",
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      userName: user.userName,
      phone: user.phone,
      photo: user.photo,
    });
  } else {
    res.status(400);
    throw new Error("User data not valid");
  }
  res.json("Registration Successful");
});

/**
 * @desc - Login user
 * @public
 * @funtion
 * @route /users/login
 * @param {string} email_password
 * @returns {Promise}
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  // //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          userName: user.userName,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "200h" }
    );
    res.status(200).json({
      accessToken,
      user: {
        userName: user.userName,
        phone: user.phone,
        email: user.email,
        name: user.name,
        photo: user.photo,
        user: user.id,
      },
    });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
  res.status(200).json("Login successful");
});

/**
 * @desc - Get current User Info
 * @public
 * @funtion
 * @route /users/current
 * @returns {Promise}
 */
const currentUser = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const user = await User.findOne({ email });
  console.log(user);
  delete user._doc.password;
  res.json(user);
});

/**
 * @desc - profile update
 * @public
 * @funtion
 * @route /users/profileUpdate
 * @param {string} email_name_phone_photo
 * @returns {Promise}
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { email, name, phone, photo } = req.body;

  const userAvailable = await User.findOne({ email });
  if (!userAvailable) {
    res.status(404);
    throw new Error("User Not Found!");
  }
  // const temp = await User.findById(userAvailable.id);

  const updatedTask = await User.findByIdAndUpdate(userAvailable.id, {
    phone,
    name,
    photo,
  });
  const sendingUser = await User.findOne({ email });
  console.log(sendingUser);
  res.status(200).json(sendingUser);
});

/**
 * @desc - Create a new task
 * @private
 * @funtion
 * @route /tasks/createTasks
 * @param {string} title
 * @param {string} body
 * @returns {Promise}
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { previousPassword, newPassword, email } = req.body;
  console.log(newPassword);

  const userAvailable = await User.findOne({ email });
  if (!userAvailable) {
    res.status(404);
    throw new Error("User Not Found!");
  }
  const status = await bcrypt.compare(previousPassword, userAvailable.password);

  if (status) {
    //Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedPassword = await User.findByIdAndUpdate(userAvailable.id, {
      password: hashedPassword,
    });
    res.status(200).json("Password Updated successfull");
  } else {
    res.status(401);
    throw new Error("Password does not match");
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  updateProfile,
  updatePassword,
};
