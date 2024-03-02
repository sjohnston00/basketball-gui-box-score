import { createPlayer, getPlayers } from './players'
import { getTeams } from './teams'
import { Team } from './types/team'

async function main() {
  let teams = await getTeams()
  let players = await getPlayers()

  renderTeamsSelectOptions(teams)

  const addPlayerForm = document.getElementById('add-player-form') as HTMLFormElement
  addPlayerForm.onsubmit = async (event) => {
    event.preventDefault()
    const playerNameInput = document.getElementById('player-name-input') as HTMLInputElement
    const playerNumberInput = document.getElementById('player-number-input') as HTMLInputElement

    const newPlayerTeamSelect = document.getElementById('player-team-id') as HTMLSelectElement

    const playerName = playerNameInput.value
    const playerNumber = playerNumberInput.value
    const playerTeamId = newPlayerTeamSelect.value

    const player = {
      name: playerName,
      number: playerNumber,
      teamId: playerTeamId,
    }

    await createPlayer(player).catch((e) => {
      const ERR_MSG = 'Error creating player'
      console.error(`${ERR_MSG}: `, e)
      alert(ERR_MSG)
    })

    window.location.replace('/pages/players.html')
  }
}

function renderTeamsSelectOptions(teams: Team[]) {
  const newPlayerTeamSelect = document.getElementById('player-team-id') as HTMLSelectElement

  while (newPlayerTeamSelect.firstChild) {
    newPlayerTeamSelect.removeChild(newPlayerTeamSelect.firstChild)
  }
  for (let index = 0; index < teams.length; index++) {
    const team = teams[index]
    const option = document.createElement('option')
    option.value = team.key
    option.textContent = team.name
    newPlayerTeamSelect.appendChild(option)
  }
}

main()

