import { ShaderSandbox } from './shader_sandbox';
import { MandelbrotShaders } from './shaders';
import { PointerChaser, Auto } from './motions';

(()=>{
	let canvas = document.getElementById('canvas') as HTMLCanvasElement;
	let showCenter = document.getElementById('dd_center') as HTMLElement;
	let showScale = document.getElementById('dd_scale') as HTMLElement;
	let showLoopMax = document.getElementById('dd_loop_max') as HTMLElement;
	let autoStart = document.getElementById('auto_start') as HTMLButtonElement;
	let autoXInput = document.getElementById('auto_x') as HTMLInputElement;
	let autoYInput = document.getElementById('auto_y') as HTMLInputElement;

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
	let pc = new PointerChaser(canvas, offsetToP, showStatus);
	let auto = new Auto(canvas, showStatus);
	pc.init(()=>auto.freeze());
	auto.init(()=>pc.freeze());

	canvas.onclick = function(e) {
		pc.start(renderer);
	};
	autoStart.onclick = function(e) {
		auto.setTarget({
			x: Number(autoXInput.value),
			y: Number(autoYInput.value) })
		auto.start(renderer);
	}
	function showStatus(center, scale :number, loopMax :number) {
		showCenter.innerText = `(${center.x}, ${center.y})`
		showScale.innerText = `${scale}`;
		showLoopMax.innerText = `${Math.floor(loopMax)}`;
	}
	function offsetToP(offset) {
		return {
			x: (offset.x - canvas.width / 2) / canvas.width / 60,
			y: -(offset.y - canvas.height / 2) / canvas.height / 60,
		};
	}
})();
