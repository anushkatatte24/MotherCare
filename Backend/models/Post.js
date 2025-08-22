const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Link to User.js
    trimester: { type: Number, required: true, enum: [1, 2, 3] }, // Auto-fetched from HealthProfile
    content: { type: String, required: true },
    replies: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);