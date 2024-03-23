export function initialiseCanvas() {
  const basketballCourtCanvas = document.getElementById('basketball-court') as HTMLCanvasElement

  const basketballCourtCtx = basketballCourtCanvas.getContext('2d')
  basketballCourtCanvas.style.border = '1px solid black'
  basketballCourtCanvas.height = 800
  basketballCourtCanvas.width = 900

  const fullCourtImage = new Image()
  fullCourtImage.src = '/public/full-court.svg'

  const halfCourtImage = new Image()
  halfCourtImage.src = '/public/half-court.svg'

  fullCourtImage.onload = function () {
    const scale = 1
    const x = 400
    const y = 0
    const rotation = 1.5707 //90º in radians

    // basketballCourtCtx.setTransform(scale, 0, 0, scale, x, y) // sets scale and origin
    // basketballCourtCtx.rotate(rotation)
    basketballCourtCtx.drawImage(fullCourtImage, 0, 0)
  }

  halfCourtImage.onload = function () {
    const scale = 1
    const x = 400
    const y = 0
    const rotation = 1.5707 //90º in radians

    // basketballCourtCtx.setTransform(scale, 0, 0, scale, x, y) // sets scale and origin
    // basketballCourtCtx.rotate(rotation)
    basketballCourtCtx.drawImage(halfCourtImage, 450, 0)
  }

  return { basketballCourtCanvas, basketballCourtCtx }
}

export function drawBasetballCanvas() {
  //clear body
  while (document.body.lastChild) {
    document.body.removeChild(document.body.firstChild)
  }

  document.body.style.backgroundColor = '#eeeeee'

  const coordsSpan = document.createElement('span')
  coordsSpan.style.display = 'block'
  coordsSpan.textContent = 'x: 0, y: 0'
  document.body.appendChild(coordsSpan)

  //create canvas element
  const canvas = document.createElement('canvas')
  canvas.style.backgroundColor = 'white'
  canvas.height = 400
  canvas.width = 500
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  const hoverState = {
    x: undefined,
    y: undefined,
  }

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

    //draw basket
    ctx.beginPath()
    ctx.arc(220, 42, 7, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.arc(220, 42, 2, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    // Start a new path
    ctx.moveTo(hoverState.x, hoverState.y)
    // Move the pen to (30, 50)
    ctx.lineTo(220, 42)
    // Draw a line to (150, 100)
    ctx.stroke()
    // Render the path
  }

  function registerEventListerners() {
    canvas.addEventListener('mousemove', (e) => {
      const x = e.offsetX
      const y = e.offsetY

      hoverState.x = x
      hoverState.y = y

      coordsSpan.textContent = `x: ${e.offsetX}, y: ${e.offsetY}`
    })

    canvas.addEventListener('click', (e) => {
      const height = 10
      const width = 10
      const rectX = e.offsetX - height / 2
      const rectY = e.offsetY - width / 2
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(rectX, rectY, height, width)
    })
  }

  function isThreePointer(x, y) {}

  window.requestAnimationFrame(draw)
  registerEventListerners()
  // ctx.beginPath();
  // ctx.arc(100,100,40,0, Math.PI, false);
  // ctx.closePath();
  // ctx.lineWidth = 5;
  // ctx.strokeStyle = '#000000';
  // ctx.stroke();

  // ctx.fillStyle = '#000000';
  // ctx.fillRect(57,80, 8, 20)
}

