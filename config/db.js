const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = () => {
  const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.${process.env.MONGODB_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority`;

  mongoose
    .connect(mongoURI)
    .then(function () {
      console.log("SuccessFully Connected to Database");
    })
    .catch(function (err) {
      console.log("Error:", err.message);
    });
};

module.exports = connectToMongo;
