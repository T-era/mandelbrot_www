import { MotionType, Position, Renderer, ShowStatus, StartedCallback } from './types';

export class Auto implements MotionType {
	canvas :HTMLCanvasElement;
	pointedOffset = {x:320,y:200};
	startedCallback :StartedCallback;
	running = false;
	loopMax :number = 1000;
	showStatus;
	currentCenter = { x:0, y:0 };
	targetCenter :Position;

	constructor(canvas :HTMLCanvasElement, showStatus :ShowStatus) {
		this.canvas = canvas;
		this.showStatus = showStatus;
	}
	init(callback :StartedCallback) :void {
		this.startedCallback = callback;
	}
	start(renderer :Renderer) :void {
		this.startedCallback();
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
	setTarget(targetCenter :Position) {
		this.targetCenter = targetCenter;
	}
	private startAnime(renderer :Renderer) {
		this.currentCenter = step(this.currentCenter, this.targetCenter);
		renderer.moveCenter(this.currentCenter);
		renderer.zoom(0.995);
		this.loopMax *= 1.002;
		renderer.render({
			uLoopMax: Math.floor(this.loopMax)
		});

		this.showStatus(
			renderer.pToL(this.currentCenter),
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
function step(a :Position, b :Position) :Position {
	return {
		x: (a.x * 98 + b.x * 2) / 100,
		y: (a.y * 98 + b.y * 2) / 100
	};
}
