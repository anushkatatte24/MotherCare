const express = require("express");
const router = express.Router();
const Appointment = require("../models/appoinments");
const moment = require("moment");
const mongoose = require("mongoose");

router.post("/schedule", async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { userId, doctorName, date, email } = req.body;

        if (!userId || !doctorName || !date || !email) {
            console.log("Missing required fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const newAppointment = new Appointment({
            userId,
            doctorName,
            date: new Date(date),  // Convert to Date object before saving
            email,
            reminderSent: false
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment scheduled successfully" });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.get("/appointments/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const objectIdUser = new mongoose.Types.ObjectId(userId); // ✅ Convert userId to ObjectId
        const appointments = await Appointment.find({ userId: objectIdUser });

        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found for this user" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;