import { th } from '@faker-js/faker'

document.body.style.backgroundColor = '#eeeeee'

type Player = {
  name: string
  number: number
}
const players = [
  {
    name: 'Sam Johnston',
    number: 0,
  },
  {
    name: 'Simon Wilkinson',
    number: 3,
  },
  {
    name: 'Gab Hunter',
    number: 6,
  },
  {
    name: 'Jon Pillow',
    number: 9,
  },
]

type Shot = {
  made: boolean
  x: number
  y: number
  player: string
  playerNumber: number
}
const shots: Shot[] = []

const addShotDialog = document.querySelector('#add-shot-dialog') as HTMLDialogElement
const addShotForm = document.querySelector('#add-shot-form') as HTMLFormElement
const showDebugLines = document.querySelector('#showCanvasDebugLines') as HTMLInputElement
const playersDiv = document.querySelector('#players') as HTMLDivElement
const statsTable = document.querySelector('#stats-tbody') as HTMLTableElement

for (let index = 0; index < players.length; index++) {
  const player = players[index]

  //add player button to dialog
  const playerButton = document.createElement('button')
  playerButton.style.textAlign = 'center'
  playerButton.style.display = 'flex'
  playerButton.style.flexDirection = 'column'
  playerButton.style.alignItems = 'center'

  const span = document.createElement('span')
  span.textContent = player.name
  const numberSpan = document.createElement('span')
  numberSpan.textContent = player.number.toString()
  playerButton.appendChild(span)
  playerButton.appendChild(numberSpan)
  playerButton.setAttribute('value', player.number.toString())
  playerButton.setAttribute('name', 'playerChoosen')
  playersDiv.appendChild(playerButton)
}

drawTable(players)

const coordsSpan = document.createElement('span')
coordsSpan.style.display = 'block'
coordsSpan.style.color = 'black'
coordsSpan.style.minHeight = '1.5rem'
coordsSpan.textContent = ''
document.body.appendChild(coordsSpan)

const canvas = document.getElementById('court-canvas') as HTMLCanvasElement
canvas.style.backgroundColor = 'white'

const ctx = canvas.getContext('2d')
const hoverState = {
  x: undefined,
  y: undefined,
}

let highlightedPlayer: number | undefined

