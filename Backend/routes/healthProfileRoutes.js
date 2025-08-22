const express = require("express");
const axios = require("axios");
const HealthProfile = require("../models/healthProfile"); // Ensure path is correct
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();



// Helper function to calculate health metrics
const calculateHealthMetrics = (data) => {
    const { weight, height, age, medicalConditions, trimester } = data;
    if (!weight || !height || !trimester) return {};
    const bmi = weight / ((height / 100) ** 2);
    const hydrationNeeds = weight * 0.033;
    const calorieIntake = { 1: 1800, 2: 2200, 3: 2400 };
    const recommendedCalories = calorieIntake[trimester];
    let pregnancyRiskLevel = "Low";
    if (age > 35 || medicalConditions?.includes("Diabetes") || medicalConditions?.includes("Hypertension")) {
        pregnancyRiskLevel = "High";
    } else if (age >= 30 || (medicalConditions && medicalConditions.length > 0)) {
        pregnancyRiskLevel = "Moderate";
    }
    return { bmi, hydrationNeeds, recommendedCalories, pregnancyRiskLevel };
};

// Load API keys from environment variables
const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;
const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const WORKOUT_API_KEY = process.env.WORKOUT_API_KEY;


// ✅ Save or Update User Health Profile (NOW SECURE)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const profileData = { userId, ...req.body };

        // Manually calculate and add the derived data
        const calculatedMetrics = calculateHealthMetrics(profileData);
        const finalProfileData = { ...profileData, ...calculatedMetrics };

        const profile = await HealthProfile.findOneAndUpdate(
            { userId: userId },
            { $set: finalProfileData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ message: "Health Profile Saved!", profile });
    } catch (error) {
        console.error("Error saving health profile:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


// ... (The helper functions to fetch from APIs are the same) ...
const fetchMealPlanFromEdamam = async (trimester, medicalConditions) => { /* ... your code ... */ };
const fetchMealPlanFromSpoonacular = async () => { /* ... your code ... */ };
const fetchExercisePlan = async () => { /* ... your code ... */ };


// ✅ Get AI-Based Meal & Exercise Plan (NOW SECURE)
router.get("/recommend", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID securely from the token
        const profile = await HealthProfile.findOne({ userId: userId });
        if (!profile) return res.status(404).json({ message: "Profile Not Found" });

        let mealPlan = await fetchMealPlanFromEdamam(profile.trimester, profile.medicalConditions);
        if (!mealPlan) {
            mealPlan = await fetchMealPlanFromSpoonacular();
        }
        const exercisePlan = await fetchExercisePlan();

        res.json({ mealPlan, exercisePlan });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Get User Info (NOW SECURE)
router.get("/userinfo", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID securely from the token
        const profile = await HealthProfile.findOne({ userId: userId });
        if (!profile) return res.status(404).json({ message: "Profile Not Found" });
        res.json(profile); // Send the whole profile, including calculated fields
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;