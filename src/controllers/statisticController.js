const StatisticModel = require("../models/StatisticModel");

exports.getStatistics = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;

    const playerUsername = req.query.playerUsername;
    const dateParam = req.query.date;
    const hour = req.query.hour !== undefined ? parseInt(req.query.hour) : null;
    const timezoneOffset = parseInt(req.query.timezoneOffset) || 0;

    // Build the query
    const query = {};

    // Add username filter if provided
    if (playerUsername) {
      query.playerUsername = playerUsername;
    }

    // Add hour filter if provided
    if (hour !== null && hour >= 0 && hour <= 23) {
      query.hour = hour;
    }

    // Process date with timezone if provided
    if (dateParam) {
      // Parse the DD-MM-YYYY format
      const [day, month, year] = dateParam.split("-").map(Number);

      // Create date object with timezone adjustment
      const startDate = new Date(
        Date.UTC(year, month - 1, day, -timezoneOffset, 0, 0)
      );
      const endDate = new Date(
        Date.UTC(year, month - 1, day, 24 - timezoneOffset, 0, 0)
      );

      query.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // Get total count for pagination
    const total = await StatisticModel.countDocuments(query);

    // Run the query with pagination
    const statistics = await StatisticModel.find(query)
      .sort({ date: -1, hour: -1 })
      .skip(skip)
      .limit(size);

    // Group data by hour for the response
    const groupedByHour = {};

    statistics.forEach((stat) => {
      // Create a unique key for date+hour combination
      const dateStr = stat.date.toISOString().split("T")[0];
      const hourKey = `${dateStr}-${stat.hour}`;

      if (!groupedByHour[hourKey]) {
        groupedByHour[hourKey] = {
          date: dateStr,
          hour: stat.hour,
          ticketCount: 0,
          totalPaymentAmount: 0,
          totalPayoutAmount: 0,
          players: [],
        };
      }

      groupedByHour[hourKey].ticketCount += stat.ticketCount;
      groupedByHour[hourKey].totalPaymentAmount += stat.totalPaymentAmount;
      groupedByHour[hourKey].totalPayoutAmount += stat.totalPayoutAmount;

      // Add player details if we're not filtering by a single player
      if (!playerUsername) {
        groupedByHour[hourKey].players.push({
          playerUsername: stat.playerUsername,
          ticketCount: stat.ticketCount,
          totalPaymentAmount: stat.totalPaymentAmount,
          totalPayoutAmount: stat.totalPayoutAmount,
        });
      }
    });

    // Convert to array for response
    const hourlyStats = Object.values(groupedByHour);

    // Prepare pagination metadata
    const totalPages = Math.ceil(total / size);

    return res.json({
      data: hourlyStats,
      pagination: {
        page,
        size,
        totalItems: total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error retrieving statistics:", error);
    return res.status(500).json({ error: "Failed to retrieve statistics" });
  }
};
