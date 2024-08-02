import {GLBase} from "./Buffers/GLBase.ts";


export class ShaderProgram extends GLBase {
    _vertexShader: WebGLShader | null;
    _fragmentShader: WebGLShader | null;

    _shaderProgram: WebGLProgram | null;

    constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
        super(gl);

        this._vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
        this._fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

        this._shaderProgram = this.gl.createProgram();

        if (!this._shaderProgram)
            throw new Error("Shader program not initialized properly.");

        if (!this._vertexShader || !this._fragmentShader)
            throw new Error("Vertex or Fragment shader not initialized properly.");

        this.gl.attachShader(this._shaderProgram, this._vertexShader);
        this.gl.attachShader(this._shaderProgram, this._fragmentShader);
        this.gl.linkProgram(this._shaderProgram);

        if (!this.gl.getProgramParameter(this._shaderProgram, gl.LINK_STATUS)) {
            alert(
                `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                    this._shaderProgram,
                )}`,
            );
        }
    }

    loadShader (type: number, source: string) {
        const shader = this.gl.createShader(type);

        if (!shader)
            throw new Error("Could not initialize shader.");

        this.gl.shaderSource(shader, source);

        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(
                `An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`,
            );
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    get shaderProgram() {
        return this._shaderProgram;
    }

    get info() {
        if (!this._shaderProgram)
            return null;

        return {
            program: this._shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(this._shaderProgram, "aVertexPosition"),
                vertexColor: this.gl.getAttribLocation(this._shaderProgram, "aVertexColor"),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(this._shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: this.gl.getUniformLocation(this._shaderProgram, "uModelViewMatrix"),
            },
        }
    }
}