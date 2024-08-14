const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const companySchema = new mongoose.Schema({
  
  companyName: {
    type: String,
    required: true,
    maxlength: 100,
    unique: true
}, 
email: {
  type: String,
  
},

  createdDate: {
    type: Date,
    default: Date.now,
  },
  website: {
    type: String,
    maxlength: 100,
  },
  title: {
    type: String,
    maxlength: 50
  },
  businessName: {
    type: String,
    maxlength: 100
  },
  contact: {
    type: String,
    maxlength: 50
  },
  phone: {
    type: String,
  },
  city: {
    type: String,
    maxlength: 50
  },
  stateFormation: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  entityType: {
    type: String,
    maxlength: 50
  },
  accountExecutive: {
    type: String,
    maxlength: 50
  },
  accountManager: {
    type: String,
    maxlength: 50
  },
  customerNumber: {
    type: String,
    maxlength: 50
  }

  
});

module.exports = { companySchema }


