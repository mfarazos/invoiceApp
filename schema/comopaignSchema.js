const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campaignSchema = new mongoose.Schema({
  campaignName: {
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
  },
  email: {
    type: String,
    
  },
  companyName: {
    type: String,
    maxlength: 50
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
  estimatedHomeDelivery: {
    type: String,
    maxlength: 50
  },
  eventDate: {
    type: Date
  },
  emailedProofTo: {
    type: String,
  },
  seedMailer: {
    type: String,
    maxlength: 100
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'company',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  data: []
});

module.exports = { campaignSchema };
