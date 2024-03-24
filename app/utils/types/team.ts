import { Player } from './player'

export type Team = {
  id: string
  name: string
  abbreviation: string
  players: Player[]
  createdAt: Date
  updatedAt: Date
}

export type IndexedDBTeam = Omit<Team, 'id' | 'players'>

export type NewTeam = Omit<IndexedDBTeam, 'createdAt' | 'updatedAt'>
export type UpdateTeam = Omit<IndexedDBTeam, 'updatedAt'>
