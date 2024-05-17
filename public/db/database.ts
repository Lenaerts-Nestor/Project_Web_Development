import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { Faction, Player } from "../../interface";
import internal from "stream";

const uri = "mongodb+srv://wpl:password_wpl@projectwpl.l2arpvq.mongodb.net/?retryWrites=true&w=majority&appName=projectwpl";
const client = new MongoClient(uri)


export const PlayerCollection: Collection<Player> = client.db("projectwpl").collection<Player>("Players");
export const FactionCollection : Collection<Faction> = client.db("projectwpl").collection<Faction>("Factions");



export async function getAllPlayers() {
    return await PlayerCollection.find().toArray();
}
export async function findPlayerByName(name:string) {
    return await PlayerCollection.findOne({name})
}
export async function findPlayerById(id:number) {
    return await PlayerCollection.findOne({id})
}

export async function updatePlayerById(id:number, name : string, age:number, honorLevel:string, married: boolean) {
    return await PlayerCollection.updateOne({id: id}, {$set:{name:name, age: age , honorLevel : honorLevel, married : married}});
}


export async function getAllFactions() {
    return await FactionCollection.find().toArray();
}




export async function loadDataToTheDatabase() {
    const players : Player[] = await getAllPlayers();
    const Faction : Faction[] = await getAllFactions();
    if(players.length === 0){
        console.log('database is leeg van players, laden van players in de database');
        const response  = await (await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/warcraft.json")).json() as Player[];
        await PlayerCollection.insertMany(response)
    }

    if(Faction.length === 0){
        console.log('database is leeg van factions, laden van factions in de database');
        const response = await (await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/Faction.json")).json() as Faction[];
        await FactionCollection.insertMany(response);
    }

    return;
}



//behandeling van de datbase connect - exit
async function exit() {
    try {
        await client.close();
        console.log('Disconnected from database');
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}
export async function connect() {
    try {
        await client.connect();
        await loadDataToTheDatabase();
        console.log("geconnecteerd in de database");
        process.on('SIGINT', exit);
    } catch (error) { console.log('er is een error bij het inloggen: ' + error) }

}