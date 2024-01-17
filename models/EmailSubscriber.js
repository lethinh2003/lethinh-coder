import mongoose from "mongoose";
import validator from "validator";

const EmailSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      tirm: true,
      required: [true, "Missing email"],
      validate: [validator.isEmail, "Email is not valid"],
    },
    token: {
      type: String,
    },
  },
  {
    collection: "EmailSubscribers",
    timestamps: true,
  }
);

const EmailSubscriber = mongoose.models.EmailSubscriber || mongoose.model("EmailSubscriber", EmailSubscriberSchema);
export default EmailSubscriber;