const DISTANCE_TO_BASKET = 197

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const threePtLine = new Path2D(
    'M406.22 86.46L404.81 86.36H404.8C402.33 97.88 398.76 109.15 394.13 120.1C384.57 142.73 370.87 163.06 353.43 180.52C335.99 197.97 315.68 211.68 293.07 221.25C269.66 231.16 244.79 236.18 219.16 236.18C193.52 236.18 168.65 231.16 145.24 221.25C122.63 211.67 102.32 197.97 84.8801 180.52C67.4401 163.06 53.7501 142.73 44.1801 120.1C39.5701 109.19 36.0201 97.97 33.5501 86.5H33.5401L32.1301 86.59C50.6901 172.91 127.37 237.61 219.16 237.61C310.98 237.6 387.71 172.84 406.22 86.46Z'
  )
  const threePtSideLineLeft = new Path2D('M33.5401 1.42H32.1201V86.6H33.5401V1.42Z')
  const threePtSideLineRight = new Path2D('M406.22 1.42H404.8V86.46H406.22V1.42Z')
  const paintBox = new Path2D(
    'M287.18 1.42V164.55H151.12V1.42H287.18ZM149.71 0V165.97H288.6V0H149.71Z'
  )
  const paintBoxTopKeyCircle = new Path2D(
    'M270.16 165.97H268.75C268.38 193.02 246.27 214.91 219.15 214.91C192.03 214.91 169.92 193.02 169.55 165.97H168.14C168.51 193.84 191.2 216.33 219.15 216.33C247.1 216.33 269.79 193.84 270.16 165.97Z'
  )
  const restrictedZoneCircle = new Path2D(
    'M255.99 46.1H254.57C254.2 65.33 238.46 80.86 219.15 80.86C199.84 80.86 184.1 65.33 183.73 46.1H182.31C182.68 66.15 199.03 82.28 219.15 82.28C239.27 82.28 255.62 66.15 255.99 46.1Z'
  )
  const restrictedZoneCircleLeft = new Path2D('M183.73 35.47H182.31V46.11H183.73V35.47Z')
  const restrictedZoneCircleRight = new Path2D('M255.99 35.47H254.57V46.11H255.99V35.47Z')
  const backboardLine = new Path2D('M186 32.47 H253Z')

  ctx.stroke(threePtLine)
  ctx.stroke(threePtSideLineLeft)
  ctx.stroke(threePtSideLineRight)
  ctx.stroke(paintBox)
  ctx.stroke(paintBoxTopKeyCircle)
  ctx.stroke(restrictedZoneCircle)
  ctx.stroke(restrictedZoneCircleLeft)
  ctx.stroke(restrictedZoneCircleRight)
  ctx.stroke(backboardLine)

  //draw basket rim
  ctx.beginPath()
  ctx.arc(220, 42, 7, 0, Math.PI * 2, false)
  ctx.stroke()
  ctx.closePath()

  //draw basket center
  ctx.beginPath()
  ctx.arc(220, 42, 2, 0, Math.PI * 2, false)
  ctx.fillStyle = '#000000'
  ctx.fill()
  ctx.closePath()

  const shotsToDisplay =
    highlightedPlayer !== undefined
      ? shots.filter((shot) => shot.playerNumber === highlightedPlayer)
      : shots

  for (let index = 0; index < shotsToDisplay.length; index++) {
    const shot = shotsToDisplay[index]
    const height = 10
    const width = 10
    const rectX = shot.x - height / 2
    const rectY = shot.y - width / 2
    // const isThree = isThreePointer(shot.x, shot.y)
    ctx.fillStyle = shot.made ? '#00ff00' : '#ff0000'
    ctx.fillRect(rectX, rectY, height, width)
  }

  if (showDebugLines.checked && hoverState.x !== undefined && hoverState.y !== undefined) {
    //line to basket
    ctx.beginPath()
    ctx.moveTo(hoverState.x, hoverState.y)
    ctx.lineTo(220, 42)
    ctx.stroke()
    ctx.closePath()

    //draw triangle base
    ctx.beginPath()
    ctx.moveTo(hoverState.x, hoverState.y)
    ctx.lineTo(hoverState.x, 42)
    ctx.stroke()
    ctx.closePath()

    //draw triangle hypotenunse
    ctx.beginPath()
    ctx.moveTo(hoverState.x, 42)
    ctx.lineTo(220, 42)
    ctx.stroke()
    ctx.closePath()
  }
  window.requestAnimationFrame(draw)
}

function registerEventListerners() {
  canvas.addEventListener('mousemove', (e) => {
    const x = e.offsetX
    const y = e.offsetY

    hoverState.x = x
    hoverState.y = y

    const distance = threePointerDistance(x, y)
    const distanceFixed = distance.toFixed(2)

    if (!showDebugLines.checked) return
    coordsSpan.textContent = `x: ${e.offsetX}, y: ${e.offsetY}, distance: ${distanceFixed}, isThreePointer: ${distance >= DISTANCE_TO_BASKET}`
  })

  // canvas.addEventListener('mouseleave', (e) => {
  //   hoverState.x = undefined
  //   hoverState.y = undefined
  //   coordsSpan.textContent = ``
  // })

  canvas.addEventListener('click', (e) => {
    addShotDialog.showModal()
    // shots.push({
    //   made: true,
    //   x: e.offsetX,
    //   y: e.offsetY,
    // })
  })

  addShotForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(
      new FormData(addShotForm, addShotForm.querySelector('button:focus'))
    )

    const player = players.find((p) => p.number === Number(formData.playerChoosen))

    const shot: Shot = {
      made: formData.shotMade === 'true',
      x: Number(hoverState.x),
      y: Number(hoverState.y),
      player: player.name,
      playerNumber: player.number,
    }
    shots.push(shot)
    addShotForm.reset()
    drawTable(players)
    addShotDialog.close()
  })

  showDebugLines.addEventListener('change', (e) => {
    if (!showDebugLines.checked) coordsSpan.textContent = ''
    else coordsSpan.textContent = `x: ${hoverState.x}, y: ${hoverState.y}`
  })
}

