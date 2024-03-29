type Player = {
  name: string
  number: number
}
const players = [
  {
    name: 'Andrew',
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
    name: 'Jon',
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

export async function initialiseCanvas() {
  const addShotDialog = document.querySelector('#add-shot-dialog') as HTMLDialogElement
  const addShotForm = document.querySelector('#add-shot-form') as HTMLFormElement
  const showDebugLines = document.querySelector('#showCanvasDebugLines') as HTMLInputElement
  const showHotZoneLines = document.querySelector('#showHotZoneLines') as HTMLInputElement
  const playersDiv = document.querySelector('#players') as HTMLDivElement
  const statsTableTbody = document.querySelector('#stats-table-tbody') as HTMLTableSectionElement
  const statsTableFooter = document.querySelector('#stats-table-tfoot') as HTMLTableSectionElement

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
  canvas.width = 438

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
    if (showHotZoneLines.checked) {
      //hot zones lines
      //left corner 3
      ctx.font = '16px monospace'
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.moveTo(0, 90)
      ctx.lineTo(34, 90)
      ctx.stroke()
      ctx.closePath()

      const leftCorner3Shots = shotsToDisplay.filter((shot) =>
        isLeftCornerThreePointer(shot.x, shot.y)
      )
      const leftCorner3Made = leftCorner3Shots.filter((shot) => shot.made).length
      const leftCorner3Attempted = leftCorner3Shots.length
      const leftCorner3Percentage = ((leftCorner3Made / leftCorner3Attempted) * 100 || 0).toFixed(0)

      ctx.save()
      ctx.translate(25, 50)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(`${leftCorner3Percentage}%`, 0, 0)
      ctx.restore()

      //right corner 3
      ctx.beginPath()
      ctx.moveTo(405, 88)
      ctx.lineTo(canvas.width, 88)
      ctx.stroke()
      ctx.closePath()

      const rightCorner3Shots = shotsToDisplay.filter((shot) =>
        isRightCornerThreePointer(shot.x, shot.y)
      )
      const rightCorner3Made = rightCorner3Shots.filter((shot) => shot.made).length
      const rightCorner3Attempted = rightCorner3Shots.length
      const rightCorner3Percentage = (
        (rightCorner3Made / rightCorner3Attempted) * 100 || 0
      ).toFixed(0)

      ctx.save()
      ctx.translate(415, 30)
      ctx.rotate(Math.PI / 2)
      ctx.fillText(`${rightCorner3Percentage}%`, 0, 0)
      ctx.restore()

      //bottom left 2 pointer
      ctx.beginPath()
      ctx.moveTo(32, 50)
      ctx.lineTo(405, 50)
      ctx.stroke()
      ctx.closePath()

      const bottomLeft2PointerShots = shotsToDisplay.filter(
        (shot) => shot.x > 34 && shot.x < 150 && shot.y < 50
      )
      const bottomLeft2PointersMade = bottomLeft2PointerShots.filter((shot) => shot.made).length
      const bottomLeft2PointersAttempted = bottomLeft2PointerShots.length
      const bottomLeft2PointersPercentage = (
        (bottomLeft2PointersMade / bottomLeft2PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${bottomLeft2PointersPercentage}%`, 80, 30)

      //bottom right 2 pointer
      const bottomRight2PointerShots = shotsToDisplay.filter(
        (shot) => shot.x > 287 && shot.x < 405 && shot.y < 50
      )
      const bottomRight2PointersMade = bottomRight2PointerShots.filter((shot) => shot.made).length
      const bottomRight2PointersAttempted = bottomRight2PointerShots.length
      const bottomRight2PointersPercentage = (
        (bottomRight2PointersMade / bottomRight2PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${bottomRight2PointersPercentage}%`, 340, 30)

      //bottom left key 2 pointer
      const bottomLeftKey2PointerShots = shotsToDisplay.filter(
        (shot) => shot.x > 150 && shot.x < 219 && shot.y < 50
      )
      const bottomLeftKey2PointersMade = bottomLeftKey2PointerShots.filter(
        (shot) => shot.made
      ).length
      const bottomLeftKey2PointersAttempted = bottomLeftKey2PointerShots.length
      const bottomLeftKey2PointersPercentage = (
        (bottomLeftKey2PointersMade / bottomLeftKey2PointersAttempted) * 100 || 0
      ).toFixed(0)
      ctx.fillText(`${bottomLeftKey2PointersPercentage}%`, 175, 30)

      //bottom right key 2 pointer
      const bottomRightKey2PointerShots = shotsToDisplay.filter(
        (shot) => shot.x > 218 && shot.x < 287 && shot.y < 50
      )
      const bottomRightKey2PointersMade = bottomRightKey2PointerShots.filter(
        (shot) => shot.made
      ).length
      const bottomRightKey2PointersAttempted = bottomRightKey2PointerShots.length
      const bottomRightKey2PointersPercentage = (
        (bottomRightKey2PointersMade / bottomRightKey2PointersAttempted) * 100 || 0
      ).toFixed(0)
      ctx.fillText(`${bottomRightKey2PointersPercentage}%`, 245, 30)

      //middle left key 2 pointer
      const middleLeftKey2PointerShots = shotsToDisplay.filter(
        (shot) => shot.x > 150 && shot.x < 219 && shot.y >= 50 && shot.y < 165
      )
      const middleLeftKey2PointersMade = middleLeftKey2PointerShots.filter(
        (shot) => shot.made
      ).length
      const middleLeftKey2PointersAttempted = middleLeftKey2PointerShots.length
      const middleLeftKey2PointersPercentage = (
        (middleLeftKey2PointersMade / middleLeftKey2PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${middleLeftKey2PointersPercentage}%`, 175, 110)

      //middle right key 2 pointer
      const middleRightKey2PointerShots = shotsToDisplay.filter(
        (shot) => shot.x > 218 && shot.x < 287 && shot.y >= 50 && shot.y < 165
      )
      const middleRightKey2PointersMade = middleRightKey2PointerShots.filter(
        (shot) => shot.made
      ).length
      const middleRightKey2PointersAttempted = middleRightKey2PointerShots.length
      const middleRightKey2PointersPercentage = (
        (middleRightKey2PointersMade / middleRightKey2PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${middleRightKey2PointersPercentage}%`, 245, 110)

      //left wing curved 2 pointer area
      const leftWing2PointerShots = shotsToDisplay.filter(
        (shot) => !isThreePointer(shot.x, shot.y) && shot.x < 150 && shot.y > 50
      )
      const leftWing2PointersMade = leftWing2PointerShots.filter((shot) => shot.made).length
      const leftWing2PointersAttempted = leftWing2PointerShots.length
      const leftWing2PointersPercentage = (
        (leftWing2PointersMade / leftWing2PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${leftWing2PointersPercentage}%`, 80, 110)

      //right wing curved 2 pointer area
      const rightWing2PointerShots = shotsToDisplay.filter(
        (shot) => !isThreePointer(shot.x, shot.y) && shot.x > 287 && shot.y > 50
      )
      const rightWing2PointersMade = rightWing2PointerShots.filter((shot) => shot.made).length
      const rightWing2PointersAttempted = rightWing2PointerShots.length
      const rightWing2PointersPercentage = (
        (rightWing2PointersMade / rightWing2PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${rightWing2PointersPercentage}%`, 340, 110)

      //top key curved 2 pointer area
      const topKey2PointerShots = shotsToDisplay.filter(
        (shot) => !isThreePointer(shot.x, shot.y) && shot.x >= 150 && shot.x <= 287 && shot.y >= 166
      )
      const topKey2PointersMade = topKey2PointerShots.filter((shot) => shot.made).length
      const topKey2PointersAttempted = topKey2PointerShots.length
      const topKey2PointersPercentage = (
        (topKey2PointersMade / topKey2PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${topKey2PointersPercentage}%`, 210, 200)

      //left 3 pointer area
      const left3PointerShots = shotsToDisplay.filter(
        (shot) =>
          isThreePointer(shot.x, shot.y) &&
          !isLeftCornerThreePointer(shot.x, shot.y) &&
          shot.x < 150
      )
      const left3PointersMade = left3PointerShots.filter((shot) => shot.made).length
      const left3PointersAttempted = left3PointerShots.length
      const left3PointersPercentage = (
        (left3PointersMade / left3PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${left3PointersPercentage}%`, 60, 270)
      //middle 3 pointer area
      const middle3PointerShots = shotsToDisplay.filter(
        (shot) => isThreePointer(shot.x, shot.y) && shot.x >= 150 && shot.x <= 287
      )
      const middle3PointersMade = middle3PointerShots.filter((shot) => shot.made).length
      const middle3PointersAttempted = middle3PointerShots.length
      const middle3PointersPercentage = (
        (middle3PointersMade / middle3PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${middle3PointersPercentage}%`, 210, 270)

      //right 3 pointer area
      const right3PointerShots = shotsToDisplay.filter(
        (shot) =>
          isThreePointer(shot.x, shot.y) &&
          !isRightCornerThreePointer(shot.x, shot.y) &&
          shot.x > 287
      )
      const right3PointersMade = right3PointerShots.filter((shot) => shot.made).length
      const right3PointersAttempted = right3PointerShots.length
      const right3PointersPercentage = (
        (right3PointersMade / right3PointersAttempted) * 100 || 0
      ).toFixed(0)

      ctx.fillText(`${right3PointersPercentage}%`, 360, 270)

      ctx.beginPath()
      ctx.moveTo(219, 0)
      ctx.lineTo(219, 165)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.moveTo(150, 164)
      ctx.lineTo(150, 400)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.moveTo(287, 164)
      ctx.lineTo(287, 400)
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
      const threePointer = isThreePointer(x, y)

      if (!showDebugLines.checked) return
      coordsSpan.textContent = `x: ${e.offsetX}, y: ${e.offsetY}, distance: ${distanceFixed}, isThreePointer: ${threePointer}`
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
    if (isLeftCornerThreePointer(x, y)) {
      return true
    }
    if (isRightCornerThreePointer(x, y)) {
      return true
    }

    const distance = threePointerDistance(x, y)

    if (distance >= DISTANCE_TO_BASKET) {
      return true
    }
    return false
  }

  function isLeftCornerThreePointer(x: number, y: number): boolean {
    return x < 34 && y < 90
  }

  function isRightCornerThreePointer(x: number, y: number): boolean {
    return x > 405 && y < 90
  }

  function threePointerDistance(x: number, y: number) {
    const triangleHeight = Math.abs(y - 42)
    const triangleWidth = Math.abs(x - 220)
    const calculation = Math.pow(triangleHeight, 2) + Math.pow(triangleWidth, 2)
    return Math.sqrt(calculation)
  }

  function drawTable(players: Player[]) {
    while (statsTableTbody.firstChild) {
      statsTableTbody.firstChild.removeEventListener('mouseover', () => {})
      statsTableTbody.firstChild.removeEventListener('mouseout', () => {})
      statsTableTbody.removeChild(statsTableTbody.firstChild)
    }

    while (statsTableFooter.firstChild) {
      statsTableFooter.removeChild(statsTableFooter.firstChild)
    }

    let teamPointsTotal = 0
    let teamTwoPointersAttemptedTotal = 0
    let teamTwoPointersMadeTotal = 0
    let teamThreePointersAttemptedTotal = 0
    let teamThreePointersMadeTotal = 0

    for (let index = 0; index < players.length; index++) {
      const player = players[index]

      //add an event listeners for hovering on the row, this will only show all shots of the current hovered player
      const row = document.createElement('tr')
      row.addEventListener('mouseover', (e) => {
        highlightedPlayer = player.number
        row.classList.add('!bg-gray-600', 'text-white')
      })
      row.addEventListener('mouseout', (e) => {
        highlightedPlayer = undefined
        row.classList.remove('!bg-gray-600', 'text-white')
      })
      const nameCell = document.createElement('td')
      const pointsCell = document.createElement('td')

      const twoPointersAttemptedCell = document.createElement('td')
      const twoPointersMadeCell = document.createElement('td')
      const twoPointersPercentage = document.createElement('td')

      const threePointersAttemptedCell = document.createElement('td')
      const threePointersMadeCell = document.createElement('td')
      const threePointersPercentage = document.createElement('td')

      const fieldGoalsAttemptedCell = document.createElement('td')
      const fieldGoalsMadeCell = document.createElement('td')
      const fieldGoalsPercentageCell = document.createElement('td')

      nameCell.classList.add('text-left')

      row.appendChild(nameCell)
      row.appendChild(pointsCell)
      row.appendChild(twoPointersMadeCell)
      row.appendChild(twoPointersAttemptedCell)
      row.appendChild(twoPointersPercentage)
      row.appendChild(threePointersMadeCell)
      row.appendChild(threePointersAttemptedCell)
      row.appendChild(threePointersPercentage)
      row.appendChild(fieldGoalsMadeCell)
      row.appendChild(fieldGoalsAttemptedCell)
      row.appendChild(fieldGoalsPercentageCell)

      const playersShots = shots.filter((p) => p.playerNumber === player.number)
      const playerTwoPointersAttempted = playersShots.filter((s) => !isThreePointer(s.x, s.y))
      const playerTwoPointersMade = playersShots.filter((s) => !isThreePointer(s.x, s.y) && s.made)
      const playerThreePointersAttempted = playersShots.filter((s) => isThreePointer(s.x, s.y))
      const playerThreePointersMade = playersShots.filter((s) => isThreePointer(s.x, s.y) && s.made)
      const playerTwoPointPercentage =
        (playerTwoPointersMade.length / playerTwoPointersAttempted.length) * 100 || 0
      const playerThreePointPercentage =
        (playerThreePointersMade.length / playerThreePointersAttempted.length) * 100 || 0

      nameCell.textContent = player.name
      twoPointersAttemptedCell.textContent = playerTwoPointersAttempted.length.toString()
      twoPointersMadeCell.textContent = playerTwoPointersMade.length.toString()
      threePointersAttemptedCell.textContent = playerThreePointersAttempted.length.toString()
      threePointersMadeCell.textContent = playerThreePointersMade.length.toString()
      twoPointersPercentage.textContent = `${playerTwoPointPercentage.toFixed(0)}%`
      threePointersPercentage.textContent = `${playerThreePointPercentage.toFixed(0)}%`
      const twoPointersPoints = playerTwoPointersMade.length * 2
      const threePointersPoints = playerThreePointersMade.length * 3
      pointsCell.textContent = (threePointersPoints + twoPointersPoints).toString()

      const fieldGoalsAttempted =
        playerTwoPointersAttempted.length + playerThreePointersAttempted.length
      const fieldGoalsMade = playerTwoPointersMade.length + playerThreePointersMade.length
      const fieldGoalsPercentage = (fieldGoalsMade / fieldGoalsAttempted) * 100 || 0

      fieldGoalsAttemptedCell.textContent = fieldGoalsAttempted.toString()
      fieldGoalsMadeCell.textContent = fieldGoalsMade.toString()
      fieldGoalsPercentageCell.textContent = `${fieldGoalsPercentage.toFixed(0)}%`

      teamPointsTotal += threePointersPoints + twoPointersPoints
      teamTwoPointersAttemptedTotal += playerTwoPointersAttempted.length
      teamTwoPointersMadeTotal += playerTwoPointersMade.length
      teamThreePointersAttemptedTotal += playerThreePointersAttempted.length
      teamThreePointersMadeTotal += playerThreePointersMade.length

      statsTableTbody.appendChild(row)
    }

    const row = document.createElement('tr')
    const teamNameCell = document.createElement('td')
    const teamPointsCell = document.createElement('td')

    const teamTwoPointersAttemptedCell = document.createElement('td')
    const teamTwoPointersMadeCell = document.createElement('td')
    const teamTwoPointersPercentage = document.createElement('td')

    const teamThreePointersAttemptedCell = document.createElement('td')
    const teamThreePointersMadeCell = document.createElement('td')
    const teamThreePointersPercentage = document.createElement('td')

    const teamFieldGoalsAttemptedCell = document.createElement('td')
    const teamFieldGoalsMadeCell = document.createElement('td')
    const teamFieldGoalsPercentageCell = document.createElement('td')

    row.appendChild(teamNameCell)
    row.appendChild(teamPointsCell)
    row.appendChild(teamTwoPointersMadeCell)
    row.appendChild(teamTwoPointersAttemptedCell)
    row.appendChild(teamTwoPointersPercentage)
    row.appendChild(teamThreePointersMadeCell)
    row.appendChild(teamThreePointersAttemptedCell)
    row.appendChild(teamThreePointersPercentage)
    row.appendChild(teamFieldGoalsMadeCell)
    row.appendChild(teamFieldGoalsAttemptedCell)
    row.appendChild(teamFieldGoalsPercentageCell)

    teamPointsCell.textContent = teamPointsTotal.toString()
    teamNameCell.textContent = 'Total'
    teamNameCell.classList.add('text-left')
    teamTwoPointersAttemptedCell.textContent = teamTwoPointersAttemptedTotal.toString()
    teamTwoPointersMadeCell.textContent = teamTwoPointersMadeTotal.toString()
    teamThreePointersAttemptedCell.textContent = teamThreePointersAttemptedTotal.toString()
    teamThreePointersMadeCell.textContent = teamThreePointersMadeTotal.toString()

    const teamTwoPointPercentage =
      (teamTwoPointersMadeTotal / teamTwoPointersAttemptedTotal) * 100 || 0
    const teamThreePointPercentage =
      (teamThreePointersMadeTotal / teamThreePointersAttemptedTotal) * 100 || 0
    teamTwoPointersPercentage.textContent = `${teamTwoPointPercentage.toFixed(0)}%`
    teamThreePointersPercentage.textContent = `${teamThreePointPercentage.toFixed(0)}%`

    const teamFieldGoalsAttempted = teamTwoPointersAttemptedTotal + teamThreePointersAttemptedTotal
    const teamFieldGoalsMade = teamTwoPointersMadeTotal + teamThreePointersMadeTotal
    const teamFieldGoalsPercentage = (teamFieldGoalsMade / teamFieldGoalsAttempted) * 100 || 0
    teamFieldGoalsAttemptedCell.textContent = teamFieldGoalsAttempted.toString()
    teamFieldGoalsMadeCell.textContent = teamFieldGoalsMade.toString()
    teamFieldGoalsPercentageCell.textContent = `${teamFieldGoalsPercentage.toFixed(0)}%`

    statsTableFooter.appendChild(row)
  }

  window.requestAnimationFrame(draw)
  registerEventListerners()

  const saveBtn = document.getElementById('save-btn') as HTMLButtonElement
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persisted()
    console.log(`Persisted storage granted: ${isPersisted}`)
  }

  saveBtn.addEventListener('click', async () => {
    const isPersisted = await navigator.storage.persist()
    console.log(`Persisted storage granted: ${isPersisted}`)
  })
}

