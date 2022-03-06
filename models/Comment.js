import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";

const commentSchema = new mongoose.Schema({
  account: {
    type: String,
    trim: true,
    minlength: [6, "Account must lengths greater or equal 6"],
    required: [true, "Missing account"],
  },

  code: {
    type: String,
    trim: true,
    minlength: [6, "Code must lengths greater or equal 6"],
    required: [true, "Missing code"],
  },
  content: {
    type: String,
    trim: true,
    minlength: [5, "Content must lengths greater or equal 5"],
    required: [true, "Missing content"],
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
