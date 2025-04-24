const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const redis = require("../db/redisConfig");
const redisClient = require("../db/redisConnection");
const StatisticModel = require("../models/StatisticModel");

async function waitForAppReady(retries = 10, delay = 3000) {
  console.log("Checking if main app is ready...");

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
        });
      }

      if (mongoose.connection.readyState === 1) {
        console.log("✅ MongoDB connection is ready");
        return true;
      }
    } catch (err) {
      console.log(
        `MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`
      );
    }

    console.log(`Waiting ${delay}ms before next attempt...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.error("❌ Failed to connect to MongoDB after multiple attempts");
  return false;
}

async function initializeStatisticsWorker() {
  new Worker(
    "statisticsQueue",
    async (job) => {
      try {
        console.log("Processing statistics job");
        const ticket = job.data;
        if (!ticket) {
          return;
        }

        const ticketDate = new Date(ticket.createdAt);

        const dateOnly = new Date(
          ticketDate.getFullYear(),
          ticketDate.getMonth(),
          ticketDate.getDate()
        );

        const hour = ticketDate.getHours();

        await StatisticModel.findOneAndUpdate(
          { date: dateOnly, hour, playerUsername: ticket.playerUsername },
          {
            $inc: {
              ticketCount: ticket.isClosed ? 0 : 1,
              totalPaymentAmount: 0,
              totalPayoutAmount: ticket.payoutAmount || 0,
            },
          },
          { upsert: true, new: true }
        );

        console.log("Statistics Job - Done");
      } catch (error) {
        console.error("Error processing statistics job:", error);
      }
    },
    {
      connection: redis,
      lockDuration: 1000 * 30,
      timeout: 1000 * 60,
    }
  );

  console.log("✅ Statistics worker initialized");
}

async function initializeLeaderboardWorker() {
  new Worker(
    "leaderboardQueue",
    async (job) => {
      try {
        console.log("Processing leaderboard job");
        const ticket = job.data;
        if (ticket && ticket.isClosed && ticket.paymentAmount > 0) {
          const score = ticket.payoutAmount / ticket.paymentAmount;
          await redisClient.zadd("leaderboard", score, ticket.playerUsername);
          await redisClient.zremrangebyrank("leaderboard", 100, -1);
          console.log("Leaderboard Job - Done");
        }
      } catch (error) {
        console.error("Error processing leaderboard job:", error);
      }
    },
    {
      connection: redis,
      lockDuration: 1000 * 30,
      timeout: 1000 * 60,
    }
  );

  console.log("✅ Leaderboard worker initialized");
}

async function bootstrapWorkers() {
  console.log("Starting workers...");
  const isReady = await waitForAppReady();

  if (!isReady) {
    console.log("Could not connect to MongoDB, retrying in 10 seconds...");
    setTimeout(bootstrapWorkers, 10000);
    return;
  }

  initializeStatisticsWorker();
  initializeLeaderboardWorker();
}

setTimeout(() => {
  console.log("Waiting for main app to initialize...");
  bootstrapWorkers();
}, 5000);
