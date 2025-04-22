const mongoose = require("mongoose");
const redis = require("../db/redisConfig");
const StatisticModel = require("../models/StatisticModel");

async function updateStatistics(ticket) {
  if (!ticket) return;

  const ticketDate = new Date(ticket.createdAt);
  const dateOnly = new Date(
    ticketDate.getFullYear(),
    ticketDate.getMonth(),
    ticketDate.getDate()
  );
  const hour = ticketDate.getHours();

  try {
    await StatisticModel.findOneAndUpdate(
      {
        date: dateOnly,
        hour: hour,
        playerUsername: ticket.playerUsername,
      },
      {
        $inc: {
          ticketCount: 1,
          totalPaymentAmount: ticket.paymentAmount || 0,
          totalPayoutAmount: ticket.payoutAmount || 0,
        },
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Error updating statistics:", error);
  }
}

const updateLeaderboard = (ticket) => {
  if (ticket && ticket.isClosed && ticket.paymentAmount > 0) {
    const score = ticket.payoutAmount / ticket.paymentAmount;
    redis.zadd("leaderboard", score, ticket.playerUsername);
    redis.zremrangebyrank("leaderboard", 100, -1);
  }
};

exports.setupTicketChangeStream = async () => {
  if (!mongoose.connection || !mongoose.connection.db) {
    console.error("MongoDB connection not ready");
    return;
  }

  const Ticket = mongoose.connection.db.collection("tickets");

  const changeStream = Ticket.watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", async (change) => {
    try {
      if (change.operationType === "insert") {
        const ticket = change.fullDocument;
        await updateStatistics(ticket);
        if (ticket.isClosed && ticket.paymentAmount > 0) {
          updateLeaderboard(ticket);
        }
      } else if (change.operationType === "update") {
        const ticket = change.fullDocument;
        if (ticket && ticket.isClosed && ticket.paymentAmount > 0) {
          updateLeaderboard(ticket);
        }
        await updateStatistics(ticket);
      }
    } catch (error) {
      console.error("Error processing change stream event:", error);
    }
  });

  changeStream.on("error", (error) => {
    console.error("Change stream error:", error);
    setTimeout(exports.setupTicketChangeStream, 5000);
  });

  console.log(
    "Ticket change stream established for statistics and leaderboard tracking"
  );
};
