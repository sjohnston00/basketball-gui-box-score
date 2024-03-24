import { teamsTable } from '~/utils/indexeddb'
import { getPlayers, getPlayersForTeam } from '~/utils/players'
import type { IndexedDBTeam, NewTeam, Team, UpdateTeam } from '~/utils/types/team'
import { team_uuid } from '~/utils/uuid'

export async function getTeams(): Promise<Team[]> {
  const teams: Team[] = []
  await teamsTable.iterate((dbTeam: IndexedDBTeam, id) => {
    const team: Team = {
      id,
      ...dbTeam,
      players: [],
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
  const team: IndexedDBTeam = {
    ...newTeam,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const teamId = team_uuid()
  await teamsTable.setItem<IndexedDBTeam>(teamId, team)
}

export async function updateTeam(teamId: string, updatedTeam: UpdateTeam): Promise<void> {
  const team: IndexedDBTeam = {
    ...updatedTeam,
    updatedAt: new Date(),
  }

  await teamsTable.setItem<IndexedDBTeam>(teamId, team)
}

export async function getTeamById(teamId: string): Promise<Team | undefined> {
  const team = await teamsTable.getItem<IndexedDBTeam>(teamId)
  if (!team) return

  const players = await getPlayersForTeam(teamId)

  return {
    id: teamId,
    ...team,
    players: players,
  }
}
