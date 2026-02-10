import gsap from "gsap";
import { dynamicDOM, getRange, invertColor, removeClasses } from "./utils";
import { lenis } from "../anim/lenis";
import { ScrollTrigger } from "gsap/all";
import { waves } from "../anim/waves";
import { animNextProject } from "../anim/next-project";
import Splitting from "splitting";
import { closeModal, openModal } from "./modals";
import videojs from "video.js";

export const mm = gsap.matchMedia();

const observeWorkflow = () => {
  mm.add("(min-width: 48.01em)", () => {
    const slides = gsap.utils.toArray(".progress__group");
    const slidesAmount = slides.length;

    gsap.to(slides, {
      ease: "none",
      duration: slides.length,
      xPercent: -(100 * (slidesAmount - 3.7)),
      scrollTrigger: {
        trigger: ".progress",
        start: "center center",
        end: "+=" + 10 * slidesAmount + "%",
        scrub: true,
        pin: true,
        snap: 1 / (slidesAmount - 1),
      },
    });
  });
};

const observe = (anchors, triggers, start) => {
  const isMainpage = document.querySelector(".hero");
  const anc = anchors.map(el => el.parentElement);
  if (anchors && triggers) {
    const addActiveClass = idx => {
      if (isMainpage) {
        removeClasses(anc, "_is-active");
        anchors[idx].parentElement.classList.add("_is-active");
        if (document.querySelector(".nav__scroll-btn")) {
          if (idx === anchors.length - 1) {
            document
              .querySelector(".nav__scroll-btn_up")
              .classList.add("_is-active");
            document
              .querySelector(".nav__scroll-btn_down")
              .classList.remove("_is-active");
          } else {
            document
              .querySelector(".nav__scroll-btn_up")
              .classList.remove("_is-active");
            document
              .querySelector(".nav__scroll-btn_down")
              .classList.add("_is-active");
          }
        }
      } else {
        removeClasses(anchors, "_is-active");
        anchors[idx].classList.add("_is-active");
      }
    };

    triggers.forEach((trigger, idx) => {
      ScrollTrigger.create({
        trigger,
        start:
          idx === 0 || (idx === triggers.length - 1 && isMainpage) ?
            "center 59%"
          : isMainpage && idx !== 0 && idx !== triggers.length - 1 ?
            "center 70%"
          : start,
        end: isMainpage ? "bottom center" : "bottom top",
        onEnter: () => {
          addActiveClass(idx);
        },
        onLeaveBack: () => {
          addActiveClass(idx);
        },
        onEnterBack: () => {
          isMainpage && addActiveClass(idx);
        },
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    if (document.querySelector(".context-cases__item")) {
      const items = document.querySelectorAll(".context-cases__item");

      items.forEach(item => {
        const videoEl = item.querySelector("video[data-videojs]");
        if (!videoEl) return;

        const player = videojs(videoEl);

        player.ready(() => {
          player.pause();
          player.currentTime(0);
          player.hasStarted(false);
        });

        item.addEventListener("mouseenter", () => {
          player.play();
        });

        item.addEventListener("mouseleave", () => {
          player.pause();
          player.hasStarted(false);
        });
      });
    }
  }, 0);
  const initResultsCompare = (
    container,
    {
      itemSelector = ".context-tech__bg-wrap",
      rulerSelector = ".context-tech__ruler",
      resetTo = 0.5,
      resetOnLeave = true,
      resetOnTouchEnd = false,
      min = 0,
      max = 1,
      swiper = null,
      disableSwiperTouchOnHover = true,
    } = {},
  ) => {
    const root =
      typeof container === "string" ?
        document.querySelector(container)
      : container;
    if (!root) return null;

    const ruler = root.querySelector(rulerSelector);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    let activeWrap = null;
    let raf = 0;
    let pending = null;

    let dragging = false;
    let pointerId = null;
    let startX = 0;
    let dragMoved = false;

    const setSplit = (wrap, split) => {
      wrap.style.setProperty("--split", split);
      if (ruler) root.style.setProperty("--ruler", split);
    };

    const schedule = (wrap, clientX) => {
      pending = { wrap, clientX };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!pending) return;
        const { wrap: w, clientX: x } = pending;
        pending = null;

        const rect = w.getBoundingClientRect();
        const raw = (x - rect.left) / rect.width;
        const split = clamp(raw, min, max);
        setSplit(w, split);
      });
    };

    const onPointerDown = e => {
      const wrap = e.target.closest(itemSelector);
      if (!wrap || !root.contains(wrap)) return;

      activeWrap = wrap;
      pointerId = e.pointerId;
      dragging = true;
      dragMoved = false;
      startX = e.clientX;

      if (!getComputedStyle(wrap).getPropertyValue("--split")) {
        wrap.style.setProperty("--split", resetTo);
      }

      if (disableSwiperTouchOnHover && swiper) swiper.allowTouchMove = false;

      try {
        wrap.setPointerCapture(pointerId);
      } catch {}
      root.style.touchAction = "none";

      schedule(wrap, e.clientX);
      e.preventDefault();
      e.stopPropagation();
    };

    const onPointerMove = e => {
      if (!dragging || e.pointerId !== pointerId || !activeWrap) return;
      if (Math.abs(e.clientX - startX) > 3) dragMoved = true;
      schedule(activeWrap, e.clientX);
      e.preventDefault();
      e.stopPropagation();
    };

    const endDrag = () => {
      if (disableSwiperTouchOnHover && swiper) swiper.allowTouchMove = true;
      if (resetOnTouchEnd && activeWrap) setSplit(activeWrap, resetTo);
      dragging = false;
      pointerId = null;
      activeWrap = null;
      root.style.touchAction = "";
    };

    const onPointerUp = e => {
      if (e.pointerId === pointerId) endDrag();
    };
    const onPointerCancel = e => {
      if (e.pointerId === pointerId) endDrag();
    };

    const onClick = e => {
      if (dragMoved) return;
      const wrap = e.target.closest(itemSelector);
      if (!wrap || !root.contains(wrap)) return;

      if (!getComputedStyle(wrap).getPropertyValue("--split")) {
        wrap.style.setProperty("--split", resetTo);
      }
      schedule(wrap, e.clientX);
    };

    root.addEventListener("pointerdown", onPointerDown, { passive: false });
    root.addEventListener("pointermove", onPointerMove, { passive: false });
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerCancel);
    root.addEventListener("click", onClick);

    let swiperReset = null;
    if (swiper && typeof swiper.on === "function") {
      swiperReset = () => {
        const activeSlide = swiper.slides?.[swiper.activeIndex];
        if (!activeSlide) return;
        const wraps = activeSlide.querySelectorAll(itemSelector);
        if (!wraps.length) return;
        wraps.forEach(w => setSplit(w, resetTo));
      };
      swiper.on("slideChangeTransitionStart", swiperReset);
      swiperReset();
    }

    return {
      destroy() {
        root.removeEventListener("pointerdown", onPointerDown);
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerup", onPointerUp);
        root.removeEventListener("pointercancel", onPointerCancel);
        root.removeEventListener("click", onClick);
        if (raf) cancelAnimationFrame(raf);
        if (disableSwiperTouchOnHover && swiper) swiper.allowTouchMove = true;
        root.style.touchAction = "";

        if (swiper && typeof swiper.off === "function" && swiperReset) {
          swiper.off("slideChangeTransitionStart", swiperReset);
        }
      },
    };
  };
  if (document.querySelector(".context-tech__bg-wrap")) {
    initResultsCompare(".context-tech__bg-wrap");
  }

  if (document.querySelectorAll("[data-current-year]").length) {
    document.querySelectorAll("[data-current-year]").forEach(item => {
      item.innerHTML = new Date().getFullYear();
    });
  }

  (function () {
    const bar = document.querySelector(".lower-bar_main");
    const target = document.querySelector(".footer");

    if (!bar || !target) return;

    const setHidden = isHidden => {
      bar.classList.toggle("_is-hidden", isHidden);
    };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setHidden(entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0.01,
      },
    );

    observer.observe(target);
  })();

  document.addEventListener("formSubmitted", function (e) {
    openModal("messageModal");
  });

  const onClickHandler = e => {
    if (
      e.target.closest(".modal-show") &&
      (!e.target.closest(".modal__content") ||
        e.target.closest(".modal__close"))
    ) {
      closeModal(document.querySelector(".modal_show").id);
    }
    if (
      e.target.closest("._show-menu") &&
      (!e.target.closest(".menu") || e.target.closest(".menu__close-btn"))
    ) {
      document.documentElement.classList.remove("_show-menu");

      lenis.start();
    } else if (e.target.closest(".header__hamburger")) {
      document.documentElement.classList.add("_show-menu");

      lenis.stop();
    }
  };

  const hoverItems = gsap.utils.toArray("[data-splitting]");

  document.addEventListener("click", onClickHandler);

  if (hoverItems) {
    hoverItems.forEach(el => {
      if (!el.hasAttribute("data-scramble-text")) {
        Splitting({ target: el });
      }
    });
  }
});
window.addEventListener("load", function () {
  dynamicDOM();
  invertColor();

  document.documentElement.classList.add("_page-loaded");

  if (document.getElementById("waves-bg")) {
    waves();
  }

  if (document.querySelector(".next-project") && window.innerWidth > 768) {
    animNextProject();
  }

  ScrollTrigger.refresh();

  if (document.querySelector(".services__group")) {
    ScrollTrigger.create({
      trigger: ".services",
      start: `${
        (70 / document.querySelector(".services__group").offsetHeight) * 100
      }% center`,
      onEnter: () => {
        observe(
          gsap.utils.toArray(".services__list-item"),
          gsap.utils.toArray(".services__group"),
          "center center",
        );
      },
    });
  }

  if (document.querySelector(".progress__group")) {
    observeWorkflow();
  }

  if (document.querySelector(".mainpage")) {
    observe(
      gsap.utils.toArray(".nav__list [data-anchor]"),
      gsap.utils.toArray("[data-section]"),
      "center center",
    );
  }

  if (document.querySelector(".process__table-head")) {
    let len = document.querySelectorAll(".process__table-head").length;
    const rows = gsap.utils.toArray(".process__row");

    const arr = [];

    gsap.set(".process__table", {
      gridTemplateColumns: `repeat(${len}, minmax(${
        window.innerWidth < 768 ? 30 : 15
      }rem, 1fr))`,
    });

    rows.forEach(rowItem => {
      const col = rowItem.dataset.column;
      const row = rowItem.dataset.row;

      arr.push(`${col},${row}`);

      if (rowItem.classList.contains("process__row_large")) {
        gsap.set(rowItem, {
          gridColumn: `${col}/${col + (len - +col)}`,
          gridRowStart: `${row}`,
        });
      } else {
        gsap.set(rowItem, {
          gridColumnStart: `${col}`,
          gridRowStart: `${row}`,
        });
      }
    });

    const createElement = () => {
      const el = document.createElement("div");
      el.classList.add("process__row");
      document.querySelector(".process__table").appendChild(el);
      return el;
    };

    const rowsCount = arr[arr.length - 1].split(",")[1];
    const rowsRange = rowsCount < 5 ? [1, 2, 3, 4] : getRange(1, rowsCount);
    const columnsRange = getRange(1, len);

    rowsRange.forEach((row, rowI) => {
      columnsRange.forEach((col, colI) => {
        const c = colI + 1;
        const r = rowI + 1;
        if (!arr.includes(`${c},${r}`)) {
          const el = createElement();
          gsap.set(el, {
            gridColumnStart: `${c}`,
            gridRowStart: `${r === 1 ? 2 : r}`,
          });
        }
      });
    });
  }

  if (document.querySelector(".info .option-btn__input")) {
    const groups = gsap.utils.toArray(".info__group");

    setTimeout(() => {
      gsap.set(".info__content", {
        height: `${groups[0].offsetHeight + 40}px`,
      });
    }, 0);

    document
      .querySelectorAll(".info .option-btn__input")
      .forEach((input, idx) => {
        input.addEventListener("change", function () {
          if (input.checked && groups[idx]) {
            removeClasses(groups, "_is-active");
            groups[idx].classList.add("_is-active");

            gsap.to(".info__content", { height: groups[idx].offsetHeight });
          }
        });
      });
  }

  if (document.querySelector(".hero"))
    document.documentElement.classList.add("homepage");

  if (document.querySelector(".error-message__nums")) {
    const parent = document.querySelector(".error-message__nums");
    const data = parent.dataset.errorCode.split("");
    const arr = getRange(1, 80);

    for (let i = 0; i < arr.length; i++) {
      const el = document.createElement("span");
      el.classList.add("particle");
      el.innerHTML =
        i <= 20 ? data[0]
        : i <= 40 ? data[1]
        : data[2];
      parent.appendChild(el);
    }
  }
});
window.addEventListener("pageswap", function () {});
