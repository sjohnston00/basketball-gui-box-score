import { playersTable } from '~/utils/indexeddb'
import type { IndexedDBPlayer, NewPlayer, Player, UpdatePlayer } from '~/utils/types/player'
import { player_uuid } from '~/utils/uuid'

export async function getPlayers(): Promise<Player[]> {
  const players: Player[] = []
  await playersTable.iterate((value: IndexedDBPlayer, playerId) => {
    const player: Player = {
      id: playerId,
      ...value,
    }
    players.push(player)
  })

  return players
}

export async function createPlayer(newPlayer: NewPlayer): Promise<void> {
  const player: IndexedDBPlayer = {
    ...newPlayer,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const playerId = player_uuid()
  await playersTable.setItem(playerId, player)
}

export async function deletePlayer(id: string): Promise<void> {
  await playersTable.removeItem(id)
}

export async function getPlayerById(playerId: string): Promise<Player | undefined> {
  const player = await playersTable.getItem<IndexedDBPlayer>(playerId)
  if (!player) return undefined

  return {
    id: playerId,
    ...player,
  }
}

export async function getPlayersForTeam(teamId: string, players?: Player[]): Promise<Player[]> {
  players = players || (await getPlayers())
  const teamPlayers: Player[] = []

  for (let index = 0; index < players.length; index++) {
    const player = players[index]
    if (player.teamId === teamId) {
      teamPlayers.push(player)
    }
  }
  return teamPlayers
}

export async function updatePlayer(playerId: string, updatedPlayer: UpdatePlayer): Promise<void> {
  const player: IndexedDBPlayer = {
    name: updatedPlayer.name,
    number: updatedPlayer.number,
    createdAt: updatedPlayer.createdAt,
    teamId: updatedPlayer.teamId,
    updatedAt: new Date(),
  }

  await playersTable.setItem<IndexedDBPlayer>(playerId, player)
}

