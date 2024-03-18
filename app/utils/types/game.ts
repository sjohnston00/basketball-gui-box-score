import { Team } from './team'

export type Game = {
  key: string
  homeTeamId: string
  awayTeamId: string
  homeTeamShots: any[]
  awayTeamShots: any[]
  createdAt: Date
  finished: boolean
}

export type PopulatedGame = Game & {
  homeTeam: Team
  awayTeam: Team
}

