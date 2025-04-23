const mongoose = require("mongoose");
const { setupTicketChangeStream } = require("../utils/changeStreams");

const connectDB = async (isChangeStreamIncluded = true) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (isChangeStreamIncluded) {
      setupTicketChangeStream();
    }
    console.log("✅ Connected to MongoDB ReplicaSet");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
