const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const ticketRoutes = require("./routes/ticket");
const statisticRoutes = require("./routes/statistics");
const leaderboardRoutes = require("./routes/leaderboard");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Betting App API",
      version: "1.0.0",
      description: "API documentation for the betting app",
    },
    servers: [
      {
        url: "http://localhost:9000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use("/api/tickets", ticketRoutes);
app.use("/api/statistics", statisticRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const PORT = process.env.PORT || 3000;

connectDB(true);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
