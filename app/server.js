const express = require("express");
const redis = require("redis");
const os = require("os");

const app = express();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || "redis"}:6379`,
});

async function start() {
  await redisClient.connect();

  app.get("/", async (req, res) => {
    let visits = await redisClient.get("visits");

    if (!visits) {
      visits = 0;
    }

    visits = parseInt(visits) + 1;

    await redisClient.set("visits", visits);

    res.send(`
      <h1>Docker Node Demo</h1>
      <p>Visits: ${visits}</p>
      <p>Container: ${os.hostname()}</p>
    `);
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

start().catch(console.error);
