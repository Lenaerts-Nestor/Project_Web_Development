export interface Player {
  id: number
  name: string
  FavoriteQoute: string
  age: number
  married: boolean
  birthdate: string
  favoriteImageUrl: string
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

