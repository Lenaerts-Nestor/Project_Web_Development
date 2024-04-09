import express from "express";

import { Player, Faction }from "../interface";

const app = express();

app.use(express.static("public"));


//view engine setup ==> niet aanraken
app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);


app.use("/", async (req, res) => {
    /*
    const response = await fetch("https://api.magicthegathering.io/v1/cards");
    const data : CardsResponse = await response.json();
    */

    const response2 = await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/warcraft.json");
    const data2 : Player[] = await response2.json() as Player[];
    res.render("index", {playersArray:data2} )
})


app.listen(app.get("port"), async ()=>{
    const response2 = await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/warcraft.json");
    const data2 : Player[] = await response2.json() as Player[];
    console.log(data2.length)
    console.log( "[server] http://localhost:" + app.get("port"))});