// import { faker } from '@faker-js/faker'
// import { createTeam, getTeams } from './src/teams'
// import { Team } from './src/types/team'
// import { createPlayer } from './src/players'
// import { initialiseCanvas } from './src/courtCanvas'
import './src/drawCourt'

// async function main() {
//   type SvgInHtml = HTMLElement & SVGElement

//   const halfCourtSVG = document.getElementById('half-court') as SvgInHtml
//   const halfCourtBasketCircle = document.getElementById('half-court-basket') as SVGCircleElement
//   const halfCourtStatusText = document.getElementById('status-text') as HTMLSpanElement

//   halfCourtSVG.addEventListener('mousemove', (e) => {
//     if (e.movementX === 0 && e.movementY === 0) return
//     halfCourtSVG.removeChild(halfCourtSVG.lastChild)
//     halfCourtSVG.removeChild(halfCourtSVG.lastChild)
//     console.log({
//       x: e.x,
//       clientX: e.clientX,
//       pageX: e.pageX,
//       offsetX: e.offsetX,
//       movementX: e.movementX,
//       screenX: e.screenX,
//       y: e.y,
//       clientY: e.clientY,
//       pageY: e.pageY,
//       offsetY: e.offsetY,
//       movementY: e.movementY,
//       screenY: e.screenY,
//     })

//     const x = e.offsetX
//     const y = e.offsetY

//     const xScale = halfCourtSVG.clientWidth / halfCourtSVG.viewBox.baseVal.width
//     const yScale = halfCourtSVG.clientHeight / halfCourtSVG.viewBox.baseVal.height

//     const rectWidth = 10
//     const rectHeight = 10

//     const pointerX = x / xScale
//     const pointerY = y / yScale

//     const rectX = pointerX - rectWidth / 2
//     const rectY = pointerY - rectHeight / 2

//     const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
//     rect.setAttribute('x', rectX)
//     rect.setAttribute('y', rectY)
//     rect.setAttribute('height', 10)
//     rect.setAttribute('width', 10)
//     rect.setAttribute('fill', 'red')
//     rect.setAttribute('id', 'pointer')

//     //Draw an svg line from the pointer to the halfCourtBasketCircle
//     const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
//     line.setAttribute('x1', pointerX)
//     line.setAttribute('y1', pointerY)
//     line.setAttribute('x2', '214')
//     line.setAttribute('y2', '45.5')
//     line.setAttribute('stroke', 'red')
//     halfCourtSVG.appendChild(line)
//     halfCourtSVG.appendChild(rect)

//     if (pointerX < 27 && pointerY < 85) {
//       halfCourtStatusText.textContent = `x: ${pointerX} y: ${pointerY} Left side 3pt`
//     } else if (pointerX > 399 && pointerY < 85) {
//       halfCourtStatusText.textContent = `x: ${pointerX} y: ${pointerY} Right side 3pt`
//     } else {
//       //TODO: run equation to check distance between the basket and the pointer if its longer then the radius of the circle then its a 3pt
//       halfCourtStatusText.textContent = `x: ${pointerX} y: ${pointerY} Check 3pt eligibility`
//     }
//   })

//   const { basketballCourtCanvas, basketballCourtCtx } = initialiseCanvas()
//   let teams = await getTeams()
//   renderTeamsTable(teams)
//   renderTeamsSelectOptions(teams)

//   const game_data = {
//     team1: {
//       players: [],
//     },
//     team2: {
//       players: [],
//     },
//   }

//   const court = document.getElementById('court')
//   const svg = document.getElementById('court-svg')
//   const missedShotMarkers = document.getElementById('missed-shot-markers')
//   const clearMarkersButton = document.getElementById('clear-markers-button')
//   const team1FinalScoreSpan = document.getElementById('team-1-final-score')
//   const team2FinalScoreSpan = document.getElementById('team-2-final-score')
//   const addPlayerForm = document.getElementById('add-player-form') as HTMLFormElement
//   const addTeamForm = document.getElementById('new-team-form') as HTMLFormElement
//   const addShotForm = document.getElementById('add-shot-form') as HTMLFormElement

//   addPlayerForm.onsubmit = async (event) => {
//     event.preventDefault()
//     const playerNameInput = document.getElementById('player-name-input') as HTMLInputElement
//     const playerNumberInput = document.getElementById('player-number-input') as HTMLInputElement

//     const newPlayerTeamSelect = document.getElementById('player-team-id') as HTMLSelectElement

//     const playerName = playerNameInput.value
//     const playerNumber = playerNumberInput.value
//     const playerTeamId = newPlayerTeamSelect.value

//     const player = {
//       name: playerName,
//       number: playerNumber,
//       teamId: playerTeamId,
//     }

