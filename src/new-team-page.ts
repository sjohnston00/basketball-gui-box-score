import { createTeam, getTeams } from './teams'

const addTeamForm = document.getElementById('new-team-form') as HTMLFormElement
addTeamForm.onsubmit = async (event) => {
  event.preventDefault()

  const teamNameInput = document.getElementById('team-name-input') as HTMLInputElement
  const teamAbbvrInput = document.getElementById('team-name-abbvr-input') as HTMLInputElement

  const teamName = teamNameInput.value
  const teamAbbvr = teamAbbvrInput.value

  //check team name already exists
  const teams = await getTeams()
  let teamNameExists = teams.some((team) => team.name === teamName)
  if (teamNameExists) {
    alert('Team name already exists')
    teamNameInput.focus()
    return
  }

  const newTeam = {
    name: teamName,
    abbvr: teamAbbvr,
  }

  await createTeam(newTeam).catch((e) => {
    const ERR_MSG = 'Error creating team'
    console.error(`${ERR_MSG}: `, e)
    alert(ERR_MSG)
  })

  window.location.replace('/pages/teams.html')
}