function isThreePointer(x: number, y: number): boolean {
  if (x < 34 && y < 90) {
    return true
  }
  if (x > 405 && y < 90) {
    return true
  }

  const distance = threePointerDistance(x, y)

  if (distance >= DISTANCE_TO_BASKET) {
    return true
  }
  return false
}
function threePointerDistance(x: number, y: number) {
  const triangleHeight = Math.abs(y - 42)
  const triangleWidth = Math.abs(x - 220)
  const calculation = Math.pow(triangleHeight, 2) + Math.pow(triangleWidth, 2)
  return Math.sqrt(calculation)
}

function drawTable(players: Player[]) {
  while (statsTable.firstChild) {
    statsTable.firstChild.removeEventListener('mouseover', () => {})
    statsTable.firstChild.removeEventListener('mouseout', () => {})
    statsTable.removeChild(statsTable.firstChild)
  }

  for (let index = 0; index < players.length; index++) {
    const player = players[index]

    //add an event listeners for hovering on the row, this will only show all shots of the current hovered player
    const row = document.createElement('tr')
    row.addEventListener('mouseover', (e) => {
      highlightedPlayer = player.number
      row.style.backgroundColor = '#ffffff'
    })
    row.addEventListener('mouseout', (e) => {
      highlightedPlayer = undefined
      row.style.backgroundColor = 'initial'
    })
    const nameCell = document.createElement('td')
    nameCell.textContent = player.name
    const twoPointersAttemptedCell = document.createElement('td')
    const twoPointersMadeCell = document.createElement('td')
    const threePointersAttemptedCell = document.createElement('td')

    const threePointersMadeCell = document.createElement('td')
    threePointersMadeCell.textContent = '0'
    const pointsCell = document.createElement('td')
    pointsCell.textContent = '0'

    row.appendChild(pointsCell)
    row.appendChild(nameCell)
    row.appendChild(twoPointersAttemptedCell)
    row.appendChild(twoPointersMadeCell)
    row.appendChild(threePointersAttemptedCell)
    row.appendChild(threePointersMadeCell)

    const playersShots = shots.filter((p) => p.playerNumber === player.number)
    const playerTwoPointersAttempted = playersShots.filter((s) => !isThreePointer(s.x, s.y))
    const playerTwoPointersMade = playersShots.filter((s) => !isThreePointer(s.x, s.y) && s.made)
    const playerThreePointersAttempted = playersShots.filter((s) => isThreePointer(s.x, s.y))
    const playerThreePointersMade = playersShots.filter((s) => isThreePointer(s.x, s.y) && s.made)

    twoPointersAttemptedCell.textContent = playerTwoPointersAttempted.length.toString()
    twoPointersMadeCell.textContent = playerTwoPointersMade.length.toString()
    threePointersAttemptedCell.textContent = playerThreePointersAttempted.length.toString()
    threePointersMadeCell.textContent = playerThreePointersMade.length.toString()
    const twoPointersPoints = playerTwoPointersMade.reduce((acc, cur) => acc + 2, 0)
    const threePointersPoints = playerThreePointersMade.reduce((acc, cur) => acc + 3, 0)
    pointsCell.textContent = (threePointersPoints + twoPointersPoints).toString()

    statsTable.appendChild(row)
  }
}

window.requestAnimationFrame(draw)
registerEventListerners()

