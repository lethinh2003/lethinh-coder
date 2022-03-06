import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import uniqid from "uniqid";
const commentSchema = new mongoose.Schema({
  account: {
    type: String,
    trim: true,
    minlength: [6, "Account must lengths greater or equal 6"],
    required: [true, "Missing account"],
  },
  role: {
    type: String,
    trim: true,
    minlength: [2, "Role must lengths greater or equal 2"],
    enum: ["user", "admin"],
    default: "user",
  },
  reply: [
    {
      _id: {
        type: String,
        default: function () {
          return uniqid();
        },
      },
      account: {
        type: String,
        trim: true,
        minlength: [6, "Account must lengths greater or equal 6"],
        required: [true, "Missing account"],
      },
      content: {
        type: String,
        trim: true,
        minlength: [5, "content must lengths greater or equal 5"],
        required: [true, "Missing content"],
      },
      createdAt: {
        type: String,
        default: () => new Date().toISOString(),
      },
      role: {
        type: String,
        trim: true,
        minlength: [2, "Role must lengths greater or equal 2"],
        enum: ["user", "admin"],
        default: "user",
      },
    },
  ],

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
