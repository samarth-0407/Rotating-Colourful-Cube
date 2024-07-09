# version 300 es

precision mediump float;

in vec3 aPosition;
in vec3 aColorRgb;

// uniform float uPointSize;
// uniform vec3 uFgColorRgb;
out vec3 fColorRgb;

void main(void){
  // gl_PointSize = uPointSize;
  gl_Position = vec4(aPosition, 1.0);
  fColorRgb = aColorRgb;
}
