import { getTeams } from './teams'
import { Team } from './types/team'

function renderTeamsTable(teams: Team[]) {
  const teamsTbody = document.getElementById('teams-table-tbody') as HTMLTableElement

  while (teamsTbody.firstChild) {
    teamsTbody.removeChild(teamsTbody.firstChild)
  }
  for (let index = 0; index < teams.length; index++) {
    const team = teams[index]
    const teamRow = document.createElement('tr')
    const teamName = document.createElement('td')
    teamName.textContent = team.name
    const teamAbbvr = document.createElement('td')
    teamAbbvr.textContent = team.abbvr
    const teamPlayers = document.createElement('td')
    teamPlayers.textContent = team.players.length.toString()
    const teamActionsTd = document.createElement('td')
    const teamActionsViewButton = document.createElement('button')
    teamActionsViewButton.textContent = 'View'
    teamActionsViewButton.addEventListener('click', () => {
      window.location.href = `/pages/team.html?teamId=${team.key}`
    })
    const teamActionsEditButton = document.createElement('button')
    teamActionsEditButton.textContent = 'Edit'
    teamActionsEditButton.addEventListener('click', () => {
      window.location.href = `/pages/edit-team.html?teamId=${team.key}`
    })
    const teamActionsDeleteButton = document.createElement('button')
    teamActionsDeleteButton.textContent = 'Delete'
    teamActionsDeleteButton.addEventListener('click', () => {
      const confirmDelete = confirm(`Are you sure you want to delete team ${team.name}?`)
      if (!confirmDelete) return
      alert(`TODO: Delete team ${team.name}`)
    })
    teamActionsTd.appendChild(teamActionsViewButton)
    teamActionsTd.appendChild(teamActionsEditButton)
    teamActionsTd.appendChild(teamActionsDeleteButton)
    teamRow.appendChild(teamName)
    teamRow.appendChild(teamAbbvr)
    teamRow.appendChild(teamPlayers)
    teamRow.appendChild(teamActionsTd)
    teamsTbody.appendChild(teamRow)
  }
}

async function main() {
  let teams = await getTeams()
  renderTeamsTable(teams)
}

main()

