#version 300 es

precision mediump float;

in vec3 vColorRgb;
out vec4 fragColor;

void main() {
  fragColor = vec4(vColorRgb, 1.0);
}