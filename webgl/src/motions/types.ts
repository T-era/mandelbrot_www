import { ShaderSandbox } from '../shader_sandbox';

export type Position = {x:number, y:number};
export type PosConverter = (arg:Position) => Position;
export type Renderer = ShaderSandbox.GlRenderer;
export type StartedCallback = () => void;
export type ShowStatus = (p :Position, scale: number, loopMax: number) => void;
export interface MotionType {
	init(callback :StartedCallback) :void;
	start(renderer :Renderer) :void;
	freeze() :void;
}
