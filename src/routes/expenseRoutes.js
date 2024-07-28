const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.post("/", expenseController.addExpense);
router.get("/user/:userId", expenseController.getIndividualExpenses);
router.get("/", expenseController.getAllExpenses);
router.get("/balance-sheet", expenseController.downloadBalanceSheet);
router.get(
  "/expenses/download-balance-sheet",
  expenseController.downloadBalanceSheet
);

module.exports = router;
