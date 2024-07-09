// ----------------------------------------------------
// Buffers
// ----------------------------------------------------
function createBufferFromData(gl, bufType, data, drawMode) {
  const buffer = gl.createBuffer();

  gl.bindBuffer(bufType, buffer);
  gl.bufferData(bufType, data, drawMode);
  gl.bindBuffer(bufType, null);

  return buffer
}


function setupDataBuffers(gl, data, vao) {
  if (vao) {
    gl.bindVertexArray(vao);
  }

  // ----------------------------------------------------
  // Set Up Data Buffers
  // ----------------------------------------------------
  const buffers = {}
  for (const k in data) {
    buffers[k] = createBufferFromData(
      gl, gl.ARRAY_BUFFER,
      new Float32Array(data[k]),
      gl.STATIC_DRAW
    )
  }

  if (vao) {
    gl.bindVertexArray(null);
  }

  return buffers

}
