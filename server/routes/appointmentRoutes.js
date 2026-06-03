const express = require("express");

const Appointment = require("../models/Appointment");
const { sendConfirmationEmail, sendStatusUpdateEmail } = require("../services/emailService");

const router = express.Router();

router.post("/book", async (req, res) => {

  try {

    const appointment = new Appointment(req.body);

    await appointment.save();

    // Send confirmation email asynchronously (don't wait for it)
    sendConfirmationEmail(appointment).catch(err => 
      console.error("Failed to send email:", err)
    );

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

router.get("/doctor/:name", async (req, res) => {
  try {
    const doctorName = req.params.name;
    const regex = new RegExp(doctorName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const appointments = await Appointment.find({ doctorName: { $regex: regex } });
    res.status(200).json(appointments);
  } catch(error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const appointments = await Appointment.find();

    const dailyCounts = {};
    const weeklyCounts = {};
    const doctorCounts = {};
    const hourCounts = {};

    const getWeekLabel = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return `${d.getUTCFullYear()}-W${weekNo}`;
    };

    appointments.forEach((appointment) => {
      const dateString = appointment.date || (appointment.createdAt ? appointment.createdAt.toISOString().slice(0, 10) : null);
      dailyCounts[dateString || "Unknown"] = (dailyCounts[dateString || "Unknown"] || 0) + 1;

      if (dateString) {
        const dateValue = new Date(dateString);
        if (!Number.isNaN(dateValue.getTime())) {
          const weekKey = getWeekLabel(dateValue);
          weeklyCounts[weekKey] = (weeklyCounts[weekKey] || 0) + 1;
        }
      }

      const doctorKey = appointment.doctorName || "Unknown";
      doctorCounts[doctorKey] = (doctorCounts[doctorKey] || 0) + 1;

      let hourKey = "Unknown";
      if (appointment.time) {
        const timeMatch = appointment.time.match(/^(\d{1,2}):?(\d{2})?/);
        if (timeMatch) {
          const hour = String(timeMatch[1]).padStart(2, "0");
          hourKey = `${hour}:00`;
        }
      }
      hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
    });

    const dailyStats = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const weeklyStats = Object.entries(weeklyCounts)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => a.week.localeCompare(b.week));

    const doctorStats = Object.entries(doctorCounts)
      .map(([doctor, count]) => ({ doctor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    res.status(200).json({
      dailyStats,
      weeklyStats,
      doctorStats,
      peakHours
    });
  } catch(error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Update appointment status and send email
router.put("/:id", async (req, res) => {

  try {

    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Send status update email asynchronously
    if (status) {
      sendStatusUpdateEmail(appointment, status).catch(err =>
        console.error("Failed to send status email:", err)
      );
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("appointmentStatusUpdated", {
        appointmentId: appointment._id,
        status: appointment.status,
        appointment
      });
    }

    res.status(200).json({
      message: "Appointment updated",
      appointment
    });

  } catch(error) {

    res.status(500).json({
      message: error.message
    });
  }

});

router.put("/:id/review", async (req, res) => {
  try {
    const { rating, review } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.rating = rating;
    appointment.review = review;
    appointment.reviewed = true;
    await appointment.save();

    res.status(200).json({
      message: "Review submitted",
      appointment
    });
  } catch(error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;