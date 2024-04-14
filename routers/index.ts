import express from "express";

import { Player, Faction }from "../interface";

const app = express();

app.use(express.static("public"));


//view engine setup ==> niet aanraken
app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);


let players : Player[] = []; 
app.use("/", async (req, res) => {
    // SEARCH / ZOEK  GEDEELTE
    const searchQuery = typeof req.query.q === "string" ? req.query.q.toLowerCase() : ""; /*ik zet het meteen tolowcase */
  
    let filteredPlayers = players;
    if (searchQuery) {
      filteredPlayers = players.filter((player) =>
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


  app.use("/factions" , async(req,res) =>{

  })

app.listen(app.get("port"), async ()=>{

    let response = await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/warcraft.json");
    players = await response.json() as Player[];
    console.log( "[server] http://localhost:" + app.get("port"))});