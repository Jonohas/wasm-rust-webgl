import { Position, PositionBuffer } from "./Buffers/PositionBase";
import { Color, ColorBuffer } from "./Buffers/ColorBuffer";
import { ShaderProgram } from "./ShaderProgram";
import { fsSource, vsSource } from "./sources";
import { IndexBuffer } from "./Buffers/IndexBuffer";
import { drawScene } from "./draw-scene";

const positions: Position[] = [
    // Front face
    new Position(-1.0, -1.0, 1.0),
    new Position(1.0, -1.0, 1.0),
    new Position(1.0, 1.0, 1.0),
    new Position(-1.0, 1.0, 1.0),

    // Back face
    new Position(-1.0, -1.0, -1.0),
    new Position(-1.0, 1.0, -1.0),
    new Position(1.0, 1.0, -1.0),
    new Position(1.0, -1.0, -1.0),

    // Top face
    new Position(-1.0, 1.0, -1.0),
    new Position(-1.0, 1.0, 1.0),
    new Position(1.0, 1.0, 1.0),
    new Position(1.0, 1.0, -1.0),

    // Bottom face
    new Position(-1.0, -1.0, -1.0),
    new Position(1.0, -1.0, -1.0),
    new Position(1.0, -1.0, 1.0),
    new Position(-1.0, -1.0, 1.0),

    // Right face
    new Position(1.0, -1.0, -1.0),
    new Position(1.0, 1.0, -1.0),
    new Position(1.0, 1.0, 1.0),
    new Position(1.0, -1.0, 1.0),

    // Left face
    new Position(-1.0, -1.0, -1.0),
    new Position(-1.0, -1.0, 1.0),
    new Position(-1.0, 1.0, 1.0),
    new Position(-1.0, 1.0, -1.0),
];

const colors: Color[] = [
    // Front face
    new Color(255, 255, 255, 1.0),
    // Back face
    new Color(255, 0, 0, 1.0),
    // Top face
    new Color(0, 255, 0, 1.0),
    // Bottom face
    new Color(0, 0, 255, 1.0),
    // Right face
    new Color(255, 255, 0, 1.0),
    // Left face
    new Color(255, 0, 255, 1.0),
];

const indices: number[] = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
];

export class Main {
    _canvas: HTMLCanvasElement | null = document.querySelector("#glcanvas");
    _gl: WebGLRenderingContext | null = null;
    _shaderProgram: ShaderProgram | null = null;
    _buffers: object | null = null;

    _then: number = 0;
    _deltaTime: number = 0;
    _cubeRotation: number = 0.0;

    constructor() {
        this._gl = this._canvas?.getContext("webgl") ?? null;
        console.log("init")

        if (this._gl) {
            this._shaderProgram = new ShaderProgram(this._gl, vsSource, fsSource);
            let newColors: Color[] = [];
            for (var j = 0; j < colors.length; ++j) {
                const c = colors[j];
                // Repeat each color four times for the four vertices of the face
                newColors = newColors.concat(c, c, c, c);
            }


           this._buffers = {
                color: new ColorBuffer(this._gl, newColors).colorBuffer,
                position: new PositionBuffer(this._gl, positions).positionBuffer,
                indices: new IndexBuffer(this._gl, indices).indexBuffer
            }

            requestAnimationFrame((now: number) => this.render(now));
        }
    }

    render(now: number) {
        now *= 0.001; // convert to seconds
        this._deltaTime = now - this._then;
        this._then = now;

        if (this._shaderProgram) {
            drawScene(this._gl, this._shaderProgram.info, this._buffers, { x: this._cubeRotation, y: this._cubeRotation, z: this._cubeRotation });
            this._cubeRotation += this._deltaTime;

            requestAnimationFrame((now: number) => this.render(now));
        }
    }
}
