function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info || "Shader compile failed");
  }
  return shader;
}

function linkProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();

  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(info || "Program link failed");
  }
  return program;
}

const isTypedArray = v => ArrayBuffer.isView(v) && !(v instanceof DataView);

export class Program {
  constructor(gl, { vertex, fragment, uniforms = {} } = {}) {
    this.gl = gl;
    this.program = linkProgram(gl, vertex, fragment);
    this.uniforms = uniforms;

    // кешируем локации атрибутов/юниформ
    this.attributeLocations = new Map();
    this.uniformLocations = new Map();

    const numAttribs = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_ATTRIBUTES,
    );
    for (let i = 0; i < numAttribs; i++) {
      const info = gl.getActiveAttrib(this.program, i);
      if (!info) continue;
      this.attributeLocations.set(
        info.name,
        gl.getAttribLocation(this.program, info.name),
      );
    }

    const numUniforms = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_UNIFORMS,
    );
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(this.program, i);
      if (!info) continue;
      const name = info.name.replace(/\[0\]$/, "");
      this.uniformLocations.set(
        name,
        gl.getUniformLocation(this.program, name),
      );
    }
  }

  use() {
    this.gl.useProgram(this.program);
    this.updateUniforms();
  }

  updateUniforms() {
    const gl = this.gl;

    for (const name in this.uniforms) {
      const entry = this.uniforms[name];
      const value = entry?.value;

      const loc = this.uniformLocations.get(name);
      if (loc == null) continue;

      if (typeof value === "number") {
        gl.uniform1f(loc, value);
        continue;
      }

      if (typeof value === "boolean") {
        gl.uniform1i(loc, value ? 1 : 0);
        continue;
      }

      if (value && value.length !== undefined) {
        const arr = isTypedArray(value) ? value : new Float32Array(value);
        const len = arr.length;

        if (len === 2) gl.uniform2fv(loc, arr);
        else if (len === 3) gl.uniform3fv(loc, arr);
        else if (len === 4) gl.uniform4fv(loc, arr);
        else if (len === 9) gl.uniformMatrix3fv(loc, false, arr);
        else if (len === 16) gl.uniformMatrix4fv(loc, false, arr);
        else gl.uniform1fv(loc, arr);
      }
    }
  }
}
