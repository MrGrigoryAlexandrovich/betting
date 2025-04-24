const express = require("express");
const yup = require("yup");
const ticketController = require("../controllers/ticketController");
const { paymentSchema } = require("../validations/paymentValidation");
const { payoutSchema } = require("../validations/payoutValidation");

const router = express.Router();

/**
 * @openapi
 * /api/tickets/list:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Get all tickets
 *     description: Fetch all tickets from the database.
 *     responses:
 *       200:
 *         description: A list of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   ticketId:
 *                     type: string
 *                   playerUsername:
 *                     type: string
 *                   paymentAmount:
 *                     type: number
 *                     format: float
 *                   payoutAmount:
 *                     type: number
 *                     format: float
 *                     description: The amount of money paid out
 *                   isClosed:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the ticket was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the ticket was last updated
 *                   __v:
 *                     type: integer
 *                     description: Version key for internal tracking
 *       500:
 *         description: Internal server error, unable to retrieve tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching the tickets."
 */

router.get("/list", async (req, res) => {
  try {
    const tickets = await ticketController.getTickets();
    return res.status(200).json(tickets);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
});

/**
 * @openapi
 * /api/tickets/payment:
 *   post:
 *     tags:
 *       - Tickets
 *     summary: Process ticket payment
 *     description: Processes the payment amount for a ticket.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier of the ticket
 *                 example: 7b862353-f1c5-4167-b24a-e23a041e3ea4
 *               playerUsername:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier of the player (username or ID)
 *                 example: 7b862353-f1c5-4167-b24a-e23a041e3ea2
 *               paymentAmount:
 *                 type: number
 *                 format: float
 *                 description: The amount to be paid for the ticket
 *                 example: 900.13
 *             required:
 *               - ticketId
 *               - playerUsername
 *               - paymentAmount
 *     responses:
 *       200:
 *         description: Payment successfully processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the payment was processed successfully
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: A message describing the outcome of the payment process
 *                   example: "Payment of 900.13 processed successfully for ticket 7b862353-f1c5-4167-b24a-e23a041e3ea4."
 *       400:
 *         description: Bad request, one or more fields are missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid ticketId, playerUsername, or paymentAmount."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing the payment."
 */

router.post("/payment", async (req, res) => {
  const ticketId = req.body.ticketId;

  const body = {
    paymentAmount: req.body.paymentAmount,
    ticketId,
    playerUsername: req.body.playerUsername,
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

/**
 * @openapi
 * /api/tickets/payout:
 *   patch:
 *     tags:
 *       - Tickets
 *     summary: Process ticket payout
 *     description: Processes the payout amount for a specific ticket.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payoutAmount:
 *                 type: number
 *                 format: float
 *                 description: The amount to be paid out for the ticket
 *                 example: 125.25
 *               ticketId:
 *                 type: string
 *                 description: The ID of the ticket for which the payout is being processed
 *                 example: "71726f26-1303-4d83-8d76-af23bc4bfb55"
 *               isClosed:
 *                 type: boolean
 *                 description: Indicates whether the ticket is now closed
 *                 example: true
 *             required:
 *               - payoutAmount
 *               - ticketId
 *               - isClosed
 *     responses:
 *       200:
 *         description: Payout successfully processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the payout was processed successfully
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: A message describing the outcome of the payout process
 *                   example: "Payout of 125.25 for ticket 71726f26-1303-4d83-8d76-af23bc4bfb55 processed successfully."
 *       400:
 *         description: Bad request, missing or invalid payoutAmount, ticketId or isClosed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid payout amount, ticket ID or isClosed flag."
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Ticket not found."
 *       500:
 *         description: Internal server error, unable to process payout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing the payout."
 */

router.patch("/payout", async (req, res) => {
  const body = {
    payoutAmount: req.body.payoutAmount,
    ticketId: req.body.ticketId,
    isClosed: req.body.isClosed,
  };

  try {
    await payoutSchema.validate(body, {
      abortEarly: false,
    });

    const payout = await ticketController.payout(body.ticketId, body);
    return res.status(200).json(payout);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
