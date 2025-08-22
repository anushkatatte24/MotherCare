const express = require("express");
const Post = require("../models/Post");
const HealthProfile = require("../models/healthProfile");
const authenticateToken = require("../middleware/authenticateToken"); // Make sure this path is correct

const router = express.Router();

// ✅ Get all posts (Now fetches user's name)
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("userId", "name") // Fetches the author's name
            .sort({ createdAt: -1 }); // Show newest posts first
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Create a new post (NOW SECURE)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from token
        const { content } = req.body;

        const healthProfile = await HealthProfile.findOne({ userId });
        if (!healthProfile) {
            return res.status(400).json({ message: "Please complete your health profile first." });
        }

        const post = new Post({ userId, trimester: healthProfile.trimester, content });
        await post.save();
        res.status(201).json({ message: "Post created successfully!", post });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Reply to a post (NOW SECURE)
router.post("/:postId/reply", authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId; // Get user ID from token
        const { content } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.replies.push({ userId, content });
        await post.save();
        res.status(201).json({ message: "Reply added!", post });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Delete my own post (NOW SECURE)
router.delete("/:postId", authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId; // Get user ID from token

        const post = await Post.findOne({ _id: postId, userId: userId });
        if (!post) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own posts." });
        }

        await Post.findByIdAndDelete(postId);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;