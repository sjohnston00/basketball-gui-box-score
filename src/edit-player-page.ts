import { playersTable } from './indexeddb'
import { createPlayer, getPlayerById, getPlayers } from './players'
import { getTeams } from './teams'
import { Team } from './types/team'

async function main() {
  let teams = await getTeams()
  let players = await getPlayers()

  const urlParams = new URLSearchParams(window.location.search)
  const playerId = urlParams.get('playerId')
  if (!playerId) {
    alert('No playerId query param')
    return
  }

  //ensure team exists in db
  const player = await getPlayerById(playerId)
  if (!player) {
    alert('Player does not exist')
    return
  }

  const editPlayerForm = document.getElementById('edit-player-form') as HTMLFormElement
  const playerNameInput = document.getElementById('player-name-input') as HTMLInputElement
  const playerNumberInput = document.getElementById('player-number-input') as HTMLInputElement

  const editPlayerTeamSelect = document.getElementById('player-team-id') as HTMLSelectElement

  playerNameInput.value = player.name
  playerNumberInput.value = player.number
  editPlayerTeamSelect.value = player.teamId

  renderTeamsSelectOptions(teams)
  editPlayerTeamSelect.selectedIndex = teams.findIndex((team) => team.key === player.teamId)

  editPlayerForm.onsubmit = async (event) => {
    event.preventDefault()

    const playerName = playerNameInput.value
    const playerNumber = playerNumberInput.value
    const playerTeamId = editPlayerTeamSelect.value

    await playersTable.setItem(playerId, {
      name: playerName,
      number: playerNumber,
      teamId: playerTeamId,
      createdAt: player.createdAt,
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

