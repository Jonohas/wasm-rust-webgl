import './app.css';
import {useCallback, useEffect, useRef, useState} from "react";
import {ShaderProgram} from "./ShaderProgram.ts";
import {fsSource, vsSource} from "./sources.ts";
import {Color, ColorBuffer} from "./Buffers/ColorBuffer.ts";
import {Position, PositionBuffer} from "./Buffers/PositionBase.ts";
import { drawScene } from "./draw-scene.ts";
import {IndexBuffer} from "./Buffers/IndexBuffer.ts";
import {useCanvasScroll} from "./useCanvasScroll.ts";
import init from '../../pkg/untitled.js';

let cubeRotation = 0.0;
let deltaTime = 0;

export function App() {

    const [gl, setGl] = useState<WebGLRenderingContext | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const zoom = useCanvasScroll(canvasRef);

    const setGlObject = useCallback(async () => {
        if (canvasRef.current) {
            canvasRef.current.width  = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            setGl(canvasRef.current.getContext("webgl"));
        }
        await init();
        // greet("Jonas");

    }, [canvasRef.current])

    useEffect(() => {
        setGlObject();
    }, [setGlObject])

    useEffect(() => {
        if (gl) {
            const shaderProgram = new ShaderProgram(gl, vsSource, fsSource);

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

            let newColors: Color[] = [];

            for (var j = 0; j < colors.length; ++j) {
                const c = colors[j];
                // Repeat each color four times for the four vertices of the face
                newColors = newColors.concat(c, c, c, c);
            }

            const buffers = {
                color: new ColorBuffer(gl, newColors).colorBuffer,
                position: new PositionBuffer(gl, [


                    //   // Front face
                    //   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
                    //
                    //   // Back face
                    //   -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
                    //
                    //   // Top face
                    //   -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
                    //
                    //   // Bottom face
                    //   -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
                    //
                    //   // Right face
                    //   1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
                    //
                    //   // Left face
                    //   -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,

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
                ]).positionBuffer,
                indices: new IndexBuffer(gl, [
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
                ]).indexBuffer
            }

            let then = 0;

            // Draw the scene repeatedly
            function render(now: number) {
                now *= 0.001; // convert to seconds
                deltaTime = now - then;
                then = now;

                drawScene(gl, shaderProgram.info, buffers, {x: cubeRotation, y: cubeRotation, z: cubeRotation}, zoom);
                cubeRotation += deltaTime;

                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        }
    }, [gl]);

    return (
        <>
          <canvas ref={canvasRef} id="glcanvas" width="640" height="480"></canvas>
        </>
    )
}
