import { teamsTable } from './indexeddb'
import { getPlayers, getPlayersForTeam } from './players'
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
  for (let i = 0; i < teams.length; i++) {
    teams[i].players = await getPlayersForTeam(teams[i].key, players)
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

export async function getTeamById(teamId: string): Promise<Team | undefined> {
  const team = (await teamsTable.getItem(teamId)) as Record<string, any> | undefined
  if (!team) return undefined

  const players = await getPlayersForTeam(teamId)

  return {
    key: teamId,
    name: team.name,
    abbvr: team.abbvr,
    players: players,
    createdAt: team.createdAt,
  }
}

