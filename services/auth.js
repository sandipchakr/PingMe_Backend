import JWT from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET;

export  function createTokenForUser(user){
    const payload = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
    };

    const token = JWT.sign(payload,secret);
    return token;
}

export function validateToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}


