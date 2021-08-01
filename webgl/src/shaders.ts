export module MandelbrotShaders {
	export const fragmentShader = `
precision highp float;

uniform int uLoopMax;
uniform float scale;
uniform vec2 center;
const float limit = 4.0;
const int LOOP_MAX = 100000;
const float ASPECT_RATIO = 40.0 / 64.0;

const vec3 L4R_COLOR = vec3(pow(0.75, 3.0),pow(0.75, 4.0),pow(0.75, 4.0));
const vec3 L4G_COLOR = vec3(pow(0.75, 4.0),pow(0.75, 3.0),pow(0.75, 4.0));
const vec3 L4B_COLOR = vec3(pow(0.75, 4.0),pow(0.75, 4.0),pow(0.75, 3.0));
const vec3 L3R_COLOR = vec3(pow(0.75, 2.0),pow(0.75, 3.0),pow(0.75, 3.0));
const vec3 L3G_COLOR = vec3(pow(0.75, 3.0),pow(0.75, 2.0),pow(0.75, 3.0));
const vec3 L3B_COLOR = vec3(pow(0.75, 3.0),pow(0.75, 3.0),pow(0.75, 2.0));
const vec3 L2R_COLOR = vec3(pow(0.75, 1.0),pow(0.75, 2.0),pow(0.75, 2.0));
const vec3 L2G_COLOR = vec3(pow(0.75, 2.0),pow(0.75, 1.0),pow(0.75, 2.0));
const vec3 L2B_COLOR = vec3(pow(0.75, 2.0),pow(0.75, 2.0),pow(0.75, 1.0));
const vec3 L1R_COLOR = vec3(pow(0.75, 0.0),pow(0.75, 1.0),pow(0.75, 1.0));
const vec3 L1G_COLOR = vec3(pow(0.75, 1.0),pow(0.75, 0.0),pow(0.75, 1.0));
const vec3 L1B_COLOR = vec3(pow(0.75, 1.0),pow(0.75, 1.0),pow(0.75, 0.0));
const vec3 L0_COLOR = vec3(1.0);

vec2 multiply_cn(vec2 a) {
	return vec2(
		a.x * a.x - a.y * a.y,
		2.0 * a.x * a.y);
}
float abs2(vec2 a) {
	return a.x * a.x + a.y * a.y;
}
vec3 to_color(float ratio) {
	float ii = sqrt(ratio) * 12.0;

	if (ii <= 1.0) {
		return L4R_COLOR;
	} else if (ii <= 2.0) {
		return L4G_COLOR;
	} else if (ii <= 3.0) {
		return L4B_COLOR;
	} else if (ii <= 4.0) {
		return L3R_COLOR;
	} else if (ii <= 5.0) {
		return L3G_COLOR;
	} else if (ii <= 6.0) {
		return L4B_COLOR;
	} else if (ii <= 7.0) {
		return L2R_COLOR;
	} else if (ii <= 8.0) {
		return L2G_COLOR;
	} else if (ii <= 9.0) {
		return L2B_COLOR;
	} else if (ii <= 10.0) {
		return L1R_COLOR;
	} else if (ii <= 11.0) {
		return L1G_COLOR;
	} else if (ii <= 12.0) {
		return L1B_COLOR;
	} else {
		return L0_COLOR;
	}
}

vec3 mandelbrot(vec2 c){
	vec2 x = vec2(0.0);
	for (int i = 0; i < LOOP_MAX; i ++) {
		x = multiply_cn(x) + c;
		if (i >= uLoopMax) {
			return vec3(0.0);
		}
		if (length(x) > limit) {
			int max = LOOP_MAX > uLoopMax ? uLoopMax : LOOP_MAX;
			return to_color(float(i) / float(max));
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
