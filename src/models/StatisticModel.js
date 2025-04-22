const mongoose = require("mongoose");

const StatisticSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  hour: {
    type: Number,
    required: true,
  },
  playerUsername: {
    type: String,
    required: true,
  },
  ticketCount: {
    type: Number,
    default: 0,
  },
  totalPaymentAmount: {
    type: Number,
    default: 0,
  },
  totalPayoutAmount: {
    type: Number,
    default: 0,
  },
});

const Statistic = mongoose.model("Statistic", StatisticSchema);

module.exports = Statistic;
