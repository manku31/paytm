const express = require("express");

const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

// constant
const router = express.Router();

// routes

// An endpoint for user to get their balance
router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });

  res.json({
    balance: account.balance,
  });
});

// An endpoint for user to transfer money to another account
router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { amount, to } = req.body;

  // Fetch the accounts within the transaction
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();

    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  if (account.userId.toString() === to) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Cannot transfer to yourself",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();

    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // Perform the transfer in sender account
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);

  // Perform the transfer in receiver account
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  // commit the transaction
  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});

module.exports = router;
