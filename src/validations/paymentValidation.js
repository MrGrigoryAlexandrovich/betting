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
      "is-exact-two-decimals",
      "Payment amount must have exactly two decimal places",
      (value) => {
        if (!Number.isFinite(value)) return false;
        const stringValue = value.toString();
        return /^\d+\.\d{2}$/.test(stringValue);
      }
    )
    .required("paymentAmount is required"),
});

module.exports = { paymentSchema };
