import type { Team } from '~/utils/types/team'

export type Game = {
  id: string
  homeTeamId: string
  awayTeamId: string
  shots: GameShot[]
  createdAt: Date
  finished: boolean
}
export type IndexedDBGame = Omit<Game, 'id'>

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
