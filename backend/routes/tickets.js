
const express = require("express");
const ticketStore = require("../models/TicketStore");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, (req, res) => {
  const { title, description } = req.body || {};

  const ticket = {
    id: ticketStore.length + 1,
    title,
    description,
    status: "OPEN",
    userId: req.user.id,
    createdAt: new Date(),
  };

  ticketStore.push(ticket);
  return res.json(ticket);
});

router.get("/", authMiddleware, (req, res) => {
  const validUserTickets = ticketStore.filter((t) => t.userId === req.user.id);
  return res.json(validUserTickets);
});

router.get("/total", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  return res.json(ticketStore);
});

router.patch("/:id", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }

  const ticket = ticketStore.find((t) => t.id === parseInt(req.params.id, 10));
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (!req.body || typeof req.body.status === "undefined") {
    return res.status(400).json({ message: "Status is required" });
  }

  ticket.status = req.body.status;

  return res.json(ticket);
});

module.exports = router;
