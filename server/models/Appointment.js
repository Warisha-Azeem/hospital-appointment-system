const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

  patientName: {
    type: String,
    required: true
  },

  patientEmail: {
    type: String,
    required: true
  },

  doctorName: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  },

  reviewed: {
    type: Boolean,
    default: false
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },

  review: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);