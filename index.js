const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToMongoDB = require("./config/db");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const userRoutes = require("./src/routes/userRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");

//routers
app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
