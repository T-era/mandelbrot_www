export module MandelbrotShaders {
	export const fragmentShader = `
precision highp float;

uniform int uLoopMax;
uniform float scale;
uniform vec2 center;
const float limit = 4.0;
const int LOOP_MAX = 100000;
const float ASPECT_RATIO = 40.0 / 64.0;

vec2 multiply_cn(vec2 a) {
	return vec2(
		a.x * a.x - a.y * a.y,
		2.0 * a.x * a.y);
}
float abs2(vec2 a) {
	return a.x * a.x + a.y * a.y;
}
vec3 to_color(int i, int max) {
	if (i < max * 1 / 128) {
		return vec3(0.75 * 0.75 * .75 * .75 * .75, 0.75 * 0.75 * .75 * .75 * .75, 0.75 * .75 * .75 * .75);
	}
	if (i < max * 2 / 128) {
		return vec3(0.75 * 0.75 * .75 * .75, 0.75 * 0.75 * .75 * .75, 0.75 * .75 * .75);
	}
	if (i < max * 4 / 128) {
		return vec3(0.75 * 0.75 * .75, 0.75 * 0.75 * .75, 0.75 * .75);
	}
	if (i < max * 8 / 128) {
		return vec3(0.75 * 0.75, 0.75 * 0.75, 0.75);
	}
	return vec3(0.75, 0.75, 1.0);
}

vec3 mandelbrot(vec2 c){
	vec2 x = vec2(0.0);
	for (int i = 0; i < LOOP_MAX; i ++) {
		x = multiply_cn(x) + c;
		if (i >= uLoopMax) {
			return vec3(0.0);
		}
		if (length(x) > limit) {
			int lm = LOOP_MAX > uLoopMax ? uLoopMax : LOOP_MAX;
			return to_color(i, lm);
		}
	}

	return vec3(0.0);
}

void main(void){
	vec2 c = center + vec2(
		gl_PointCoord.x * scale,
		gl_PointCoord.y * scale * ASPECT_RATIO);
	vec3 col = mandelbrot(c);
	gl_FragColor = vec4(col, 1.0);
}
`;
	export const vertexShader = `
attribute vec4 position;

void main ()
{
	gl_Position = position;
}
`;
};
