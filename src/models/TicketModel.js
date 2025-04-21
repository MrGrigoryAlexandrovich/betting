const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: [true, "Please enter ticket id"],
  },
  playerUsername: {
    type: String,
    required: [true, "Please enter username"],
  },
  paymentAmount: {
    type: Number,
    required: [true, "Please enter amount"],
  },
  payoutAmount: {
    type: Number,
    default: 0,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
});

const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = Ticket;
