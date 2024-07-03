const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 const compaignSchema = new mongoose.Schema({
    compaignName: {
    type: String,
    required: true
  },

  orderId: {
    type: String,
    required: true,
    maxlength: 50
  },
  website: {
    type: String,
    maxlength: 100,
    match: /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\.-]*)*\/?$/
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/
  },
  title: {
    type: String,
    maxlength: 50
  },
  legalBusinessName: {
    type: String,
    maxlength: 100
  },
  contact: {
    type: String,
    maxlength: 50
  },
  phone: {
    type: String,
    match: /^[2-9]\d{2}-\d{3}-\d{4}$/
  },
  city: {
    type: String,
    maxlength: 50
  },
  stateOfFormation: {
    type: String,
    maxlength: 2,
    match: /^[A-Z]{2}$/
  },
  zipCode: {
    type: String,
    match: /^\d{5}(?:[-\s]\d{4})?$/
  },
  typeOfEntity: {
    type: String,
    maxlength: 50
  },
  acctExec: {
    type: String,
    maxlength: 50
  },
  acctMngr: {
    type: String,
    maxlength: 50
  },
  cNumber: {
    type: String,
    maxlength: 50
  },
  mailDropQuantity: {
    type: Number,
    min: 0
  },
  mailDropDate: {
    type: Date
  },
  estimatedMailDropDate: {
    type: Date
  },
  estimatedMailSortDate: {
    type: Date
  },
  estimatedMailEntry: {
    type: String,
    maxlength: 50
  },
  estimatedInHomeDelivery: {
    type: String,
    maxlength: 50
  },
  eventDate: {
    type: Date
  },
  emailedProofTo: {
    type: String,
    match: /^\S+@\S+\.\S+$/
  },
  seedMailer: {
    type: String,
    maxlength: 100
  },

  
  createdDate: {
    type: Date,
    default: Date.now,
  },

  isDeleated: {
    type: Boolean,
    default: false,
  },

  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'company',
    required: true
  },
  data: [],
    
  
});
module.exports = { compaignSchema }

