import express from "express";

import dotenv from "dotenv";
import { User } from "../public/interfaces/interface";
import { login } from "../public/db/database";

export function loginRouter(){
    const router = express.Router();

    
    router.get("/login", (req, res) => { 
        res.render("login");
      });


      router.post("/login", async(req, res) => {
        const email : string = req.body.email;
        const password : string = req.body.password;
        try {
            let user : User = await login(email, password);
            delete user.password;  
            req.session.user = user;
            res.redirect("/")
        } catch (e : any) {
            res.redirect("/login");
        }
      });
      
      router.post("/logout", async(req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
      });

      

      return router;
}