import {GLBase, BufferItemBase} from "./GLBase.ts";


export class Position implements BufferItemBase {
    _x: number;
    _y: number;
    _z: number;

    constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y
        this._z = z;
    }

    convertToWebGLArray(): number[] {
        return [this._x, this._y, this._z];
    }
}

export class PositionBuffer extends GLBase {
    _positions: Position[] = [];
    _positionBuffer: WebGLBuffer | null;

    constructor(gl: WebGLRenderingContext, positions: Position[]) {
        super(gl);
        this._positions = positions;
        this._positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colorsToFloat32Array, this.gl.STATIC_DRAW);
    }

    get colorsToFloat32Array (): Float32Array {
        let finalColorArray: number[] = []
        this._positions.map((color) => {
            finalColorArray = [...finalColorArray, ...color.convertToWebGLArray()];
        })
        return new Float32Array(finalColorArray);
    }

    get positionBuffer (): WebGLBuffer | null {
        return this._positionBuffer;
    }
}