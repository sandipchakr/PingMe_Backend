import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }
}, { timestamps: true });

likeSchema.index({ postId: 1, userId: 1 }, { unique: true }); // 👈 prevent duplicate likes

const Like = mongoose.model("Like", likeSchema);
export default Like;
