import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import ip from "ip";
const NotifySchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    minlength: [6, "Content must lengths greater or equal 6"],
    required: [true, "Missing content"],
  },
  link: {
    type: String,
    trim: true,
  },
  account_send: {
    type: String,
    trim: true,
    minlength: [6, "Account send must lengths greater or equal 6"],
    required: [true, "Missing account"],
  },
  account_receive: {
    type: String,
    trim: true,
    minlength: [6, "Account receive must lengths greater or equal 6"],
    required: [true, "Missing account"],
  },
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

const Notify = mongoose.models.Notify || mongoose.model("Notify", NotifySchema);
export default Notify;
