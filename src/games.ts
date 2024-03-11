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
