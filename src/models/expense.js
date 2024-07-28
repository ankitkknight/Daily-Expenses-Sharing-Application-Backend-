const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  splitMethod: {
    type: String,
    required: true,
    enum: ["EQUAL", "PERCENTAGE", "EXACT"],
  },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amount: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now() },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
