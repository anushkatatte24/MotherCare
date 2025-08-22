const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    doctorName: { type: String, required: true },
    date: { type: Date, required: true },  // Ensure this is a Date type
    email: { type: String, required: true },
    reminderSent: { type: Boolean, default: false }
});


// Exporting the Model
module.exports = mongoose.model("Appointment", appointmentSchema);