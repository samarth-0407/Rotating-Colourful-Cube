class Experiment {
  // Candidate Details
  static rollNo = '102103364';
  static name = 'Samarth Thakur';

  #gl; // Private WebGL context
  #programs = []; // Array to hold instances of RefTriangles2

  canvasSel = '#myCanvas'; // Selector for canvas element
  cameraControls; // Placeholder for camera controls instance

  constructor() {
    const Cls = this.constructor;

    // Initialize controls for user interaction
    this.controls = new Controls('#controls', {
      submitSel: '#controls-submit'
    });

    // Make controls visible
    this.controls.unhide();

    const { inputs } = this.controls;
    console.log({ inputs }); // Log inputs for debugging
  }

  async setupPrograms(gl) {
    this.#gl = gl; // Store WebGL context locally

    const Cls = this.constructor;

    const data = Cls.generateData(8); // Generate data for 8 vertices (cube)

    try {
      const refTriangles2 = new RefTriangles2(gl, data); // Create RefTriangles2 instance
      this.#programs.push(refTriangles2); // Store instance in programs array

    } catch (e) {
      console.error(e); // Log any errors encountered during setup
    }
  }

  loop(ms) {
    const gl = this.#gl;

    const { inputs } = this.controls;

    gl.clearColor(0, 0, 0, 0); // Set clear color (black)
    // Clear Buffers (color and depth)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const program of this.#programs) {
      program.draw(ms, inputs); // Draw each RefTriangles2 instance
    }
  }

  static generateData(N) {
    const vertices = [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5]
    ];

    const colors = [
      [1.0, 0.0, 0.0], // Red
      [0.0, 1.0, 0.0], // Green
      [0.0, 0.0, 1.0], // Blue
      [1.0, 1.0, 0.0], // Yellow
      [1.0, 0.0, 1.0], // Magenta
      [0.0, 1.0, 1.0], // Cyan
      [1.0, 0.5, 0.0], // Orange
      [0.5, 0.0, 0.5]  // Purple
    ];

    const indices = [
      // Front face
      [0, 1, 2],
      [2, 3, 0],
      // Back face
      [4, 5, 6],
      [6, 7, 4],
      // Left face
      [0, 4, 7],
      [7, 3, 0],
      // Right face
      [1, 5, 6],
      [6, 2, 1],
      // Top face
      [3, 2, 6],
      [6, 7, 3],
      // Bottom face
      [0, 1, 5],
      [5, 4, 0]
    ];

    // Flatten the vertices and colors based on the indices
    const pos = indices.flat().map(index => vertices[index]).flat();
    const flattenedColors = indices.flat().map(index => colors[index]).flat();

    const data = {
      pos,
      colors: flattenedColors
    };

    return data; // Return flattened vertex and color data
  }
}