const TicketModel = require("../models/TicketModel");

exports.findTicket = async (ticketId) => {
  try {
    const ticket = await TicketModel.findOne({ ticketId });
    return ticket;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

exports.payment = async (data) => {
  try {
    const ticket = await TicketModel.create(data);
    return ticket;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

exports.payout = async (ticketId, updatedData) => {
  try {
    const ticket = await exports.findTicket(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (ticket.isClosed) {
      throw new Error("Ticket is already closed.");
    }

    await TicketModel.updateOne({ ticketId }, { $set: updatedData });
    return updatedData;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

exports.getTickets = async () => {
  try {
    const tickets = await TicketModel.find();
    return tickets;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};
