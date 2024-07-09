// Switcher State
// ----------------------------------------------------
let visible = 'Canvas'	// or 'refimg'
let invisible = 'Refimg'
const canvasSel = '#myCanvas'
const refimgSel = '#refImg'
const sels = {
  Canvas: canvasSel,
  Refimg: refimgSel,
}
const icons = {
  Canvas: 'wallet',
  Refimg: 'image',
}
const saveFunctions = {
  Canvas : saveCanvas,
  Refimg : saveRefimg,
}

async function main() {

  const experiment = new Experiment()

  // Update Candidate Details
  updateCandidateDetails(Experiment)

  // // Set up refimg
  // setupRefimg()

  // // Set up canvas
  // flipVisible('Canvas')

  // --------------------------------------------------
  // Canvas Setup
  // --------------------------------------------------
  canvasSetup(canvasSel, 'webgl2')
  const {canvas, ctx:gl, bb}
	= getCanvas(canvasSel, 'webgl2', {
	  alpha: true,
    preserveDrawingBuffer: true,
  })

  console.log({canvas, gl, bb})

  // --------------------------------------------------
  // Start the experiment
  // --------------------------------------------------
  await experiment.setupPrograms(gl)
  // experiment.handleCamera()
  const expRafFn = (ts) => {
    experiment.loop(ts)
    window.requestAnimationFrame(expRafFn)
  }
  const expRaf = window.requestAnimationFrame(expRafFn)

  // const {
  //   shaderProgram,
  //   aPositionLoc,
  //   aColorRgbLoc,
  //   posVerts,
  //   colorVerts,
  //   vao,
  //   N,
  // } = await getReferenceTrianglesDrawSetup(gl)

  // gl.clearColor(0,0,0,0)
  // // Clear Buffers
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // drawReferenceTriangles(gl, {
  //   shaderProgram,
  //   aPositionLoc,
  //   aColorRgbLoc,
  //   posVerts,
  //   colorVerts,
  //   vao,
  //   N,
  // })
  // const N = 80
  // const data = {
  //   pos : getRandomTriangles(N, 6, [-1.5,1.5]),
  //   colors : getRandomColorsRgb(N,3),
  // }
  // console.log({data})

  // try {

  //   const {drawFn: drawReferenceTriangles}
  // 	  = await getReferenceTrianglesDraw(gl, data)

  //   gl.clearColor(0,0,0,0)
  //   // Clear Buffers
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  //   drawReferenceTriangles()

  // } catch (e) {
  //   console.error(e)
  // }

  // await RefTriangles2.bootstrap()
  // const refTriangles2 = new RefTriangles2(gl, {
  //   pos : [
  //     [0.5,   0.5, 1.0],
  //     [0.0,  -0.5, 1.0],
  //     [-0.5,  0.5, 1.0],
  //   ],
  //   colors : [
  //     [0.8,0.1,0.05],
  //     [0.8,0.1,0.05],
  //     [0.8,0.1,0.05],
  //   ]
  // })


  // try {

  //   const refTriangles2 = new RefTriangles2(gl, data)

  //   gl.clearColor(0,0,0,0)
  //   // Clear Buffers
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  //   refTriangles2.draw()
  // } catch (e) {
  //   console.error(e)
  // }
}

function updateCandidateDetails({rollNo,name}) {
  let isValidRollNo, isValidName
  isValidRollNo = (isValidName = false)

  // Validate RollNo
  rollNo = Number(rollNo)
  isValidRollNo = !isNaN(rollNo) && 9999999 < rollNo
  if (!isValidRollNo) {
    console.warn({invalidRollNo: rollNo})
  }

  // Validate Name
  const titleCasePat = /^[A-Z][a-z]+( [A-Z][a-z]+)*$/
  name = String(name).trim()
  isValidName = titleCasePat.test(name)
  if (!isValidName) {
    console.warn({invalidName: name})
  }
  
  if (isValidRollNo && isValidName) {
    document.querySelector('#by')
      .textContent = `By: ${name} (${rollNo})`
  }
}

function saveCanvas() {
  const link = document.createElement('a');
  const {canvas, ctx, bb} = getCanvas(canvasSel, 'webgl2')
  link.download = `${rollNo}-${slug(document.title)}-canvas.png`;
  link.href = canvas.toDataURL()
  link.click();  
}

function saveRefimg() {
  console.warn({saveRefimg: 'Not Implemented.'})
}

function saveVisible() {
  return saveFunctions[visible]()
}

function flipVisible(name) {
  if (name != visible) {
    // Swap
    [visible, invisible] = [invisible, visible]
  }

  document.querySelector(sels[visible])
    .classList.remove('hidden')
  document.querySelector(sels[invisible])
    .classList.add('hidden')

  document.querySelector('#switchButtonIcon')
    .name = icons[invisible]
  document.querySelector('#switchButtonText')
    .textContent = `Show ${invisible}`
}

function setupRefimg() {
  document.querySelector(refimgSel)
    .src = `./assets/${rollNo}-${slug(document.title)}-refimg.png`
}
