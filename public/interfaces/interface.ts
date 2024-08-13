import { ObjectId } from "mongodb"

export interface Player {
  id: number
  name: string
  FavoriteQoute: string
  age: number
  married: boolean
  birthdate: string
  profielImageUrl: string
  honorLevel: string
  hobby: string[]
  Faction: Faction
}

export interface Faction {
  id: number
  name: string
  guildmaster: string
  factionUrl: string
  foundedYear: number
  Moto: string
}

export interface User{
  _id?: ObjectId;
  role : "ADMIN" | "USER";
  email : string;
  password? : string;
}
export interface FlashMessage {
  type: "error" | "success"
  message: string;
}