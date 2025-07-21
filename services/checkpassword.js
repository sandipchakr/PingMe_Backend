import User from "../models/user.js";
import {createTokenForUser} from "./auth.js";

export default async function CheckPassword(email,password){
    const user = await User.findOne({email})

    if(!user) throw new Error ("user not found");
    if(user.password !== password) throw new Error ("Invalid password");

    const token = createTokenForUser(user);

    return token;
}