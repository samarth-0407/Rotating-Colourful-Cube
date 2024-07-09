// ----------------------------------------------------
// Shaders
// ----------------------------------------------------
function compileShader(gl, shaderTxt, shaderType) {
  // Compile Shader
  // ----------------------------------------------------
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderTxt)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error({
      shaderCompileError: {
	src: shaderTxt,
	glInfoLog: gl.getShaderInfoLog(shader)
      }
    })

    gl.deleteShader(shader)
  }

  return shader
}

function linkShaders(gl, vShader, fShader, doValidate) {
  // Link all the Shaders together
  // ----------------------------------------------------

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram,vShader)
  gl.attachShader(shaderProgram,fShader)
  gl.linkProgram(shaderProgram)

  //Check if successful
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
    console.error({
      shaderLinkingError: {
	glInfoLog: gl.getProgramInfoLog(shaderProgram)
      }
    })
    gl.deleteProgram(shaderProgram)
  }

  //Only do this for additional debugging.
  if (doValidate) {
    gl.validateProgram(shaderProgram)
    if(!gl.getProgramParameter(shaderProgram,gl.VALIDATE_STATUS)){
      console.error({
	shaderValidationError: {
	  glInfoLog: gl.getProgramInfoLog(shaderProgram)
	}
      })
      gl.deleteProgram(shaderProgram)
    }
  }

  // Can delete the shaders since the program has been
  // made.
  // ----------------------------------------------------
  // TODO, detaching might cause issues on some browsers,
  // Might only need to delete.
  gl.detachShader(shaderProgram,vShader);
  gl.detachShader(shaderProgram,fShader);
  gl.deleteShader(fShader);
  gl.deleteShader(vShader);

  // ----------------------------------------------------

  return shaderProgram
}
