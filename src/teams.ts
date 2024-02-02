import { teamsTable } from './indexeddb'
import { getPlayers } from './players'
import type { NewTeam, Team } from './types/team'
import { generateTeam_uuid, uuid } from './uuid'

export async function getTeams() {
  let teams: Team[] = []
  await teamsTable.iterate((value: Team, key) => {
    const team = {
      key: key,
      name: value.name,
      abbvr: value.abbvr,
      players: [],
      createdAt: value.createdAt,
    }
    teams.push(team)
  })

  const players = await getPlayers()
  for (let index = 0; index < players.length; index++) {
    const player = players[index]

    for (let j = 0; j < teams.length; j++) {
      const team = teams[j]
      if (player.teamId === team.key) {
        teams[j].players.push(player)
        break
      }
    }
  }
  return teams
}

export async function createTeam(newTeam: NewTeam) {
  const team: Omit<Team, 'key' | 'players'> = {
    name: newTeam.name,
    abbvr: newTeam.abbvr,
    createdAt: new Date(),
  }

  const teamId = generateTeam_uuid()
  await teamsTable.setItem(teamId, team)
}
