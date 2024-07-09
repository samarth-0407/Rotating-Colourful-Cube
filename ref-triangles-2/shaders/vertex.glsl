#version 300 es

in vec3 aPosition;
in vec3 aColorRgb;

out vec3 vColorRgb;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
  vColorRgb = aColorRgb;
}