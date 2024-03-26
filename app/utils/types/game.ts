import type { Team } from '~/utils/types/team'

export type Game = {
  id: string
  homeTeamId: string
  awayTeamId: string
  shots: GameShot[]
  rebounds: GameRebound[]
  freeThrows: GameFreeThrow[]
  steals: GameStat[]
  blocks: GameStat[]
  turnovers: GameStat[]
  fouls: GameStat[]
  createdAt: Date
  updatedAt: Date
  finished: boolean
}
export type IndexedDBGame = Omit<Game, 'id'>
export type NewGame = Pick<IndexedDBGame, 'homeTeamId' | 'awayTeamId'>

export type PopulatedGame = Game & {
  homeTeam: Team
  awayTeam: Team
  homeTeamScore: number
  awayTeamScore: number
}

export type GameStat = {
  playerId: string
  playerTeamId: string
  createdAt: Date
}

export type GameRebound = {
  playerId: string
  playerTeamId: string
  createdAt: Date
  reboundType: 'offensive' | 'defensive'
  missedByPlayerId?: string
  missedByPlayerTeamId?: string
}

export type GameFreeThrow = {
  playerId: string
  playerTeamId: string
  createdAt: Date
  made: boolean
}

export type GameShot = {
  playerId: string
  made: boolean
  assistPlayerId?: string
  playerTeamId: string
  createdAt: Date
  x: number
  y: number
  isThreePointer: boolean
}
