import { getTeams } from './teams'

async function main() {
  let teams = await getTeams()

  const team1Select = document.getElementById('team1-select') as HTMLSelectElement
  const team2Select = document.getElementById('team2-select') as HTMLSelectElement
  const newGameForm = document.getElementById('new-game-form') as HTMLFormElement

  for (let index = 0; index < teams.length; index++) {
    const team = teams[index]
    const teamOption = document.createElement('option')
    teamOption.textContent = team.name
    teamOption.value = team.key
    team1Select.appendChild(teamOption)
    team2Select.appendChild(teamOption.cloneNode(true))
  }

  newGameForm.onsubmit = async (event) => {
    event.preventDefault()
    const team1Key = team1Select.value
    const team2Key = team2Select.value

    if (team1Key === team2Key) {
      alert('You cannot play against yourself!')
      return
    }

    alert('Play on')
  }
}

main()