//     await createPlayer(player).catch((e) => {
//       const ERR_MSG = 'Error creating player'
//       console.error(`${ERR_MSG}: `, e)
//       alert(ERR_MSG)
//     })

//     teams = await getTeams()
//     renderTeamsTable(teams)

//     addPlayerForm.reset()
//     playerNameInput.focus()
//   }

//   addTeamForm.onsubmit = async (event) => {
//     event.preventDefault()

//     const teamNameInput = document.getElementById('team-name-input') as HTMLInputElement
//     const teamAbbvrInput = document.getElementById('team-name-abbvr-input') as HTMLInputElement

//     const teamName = teamNameInput.value
//     const teamAbbvr = teamAbbvrInput.value

//     //check team name already exists
//     let teamNameExists = teams.some((team) => team.name === teamName)
//     if (teamNameExists) {
//       alert('Team name already exists')
//       teamNameInput.focus()
//       return
//     }

//     const newTeam = {
//       name: teamName,
//       abbvr: teamAbbvr,
//     }

//     await createTeam(newTeam).catch((e) => {
//       const ERR_MSG = 'Error creating team'
//       console.error(`${ERR_MSG}: `, e)
//       alert(ERR_MSG)
//     })

//     teams = await getTeams()

//     renderTeamsTable(teams)
//     renderTeamsSelectOptions(teams)

//     addTeamForm.reset()
//     teamNameInput.focus()
//   }

//   const viewBox = svg.getAttribute('viewBox').split(' ')

//   const svgViewBoxWidth = Number(viewBox[2])
//   const svgViewBoxHeight = Number(viewBox[3])

//   svg.addEventListener('click', function (event) {
//     const dialog = document.getElementById('add-shot-dialog') as HTMLDialogElement
//     dialog.showModal()

//     //TODO move the adding off the marker based of the form submission of the #add-shot-form
//     const x = event.offsetX
//     const y = event.offsetY

//     const xScale = svg.clientWidth / svgViewBoxWidth
//     const yScale = svg.clientHeight / svgViewBoxHeight

//     const rectWidth = 10
//     const rectHeight = 10

//     const rectX = x / xScale - rectWidth / 2
//     const rectY = y / yScale - rectHeight / 2

//     const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
//     rect.setAttribute('x', rectX)
//     rect.setAttribute('y', rectY)
//     rect.setAttribute('height', 10)
//     rect.setAttribute('width', 10)
//     rect.setAttribute('fill', 'red')
//     missedShotMarkers.appendChild(rect)
//   })

//   clearMarkersButton.addEventListener('click', function () {
//     while (missedShotMarkers.firstChild) {
//       missedShotMarkers.removeChild(missedShotMarkers.firstChild)
//     }
//   })

//   window.addEventListener('keydown', function (event) {
//     //if key is backspace, remove from lastChild of missedShotMarkers
//     if (event.key === 'Backspace') {
//       if (missedShotMarkers.lastChild) {
//         missedShotMarkers.removeChild(missedShotMarkers.lastChild)
//       }
//     }
//   })

//   generateRandomBoxScore(game_data)

//   team1FinalScoreSpan.textContent = game_data.team1.players.reduce(
//     (total, player) => total + player.points,
//     0
//   )
//   team2FinalScoreSpan.textContent = game_data.team2.players.reduce(
//     (total, player) => total + player.points,
//     0
//   )
// }

// function generateRandomBoxScore(game_data: any) {
//   const team1PlayerTbody = document.getElementById('team1-players-tbody')
//   const team2PlayerTbody = document.getElementById('team2-players-tbody')

//   //team 1 players
//   for (let index = 0; index < 13; index++) {
//     const team1Player = {}
//     const team2Player = {}

//     team1Player.number = randomUniqueNumber(
//       game_data.team1.players.map((p) => p.number),
//       30
//     )
//     team1Player.name = faker.person.fullName()
//     team1Player.points = randomWeightedNumber(25)
//     team1Player.assists = faker.number.int(5)
//     team1Player.rebounds = faker.number.int(10)
//     team1Player.fieldGoals = []
//     team1Player.freeThrows = []
//     team1Player.fouls = []
//     team1Player.minutes = randomWeightedNumber(40)

//     game_data.team1.players.push(team1Player)

//     team2Player.number = randomUniqueNumber(
//       game_data.team2.players.map((p) => p.number),
//       30
//     )
//     team2Player.name = faker.person.fullName()
//     team2Player.points = randomWeightedNumber(25)
//     team2Player.assists = faker.number.int(5)
//     team2Player.rebounds = faker.number.int(10)
//     team2Player.fieldGoals = []
//     team2Player.freeThrows = []
//     team2Player.fouls = []
//     team2Player.minutes = randomWeightedNumber(40)

