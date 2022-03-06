import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import ip from "ip";
const HistoryLikeSchema = new mongoose.Schema({
  account: {
    type: String,
    trim: true,
    minlength: [6, "Account must lengths greater or equal 6"],
    required: [true, "Missing account"],
  },
  comment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],
  ipAddress: {
    type: String,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});
HistoryLikeSchema.pre("save", async function (next) {
  this.ipAddress = ip.address();
  next();
});
const HistoryLike = mongoose.models.HistoryLike || mongoose.model("HistoryLike", HistoryLikeSchema);
export default HistoryLike;
