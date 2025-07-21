import { Router } from "express";
import User from "../models/user.js"
import CheckPassword from "../services/checkpassword.js";
import { requireAuth } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();
const BASE_URL = `http://localhost:${process.env.PORT}`

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
        // try {
                const userId = req.user._id;
        //         const user = await User.findById(userId).select("-password"); // exclude password
        //         res.json({ user });
        // } catch (err) {
        //         res.status(500).json({ error: "Server error" });
        // }
        const user = await User.findById(userId).select("-password");

        const profileImageURL = user.profileImageURL?.startsWith("http")
                ? user.profileImageURL
                : `${BASE_URL}${user.profileImageURL}`;

        res.json({
                user: {
                        ...user.toObject(),
                        profileImageURL,
                },
        });
});

router.post("/signup", async (req, res) => {
        const { fullname, email, password } = req.body;
        await User.create({
                fullname,
                email,
                password
        });

        res.status(200).json({ success: true, message: "Signup succesfully done.." });

});
router.post("/signin", async (req, res) => {
        const { email, password } = req.body
        try {
                const token = await CheckPassword(email, password)
                return res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "none", // or "None" if using cross-site cookies  --> should be none leter // todo->done
                        secure: true    // set to true in production with HTTPS
                }).json({ success: true, message: "You are Loggedin.." });
        } catch (error) {
                res.status(401).json({ success: false, message: `Signin failed: ${error.message}` });
        }
});
router.get("/logout", (req, res) => {
        res.clearCookie("token");
        res.json({success:true,message: "you have been logged out"});
});

export default router;