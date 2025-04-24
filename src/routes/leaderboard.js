const express = require("express");
const redis = require("../db/redisConnection");
const router = express.Router();

/**
 * @openapi
 * /api/leaderboard:
 *   get:
 *     tags:
 *       - Leaderboard
 *     summary: Get Leaderboard (TOP 100)
 *     description: Fetch top 100 Leaderboard
 *     responses:
 *       200:
 *         description: Leaderboard list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   playerUsername:
 *                     type: string
 *                   score:
 *                     type: number
 *                     format: float
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
