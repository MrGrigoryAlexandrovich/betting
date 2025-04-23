const { Queue } = require("bullmq");
const connection = require("../db/redisConfig");

const leaderboardQueue = new Queue("leaderboardQueue", { connection });

module.exports = leaderboardQueue;
