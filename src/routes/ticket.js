const express = require("express");
const { v4: uuidv4 } = require("uuid");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.post("/payment", async (req, res) => {
  try {
    const formattedBody = {
      ...req.body,
      ticketId: uuidv4(),
      playerUsername: uuidv4(),
      paymentAmount: parseFloat(req.body.paymentAmount.toFixed(2)),
    };
    const accaount = await ticketController.payment(formattedBody);
    return res.status(201).json(accaount);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
