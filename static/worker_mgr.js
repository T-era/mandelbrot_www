const HOR = 1;
const VER = 40;
const WID = 640 / HOR;
const HEI = 400 / VER;
function WorkerWrapper(cvs, lx, ly) {
	var ctx = cvs.getContext('2d');
	var myWorker = new Worker('./mandelbrot_www.js');
	this.postMessage = function(x, y, scale, loop_max) {
		myWorker.postMessage([x + lx * WID * scale, y + ly * HEI * scale, scale, loop_max]);
	};
	myWorker.onmessage = function(arg) {
		var imgData = ctx.createImageData(WID, HEI);
		imgData.data.set(arg.data);

		ctx.putImageData(imgData, WID * lx, HEI * ly);
	};
}
function WorkerManager(cvs) {
	let ctx = cvs.getContext('2d');
	let workerIndex = []
	for (let y = 0; y < VER; y ++) {
		for (let x = 0; x < HOR; x ++) {
			workerIndex.push([x,y]);
		}
	}
	let workers = workerIndex.map(function(args) {
		return new WorkerWrapper(cvs, args[0], args[1]);
	});
	this.postMessages = function(x, y, scale, loop_max) {
		ctx.clearRect(0, 0, 640, 400);
		workers.forEach(function(worker) {
			worker.postMessage(x, y, scale, loop_max);
		});
	};
}
function Scaler(manager) {
	let scale = 0.005;
	let centerX = -0.5;
	let centerY = 0;

	this.reload = function(loopMax) {
		manager.postMessages(
			centerX - 320 * scale,
			centerY - 200 * scale,
			scale,
			loopMax)
	}
	this.scaleUp = function(px, py, loopMax) { // px, py は640,400のCanvasサイズ
		centerX = centerX + (px - 320) * scale;
		centerY = centerY + (py - 200) * scale;
		scale = scale / 2;
		manager.postMessages(
			centerX - 320 * scale,
			centerY - 200 * scale,
			scale,
			loopMax);
	}
	this.scaleDown = function(px, py, loopMax) { // px, py は640,400のCanvasサイズ
		centerX = centerX + (px - 320) * scale;
		centerY = centerY + (py - 200) * scale;
		scale = scale * 8;
		manager.postMessages(
			centerX - 320 * scale,
			centerY - 200 * scale,
			scale,
			loopMax);
	}
	this.showPosition = function(cvs, px, py) {
		let x = centerX + (px - 320) * scale;
		let y = centerY + (py - 200) * scale;

		let ctx = cvs.getContext('2d');
		let imageData = ctx.getImageData(px, py, 1, 1);
		let r = imageData.data[0];
		let g = imageData.data[1];
		let b = imageData.data[2];

		return `[${r},${g},${b}](${x},  ${y})`
	}
}
function onload() {
	var cvs = document.getElementById('c01');
	var manager = new Scaler(new WorkerManager(cvs));
	var loopMaxInput = document.getElementById('loop_max');
	let statusBox = document.getElementById('status_box');

	cvs.onclick = function(event) {
		var x = event.offsetX;
		var y = event.offsetY;
		manager.scaleUp(x, y, loopMaxInput.value);
	}
	cvs.ondblclick = function(event) {
		var x = event.offsetX;
		var y = event.offsetY;
		var button = event.button;
		manager.scaleDown(x, y, loopMaxInput.value);
	}
	cvs.onmousemove = function(event) {
		var x = event.offsetX;
		var y = event.offsetY;
		statusBox.value = manager.showPosition(cvs, x, y);
	}
	window.canvasGoGo = function() {
		var loop_max = loopMaxInput.value;
		manager.reload(loop_max);
	}
}
