import { playersTable } from './indexeddb'
import { Player } from './types/player'
import { generatePlayer_uuid, uuid } from './uuid'

export async function getPlayers() {
  let players: Player[] = []
  await playersTable.iterate((value: Omit<Player, 'key'>, key) => {
    const player: Player = {
      key: key,
      name: value.name,
      number: value.number,
      teamId: value.teamId,
      createdAt: value.createdAt,
    }
    players.push(player)
  })

  return players
}

export async function createPlayer(newPlayer: Omit<Player, 'key' | 'createdAt'>) {
  const player: Omit<Player, 'key'> = {
    name: newPlayer.name,
    number: newPlayer.number,
    teamId: newPlayer.teamId,
    createdAt: new Date(),
  }

  const playerId = generatePlayer_uuid()
  await playersTable.setItem(playerId, player)
}

export async function deletePlayer(id: string) {
  await playersTable.removeItem(id)
}

export async function getPlayerById(playerId: string): Promise<Player | undefined> {
  const player = (await playersTable.getItem(playerId)) as Record<string, any> | undefined
  if (!player) return undefined

  return {
    key: playerId,
    name: player.name,
    number: player.number,
    teamId: player.teamId,
    createdAt: player.createdAt,
  }
}

export async function getPlayersForTeam(teamId: string, players?: Player[]): Promise<Player[]> {
  players = players || (await getPlayers())
  let teamPlayers: Player[] = []

  for (let index = 0; index < players.length; index++) {
    const player = players[index]
    if (player.teamId === teamId) {
      teamPlayers.push(player)
    }
  }
  return teamPlayers
}

