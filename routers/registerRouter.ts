import express from "express";
import { register } from "../public/db/database";
import { User } from "../public/interfaces/interface";
import { checkifUserIsLogged } from "../public/middleware/secureMiddleware";

export function registerRouter() {
    const router = express.Router();

    router.get("/register", checkifUserIsLogged,(req, res) => {
        res.render("register");
    });

    router.post("/register", async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        
        try {
            const userId = await register(email, password);
            res.redirect("/login");
        } catch (e: any) {
            res.render("register", { error: e.message });
        }
    });

    return router;
}
