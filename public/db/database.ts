import { Collection, MongoClient, } from "mongodb";
import { Faction, Player, User } from "../interfaces/interface";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export const MONGODB_URI = process.env.MONGO_URI ?? "mongodb+srv://wpl:password_wpl@projectwpl.l2arpvq.mongodb.net/?retryWrites=true&w=majority&appName=projectwpl";
const client = new MongoClient(MONGODB_URI)
const saltRounds: number = 10;

export const PlayerCollection: Collection<Player> = client.db("projectwpl").collection<Player>("Players");
export const FactionCollection: Collection<Faction> = client.db("projectwpl").collection<Faction>("Factions");
export const userCollection: Collection<User> = client.db("projectwpl").collection<User>("users_webont")


export async function getAllPlayers() {
    return await PlayerCollection.find().toArray();
}
export async function findPlayerByName(name: string) {
    return await PlayerCollection.findOne({ name })
}
export async function findPlayerById(id: number) {
    return await PlayerCollection.findOne({ id })
}

export async function findUserByEmail(email: string) {
    return await userCollection.findOne({ email: email })
}

export async function updatePlayerById(id: number, name: string, age: number, honorLevel: string, married: boolean) {
    return await PlayerCollection.updateOne({ id: id }, { $set: { name: name, age: age, honorLevel: honorLevel, married: married } });
}

export async function getAllFactions() {
    return await FactionCollection.find().toArray();
}



async function createInitialUser() {
    if (await userCollection.countDocuments() > 0) { return; }
    let email: string | undefined = process.env.ADMIN_EMAIL;
    let password: string | undefined = process.env.ADMIN_PASSWORD;

    if (email === undefined || password === undefined) {
        throw new Error("email of password moeten in de env enviroment staan")
    }

    await userCollection.insertOne({
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });
}



export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user: User | null = await findUserByEmail(email);
    if (user) {
        if (user.password && await bcrypt.compare(password, user.password)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}



export async function loadDataToTheDatabase() {
    const players: Player[] = await getAllPlayers();
    const Faction: Faction[] = await getAllFactions();
    if (players.length === 0) {
        console.log('database is leeg van players, laden van players in de database');
        const response = await (await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/warcraft.json")).json() as Player[];
        await PlayerCollection.insertMany(response)
    }

    if (Faction.length === 0) {
        console.log('database is leeg van factions, laden van factions in de database');
        const response = await (await fetch("https://raw.githubusercontent.com/Lenaerts-Nestor/WorldofWarcraft/main/Faction.json")).json() as Faction[];
        await FactionCollection.insertMany(response);
    }

    return;
}

export async function register(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser: User = {
        email: email,
        password: hashedPassword,
        role: "USER"
    };
    
    const result = await userCollection.insertOne(newUser);
    return result.insertedId;
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
        await createInitialUser();
        await loadDataToTheDatabase();
        console.log("geconnecteerd in de database");
        process.on('SIGINT', exit);
    } catch (error) { console.log('er is een error bij het inloggen: ' + error) }

}