import { Geometry } from "../core/Geometry.js";

// Fullscreen triangle: position(vec2) + uv(vec2)
export class Triangle extends Geometry {
  constructor(gl) {
    const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);

    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

    super(gl, {
      attributes: {
        position: { data: positions, size: 2 },
        uv: { data: uvs, size: 2 },
      },
    });
  }
}
