const express = require("express");
const redis = require("../db/redisConnection");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const leaderboardData = await redis.zrevrange(
      "leaderboard",
      0,
      99,
      "WITHSCORES"
    );
    const formattedLeaderboard = [];
    for (let i = 0; i < leaderboardData.length; i += 2) {
      formattedLeaderboard.push({
        playerUsername: leaderboardData[i],
        score: parseFloat(leaderboardData[i + 1]),
      });
    }
    return res.status(200).json(formattedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
