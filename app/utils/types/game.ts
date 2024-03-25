import type { Team } from '~/utils/types/team'

export type Game = {
  id: string
  homeTeamId: string
  awayTeamId: string
  shots: GameShot[]
  createdAt: Date
  updatedAt: Date
  finished: boolean
}
export type IndexedDBGame = Omit<Game, 'id'>
export type NewGame = Omit<IndexedDBGame, 'finished' | 'createdAt' | 'updatedAt' | 'shots'>

export type PopulatedGame = Game & {
  homeTeam: Team
  awayTeam: Team
  homeTeamScore: number
  awayTeamScore: number
}

export type GameShot = {
  playerId: string
  made: boolean
  assistPlayerId?: string
  playerTeamId: string
  createdAt: Date
}
