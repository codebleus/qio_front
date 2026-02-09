import { Transform } from "./Transform.js";

export class Mesh extends Transform {
  constructor(gl, { geometry, program, mode = gl.TRIANGLES } = {}) {
    super();
    this.gl = gl;
    this.geometry = geometry;
    this.program = program;
    this.mode = mode;

    // для fullscreen Triangle = 3 вершины
    this.count = 3;
  }

  draw() {
    const gl = this.gl;
    this.program.use();
    this.geometry.bind(this.program);
    gl.drawArrays(this.mode, 0, this.count);
  }
}
