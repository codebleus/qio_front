export class Renderer {
  constructor({
    canvas = document.createElement("canvas"),
    antialias = false,
    alpha = true,
    depth = true,
    stencil = false,
    premultipliedAlpha = true,
    preserveDrawingBuffer = false,
    powerPreference = "default",
  } = {}) {
    this.canvas = canvas;
    this.gl =
      canvas.getContext("webgl", {
        antialias,
        alpha,
        depth,
        stencil,
        premultipliedAlpha,
        preserveDrawingBuffer,
        powerPreference,
      }) ||
      canvas.getContext("experimental-webgl", {
        antialias,
        alpha,
        depth,
        stencil,
        premultipliedAlpha,
        preserveDrawingBuffer,
        powerPreference,
      });

    if (!this.gl) throw new Error("WebGL not supported");

    this.dpr = 1;
    this.width = 1;
    this.height = 1;

    // минимально нужное состояние
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
  }

  setSize(width, height, dpr = this.dpr) {
    this.dpr = dpr;
    this.width = width;
    this.height = height;

    const w = Math.max(1, Math.round(width * dpr));
    const h = Math.max(1, Math.round(height * dpr));

    this.gl.canvas.width = w;
    this.gl.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
  }

  render({ scene } = {}) {
    const gl = this.gl;
    if (!scene) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // у нас в сцене один Mesh, но поддержим и Transform-граф
    if (typeof scene.updateMatrixWorld === "function")
      scene.updateMatrixWorld();

    if (typeof scene.traverse === "function") {
      scene.traverse(node => {
        if (node && typeof node.draw === "function") node.draw();
      });
    } else if (typeof scene.draw === "function") {
      scene.draw();
    }
  }
}
