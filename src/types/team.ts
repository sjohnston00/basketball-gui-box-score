import { Player } from './player'

export type Team = {
  key: string
  name: string
  abbvr: string
  players: Player[]
  createdAt: Date
}

export type NewTeam = Omit<Team, 'key' | 'createdAt' | 'players'>
