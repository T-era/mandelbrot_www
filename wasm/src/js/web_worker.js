import init, {image_data} from '../../pkg/mandelbrot_www';
init();

onmessage = function(arg) {
	let x = arg.data[0];
	let y = arg.data[1];
	let d = arg.data[2];
	let loopMax = arg.data[3];

	let ret = image_data(x, y, d, loopMax);
	postMessage(ret);
}
