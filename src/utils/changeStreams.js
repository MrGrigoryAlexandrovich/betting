const mongoose = require("mongoose");
const statisticsQueue = require("../queues/statisticsQueue");
const leaderboardQueue = require("../queues/leaderboardQueue");

exports.setupTicketChangeStream = async () => {
  if (!mongoose.connection || !mongoose.connection.db) {
    console.error("MongoDB connection not ready");
    return;
  }

  const Ticket = mongoose.connection.db.collection("tickets");
  const changeStream = Ticket.watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", async (change) => {
    try {
      const ticket = change.fullDocument;
      if (!ticket) {
        return;
      }
      await statisticsQueue.add("updateTicketStatistics", ticket);

      if (ticket.isClosed && ticket.paymentAmount > 0) {
        await leaderboardQueue.add("updateLeaderboard", ticket);
      }
    } catch (error) {
      console.error("Error processing change stream event:", error);
    }
  });

  changeStream.on("error", (error) => {
    console.error("Change stream error:", error);
    setTimeout(exports.setupTicketChangeStream, 5000);
  });

  console.log("Ticket change stream established with BullMQ");
};
