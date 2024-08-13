import express from "express";
import { findUserByEmail, register } from "../public/db/database";
import { User } from "../public/interfaces/interface";
import { checkifUserIsLogged } from "../public/middleware/secureMiddleware";
import bcrypt from 'bcrypt';
export function registerRouter() {
    const router = express.Router();

    router.get("/register", checkifUserIsLogged,(req, res) => {
        res.render("register");
    });

    router.post("/register", async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        const repeatPassword: string = req.body.repeatPassword;
        
        // Server-side validation
        if (password !== repeatPassword) {
            req.session.message = { type: 'error', message: 'Passwords do not match.' };
            return res.redirect("/register");
        }

        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
        if (password.length < 4 || !specialCharPattern.test(password)) {
            req.session.message = { type: 'error', message: 'Password must be at least 4 characters long and contain at least one special character.' };
            return res.redirect("/register");
        }

        // Check if the email is already registered
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            req.session.message = { type: 'error', message: 'Email is already occupied.' };
            return res.redirect("/register");
        }

        // Hash the password and register the user
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await register(email, hashedPassword);
            req.session.user = { email, role:"USER"}; // Automatically log the user in
            req.session.message = { type: 'success', message: 'Registration successful!' };
            res.redirect("/");
        } catch (e: any) {
            req.session.message = { type: 'error', message: 'Registration failed. Please try again.' };
            res.redirect("/register");
        }
    });
    return router;
}
