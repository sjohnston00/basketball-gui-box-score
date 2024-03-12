import { gamesTable } from './indexeddb'
import { getTeamById } from './teams'
import { Game, PopulatedGame } from './types/game'

export async function getGames(): Promise<PopulatedGame[]> {
  let games: PopulatedGame[] = []
  await gamesTable.iterate(async (value: Omit<Game, 'key'>, key) => {
    const game = {
      key: key,
      ...value,
      homeTeam: await getTeamById(value.homeTeamId),
      awayTeam: await getTeamById(value.awayTeamId),
    }
    games.push(game)
  })

  return games
}

export async function deleteGame(gameId: string) {
  await gamesTable.removeItem(gameId)
}

export async function getGameById(gameId: string): Promise<PopulatedGame | undefined> {
  const game = (await gamesTable.getItem(gameId)) as Record<string, any> | undefined
  if (!game) return undefined

  return {
    key: gameId,
    homeTeam: await getTeamById(game.homeTeamId),
    awayTeam: await getTeamById(game.awayTeamId),
    homeTeamId: game.homeTeamId,
    awayTeamId: game.awayTeamId,
    homeTeamShots: game.homeTeamShots,
    awayTeamShots: game.awayTeamShots,
    createdAt: game.createdAt,
    finished: game.finished,
    ...game,
  }
}

