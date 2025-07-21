import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required: true,
    },

    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"posts",
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
}, {timestamps:true}
);

const Comment = mongoose.model("comment",commentSchema);

export default Comment;