const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { email, password, name, role, about_me } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "") {
    res.status(400).json({ message: "Provide email" });
    return;
  } else if (password === "") {
    res.status(400).json({ message: "Provide password" });
    return;
  } else if (name === "") {
    res.status(400).json({ message: "Provide name" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "Email already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({
        email,
        password: hashedPassword,
        name,
        role,
        about_me,
      });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id, role, about_me } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id, role, about_me };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// PUT /api/projects/:projectId to update info of a Project

router.put("/profile/edit/:userId", async (req, res) => {
  const { userId } = req.params;
  const { email, name, about_me, imgUrl } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  try {
    let updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, name, about_me, imgUrl },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.json(error);
  }
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "") {
    res.status(400).json({ message: "Provide email." });
    return;
  } else if (password === "") {
    res.status(400).json({ message: "Provide password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, admin, about_me, name, imgUrl } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, admin, about_me, name, imgUrl };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({
          message:
            "Wrong Password!",
        });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET /api/profile
router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    let user = await User.findById(userId).populate("favGames");
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

router.get("/profile-fav/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    let user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

router.delete("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  try {
    await User.findByIdAndRemove(userId);
    res.json({ message: `User with ${userId} is removed.` });
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
