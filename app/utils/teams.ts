import { teamsTable } from '~/utils/indexeddb'
import { getPlayers, getPlayersForTeam } from '~/utils/players'
import type { IndexedDBTeam, NewTeam, Team } from '~/utils/types/team'
import { team_uuid } from '~/utils/uuid'

export async function getTeams(): Promise<Team[]> {
  const teams: Team[] = []
  await teamsTable.iterate((dbTeam: IndexedDBTeam, id) => {
    const team: Team = {
      id,
      name: dbTeam.name,
      abbvr: dbTeam.abbvr,
      players: [],
      createdAt: dbTeam.createdAt,
    }
    teams.push(team)
  })

  const players = await getPlayers()
  for (let i = 0; i < teams.length; i++) {
    teams[i].players = await getPlayersForTeam(teams[i].id, players)
  }
  return teams
}

export async function createTeam(newTeam: NewTeam): Promise<void> {
  const team: Omit<Team, 'id' | 'players'> = {
    name: newTeam.name,
    abbvr: newTeam.abbvr,
    createdAt: new Date(),
  }

  const teamId = team_uuid()
  await teamsTable.setItem(teamId, team)
}

export async function getTeamById(teamId: string): Promise<Team | undefined> {
  const team = (await teamsTable.getItem(teamId)) as IndexedDBTeam | undefined
  if (!team) return undefined

  const players = await getPlayersForTeam(teamId)

  return {
    id: teamId,
    name: team.name,
    abbvr: team.abbvr,
    players: players,
    createdAt: team.createdAt,
  }
}
