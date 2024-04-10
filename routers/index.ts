import express from "express";

import { Player, Faction }from "../interface";

const app = express();

app.use(express.static("public"));


//view engine setup ==> niet aanraken
app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);


let players : Player[] = []; 

app.use("/", async (req, res) => {
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";

    // Define a faction ranking for sorting
    const factionRanking = { alliance: 1, horde: 2, legion: 3, neutral: 4 };

    let SortedPlayer = [...players].sort((a, b) => {
        switch (sortField) {
            case "name":
                return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            case "birthdate":
                // Assuming birthdate is in a format that allows direct comparison (e.g., "YYYY-MM-DD")
                return sortDirection === "asc" ? a.birthdate.localeCompare(b.birthdate) : b.birthdate.localeCompare(a.birthdate);
            case "married":
                // Convert boolean to number for comparison (false < true)
                return sortDirection === "asc" ? Number(a.married) - Number(b.married) : Number(b.married) - Number(a.married);
            default:
                return 0;
        }
    });

    const sortFields = [
        { value: 'name', text: 'NAME', selected: sortField === 'name' ? 'selected' : '' },
        { value: 'birthdate', text: 'BIRTHDATE', selected: sortField === 'birthdate' ? 'selected' : ''},
        { value: 'faction', text: 'FACTION', selected: sortField === 'faction' ? 'selected' : ''},
        { value: 'married', text: 'MARRIED', selected: sortField === 'married' ? 'selected' : ''},
    ];

    const sortDirections = [
        { value: 'asc', text: 'Ascending', selected: sortDirection === 'asc' ? 'selected' : ''},
        { value: 'desc', text: 'Descending', selected: sortDirection === 'desc' ? 'selected' : ''}
    ];

    // Make sure to pass SortedPlayer instead of players
    res.render("index", { 
        warcraftData: SortedPlayer ,
        sortFields : sortFields,
        sortDirections : sortDirections,
        sortField : sortField,
        sortDirection : sortDirection
    });
});

app.listen(app.get("port"), async ()=>{

    let response = await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/warcraft.json");
    players = await response.json() as Player[];
    console.log( "[server] http://localhost:" + app.get("port"))});