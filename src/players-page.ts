import { pl } from '@faker-js/faker'
import { deletePlayer, getPlayers } from './players'
import { getTeams } from './teams'
import { Player } from './types/player'
import { Team } from './types/team'

async function main() {
  let teams = await getTeams()
  let players = await getPlayers()

  renderPlayersTable(players, teams)
}

function renderPlayersTable(players: Player[], teams: Team[]) {
  const playersTbody = document.getElementById('players-table-tbody') as HTMLTableSectionElement

  while (playersTbody.firstChild) {
    playersTbody.removeChild(playersTbody.firstChild)
  }
  for (let index = 0; index < players.length; index++) {
    const player = players[index]
    const playerRow = document.createElement('tr')
    const playerName = document.createElement('td')
    playerName.textContent = player.name
    const playerNumber = document.createElement('td')
    playerNumber.textContent = player.number.toString()

    const playerTeamTd = document.createElement('td')
    const playerTeamLink = document.createElement('a')
    const playerTeam = teams.find((team) => team.key === player.teamId)

    playerTeamLink.classList.add('underline')
    playerTeamLink.textContent = playerTeam ? playerTeam.name : 'No Team'
    playerTeamLink.href = playerTeam ? `/pages/team.html?teamId=${player.teamId}` : '#'
    playerTeamTd.appendChild(playerTeamLink)

    const playerActionsTd = document.createElement('td')
    const playerEditButton = document.createElement('button')
    playerEditButton.classList.add('btn', 'btn-primary')
    playerEditButton.textContent = 'Edit'
    playerEditButton.addEventListener('click', () => {
      window.location.href = `/pages/edit-player.html?playerId=${player.key}`
    })
    const playerDeleteButton = document.createElement('button')
    playerDeleteButton.textContent = 'Delete'
    playerDeleteButton.addEventListener('click', async () => {
      const confirmDelete = confirm(`Are you sure you want to delete this player?`)
      if (!confirmDelete) return
      await deletePlayer(player.key)
      players = await getPlayers()
      renderPlayersTable(players, teams)
      // console.log(`deletePlayer(player=${player.name})`)
    })
    playerActionsTd.appendChild(playerEditButton)
    playerActionsTd.appendChild(playerDeleteButton)

    playerRow.appendChild(playerName)
    playerRow.appendChild(playerNumber)
    playerRow.appendChild(playerTeamTd)
    playerRow.appendChild(playerActionsTd)
    playersTbody.appendChild(playerRow)
  }
}
main()

