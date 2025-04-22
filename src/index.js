const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
require("./db/redisClient");
const ticketRoutes = require("./routes/ticket");
const statisticRoutes = require("./routes/statistics");
const leaderboardRoutes = require("./routes/leaderboard");

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/tickets", ticketRoutes);
app.use("/api/statistics", statisticRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
