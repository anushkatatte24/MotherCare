const express = require("express");
const router = express.Router();
const PregnancyRisk = require("../models/PregnancyRisk");

// POST Route
router.post("/predict", async (req, res) => {
  try {
    const newData = new PregnancyRisk(req.body);
    await newData.save();
    res.status(201).json({ message: "Data Saved ✅", data: newData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET Route
router.get("/get-all", async (req, res) => {
  try {
    const data = await PregnancyRisk.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;