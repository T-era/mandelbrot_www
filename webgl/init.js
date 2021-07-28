var mandelbrot = (function() {
	let gl; // context
	let program;
	let positionBuffer;
	const posList = [
		-1,-1,
		-1, 1,
		 1,-1,
		 1, 1
	];
	const posListDim = 2;
	const posSize = posList.length / posListDim;
	let scale = 1.6;
	let center = {
		x: -0.5,
		y:0
	};
	let uniform = {};
	return {
		init: (canvas, vertexShader, fragmentShader) => {
			gl = canvas.getContext('webgl', null);
			program = createProgram(gl, vertexShader, fragmentShader);
			positionBuffer = createPositionBuffer(gl, posList);
		},
		ready: () => {
			gl.clearColor (0.8, 0.8, 0.8, 1.0);
			gl.clearDepth(0.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			var positionAddress = gl.getAttribLocation(program, "position");
			gl.enableVertexAttribArray(positionAddress);
			gl.vertexAttribPointer(positionAddress, posListDim, gl.FLOAT, false, 0, 0);

			// ポリゴンを描画
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, posSize);

			uniform = {
				LoopMax: gl.getUniformLocation(program, 'uLoopMax'),
				Scale: gl.getUniformLocation(program, 'scale'),
				Center: gl.getUniformLocation(program, 'center'),
			};
		},
		moveCenter: (pointerPos) => {
			center = {
				x: center.x + pointerPos.x * scale,
				y: center.y + pointerPos.y * scale * 40 / 64,
			};
		},
		scaleUp: () => {
			scale /= 2;
		},
		render: (loopMax) => {
			gl.uniform1i(uniform.LoopMax, loopMax);
			gl.uniform1f(uniform.Scale, scale);
			gl.uniform2f(uniform.Center, center.x, center.y);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, posSize);

			gl.flush();
		},
		show: (px, py) => {
			let lx = center.x + px * scale;
			let ly = center.y + py * scale * 40 / 64;
			return `${scale} (${lx}, ${ly})`;
		},
	};
	function createPositionBuffer(gl, posList) {
		let positionBuffer = gl.createBuffer();
		// 生成したバッファをバインドする
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posList), gl.STATIC_DRAW);
		// バインド解除
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return positionBuffer;
	}
	function createProgram(gl, vertexShaderScript, fragmentShaderScript) {
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
	function createShader(gl, shaderScript, shaderType) {
		let shader = gl.createShader(shaderType);
		gl.shaderSource(shader, shaderScript);
		gl.compileShader(shader);
		if(! gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.log(gl.getShaderInfoLog(shader));
			throw 'error';
		}
		return shader;
	}
})();
