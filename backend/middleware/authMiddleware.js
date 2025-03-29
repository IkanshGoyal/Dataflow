const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Debugging logs to check the token received
        console.log("🔹 Received Token:", token);

        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("✅ Decoded Token:", decodedToken);

        req.user = decodedToken; // Attach user data to the request
        next();
    } catch (error) {
        console.error("❌ Error verifying token:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { verifyToken };