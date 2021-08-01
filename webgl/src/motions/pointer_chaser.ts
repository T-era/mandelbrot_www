import { MotionType, PosConverter, Renderer, ShowStatus, StartedCallback } from './types';

export class PointerChaser implements MotionType {
	canvas :HTMLCanvasElement;
	pointedOffset = {x:320,y:200};
	startedCallback :StartedCallback;
	running = false;
	loopMax :number = 1000;
	showStatus;
	offsetToP :PosConverter;

	constructor(canvas :HTMLCanvasElement, offsetToP :PosConverter, showStatus :ShowStatus) {
		this.canvas = canvas;
		this.offsetToP = offsetToP;
		this.showStatus = showStatus;
	}
	init(callback :StartedCallback) :void {
		this.startedCallback = callback;
	}
	start(renderer :Renderer) :void {
		this.startedCallback();
		this.canvas.onmousemove = (e) => {
			this.pointedOffset = {
				x: e.offsetX,
				y: e.offsetY
			};
		};
		this.canvas.onclick = (e) => {
			if (!this.running) {
				this.running = true;
				this.startAnime(renderer);
			} else {
				this.running = false;
			}
		};
		this.running = true;
		this.startAnime(renderer);

	}
	freeze() :void {
		this.canvas.onmousemove = null;
	}
	private startAnime(renderer :Renderer) {
		let physCenter = this.offsetToP(this.pointedOffset);
		renderer.moveCenter(
			renderer.pToL(physCenter));
		renderer.zoom(0.995);
		this.loopMax *= 1.002;
		renderer.render({
			uLoopMax: Math.floor(this.loopMax)
		});

		this.showStatus(
			renderer.pToL(physCenter),
			renderer.getScale(),
			this.loopMax);
		// 計算精度の都合でスケールをあまり小さくしてもギザギザになっちゃうので止める
		if (renderer.getScale() < 0.000007) {
			this.running = false;
		}
		if (this.running) {
			requestAnimationFrame(this.startAnime.bind(this, renderer));
		}
	}
}
