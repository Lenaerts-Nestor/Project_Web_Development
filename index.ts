import express from "express";

import dotenv from "dotenv";
import session from "./public/db/session";
import { Player, Faction, User } from "./public/interfaces/interface";
import { connect, findPlayerById, findPlayerByName, getAllFactions, getAllPlayers, login, searchAndSortPlayers, updatePlayerById } from "./public/db/database";
import {  secureMiddleware } from "./public/middleware/secureMiddleware";
import { loginRouter } from "./routers/loginRouter";
import { registerRouter } from "./routers/registerRouter";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000; 
let players: Player[] = [];
let factions: Faction[] = [];

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session);

app.use(loginRouter());
app.use(registerRouter());

//view engine setup ==> niet aanraken
app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);




app.get("/factions", async (req, res) => {
  //krijg de laatste faction upgedated
  factions= await getAllFactions();
  res.render("factions", {
    Factions: factions,
    warcraftData: players,
  });
});


app.get("/", secureMiddleware, async (req, res) => {
  if (req.session.user) {
    const searchQuery = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    
    let sortDirection: "asc" | "desc" = "asc";
    if (req.query.sortDirection === "desc" || req.query.sortDirection === "asc") {
      sortDirection = req.query.sortDirection;
    }

    try {
      const players = await searchAndSortPlayers(searchQuery, sortField, sortDirection);

      // Define the available sort fields for the table headers
      const sortFields = [
        { value: "name", text: "Name" },
        { value: "age", text: "Age" },
        { value: "birthdate", text: "Birthdate" }
      ];

      res.render("index", { 
        user: req.session.user,
        players, 
        searchQuery, 
        sortField, 
        sortDirection, 
        sortFields 
      });
    } catch (error) {
      res.status(500).send("An error occurred while fetching the players.");
    }
  } else {
    res.redirect("/login");
  }
});


app.get("/person", secureMiddleware,async (req, res) => {
  const playerName = req.query.name as string;
  const selectedPlayer = await findPlayerByName(playerName);


  res.render("person", {
    player: selectedPlayer,
    Factions: factions,
  });
});


app.get("/:id", secureMiddleware,async (req, res) => {
  const id = parseInt(req.params.id);
  const player = await findPlayerById(id);

  if (!player) {
    res.redirect("/404");
  } else {
    res.render("updateplayer", { player });
  }
});

app.post("/update-player", async (req, res) => {
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


app.listen(port, async () => {
  await connect();
  factions = await getAllFactions();
  players = await getAllPlayers();
  console.log("[server] http://localhost:" + port)
});