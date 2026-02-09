export class Geometry {
  constructor(gl, { attributes = {} } = {}) {
    this.gl = gl;
    this.attributes = {};
    this.buffers = {};

    for (const name in attributes) {
      this.addAttribute(name, attributes[name]);
    }
  }

  addAttribute(
    name,
    {
      data,
      size = 3,
      type = this.gl.FLOAT,
      normalized = false,
      stride = 0,
      offset = 0,
    } = {},
  ) {
    const gl = this.gl;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const arr = ArrayBuffer.isView(data) ? data : new Float32Array(data);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);

    this.attributes[name] = { size, type, normalized, stride, offset };
    this.buffers[name] = buffer;
    return this;
  }

  bind(program) {
    const gl = this.gl;

    for (const name in this.attributes) {
      const loc = program.attributeLocations.get(name);
      if (loc == null || loc < 0) continue;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[name]);
      const a = this.attributes[name];

      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(
        loc,
        a.size,
        a.type,
        a.normalized,
        a.stride,
        a.offset,
      );
    }
  }
}
