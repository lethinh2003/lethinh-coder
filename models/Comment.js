import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    parentComment: {
      type: String,
      default: "",
      trim: true,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Missing user"],
      },
    ],
    reply: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "RepComment",
      },
    ],
    childrenComment: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],

    code: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Code",
      },
    ],
    blog: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Blog",
      },
    ],
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
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
