extern crate num;

use wasm_bindgen::prelude::*;

use js_sys::*;
use num::Complex;

const WIDTH :u32 = 640;
const HEIGHT :u32 = 10;
const LIMIT :f64 = 4.0;

#[wasm_bindgen]
pub fn image_data(min_x :f64, min_y :f64, d :f64, loop_max :usize) -> Int16Array {
	let obj = Int16Array::new_with_length(4 * WIDTH * HEIGHT);
	let mut ret = [0 as i16; (4 * WIDTH * HEIGHT) as usize];
	for y in 0..HEIGHT {
		let ly = min_y + d * y as f64;
		for x in 0..WIDTH {
			let lx = min_x + d * x as f64;
			let pos = (y * WIDTH + x) * 4;
			let c = Complex { re: lx, im: ly };
			let color = color(calc(c, loop_max), loop_max);

			ret[(pos + 0) as usize] = color[0];
			ret[(pos + 1) as usize] = color[1];
			ret[(pos + 2) as usize] = color[2];
			ret[(pos + 3) as usize] = 255;
		}
	}
	obj.copy_from(&ret);
	return obj
}

fn color(result :usize, loop_max :usize) -> [i16;3] {
	if result == 0 {
		return [0, 0, 0];
	} else if result < loop_max * 1 / 128 {
		return [61, 61, 81];
	} else if result < loop_max * 2 / 128 {
		return [81, 81, 108];
	} else if result < loop_max * 4 / 128 {
		return [108, 108, 144];
	} else if result < loop_max * 8 / 128 {
		return [144, 144, 192];
	} else  {
		return [192, 192, 255];
	}
}

fn calc(c :Complex<f64>, loop_max :usize) -> usize {
	let mut z = Complex { re: 0.0, im: 0.0 };
	for i in 1..loop_max+1 {
		z = z * z + c;
		if z.norm_sqr() > LIMIT {
			return i;
		}
	}
	return 0;
}
