const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const companySchema = new mongoose.Schema({
  
  companyName: {
    type: String,
    required: true,
    maxlength: 100
  },
  createdDate: {
    type: Date,
    default: Date.now,
  }
  
});

module.exports = { companySchema }


