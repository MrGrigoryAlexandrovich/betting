const Redis = require("ioredis");
const redisConfig = require("./redisConfig");

const redis = new Redis(redisConfig);

redis.on("connect", () => {
  console.log("Redis connected!");
});

redis.on("error", (err) => {
  console.error("Redis - Connection error", err);
});

module.exports = redis;
