
export interface BufferItemBase {
    convertToWebGLArray: () => number[]
}
export class GLBase {
    _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    get gl() {
        return this._gl;
    }
}