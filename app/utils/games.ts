import { gamesTable } from '~/utils/indexeddb'
import { getTeamById } from '~/utils/teams'
import type { IndexedDBGame, NewGame, PopulatedGame } from '~/utils/types/game'
import { game_uuid } from '~/utils/uuid'
export async function getGames(): Promise<PopulatedGame[]> {
  const games: PopulatedGame[] = []
  await gamesTable.iterate(async (value: IndexedDBGame, gameId) => {
    const homeTeam = await getTeamById(value.homeTeamId)
    const awayTeam = await getTeamById(value.awayTeamId)
    const { homeTeamScore, awayTeamScore } = getGameScore(value)

    const game: PopulatedGame = {
      ...value,
      id: gameId,
      homeTeam: homeTeam!,
      awayTeam: awayTeam!,
      homeTeamScore,
      awayTeamScore,
    }
    games.push(game)
  })

  return games
}

export async function createGame(newGame: NewGame): Promise<void> {
  const data: IndexedDBGame = {
    ...newGame,
    createdAt: new Date(),
    updatedAt: new Date(),
    finished: false,
    shots: [],
  }
  await gamesTable.setItem<IndexedDBGame>(game_uuid(), data)
}

export async function deleteGame(gameId: string): Promise<void> {
  await gamesTable.removeItem(gameId)
}

export async function getGameById(gameId: string): Promise<PopulatedGame | undefined> {
  const game = await gamesTable.getItem<IndexedDBGame>(gameId)
  if (!game) return undefined

  const homeTeam = await getTeamById(game.homeTeamId)
  const awayTeam = await getTeamById(game.awayTeamId)

  const { homeTeamScore, awayTeamScore } = getGameScore(game)

  return {
    id: gameId,
    homeTeam: homeTeam!,
    awayTeam: awayTeam!,
    homeTeamScore,
    awayTeamScore,
    ...game,
  }
}

export function getGameScore(game: IndexedDBGame): {
  homeTeamScore: number
  awayTeamScore: number
} {
  console.error('function getGameScore() NOT YET IMPLEMENTED')
  return {
    homeTeamScore: 0,
    awayTeamScore: 0,
  }
}

export async function getUnfinishedGames(): Promise<PopulatedGame[]> {
  const games = await getGames()
  return games.filter((game) => !game.finished)
}