//     game_data.team2.players.push(team2Player)

//     const team1Tr = document.createElement('tr')
//     const team1numberTd = document.createElement('td')
//     const team1nameTd = document.createElement('td')
//     const team1ptsTd = document.createElement('td')
//     const team1astTd = document.createElement('td')
//     const team1rebTd = document.createElement('td')
//     const team1twopaTd = document.createElement('td')
//     const team1twopmTd = document.createElement('td')
//     const team1threepaTd = document.createElement('td')
//     const team1threepmTd = document.createElement('td')

//     team1ptsTd.style.textAlign = 'right'
//     team1astTd.style.textAlign = 'right'
//     team1rebTd.style.textAlign = 'right'

//     team1numberTd.textContent = team1Player.number
//     team1nameTd.textContent = team1Player.name
//     team1ptsTd.textContent = team1Player.points
//     team1astTd.textContent = team1Player.assists
//     team1rebTd.textContent = team1Player.rebounds

//     team1Tr.appendChild(team1numberTd)
//     team1Tr.appendChild(team1nameTd)
//     team1Tr.appendChild(team1ptsTd)
//     team1Tr.appendChild(team1astTd)
//     team1Tr.appendChild(team1rebTd)
//     team1Tr.appendChild(team1twopaTd)
//     team1Tr.appendChild(team1twopmTd)
//     team1Tr.appendChild(team1threepaTd)
//     team1Tr.appendChild(team1threepmTd)
//     team1PlayerTbody.appendChild(team1Tr)

//     const team2Tr = document.createElement('tr')
//     const team2numberTd = document.createElement('td')
//     const team2nameTd = document.createElement('td')
//     const team2ptsTd = document.createElement('td')
//     const team2astTd = document.createElement('td')
//     const team2rebTd = document.createElement('td')
//     const team2twopaTd = document.createElement('td')
//     const team2twopmTd = document.createElement('td')
//     const team2threepaTd = document.createElement('td')
//     const team2threepmTd = document.createElement('td')

//     team2ptsTd.style.textAlign = 'right'
//     team2astTd.style.textAlign = 'right'
//     team2rebTd.style.textAlign = 'right'

//     team2numberTd.textContent = team2Player.number
//     team2nameTd.textContent = team2Player.name
//     team2ptsTd.textContent = team2Player.points
//     team2astTd.textContent = team2Player.assists
//     team2rebTd.textContent = team2Player.rebounds

//     team2Tr.appendChild(team2numberTd)
//     team2Tr.appendChild(team2nameTd)
//     team2Tr.appendChild(team2ptsTd)
//     team2Tr.appendChild(team2astTd)
//     team2Tr.appendChild(team2rebTd)
//     team2Tr.appendChild(team2twopaTd)
//     team2Tr.appendChild(team2twopmTd)
//     team2Tr.appendChild(team2threepaTd)
//     team2Tr.appendChild(team2threepmTd)
//     team2PlayerTbody.appendChild(team2Tr)
//   }

//   const team1Footertr = document.createElement('tr')
//   const team1FooternumberTd = document.createElement('td')
//   const team1FooternameTd = document.createElement('td')
//   const team1FooterptsTd = document.createElement('td')
//   const team1FooterastTd = document.createElement('td')
//   const team1FooterrebTd = document.createElement('td')
//   const team1FootertwopaTd = document.createElement('td')
//   const team1FootertwopmTd = document.createElement('td')
//   const team1FooterthreepaTd = document.createElement('td')
//   const team1FooterthreepmTd = document.createElement('td')

//   team1FooterptsTd.style.textAlign = 'right'
//   team1FooterastTd.style.textAlign = 'right'
//   team1FooterrebTd.style.textAlign = 'right'

//   team1FooternumberTd.style.fontWeight = 'bold'
//   team1FooterptsTd.style.fontWeight = 'bold'
//   team1FooterastTd.style.fontWeight = 'bold'
//   team1FooterrebTd.style.fontWeight = 'bold'

//   team1FooternumberTd.textContent = 'Total'

//   team1FooterptsTd.textContent = game_data.team1.players.reduce(
//     (total, player) => total + player.points,
//     0
//   )

//   team1FooterastTd.textContent = game_data.team1.players.reduce(
//     (total, player) => total + player.assists,
//     0
//   )

//   team1FooterrebTd.textContent = game_data.team1.players.reduce(
//     (total, player) => total + player.rebounds,
//     0
//   )

