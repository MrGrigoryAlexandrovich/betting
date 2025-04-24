const express = require("express");
const { getStatistics } = require("../controllers/statisticController");

const router = express.Router();

/**
 * @openapi
 * /api/statistics:
 *   get:
 *     tags:
 *       - Statistics
 *     summary: Get ticket statistics
 *     description: Retrieve ticket statistics based on filters such as pagination, player username, date, hour, and timezone offset.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of results per page
 *         example: 10
 *       - in: query
 *         name: playerUsername
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of player's username to filter results
 *         example: 81d0f3e7-81dd-4c96-be73-d4d7015e17c7
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Date to filter results in DD-MM-YYYY format
 *         example: 23-04-2025
 *       - in: query
 *         name: hour
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 23
 *         description: Hour to filter results (0-23)
 *         example: 10
 *       - in: query
 *         name: timezoneOffset
 *         schema:
 *           type: integer
 *         description: Timezone offset value
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved statistics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: Statistics date (YYYY-MM-DD)
 *                         example: 2025-04-24
 *                       hour:
 *                         type: integer
 *                         description: Hour of the day (0-23)
 *                         example: 8
 *                       ticketCount:
 *                         type: integer
 *                         description: Total number of tickets in the period
 *                         example: 3
 *                       totalPaymentAmount:
 *                         type: number
 *                         format: float
 *                         description: Total payment amount in the period
 *                         example: 426.15
 *                       totalPayoutAmount:
 *                         type: number
 *                         format: float
 *                         description: Total payout amount in the period
 *                         example: 744.82
 *                       players:
 *                         type: array
 *                         description: Individual player statistics
 *                         items:
 *                           type: object
 *                           properties:
 *                             playerUsername:
 *                               type: string
 *                               format: uuid
 *                               description: Player's username UUID
 *                               example: 93c35707-446c-4099-b4b6-23291765043f
 *                             ticketCount:
 *                               type: integer
 *                               description: Number of player's tickets
 *                               example: 1
 *                             totalPaymentAmount:
 *                               type: number
 *                               format: float
 *                               description: Total player's payment amount
 *                               example: 150.45
 *                             totalPayoutAmount:
 *                               type: number
 *                               format: float
 *                               description: Total player's payout amount
 *                               example: 0
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                       example: 1
 *                     size:
 *                       type: integer
 *                       description: Number of results per page
 *                       example: 10
 *                     totalItems:
 *                       type: integer
 *                       description: Total number of items
 *                       example: 7
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                       example: 1
 *             example:
 *               data:
 *                 - date: "2025-04-24"
 *                   hour: 8
 *                   ticketCount: 3
 *                   totalPaymentAmount: 426.15
 *                   totalPayoutAmount: 744.82
 *                   players:
 *                     - playerUsername: "93c35707-446c-4099-b4b6-23291765043f"
 *                       ticketCount: 1
 *                       totalPaymentAmount: 150.45
 *                       totalPayoutAmount: 0
 *                     - playerUsername: "198e85ad-998e-4074-b820-5e73b1c02a3d"
 *                       ticketCount: 1
 *                       totalPaymentAmount: 150.45
 *                       totalPayoutAmount: 300.46
 *                     - playerUsername: "eb4ede48-dd43-4188-9c1f-d2e4d6ffb779"
 *                       ticketCount: 1
 *                       totalPaymentAmount: 125.25
 *                       totalPayoutAmount: 444.36
 *                 - date: "2025-04-23"
 *                   hour: 10
 *                   ticketCount: 1
 *                   totalPaymentAmount: 10.45
 *                   totalPayoutAmount: 0
 *                   players:
 *                     - playerUsername: "81d0f3e7-81dd-4c96-be73-d4d7015e17c7"
 *                       ticketCount: 1
 *                       totalPaymentAmount: 10.45
 *                       totalPayoutAmount: 0
 *               pagination:
 *                 page: 1
 *                 size: 10
 *                 totalItems: 7
 *                 totalPages: 1
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid request"
 *                 message:
 *                   type: string
 *                   example: "Invalid date format, use DD-MM-YYYY"
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving statistics data"
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 */

router.get("/", getStatistics);

module.exports = router;
