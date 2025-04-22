const redis = require("./redisConfig");

redis.on("connect", () => {
  console.log("Redis connected!");
});

redis.on("error", (err) => {
  console.error("Greška pri povezivanju na Redis:", err);
});
