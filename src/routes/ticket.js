const express = require("express");
const yup = require("yup");
const { v4: uuidv4 } = require("uuid");
const ticketController = require("../controllers/ticketController");
const { paymentSchema } = require("../validations/paymentValidation");
const { payoutSchema } = require("../validations/payoutValidation");

const router = express.Router();

router.post("/payment", async (req, res) => {
  const ticketId = uuidv4();

  const body = {
    paymentAmount: req.body.paymentAmount,
    ticketId,
    playerUsername: uuidv4(),
  };

  try {
    const ticketExist = await ticketController.findTicket(ticketId);
    if (ticketExist) {
      return res.status(200).json(ticketExist);
    }

    await paymentSchema.validate(body, {
      abortEarly: false,
    });

    const payment = await ticketController.payment(body);
    return res.status(201).json(payment);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
});

router.patch("/payout", async (req, res) => {
  const body = {
    payoutAmount: req.body.payoutAmount,
    ticketId: req.body.ticketId,
    isClosed: true,
  };

  try {
    await payoutSchema.validate(body, {
      abortEarly: false,
    });

    const payment = await ticketController.payout(body.ticketId, body);
    return res.status(200).json(payment);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
