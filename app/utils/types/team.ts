import { Player } from './player'

export type Team = {
  id: string
  name: string
  abbvr: string
  players: Player[]
  createdAt: Date
}

export type IndexedDBTeam = Omit<Team, 'id'>

export type NewTeam = Omit<Team, 'id' | 'createdAt' | 'players'>
