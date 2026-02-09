let __glassSurfaceCounter = 0;

function makeId() {
  __glassSurfaceCounter += 1;
  return `gs-${Date.now().toString(36)}-${__glassSurfaceCounter}`;
}

function supportsSVGFilters(filterId) {
  if (typeof window === "undefined" || typeof document === "undefined")
    return false;

  const isWebkit =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);

  if (isWebkit || isFirefox) return false;

  const div = document.createElement("div");
  div.style.backdropFilter = `url(#${filterId})`;
  return div.style.backdropFilter !== "";
}

export function createGlassSurface(options = {}) {
  const {
    content = null,
    width = 200,
    height = 80,
    borderRadius = 20,
    className = "",
    style = {},
    borderWidth = 0.07,
    brightness = 50,
    opacity = 0.93,
    blur = 11,
    displace = 0,
    backgroundOpacity = 0,
    saturation = 1,
    distortionScale = -180,
    redOffset = 0,
    greenOffset = 10,
    blueOffset = 20,
    xChannel = "R",
    yChannel = "G",
    mixBlendMode = "difference",
  } = options;

  const uniqueId = makeId();
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const el = document.createElement("div");
  el.className = `glass-surface ${className}`.trim();

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.classList.add("glass-surface__filter");

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const filter = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "filter",
  );
  filter.setAttribute("id", filterId);
  filter.setAttribute("color-interpolation-filters", "sRGB");
  filter.setAttribute("x", "0%");
  filter.setAttribute("y", "0%");
  filter.setAttribute("width", "100%");
  filter.setAttribute("height", "100%");

  const feImage = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feImage",
  );
  feImage.setAttribute("x", "0");
  feImage.setAttribute("y", "0");
  feImage.setAttribute("width", "100%");
  feImage.setAttribute("height", "100%");
  feImage.setAttribute("preserveAspectRatio", "none");
  feImage.setAttribute("result", "map");

  const redChannel = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feDisplacementMap",
  );
  redChannel.setAttribute("in", "SourceGraphic");
  redChannel.setAttribute("in2", "map");
  redChannel.setAttribute("id", "redchannel");
  redChannel.setAttribute("result", "dispRed");

  const redMatrix = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feColorMatrix",
  );
  redMatrix.setAttribute("in", "dispRed");
  redMatrix.setAttribute("type", "matrix");
  redMatrix.setAttribute(
    "values",
    `1 0 0 0 0
     0 0 0 0 0
     0 0 0 0 0
     0 0 0 1 0`,
  );
  redMatrix.setAttribute("result", "red");

  const greenChannel = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feDisplacementMap",
  );
  greenChannel.setAttribute("in", "SourceGraphic");
  greenChannel.setAttribute("in2", "map");
  greenChannel.setAttribute("id", "greenchannel");
  greenChannel.setAttribute("result", "dispGreen");

  const greenMatrix = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feColorMatrix",
  );
  greenMatrix.setAttribute("in", "dispGreen");
  greenMatrix.setAttribute("type", "matrix");
  greenMatrix.setAttribute(
    "values",
    `0 0 0 0 0
     0 1 0 0 0
     0 0 0 0 0
     0 0 0 1 0`,
  );
  greenMatrix.setAttribute("result", "green");

  const blueChannel = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feDisplacementMap",
  );
  blueChannel.setAttribute("in", "SourceGraphic");
  blueChannel.setAttribute("in2", "map");
  blueChannel.setAttribute("id", "bluechannel");
  blueChannel.setAttribute("result", "dispBlue");

  const blueMatrix = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feColorMatrix",
  );
  blueMatrix.setAttribute("in", "dispBlue");
  blueMatrix.setAttribute("type", "matrix");
  blueMatrix.setAttribute(
    "values",
    `0 0 0 0 0
     0 0 0 0 0
     0 0 1 0 0
     0 0 0 1 0`,
  );
  blueMatrix.setAttribute("result", "blue");

  const blendRG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feBlend",
  );
  blendRG.setAttribute("in", "red");
  blendRG.setAttribute("in2", "green");
  blendRG.setAttribute("mode", "screen");
  blendRG.setAttribute("result", "rg");

  const blendRGB = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feBlend",
  );
  blendRGB.setAttribute("in", "rg");
  blendRGB.setAttribute("in2", "blue");
  blendRGB.setAttribute("mode", "screen");
  blendRGB.setAttribute("result", "output");

  const gaussianBlur = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feGaussianBlur",
  );
  gaussianBlur.setAttribute("in", "output");
  gaussianBlur.setAttribute("stdDeviation", "0.7");

  filter.appendChild(feImage);

  filter.appendChild(redChannel);
  filter.appendChild(redMatrix);

  filter.appendChild(greenChannel);
  filter.appendChild(greenMatrix);

  filter.appendChild(blueChannel);
  filter.appendChild(blueMatrix);

  filter.appendChild(blendRG);
  filter.appendChild(blendRGB);
  filter.appendChild(gaussianBlur);

  defs.appendChild(filter);
  svg.appendChild(defs);

  // Content wrapper
  const contentWrap = document.createElement("div");
  contentWrap.className = "glass-surface__content";

  if (content instanceof HTMLElement) {
    contentWrap.appendChild(content);
  } else if (typeof content === "string") {
    contentWrap.innerHTML = content;
  }

  el.appendChild(svg);
  el.appendChild(contentWrap);

  const state = {
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    backgroundOpacity,
    saturation,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode,
    style,
  };

  const applyContainerStyle = () => {
    Object.assign(el.style, state.style || {});
    el.style.width =
      typeof state.width === "number" ? `${state.width}px` : state.width;
    el.style.height =
      typeof state.height === "number" ? `${state.height}px` : state.height;
    el.style.borderRadius = `${state.borderRadius}px`;

    el.style.setProperty("--glass-frost", String(state.backgroundOpacity));
    el.style.setProperty("--glass-saturation", String(state.saturation));
    el.style.setProperty("--filter-id", `url(#${filterId})`);
  };

  const generateDisplacementMap = () => {
    const rect = el.getBoundingClientRect();
    const actualWidth = rect.width || 400;
    const actualHeight = rect.height || 200;
    const edgeSize =
      Math.min(actualWidth, actualHeight) * (state.borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${state.borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${state.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${state.mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${state.borderRadius}" fill="hsl(0 0% ${state.brightness}% / ${state.opacity})" style="filter:blur(${state.blur}px)" />
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    feImage.setAttribute("href", generateDisplacementMap());

    [
      { node: redChannel, offset: state.redOffset },
      { node: greenChannel, offset: state.greenOffset },
      { node: blueChannel, offset: state.blueOffset },
    ].forEach(({ node, offset }) => {
      node.setAttribute("scale", String(state.distortionScale + offset));
      node.setAttribute("xChannelSelector", state.xChannel);
      node.setAttribute("yChannelSelector", state.yChannel);
    });

    gaussianBlur.setAttribute("stdDeviation", String(state.displace));
  };

  const svgSupported = supportsSVGFilters(filterId);
  el.classList.toggle("glass-surface--svg", svgSupported);
  el.classList.toggle("glass-surface--fallback", !svgSupported);

  applyContainerStyle();
  queueMicrotask(updateDisplacementMap);

  const ro = new ResizeObserver(() => {
    setTimeout(updateDisplacementMap, 0);
  });
  ro.observe(el);

  const setOptions = (partial = {}) => {
    Object.assign(state, partial);

    applyContainerStyle();
    updateDisplacementMap();
  };

  const destroy = () => {
    ro.disconnect();
  };

  return {
    el,
    contentEl: contentWrap,
    setOptions,
    destroy,
  };
}
