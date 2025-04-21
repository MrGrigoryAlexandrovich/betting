const yup = require("yup");
const { validate: validateUUID, version: uuidVersion } = require("uuid");

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
      "is-two-decimals",
      "Payout amount must have at most two decimal places",
      (value) => {
        if (!Number.isFinite(value)) return false;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }
    )
    .required("payoutAmount is required"),
});

module.exports = { payoutSchema };