//   team1Footertr.appendChild(team1FooternumberTd)
//   team1Footertr.appendChild(team1FooternameTd)
//   team1Footertr.appendChild(team1FooterptsTd)
//   team1Footertr.appendChild(team1FooterastTd)
//   team1Footertr.appendChild(team1FooterrebTd)
//   team1Footertr.appendChild(team1FootertwopaTd)
//   team1Footertr.appendChild(team1FootertwopmTd)
//   team1Footertr.appendChild(team1FooterthreepaTd)
//   team1Footertr.appendChild(team1FooterthreepmTd)
//   team1PlayerTbody.appendChild(team1Footertr)

//   const team2Footertr = document.createElement('tr')
//   const team2FooternumberTd = document.createElement('td')
//   const team2FooternameTd = document.createElement('td')
//   const team2FooterptsTd = document.createElement('td')
//   const team2FooterastTd = document.createElement('td')
//   const team2FooterrebTd = document.createElement('td')
//   const team2FootertwopaTd = document.createElement('td')
//   const team2FootertwopmTd = document.createElement('td')
//   const team2FooterthreepaTd = document.createElement('td')
//   const team2FooterthreepmTd = document.createElement('td')

//   team2FooterptsTd.style.textAlign = 'right'
//   team2FooterastTd.style.textAlign = 'right'
//   team2FooterrebTd.style.textAlign = 'right'

//   team2FooternumberTd.style.fontWeight = 'bold'
//   team2FooterptsTd.style.fontWeight = 'bold'
//   team2FooterastTd.style.fontWeight = 'bold'
//   team2FooterrebTd.style.fontWeight = 'bold'

//   team2FooternumberTd.textContent = 'Total'

//   team2FooterptsTd.textContent = game_data.team2.players.reduce(
//     (total, player) => total + player.points,
//     0
//   )

//   team2FooterastTd.textContent = game_data.team2.players.reduce(
//     (total, player) => total + player.assists,
//     0
//   )

//   team2FooterrebTd.textContent = game_data.team2.players.reduce(
//     (total, player) => total + player.rebounds,
//     0
//   )

//   team2Footertr.appendChild(team2FooternumberTd)
//   team2Footertr.appendChild(team2FooternameTd)
//   team2Footertr.appendChild(team2FooterptsTd)
//   team2Footertr.appendChild(team2FooterastTd)
//   team2Footertr.appendChild(team2FooterrebTd)
//   team2Footertr.appendChild(team2FootertwopaTd)
//   team2Footertr.appendChild(team2FootertwopmTd)
//   team2Footertr.appendChild(team2FooterthreepaTd)
//   team2Footertr.appendChild(team2FooterthreepmTd)
//   team2PlayerTbody.appendChild(team2Footertr)
// }

// function randomWeightedNumber(maxNumber = 50) {
//   // Adjust the exponent to control the distribution
//   const exponent = 2

//   // Calculate the weighted random number
//   return Math.floor(Math.pow(Math.random(), exponent) * maxNumber) + 1
// }

// function randomUniqueNumber(currentNums: number[], maxNumber = 99) {
//   let randomNumber = faker.number.int(maxNumber)
//   while (currentNums.includes(randomNumber)) {
//     randomNumber = faker.number.int(maxNumber)
//   }
//   return randomNumber
// }

// function renderTeamsTable(teams: Team[]) {
//   const teamsTbody = document.getElementById('teams-table-tbody') as HTMLTableElement

//   while (teamsTbody.firstChild) {
//     teamsTbody.removeChild(teamsTbody.firstChild)
//   }
//   for (let index = 0; index < teams.length; index++) {
//     const team = teams[index]
//     const teamRow = document.createElement('tr')
//     const teamName = document.createElement('td')
//     teamName.textContent = team.name
//     const teamAbbvr = document.createElement('td')
//     teamAbbvr.textContent = team.abbvr
//     const teamPlayers = document.createElement('td')
//     teamPlayers.textContent = team.players.length.toString()
//     teamRow.appendChild(teamName)
//     teamRow.appendChild(teamAbbvr)
//     teamRow.appendChild(teamPlayers)
//     teamsTbody.appendChild(teamRow)
//   }
// }

// function renderTeamsSelectOptions(teams: Team[]) {
//   const newPlayerTeamSelect = document.getElementById('player-team-id') as HTMLSelectElement

//   while (newPlayerTeamSelect.firstChild) {
//     newPlayerTeamSelect.removeChild(newPlayerTeamSelect.firstChild)
//   }
//   for (let index = 0; index < teams.length; index++) {
//     const team = teams[index]
//     const option = document.createElement('option')
//     option.value = team.key
//     option.textContent = team.name
//     newPlayerTeamSelect.appendChild(option)
//   }
// }

// main()

