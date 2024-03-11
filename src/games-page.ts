import { deleteGame, getGames } from './games'
import { PopulatedGame } from './types/game'

function renderGamesTable(games: PopulatedGame[]) {
  const gamesTbody = document.getElementById('games-table-tbody') as HTMLTableElement

  while (gamesTbody.firstChild) {
    gamesTbody.removeChild(gamesTbody.firstChild)
  }
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const gameRow = document.createElement('tr')
    const gameHomeTeam = document.createElement('td')
    const gameHomeTeamLink = document.createElement('a')
    // gameHomeTeamLink.href = `/pages/team.html?teamId=${game.homeTeam.key}`
    gameHomeTeamLink.textContent = game.homeTeam.name
    gameHomeTeam.appendChild(gameHomeTeamLink)

    const gameHomeTeamScore = document.createElement('td')
    gameHomeTeamScore.textContent = '0'

    const gameAwayTeam = document.createElement('td')
    const gameAwayTeamLink = document.createElement('a')
    // gameLink.href = `/pages/team.html?teamId=${game.awayTeam.key}`
    gameAwayTeamLink.textContent = game.awayTeam.name
    gameAwayTeam.appendChild(gameAwayTeamLink)

    const gameAwayTeamScore = document.createElement('td')
    gameAwayTeamScore.textContent = '0'

    const gameActionsTd = document.createElement('td')
    const gameActionsEditLink = document.createElement('a')
    gameActionsEditLink.href = `/pages/edit-game.html?gameId=${game.key}`
    gameActionsEditLink.textContent = 'Edit'
    const gameActionsDeleteButton = document.createElement('button')
    gameActionsDeleteButton.textContent = 'Delete'
    gameActionsDeleteButton.addEventListener('click', async () => {
      const confirmDelete = confirm(`Are you sure you want to delete this game?`)
      if (!confirmDelete) return

      await deleteGame(game.key)
      games = await getGames()
      renderGamesTable(games)
      // await teamsTable.removeItem(game.key)
      // games = await getTeams()
      // renderGamesTable(games)
    })
    gameActionsTd.appendChild(gameActionsEditLink)
    gameActionsTd.appendChild(gameActionsDeleteButton)

    gameRow.appendChild(gameHomeTeam)
    gameRow.appendChild(gameHomeTeamScore)
    gameRow.appendChild(gameAwayTeamScore)
    gameRow.appendChild(gameAwayTeam)
    gameRow.appendChild(gameActionsTd)
    gamesTbody.appendChild(gameRow)
  }
}

async function main() {
  let games = await getGames()
  renderGamesTable(games)
}

main()

