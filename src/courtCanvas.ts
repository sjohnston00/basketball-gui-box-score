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

