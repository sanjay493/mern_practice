const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

let success = false;
const JWT_SECRET = "FreshVegetableFromFarmToYourDoor";
//Route 1: create a User using : POST "/api/auth/createuser" . Doesn't require Authentication
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name Min 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail().toLowerCase(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and errors
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // check whether the email exist
      //search email from existing database
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Sorry a user with this email already exists",
          });
      }
      //create a secure password with bcrypt which is async function
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

//Route 2: Login User using : POST "/api/auth/login" . Doesn't require Authentication
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail().toLowerCase(),
    body("password", "password can not be empty").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and errors
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //Destructure req.body data in email and password variables
    const { email, password } = req.body;
    try {
      // check whether the email exit
      //search email from exiting database
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Enter a valid Credentails" });
      }
      //create a secure password with bcrypt which is async function
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Enter a valid Credentails" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error occurred");
    }
  }
);
//Route 3: Get logging User Details using : POST "/api/auth/getuser" . require Authentication
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    //user's column data can be filter by any of these method. "-columnName" means exclusion and vice versa.
    //const user = await User.findById(userId).select("-password")
    const user = await User.findById(userId, "-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error occurred");
  }
});

module.exports = router;
