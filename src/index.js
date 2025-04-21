import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/test", (_req, res) => {
  res.json({ message: "SUCCESS" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server run on http://localhost:${PORT}`);
});
