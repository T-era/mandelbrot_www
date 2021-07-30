// Shaderでグラフィクス描画を行うために真っ平らなポリゴンを設定します。
// Shader側には視点移動と拡大縮小のためのuniformを渡します。
//
// シェーダには、このスクリプトから自動的に `float scale` と `vec2 center` を連携します。
// 他にもuniformで値を連携したい場合、Initializer.ready , GlRenderer.render に引数を加えます。
export module ShaderSandbox {
	interface Position {
		x :number;
		y :number;
	}
	interface Shaders {
		readonly vertexShader :string;
		readonly fragmentShader :string;
	}
	interface InitializerArgs {
		readonly canvas :HTMLCanvasElement;
		readonly initialScale :number;
		readonly initialCenter :Position;
		readonly shaders :Shaders;
	}
	const POS_LIST = [
		-1,-1,
		-1, 1,
		 1,-1,
		 1, 1
	];
	const POS_LIST_DIM = 2;
	const POS_SIZE = POS_LIST.length / POS_LIST_DIM;

	export class Initializer {
		scale :number;
		center :Position;
		gl :WebGLRenderingContext;
		canvasWidth :number;
		canvasHeight :number;
		program :WebGLProgram;
		positionBuffer :WebGLBuffer;

		constructor(args :InitializerArgs) {
			this.canvasWidth = args.canvas.width;
			this.canvasHeight = args.canvas.height;

			this.scale = args.initialScale;
			this.center = args.initialCenter;
			this.gl = args.canvas.getContext('webgl');
			this.program = createProgram(
				this.gl,
				args.shaders.vertexShader,
				args.shaders.fragmentShader);
			this.positionBuffer = createPositionBuffer(
				this.gl,
				POS_LIST);
		}
		ready(additionalUniform :{[name :string] :UniformSetter} = {}) :GlRenderer {
			this.gl.clearColor (0.8, 0.8, 0.8, 1.0);
			this.gl.clearDepth(0.0);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
			var positionAddress = this.gl.getAttribLocation(this.program, "position");
			this.gl.enableVertexAttribArray(positionAddress);
			this.gl.vertexAttribPointer(positionAddress, POS_LIST_DIM, this.gl.FLOAT, false, 0, 0);

			// ポリゴンを描画
			this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, POS_SIZE);

			return new GlRenderer(this, additionalUniform);
		}
	}
	type UniformSetter = (gl, location :WebGLUniformLocation, value:any) => void;
	interface UniformSetting {
		location :WebGLUniformLocation;
		setter :UniformSetter;
	}
	export class GlRenderer {
		gl :WebGLRenderingContext;
		program :WebGLProgram;
		positionBuffer :WebGLBuffer;

		center :Position;
		scale :number;
		canvasAspect :number;
		uniform :{[name:string]:WebGLUniformLocation};
		additionalUniformSetting :{[name :string] :UniformSetting};

		constructor(init :Initializer, additionalUniform :{[name :string] :UniformSetter}) {
			this.gl = init.gl;
			this.program = init.program;
			this.positionBuffer = init.positionBuffer;
			this.center = init.center;
			this.scale = init.scale;
			this.canvasAspect = init.canvasWidth / init.canvasHeight;
			this.uniform = {
				Scale: this.gl.getUniformLocation(this.program, 'scale'),
				Center: this.gl.getUniformLocation(this.program, 'center'),
			}
			this.additionalUniformSetting = {};
			for (let name in additionalUniform) {
				let setter = additionalUniform[name];
				this.additionalUniformSetting[name] = {
					location: this.gl.getUniformLocation(this.program, name),
					setter: setter
				}
			}
		}
		moveCenter(pointerPos :Position) {
			this.center = this.pToL(pointerPos);
		}
		zoom(ratio :number) {
			this.scale *= ratio;
		}
		render(additionalUniform :{[name:string]:any}) {
			for (let name in additionalUniform) {
				let setting = this.additionalUniformSetting[name];
				let value = additionalUniform[name];
				setting.setter(this.gl, setting.location, value);
			}
			this.gl.uniform1f(this.uniform.Scale, this.scale);
			this.gl.uniform2f(this.uniform.Center, this.center.x, this.center.y);
			this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, POS_SIZE);

			this.gl.flush();
		}
		getScale() :number {
			return this.scale;
		}
		pToL(p :Position) :Position {
			return {
				x: this.center.x + p.x * this.scale,
				y: this.center.y + p.y * this.scale / this.canvasAspect
			};
		}
	}
}
function createPositionBuffer(gl :WebGLRenderingContext, posList :number[]) :WebGLBuffer {
	let positionBuffer = gl.createBuffer();
	// 生成したバッファをバインドする
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posList), gl.STATIC_DRAW);
	// バインド解除
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	return positionBuffer;
}
function createProgram(gl :WebGLRenderingContext, vertexShaderScript :string, fragmentShaderScript :string) :WebGLProgram {
	let vertexShader = createShader(gl, vertexShaderScript, gl.VERTEX_SHADER);
	let fragmentShader = createShader(gl, fragmentShaderScript, gl.FRAGMENT_SHADER);
	let program = gl.createProgram();

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
		gl.useProgram(program);
	}else {
		console.log(gl.getProgramInfoLog(program));
		throw 'error';
	}
	return program;
}
function createShader(gl :WebGLRenderingContext, shaderScript :string, shaderType :number) :WebGLShader {
	let shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderScript);
	gl.compileShader(shader);
	if(! gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		console.log(gl.getShaderInfoLog(shader));
		throw 'error';
	}
	return shader;
}
