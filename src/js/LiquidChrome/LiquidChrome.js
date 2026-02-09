import { Renderer, Program, Mesh, Triangle } from "./ogl-lite/index.js";

/**
 * Полный аналог React LiquidChrome, но без React.
 *
 * @param {HTMLElement} container  DOM-элемент-контейнер
 * @param {Object} opts           параметры эффекта
 * @returns {{ destroy(): void, setOptions(partial: Object): void }}
 */
export function createLiquidChrome(container, opts = {}) {
  if (!(container instanceof HTMLElement)) {
    throw new TypeError(
      "createLiquidChrome(container, opts): container must be an HTMLElement",
    );
  }

  const state = {
    baseColor: [0.8470588, 0.8509804, 0.8588235],
    speed: 0.2,
    amplitude: 0.3,
    frequencyX: 3,
    frequencyY: 3,
    interactive: true,
    ...opts,
  };

  const renderer = new Renderer({ antialias: true });
  const gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);

  const vertexShader = `
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform float uTime;
    uniform vec3 uResolution;
    uniform vec3 uBaseColor;
    uniform float uAmplitude;
    uniform float uFrequencyX;
    uniform float uFrequencyY;
    uniform vec2 uMouse;
    varying vec2 vUv;

    vec4 renderImage(vec2 uvCoord) {
        vec2 fragCoord = uvCoord * uResolution.xy;
        vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

        for (float i = 1.0; i < 10.0; i++){
            uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
            uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
        }

        vec2 diff = (uvCoord - uMouse);
        float dist = length(diff);
        float falloff = exp(-dist * 20.0);
        float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
        uv += (diff / (dist + 0.0001)) * ripple * falloff;

        vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
        return vec4(color, 1.0);
    }

    void main() {
        vec4 col = vec4(0.0);
        int samples = 0;
        for (int i = -1; i <= 1; i++){
            for (int j = -1; j <= 1; j++){
                vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
                col += renderImage(vUv + offset);
                samples++;
            }
        }
        gl_FragColor = col / float(samples);
    }
  `;

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: {
        value: new Float32Array([
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ]),
      },
      uBaseColor: { value: new Float32Array(state.baseColor) },
      uAmplitude: { value: state.amplitude },
      uFrequencyX: { value: state.frequencyX },
      uFrequencyY: { value: state.frequencyY },
      uMouse: { value: new Float32Array([0, 0]) },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  container.appendChild(gl.canvas);

  const resize = () => {
    const scale = 1;
    renderer.setSize(
      container.offsetWidth * scale,
      container.offsetHeight * scale,
    );

    const res = program.uniforms.uResolution.value;
    res[0] = gl.canvas.width;
    res[1] = gl.canvas.height;
    res[2] = gl.canvas.width / gl.canvas.height;
  };

  window.addEventListener("resize", resize);
  resize();

  const setMouseFromClient = (clientX, clientY) => {
    const rect = container.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = 1 - (clientY - rect.top) / rect.height;

    const m = program.uniforms.uMouse.value;
    m[0] = x;
    m[1] = y;
  };

  const handleMouseMove = e => setMouseFromClient(e.clientX, e.clientY);

  const handleTouchMove = e => {
    if (e.touches && e.touches.length > 0) {
      const t = e.touches[0];
      setMouseFromClient(t.clientX, t.clientY);
    }
  };

  const attachInput = () => {
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
  };

  const detachInput = () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("touchmove", handleTouchMove);
  };

  if (state.interactive) attachInput();

  let raf = 0;
  const update = t => {
    raf = requestAnimationFrame(update);
    program.uniforms.uTime.value = t * 0.001 * state.speed;
    renderer.render({ scene: mesh });
  };
  raf = requestAnimationFrame(update);

  const setOptions = (partial = {}) => {
    if (partial.baseColor) {
      state.baseColor = partial.baseColor;
      program.uniforms.uBaseColor.value = new Float32Array(state.baseColor);
    }
    if (typeof partial.speed === "number") state.speed = partial.speed;

    if (typeof partial.amplitude === "number") {
      state.amplitude = partial.amplitude;
      program.uniforms.uAmplitude.value = state.amplitude;
    }
    if (typeof partial.frequencyX === "number") {
      state.frequencyX = partial.frequencyX;
      program.uniforms.uFrequencyX.value = state.frequencyX;
    }
    if (typeof partial.frequencyY === "number") {
      state.frequencyY = partial.frequencyY;
      program.uniforms.uFrequencyY.value = state.frequencyY;
    }
    if (
      typeof partial.interactive === "boolean" &&
      partial.interactive !== state.interactive
    ) {
      state.interactive = partial.interactive;
      if (state.interactive) attachInput();
      else detachInput();
    }
  };

  const destroy = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    detachInput();

    if (gl.canvas.parentElement === container) {
      container.removeChild(gl.canvas);
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  return { destroy, setOptions };
}
