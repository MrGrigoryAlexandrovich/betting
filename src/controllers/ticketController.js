const TicketModel = require("../models/TicketModel");

exports.payment = async (data) => {
  try {
    const ticket = await TicketModel.create(data);
    return ticket;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};
