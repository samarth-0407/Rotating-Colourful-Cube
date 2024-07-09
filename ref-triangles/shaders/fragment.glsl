# version 300 es

precision mediump float;

in vec3 fColorRgb;

out vec4 finalColor;

void main(void) {
  // vec3 fgColor = vec3(0.0, 0.0, 0.0);
  finalColor = vec4(fColorRgb, 1.0);
}
