import { ShaderSandbox } from './shader_sandbox';
import { MandelbrotShaders } from './shaders';

(()=>{
	let canvas = document.getElementById('canvas') as HTMLCanvasElement;
	let startBtn = document.getElementById('start_btn');
	let statusBar = document.getElementById('status_box') as HTMLInputElement;
	let loopInput = document.getElementById('loop_max') as HTMLInputElement;

	let init = new ShaderSandbox.Initializer({
		canvas: canvas,
		initialScale: 1.6,
		initialCenter: { x: -0.5, y: 0 },
		shaders: MandelbrotShaders
	});

	let renderer = init.ready({
		uLoopMax: (gl, location, val) => {
			gl.uniform1i(location, val);
		}
	});
	canvas.onmousemove = function(e) {
		var l = renderer.pToL(offsetToP(e));
		var s = renderer.scale;
		statusBar.value = `${s} (${l.x}, ${l.y})`;
	};
	canvas.onclick = function(e) {
		renderer.moveCenter(
			offsetToP(e)
		);
		renderer.zoom(0.5);
		renderer.render({
			uLoopMax: Number(loopInput.value)
		});
	}
	startBtn.onclick = function() {
		renderer.render({
			uLoopMax: Number(loopInput.value)
		});
	}
	function offsetToP(e) {
		return {
			x: (e.offsetX - canvas.width / 2) / canvas.width * 2,
			y: -(e.offsetY - canvas.height / 2) / canvas.height * 2,
		};
	}
})();
