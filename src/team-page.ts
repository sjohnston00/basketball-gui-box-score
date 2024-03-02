import { teamsTable } from './indexeddb'

async function main() {
  //get the teamId query param
  const urlParams = new URLSearchParams(window.location.search)
  const teamId = urlParams.get('teamId')
  if (!teamId) {
    alert('No teamId query param')
    return
  }

  //TODO: ensure team exists in db
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

  const teamNameHeading = document.getElementById('team-name') as HTMLHeadingElement
  teamNameHeading.textContent = team.name
}

main()

