import { playersTable, teamsTable } from './indexeddb'
import { getTeamById } from './teams'

async function main() {
  //get the teamId query param
  const urlParams = new URLSearchParams(window.location.search)
  const teamId = urlParams.get('teamId')
  if (!teamId) {
    alert('No teamId query param')
    return
  }

  //ensure team exists in db
  const team = await getTeamById(teamId)
  if (!team) {
    alert('Team does not exist')
    return
  }

  //get the players for the team
  // const players = await getPlayersForTeam(teamId)
  // console.log({
  //   teamPlayers: players,
  // })

  const teamNameHeading = document.getElementById('team-name') as HTMLHeadingElement
  teamNameHeading.textContent = team.name

  const teamPlayerTbody = document.getElementById('team-players-tbody') as HTMLTableSectionElement

  for (let index = 0; index < team.players.length; index++) {
    const teamPlayer = team.players[index]
    const teamPlayerRow = document.createElement('tr')
    const teamPlayerName = document.createElement('td')
    teamPlayerName.textContent = teamPlayer.name
    const teamPlayerNumber = document.createElement('td')
    teamPlayerNumber.textContent = teamPlayer.number.toString()

    teamPlayerRow.appendChild(teamPlayerName)
    teamPlayerRow.appendChild(teamPlayerNumber)
    teamPlayerTbody.appendChild(teamPlayerRow)
  }
}

main()

