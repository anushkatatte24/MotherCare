const mongoose = require("mongoose");

const PregnancyRiskSchema = new mongoose.Schema({
  age: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
  },
  blood_pressure: {
    type: Number,
    required: true,
  },
  heart_rate: {
    type: Number,
    required: true,
  },
  glucose_level: {
    type: Number,
    required: true,
  },
  previous_pregnancy: {
    type: Number,
    required: true,
  },
  risk_level: {
    type: String,
    enum: ["Low Risk", "Medium Risk", "High Risk"],
    default: "Low Risk",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PregnancyRisk", PregnancyRiskSchema);