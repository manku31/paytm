const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");

const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");

// constant
const router = express.Router();

const signupBody = zod.object({
  username: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

const updateBody = zod.object({
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

// routes

// Route to sign up the user
router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);

  // Validate the inputs
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs line 40",
    });
  }

  const existinguser = await User.findOne({
    username: req.body.username,
  });

  if (existinguser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs  line 50",
    });
  }

  // Create the new user
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;

  // Create the new account with some initialize balances
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign({ userId }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token,
  });
});

// Route to sign in the user
router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    return res.json({
      message: "User logged in successfully",
      token,
    });
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

// Route to update user information
router.put("/", async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully",
  });
});

// Route to get users, filterable via firstName/lastName
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const user = await User.find({
    $or: [
      {
        firstName: { $regex: filter },
      },
      {
        lastName: { $regex: filter },
      },
    ],
  });

  res.json({
    user: user.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
