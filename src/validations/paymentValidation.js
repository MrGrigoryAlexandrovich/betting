const yup = require("yup");
const { validate: validateUUID } = require("uuid");

const paymentSchema = yup.object().shape({
  ticketId: yup
    .string()
    .required("ticketId is required")
    .test("is-uuid", "ticketId - Invalid UUID format", (value) =>
      value ? validateUUID(value) : false
    ),
  playerUsername: yup
    .string()
    .required("playerUsername is required")
    .test("is-uuid", "playerUsername - Invalid UUID format", (value) =>
      value ? validateUUID(value) : false
    ),
  paymentAmount: yup
    .number()
    .typeError("paymentAmount must be a number")
    .test(
      "is-two-decimals",
      "Payment amount must have at most two decimal places",
      (value) => {
        if (!Number.isFinite(value)) return false;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }
    )
    .required("paymentAmount is required"),
});

module.exports = { paymentSchema };
