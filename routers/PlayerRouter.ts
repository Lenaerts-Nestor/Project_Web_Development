import express from "express";
import { findPlayerById, findPlayerByName, updatePlayerById } from "../public/db/database";
import { checkLogin } from "../public/middleware/secureMiddleware";
import { Faction } from "../public/interfaces/interface";

export function playerRouter(factions : Faction[]) {
    const router = express.Router();


    router.get("/:id", checkLogin,async (req, res) => {
        const id = parseInt(req.params.id);
        const player = await findPlayerById(id);
      
        if (!player) {
          res.redirect("/404");
        } else {
          res.render("updateplayer", { player });
        }
      });
      
      router.post("/update-player", async (req, res) => {
        const id = parseInt(req.body.id);
        const player = await findPlayerById(id);
      
        if (!player) {
          return res.status(400).json({ message: "Player not found" });
        }
        const honorLevel = req.body.honorLevel;
        const married = req.body.married === 'on' ? true : false;
        const name: string = req.body.name || player.name;
        const age: number = parseInt(req.body.age) || player.age;
      
        await updatePlayerById(id, name, age, honorLevel, married);
        res.redirect("/");
      
      });

      router.get("/person", async (req, res) => {
        const playerName = req.query.name as string;
        const selectedPlayer = await findPlayerByName(playerName);
      
      
        res.render("person", {
          player: selectedPlayer,
          Factions: factions,
        });
      });
      
      
    return router;
}
