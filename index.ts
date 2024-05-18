import express from "express";

import { Player, Faction } from "./interface";
import { connect, findPlayerById, findPlayerByName, getAllFactions, getAllPlayers, updatePlayerById } from "./public/db/database";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//view engine setup ==> niet aanraken
app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);


let players: Player[] = [];
let factions: Faction[] = [];

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


app.get("/factions", async (req, res) => {

  res.render("factions", {
    Factions: factions,
    warcraftData: players,
  });
});

app.get("/person", async (req, res) => {
  const playerName = req.query.name as string;
  const selectedPlayer = await findPlayerByName(playerName);


  res.render("person", {
    player: selectedPlayer,
    Factions: factions,
  });
});

app.get("/", async (req, res) => {
  // SEARCH / ZOEK  GEDEELTE
  const searchQuery = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";

  let players1 = await getAllPlayers();
  let filteredPlayers = players1;
  if (searchQuery) {
    filteredPlayers = players1.filter((player) =>
      player.name.toLowerCase().includes(searchQuery)
    );
  }

  // SORT GEDEELTE
  const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
  const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";

  let SortedPlayer = [...filteredPlayers].sort((a, b) => {
    switch (sortField) {
      case "name":
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      case "birthdate":
        return sortDirection === "asc" ? a.birthdate.localeCompare(b.birthdate) : b.birthdate.localeCompare(a.birthdate);
      case "married":
        return sortDirection === "asc" ? Number(a.married) - Number(b.married) : Number(b.married) - Number(a.married);
      default:
        return 0;
    }
  });

  const sortFields = [
    { value: "name", text: "NAME", selected: sortField === "name" ? "selected" : "" },
    { value: "birthdate", text: "BIRTHDATE", selected: sortField === "birthdate" ? "selected" : "" },
    { value: "married", text: "MARRIED", selected: sortField === "married" ? "selected" : "" },
  ];

  const sortDirections = [
    { value: "asc", text: "Ascending", selected: sortDirection === "asc" ? "selected" : "" },
    { value: "desc", text: "Descending", selected: sortDirection === "desc" ? "selected" : "" },
  ];

  res.render("index", {
    warcraftData: SortedPlayer,
    sortFields,
    sortDirections,
    sortField,
    sortDirection,
    searchQuery,
  });
});


app.get("/:id", async (req, res) => {
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


app.listen(app.get("port"), async () => {


  await connect();
  players = await getAllPlayers();
  factions = await getAllFactions();

  console.log("[server] http://localhost:" + app.get("port"))
});