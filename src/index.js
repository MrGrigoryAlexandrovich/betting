const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const ticketRoutes = require("./routes/ticket");

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/test", (_req, res) => {
  res.json({ message: "SUCCESS" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
