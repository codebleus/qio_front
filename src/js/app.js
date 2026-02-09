import "../scss/style.scss";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

import "./utils/script.js";
import "./utils/forms.js";
import "./utils/anchors.js";
import "./utils/marquee.js";
import "./utils/accordion.js";
import "./utils/modals.js";

import "./lib/lib.js";
import "./anim/anim.js";

import "./dot-range.js";
import { createLiquidChrome } from "./LiquidChrome/LiquidChrome.js";
// import { createGlassSurface } from "./GlassSurface.js";

document.addEventListener("DOMContentLoaded", function () {
  // const el1 = document.getElementById("chrome");
  // createLiquidChrome(el1, {
  //   baseColor: [0.8470588, 0.8509804, 0.8588235],
  //   speed: 0.2,
  //   amplitude: 0.3,
  //   frequencyX: 3,
  //   frequencyY: 3,
  //   interactive: false,
  // });
  // const el2 = document.getElementById("chrome2");
  // createLiquidChrome(el2, {
  //   baseColor: [0.027451, 0.027451, 0.027451],
  //   speed: 0.2,
  //   amplitude: 0.3,
  //   frequencyX: 3,
  //   frequencyY: 3,
  //   interactive: false,
  // });
  // const roots = document.querySelectorAll("[data-glass-el]");
  // if (roots.length) {
  //   roots.forEach(root => {
  //     const glass = createGlassSurface({
  //       width: "100%",
  //       height: "100%",
  //       borderRadius: root.closest(".lower-bar") ? 25 : 10,
  //       content: "",
  //     });
  //     glass.el.style.position = "absolute";
  //     glass.el.style.left = "50%";
  //     glass.el.style.top = "50%";
  //     glass.el.style.transform = "translate(-50%, -50%)";
  //     root.style.position = "relative";
  //     root.appendChild(glass.el);
  //   });
  // }
});
