const { Queue } = require("bullmq");
const connection = require("../db/redisConfig");

const statisticsQueue = new Queue("statisticsQueue", { connection });

module.exports = statisticsQueue;
