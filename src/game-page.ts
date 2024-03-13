import { getGameById } from './games'
import { initialiseCanvas } from './drawCourt'

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

  const statusHomeTeamNameHeading = document.getElementById(
    'stats-home-team-name'
  ) as HTMLHeadingElement
  const statusAwayTeamNameHeading = document.getElementById(
    'stats-away-team-name'
  ) as HTMLHeadingElement

  statusHomeTeamNameHeading.textContent = game.homeTeam.name
  statusAwayTeamNameHeading.textContent = game.awayTeam.name

  const statsHomeTbody = document.getElementById(
    'stats-home-table-tbody'
  ) as HTMLTableSectionElement
  const statsAwayTbody = document.getElementById(
    'stats-away-table-tbody'
  ) as HTMLTableSectionElement

  for (let index = 0; index < game.homeTeam.players.length; index++) {
    const homePlayer = game.homeTeam.players[index]
    const playerTableData = {
      number: homePlayer.number,
      name: homePlayer.name,
      assists: 0,
      rebounds: 0,
      points: 0,
    }
    const row = document.createElement('tr')
    const playerTDs = tableTDs(playerTableData)
    row.append(...playerTDs)
    statsHomeTbody.appendChild(row)
  }

  for (let index = 0; index < game.awayTeam.players.length; index++) {
    const awayPlayer = game.awayTeam.players[index]
    const playerTableData = {
      number: awayPlayer.number,
      name: awayPlayer.name,
      assists: 0,
      rebounds: 0,
      points: 0,
    }
    const row = document.createElement('tr')
    const playerTDs = tableTDs(playerTableData)
    row.append(...playerTDs)
    statsAwayTbody.appendChild(row)
  }
}

function tableTDs(data: Record<string, any>) {
  const tds: HTMLTableCellElement[] = []
  for (const key in data) {
    const td = document.createElement('td')
    td.textContent = data[key]
    tds.push(td)
  }
  return tds
}

main()
// initialiseCanvas()
