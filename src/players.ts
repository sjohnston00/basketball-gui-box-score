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
