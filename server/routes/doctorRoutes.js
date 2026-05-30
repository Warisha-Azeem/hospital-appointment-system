const express = require("express");

const Doctor = require("../models/Doctor");

const router = express.Router();

router.post("/add", async (req, res) => {

  try {

    const doctor = new Doctor(req.body);

    await doctor.save();

    res.status(201).json({
      message: "Doctor Added",
      doctor
    });

  } catch(error) {

    res.status(500).json({
      message: error.message
    });
  }

});

router.get("/", async (req, res) => {

  try {

    const doctors = await Doctor.find();

    res.status(200).json(doctors);

  } catch(error) {

    res.status(500).json({
      message: error.message
    });
  }

});

module.exports = router;