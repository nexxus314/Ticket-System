const express = require("express");
const Ticket = require("../models/TicketStore");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body || {};

    const ticket = new Ticket({
      title,
      description,
      status: "OPEN",
      userId: req.user.id,
    });

    await ticket.save();
    return res.json(ticket);
  } catch (error) {
    console.error("Create ticket error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const validUserTickets = await Ticket.find({ userId: req.user.id });
    return res.json(validUserTickets);
  } catch (error) {
    console.error("Get user tickets error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/total", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const allTickets = await Ticket.find();
    return res.json(allTickets);
  } catch (error) {
    console.error("Get total tickets error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (!req.body || typeof req.body.status === "undefined") {
      return res.status(400).json({ message: "Status is required" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.json(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
