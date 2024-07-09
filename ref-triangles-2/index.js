class RefTriangles2 {
  #gl = null; // Private WebGL context
  #inputs = null; // Private inputs object

  vao; // Vertex Array Object
  buffers; // Object to store WebGL buffers
  shader; // Object to store shader program information
  N; // Number of vertices

  static vShaderTxt = `
    attribute vec4 aPosition;
    attribute vec4 aColorRgb;
    varying vec4 vColorRgb;
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main(void) {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
      vColorRgb = aColorRgb;
    }
  `;

  static fShaderTxt = `
    precision mediump float;
    varying vec4 vColorRgb;

    void main(void) {
      gl_FragColor = vColorRgb;
    }
  `;

  constructor(gl, { pos, colors }) {
    this.#gl = gl; // Store WebGL context locally

    if (pos.length !== colors.length) {
      throw new TypeError({
        pos: pos.length,
        required: 'equal',
        colors: colors.length,
      });
    }

    this.N = pos.length / 3; // Determine number of vertices (each vertex has 3 components)

    this.setupShaders(); // Initialize shaders
    this.setupBuffers({ pos, colors }); // Initialize WebGL buffers
    this.setupVao(); // Initialize Vertex Array Object (VAO)
  }

  // Compile vertex and fragment shaders, link them into a shader program
  setupShaders() {
    const gl = this.#gl;
    const { vShaderTxt, fShaderTxt } = this.constructor; // Retrieve shader source codes

    console.log('VERTEX_SHADER');
    console.log(vShaderTxt);
    console.log('FRAGMENT_SHADER');
    console.log(fShaderTxt);

    // Compile vertex shader
    const vShader = this.compileShader(gl, vShaderTxt, gl.VERTEX_SHADER);
    // Compile fragment shader
    const fShader = this.compileShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
    // Link shaders into a shader program
    const shaderProgram = this.linkShaders(gl, vShader, fShader, true);

    // Use the shader program
    gl.useProgram(shaderProgram);

    // Retrieve attribute and uniform locations from the shader program
    const aPositionLoc = gl.getAttribLocation(shaderProgram, 'aPosition');
    const aColorRgbLoc = gl.getAttribLocation(shaderProgram, 'aColorRgb');
    const uModelMatrixLoc = gl.getUniformLocation(shaderProgram, 'uModelMatrix');
    const uViewMatrixLoc = gl.getUniformLocation(shaderProgram, 'uViewMatrix');
    const uProjectionMatrixLoc = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

    // Stop using the shader program
    gl.useProgram(null);

    // Store shader program information in this.shader
    this.shader = {
      program: shaderProgram,
      attributes: {
        aPosition: aPositionLoc,
        aColorRgb: aColorRgbLoc,
      },
      uniforms: {
        uModelMatrix: uModelMatrixLoc,
        uViewMatrix: uViewMatrixLoc,
        uProjectionMatrix: uProjectionMatrixLoc,
      },
    };
  }

  // Compile a shader of given type with provided source code
  compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check if shader compilation was successful
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`ERROR compiling shader!`, gl.getShaderInfoLog(shader));
      gl.deleteShader(shader); // Clean up shader if compilation failed
      return null;
    }

    return shader; // Return compiled shader
  }

  // Link vertex and fragment shaders into a shader program
  linkShaders(gl, vShader, fShader, deleteShaders = false) {
    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    // Check if shader program linking was successful
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('ERROR linking program!', gl.getProgramInfoLog(program));
      gl.deleteProgram(program); // Clean up program if linking failed
      return null;
    }

    // Delete shaders if specified
    if (deleteShaders) {
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
    }

    return program; // Return linked shader program
  }

  // Set up WebGL buffers for position and color data
  setupBuffers({ pos, colors }) {
    const gl = this.#gl;

    pos = pos.flat(); // Flatten position data
    colors = colors.flat(); // Flatten color data

    console.log('Position Data:', pos);
    console.log('Color Data:', colors);

    // Create buffer for position data
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

    // Create buffer for color data
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    console.log('Position Buffer Size:', gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
    console.log('Color Buffer Size:', gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));

    // Store buffers in this.buffers
    this.buffers = {
      pos: posBuffer,
      colors: colorBuffer,
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer
  }

  // Set up Vertex Array Object (VAO) to hold vertex attribute configurations
  setupVao() {
    const gl = this.#gl;

    const { program, attributes: { aPosition, aColorRgb } } = this.shader; // Retrieve shader program and attribute locations
    const { pos, colors } = this.buffers; // Retrieve buffers for position and color data

    // Create and bind a new Vertex Array Object (VAO)
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Configure position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Configure color attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, colors);
    gl.vertexAttribPointer(aColorRgb, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColorRgb);

    // Unbind VAO and buffers
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Store VAO in this.vao
    this.vao = vao;
  }

  draw(ms, inputs) {
    // Initialize WebGL context and necessary variables
    const gl = this.#gl;
    const N = this.N;
    const vao = this.vao;

    // Retrieve shader program and uniform locations from this.shader
    const {
      program,
      uniforms: {
        uModelMatrix, uViewMatrix, uProjectionMatrix
      }
    } = this.shader;

    // Create view matrix based on user inputs
    const viewMatrix = mat4.create();
    if (inputs.isCamTranslate) {
      mat4.translate(viewMatrix, viewMatrix, [inputs.x, inputs.y, inputs.z]); // Translate the view matrix
    }
    if (inputs.isCamRotate) {
      mat4.rotateX(viewMatrix, viewMatrix, inputs.pitchRadians); // Rotate around X axis
      mat4.rotateY(viewMatrix, viewMatrix, inputs.yawRadians); // Rotate around Y axis
      mat4.rotateZ(viewMatrix, viewMatrix, inputs.rollRadians); // Rotate around Z axis
    }

    // Calculate rotation angle based on time and input RPM
    const angle = ms * inputs.cubeRpm * 0.06 * (Math.PI / 180);
    const modelMatrix = mat4.create();
    mat4.rotateY(modelMatrix, modelMatrix, angle); // Rotate the model matrix around Y axis

    // Ensure valid input values for camera perspective projection
    const isValidNumber = (num) => typeof num === 'number' && !isNaN(num) && isFinite(num);
    if (!isValidNumber(inputs.camfov) || inputs.camfov <= 0) {
      inputs.camfov = Math.PI / 4; // Default field of view angle
    }
    if (!isValidNumber(inputs.camNear) || inputs.camNear <= 0) {
      inputs.camNear = 0.1; // Default near clipping plane distance
    }
    if (!isValidNumber(inputs.camFar) || inputs.camFar <= inputs.camNear) {
      inputs.camFar = 1000; // Default far clipping plane distance
    }

    // Calculate projection matrix based on perspective or orthographic projection
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    if (!isValidNumber(aspectRatio) || aspectRatio <= 0) {
      console.error('Invalid aspect ratio:', aspectRatio);
    }
    const projectionMatrix = mat4.create();
    if (inputs.isCamPerspective) {
      mat4.perspective(projectionMatrix, inputs.camfov, aspectRatio, inputs.camNear, inputs.camFar); // Perspective projection
    } else {
      mat4.ortho(projectionMatrix, -1, 1, -1, 1, inputs.camNear, inputs.camFar); // Orthographic projection
    }

    // Use the shader program and set uniform matrices
    gl.useProgram(program);
    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix); // Set model matrix uniform
    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix); // Set view matrix uniform
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix); // Set projection matrix uniform

    // Bind vertex array object and draw triangles
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, this.N); // Draw triangles
    gl.bindVertexArray(null); // Unbind vertex array object
    gl.useProgram(null); // Stop using the shader program

 
  }
}

function deepEqual(x, y) {
  if (x === null || x === undefined || y === null || y === undefined) {
    return x === y;
  }
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return tx === 'object' && ty === 'object' && (
    ok(x).length === ok(y).length &&
    ok(x).every(key => deepEqual(x[key], y[key]))
  );
}