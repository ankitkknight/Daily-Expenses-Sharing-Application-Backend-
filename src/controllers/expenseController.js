const Expense = require("../models/expense");
const { validatePercentageSplit } = require("../utils/validation");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

// Custom validation functions
const validateDescription = (description) => {
  return description && description.length >= 3;
};

const validateAmount = (amount) => {
  return amount && amount > 0;
};

const validateSplitMethod = (method) => {
  const validMethods = ["EQUAL", "EXACT", "PERCENTAGE"];
  return validMethods.includes(method);
};

exports.addExpense = async (req, res) => {
  const { description, amount, splitMethod, participants } = req.body;

  // Validate expense input
  if (!validateDescription(description)) {
    return res
      .status(400)
      .send({ error: "Description must be at least 3 characters long" });
  }

  if (!validateAmount(amount)) {
    return res.status(400).send({ error: "Amount must be a positive number" });
  }

  if (!validateSplitMethod(splitMethod)) {
    return res.status(400).send({ error: "Invalid split method" });
  }

  if (splitMethod === "percentage" && !validatePercentageSplit(participants)) {
    return res.status(400).send({ error: "Percentages must add up to 100%" });
  }

  let participantData = [];
  try {
    // Calculate the amount each participant owes
    switch (splitMethod) {
      case "EQUAL":
        if (participants.length < 2) {
          return res
            .status(400)
            .send("At least two participants are required.");
        }
        // Divide the amount equally among all participants
        const amountPerParticipant = Math.floor(amount / participants.length);
        const remainder = amount % participants.length;
        participantData = participants.map((userId, index) => ({
          userId,
          amount: amountPerParticipant + (index < remainder ? 1 : 0),
        }));
        break;

      case "EXACT":
        const totalAmount = participants.reduce(
          (sum, participant) => sum + participant.amount,
          0
        );
        if (totalAmount !== amount) {
          return res
            .status(400)
            .send("Total amount does not match the sum of individual amounts.");
        }
        participantData = participants;
        break;

      case "PERCENTAGE":
        participantData = participants.map((participant) => ({
          userId: participant.userId,
          amount: (amount * participant.percentage) / 100,
        }));
        break;

      default:
        return res.status(400).send("Invalid split method.");
    }

    const expense = new Expense({
      description,
      amount,
      participants: participantData,
    });

    await expense.save();
    res.status(201).send(expense);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getIndividualExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      "participants.userId": req.params.userId,
    });
    const userExpenses = expenses.map((expense) => {
      const userShare = expense.participants.find(
        (participant) => participant.userId.toString() === req.params.userId
      );
      return {
        expenseId: expense._id,
        description: expense.description,
        amount: expense.amount,
        userShare: userShare ? userShare.amount : 0,
        date: expense.date,
      };
    });

    res.send(userExpenses);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balanceSheet = {};

    expenses.forEach((expense) => {
      expense.participants.forEach((participant) => {
        if (!balanceSheet[participant.userId]) {
          balanceSheet[participant.userId] = 0;
        }
        balanceSheet[participant.userId] += participant.amount;
      });
    });

    res.send(balanceSheet);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find();

    // Convert expenses to a format suitable for CSV
    const fields = ["description", "amount", "splitMethod", "participants"];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(expenses);

    // Save the CSV file
    const filePath = path.join(__dirname, "../balancesheet.csv");
    fs.writeFileSync(filePath, csv);

    // Send the CSV file as a response
    res.download(filePath, "balancesheet.csv", (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the balance sheet.",
          error: err.message,
        });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
