import { teamsTable } from './indexeddb'
import { getTeams } from './teams'

async function main() {
  //get the teamId query param
  const urlParams = new URLSearchParams(window.location.search)
  const teamId = urlParams.get('teamId')
  if (!teamId) {
    alert('No teamId query param')
    return
  }

  //ensure team exists in db
  const team = await teamsTable.getItem(teamId)
  if (!team) {
    alert('Team does not exist')
    return
  }

  //get the players for the team
  // const players = await getPlayersForTeam(teamId)
  // console.log({
  //   teamPlayers: players,
  // })

  const teamNameInput = document.getElementById('team-name-input') as HTMLInputElement
  const teamAbbvrInput = document.getElementById('team-name-abbvr-input') as HTMLInputElement

  const teamNameHeading = document.getElementById('team-name') as HTMLHeadingElement
  teamNameInput.value = team.name
  teamAbbvrInput.value = team.abbvr

  teamNameHeading.textContent = team.name

  const editTeamForm = document.getElementById('edit-team-form') as HTMLFormElement

  editTeamForm.onsubmit = async (event) => {
    event.preventDefault()
    const teamName = teamNameInput.value
    const teamAbbvr = teamAbbvrInput.value

    //TODO: check team NEW name already exists
    const teams = await getTeams()
    let newTeamNameExists = teams.some((team) => team.name === teamName)
    if (newTeamNameExists) {
      alert('Team name already exists')
      teamNameInput.focus()
      return
    }

    await teamsTable.setItem(teamId, {
      ...team,
      name: teamName,
      abbvr: teamAbbvr,
    })

    window.location.replace('/pages/teams.html')
  }
}

main()

