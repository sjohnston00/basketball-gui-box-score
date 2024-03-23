import { gamesTable } from './indexeddb'
import { getTeamById } from './teams'
import type { IndexedDBGame, PopulatedGame } from '~/utils/types/game'
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

export async function deleteGame(gameId: string): Promise<void> {
  await gamesTable.removeItem(gameId)
}

export async function getGameById(gameId: string): Promise<PopulatedGame | undefined> {
  const game = (await gamesTable.getItem(gameId)) as IndexedDBGame | undefined
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

export function getGameScore(game: IndexedDBGame) {
  console.error('function getGameScore() NOT YET IMPLEMENTED')
  return {
    homeTeamScore: 0,
    awayTeamScore: 0,
  }
}
