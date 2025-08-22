const mongoose = require("mongoose");

const healthProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    trimester: { type: Number, required: true, enum: [1, 2, 3] }, // 1st, 2nd, or 3rd trimester
    weight: { type: Number, required: true }, // kg
    height: { type: Number, required: true }, // cm
    medicalConditions: [{ type: String }], // E.g., ["Anemia", "Diabetes"]

    // ✅ Auto-Calculated Fields (User doesn't enter these)
    bmi: { type: Number },  // BMI = weight / (height/100)^2
    recommendedCalories: { type: Number }, // Based on trimester
    hydrationNeeds: { type: Number }, // Liters per day (Weight * 0.033)
    pregnancyRiskLevel: { type: String, enum: ["Low", "Moderate", "High"] }, // Auto-calculated risk level

    createdAt: { type: Date, default: Date.now }
});

// ✅ Auto-calculate fields before saving
healthProfileSchema.pre("save", function (next) {
    this.bmi = this.weight / ((this.height / 100) ** 2);
    this.hydrationNeeds = this.weight * 0.033;

    // ✅ Auto-calculate recommended calories based on trimester
    const calorieIntake = { 1: 1800, 2: 2200, 3: 2400 };
    this.recommendedCalories = calorieIntake[this.trimester];

    // ✅ Auto-determine pregnancy risk based on age & medical conditions
    if (this.age > 35 || this.medicalConditions?.includes("Diabetes") || this.medicalConditions?.includes("Hypertension")) {
        this.pregnancyRiskLevel = "High";
    } else if (this.age >= 30 || this.medicalConditions?.length > 0) {
        this.pregnancyRiskLevel = "Moderate";
    } else {
        this.pregnancyRiskLevel = "Low";
    }

    next();
});

const HealthProfile = mongoose.model("HealthProfile", healthProfileSchema);
module.exports = HealthProfile;