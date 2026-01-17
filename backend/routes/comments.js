const express = require("express");
const Comment = require("../models/Comment");
const Ticket = require("../models/TicketStore");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    console.log("Creating comment with user:", req.user);
    const userEmail = req.user.email || "Admin";
    const userId = req.user.id;
    const ticketId = req.params.ticketId;
    const commentText = text.trim();

    const comment = new Comment({
      text: commentText,
      userId: userId,
      userEmail: userEmail,
      ticketId: ticketId,
    });

    const savedComment = await comment.save();
    console.log("Comment saved:", savedComment);
    return res.json(savedComment);
  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({ 
      message: error.message || "Internal server error",
      details: error.errors ? Object.keys(error.errors).map(k => error.errors[k].message) : []
    });
  }
});

router.get("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.ticketId })
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    return res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
