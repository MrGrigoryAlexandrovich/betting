const yup = require("yup");
const { validate: validateUUID } = require("uuid");

const payoutSchema = yup.object().shape({
  ticketId: yup
    .string()
    .required("ticketId is required")
    .test("is-uuid", "ticketId - Invalid UUID format", (value) =>
      value ? validateUUID(value) : false
    ),
  payoutAmount: yup
    .number()
    .typeError("payoutAmount must be a number")
    .test(
      "is-exact-two-decimals",
      "Payout amount must have exactly two decimal places",
      (value) => {
        if (!Number.isFinite(value)) {
          return false;
        }
        const stringValue = value.toString();
        return /^\d+(\.\d{1,2})?$/.test(stringValue);
      }
    )
    .required("payoutAmount is required"),
});

module.exports = { payoutSchema };
