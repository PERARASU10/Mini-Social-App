import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    likes: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
