const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ComopaignSchema = new mongoose.Schema({
    compaignName: {
    type: String,
    required: true
  },

  
  createdDate: {
    type: Date,
    default: Date.now,
  },

  isDeleated: {
    type: Boolean,
    default: false,
  },
  
  data: [],
    
  
});

module.exports = {
  ComopaignSchema
};
