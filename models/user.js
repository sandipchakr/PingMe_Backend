import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
       profileImageURL:{
        type:String,
        default:`/images/default.png`,
    },
},
{timestamps:true}
);

const User = mongoose.model("user",userSchema);

export default User;