import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    content:{
        type:String,
        required:true,
    },
    coverImgUrl:{
        type: String,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
},{timestamps:true});

const Posts = mongoose.model("Post",postSchema);

export default Posts;
