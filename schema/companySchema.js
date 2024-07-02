const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true
  },

  
  createdDate: {
    type: Date,
    default: Date.now,
  },

  isDeleated: {
    type: Boolean,
    default: false,
  },
  
  compainIds: [{ type: Schema.Types.ObjectId, ref: 'compaign' }],
  
});

module.exports = {
  CompanySchema,
};
