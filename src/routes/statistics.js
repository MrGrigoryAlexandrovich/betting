const express = require("express");
const { getStatistics } = require("../controllers/statisticController");

const router = express.Router();

router.get("/", getStatistics);

module.exports = router;
