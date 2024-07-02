const url = require("url");
const mongoose = require("mongoose");
const path = require("path");

const connectDB = async () => {
  try {
    await mongoose.connect("");
    console.log("Database connected...");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  connectDB,
};
