import { validateToken } from "../services/auth.js";

export default function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            req.user = null;
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            console.error("Token validation failed:", error.message);
            req.user = null;
        }
        return next();
    }
}
export function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}