import express from "express";
const app = express();
const port = process.env.PORT || 3000;
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
//mongodb connection:-
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Mongodb Connected...."));

//import from router:-
import userRoute from "./routers/user.js";
import postRoute from "./routers/Post.js";
import checkForAuthenticationCookie from "./middleware/auth.js";

//middleware:-
app.use(cors({
  origin: "https://ping-me-frontend-sooty.vercel.app",     // ✅ your frontend URL
  credentials: true                    // ✅ allow cookies
}));
app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));


//router:-
app.get("/api/health",(req,res)=>{
  res.send("Backend is running...");
})
app.get("/", async(req,res)=>{
    if(!req.user) res.send("you need to signin...");
    res.send(`JAI JAGANNATH \n You are walcome ${req.user.fullname}`);
});

app.use("/api/user",userRoute);
app.use("/api/posts",postRoute)


app.listen(port,()=>console.log(`Server Started at PORT ${port}`));