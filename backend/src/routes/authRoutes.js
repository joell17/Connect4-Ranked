const express = require("express");
const passport = require("passport");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Google OAuth authentication route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Store entire user_data in session
        req.session.user = req.user;

        // Use the origin from the request headers for the redirect
        const origin = process.env.NODE_ENV == "Development" ? "https://localhost:3001" : "https://super-kitsune-9a88a7.netlify.app/";
        res.redirect(`${origin}/`); // Redirect to the origin of the request
    }
);

// Route to get the current user's data
router.get("/user", async (req, res) => {
    if (req.session.user) {
        try {
            const user_data = await prisma.user_data.findUnique({
                where: {
                    id: req.session.user.id,
                },
            });

            if (user_data) {
                req.session.user = user_data;
                res.json(user_data); // Send user data
                console.log('User was found');
            } else {
                // User not found in the database
                console.log('User not found');
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

router.post("/user/change-skins", async (req, res) => {
    if (req.session.user) {
        try {
            const updateResult = await prisma.user_data.update({
                where: {
                    id: req.session.user.id,
                },
                data: {
                    primary_skin: req.body.primary_skin,
                    secondary_skin: req.body.secondary_skin,
                },
            });

            if (updateResult) {
                console.log('Skins updated successfully');
                res.json({ message: "Skins updated successfully" }); // Confirm successful update
            } else {
                res.status(404).json({ message: "User not found" }); // User not found in the database
            }
        } catch (error) {
            console.log(req.body);
            console.error(error);
            res.status(500).json({ message: "Internal server error" }); // Handle server errors
        }
    } else {
        res.status(401).json({ message: "Not authenticated" }); // User not authenticated
    }
});


// Logout route
router.get("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy(); // Destroy session after logging out
        res.json({ message: "Logged out successfully" }); // Send a JSON response
    });
});

module.exports = router;
