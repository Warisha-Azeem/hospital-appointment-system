const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  specialization: {
    type: String,
    required: true
  },

  experience: {
    type: Number,
    required: true
  },

  availableDays: {
    type: [String]
  },

  fees: {
    type: Number
  }

});

module.exports = mongoose.model("Doctor", doctorSchema);