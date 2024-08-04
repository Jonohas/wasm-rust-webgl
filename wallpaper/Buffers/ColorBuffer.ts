import {BufferItemBase, GLBase} from "./GLBase.ts";




export class Color implements BufferItemBase {
    _red: number;
    _green: number;
    _blue: number;
    _opacity: number;

    constructor(red: number, green: number, blue: number, opacity: number) {
        if (0 <= red && red <= 255)
            this._red = red;
        else
            throw new Error("Number red out of range: 0-255");

        if (0 <= green && green <= 255)
            this._green = green;
        else
            throw new Error("Number green out of range: 0-255");

        if (0 <= blue && blue <= 255)
            this._blue = blue;
        else
            throw new Error("Number blue out of range: 0-255");

        if (0 <= opacity && opacity <= 1)
            this._opacity = opacity;
        else
            throw new Error("Number opacity out of range: 0-1");
    }

    convertToWebGLArray(): number[] {
        return [this._red / 255, this._green / 255, this._blue / 255, this._opacity]
    }
}

export class ColorBuffer extends GLBase {
    _colors: Color[] = [];
    _colorBuffer: WebGLBuffer | null;

    constructor(gl: WebGLRenderingContext ,colors: Color[]) {
        super(gl);
        this._colors = colors;
        this._colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colorsToFloat32Array, this.gl.STATIC_DRAW);
    }

    get colorsToFloat32Array (): Float32Array {
        let finalColorArray: number[] = []
        this._colors.map((color) => {
            finalColorArray = [...finalColorArray, ...color.convertToWebGLArray()];
        })
        return new Float32Array(finalColorArray);
    }

    get colorBuffer (): WebGLBuffer | null {
        return this._colorBuffer;
    }
}