const express = require("express");

const Appointment = require("../models/Appointment");

const router = express.Router();

router.post("/book", async (req, res) => {

  try {

    const appointment = new Appointment(req.body);

    await appointment.save();

    res.status(201).json({
      message: "Appointment Booked",
      appointment
    });

  } catch(error) {

    res.status(500).json({
      message: error.message
    });
  }

});

router.get("/", async (req, res) => {

  try {

    const appointments = await Appointment.find();

    res.status(200).json(appointments);

  } catch(error) {

    res.status(500).json({
      message: error.message
    });
  }

});

module.exports = router;