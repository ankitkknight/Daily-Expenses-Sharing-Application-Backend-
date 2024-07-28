const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToMongoDB = require("./config/db");
const userRoutes = require("./src/routes/userRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//routers
app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);

//connect to mongodb
connectToMongoDB();

//start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
