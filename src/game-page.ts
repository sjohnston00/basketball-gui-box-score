import { getGameById } from './games'
import { gamesTable } from './indexeddb'
import { getTeamById } from './teams'

async function main() {
  //get the gameId query param
  const urlParams = new URLSearchParams(window.location.search)
  const gameId = urlParams.get('gameId')
  if (!gameId) {
    alert('No gameId query param')
    return
  }

  //ensure game exists in db
  const game = await getGameById(gameId)
  if (!game) {
    alert('Game does not exist')
    return
  }

  //get the players for the team
  // const players = await getPlayersForTeam(gameId)
  // console.log({
  //   teamPlayers: players,
  // })

  const homeTeamNameHeading = document.getElementById('home-team-name') as HTMLHeadingElement
  const awayTeamNameHeading = document.getElementById('away-team-name') as HTMLHeadingElement
  homeTeamNameHeading.textContent = game.homeTeam.name
  awayTeamNameHeading.textContent = game.awayTeam.name
}

main()

