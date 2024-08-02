import {GLBase} from "./GLBase.ts";


export class IndexBuffer extends GLBase {
    _indices: number[];
    _indexBuffer: WebGLBuffer | null;

    constructor(gl: WebGLRenderingContext, indices: number[]) {
        super(gl);
        this._indices = indices;

        this._indexBuffer = this.gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            gl.STATIC_DRAW,
        );
    }

    get indexBuffer(): WebGLBuffer | null {
        return this._indexBuffer;
    }
}