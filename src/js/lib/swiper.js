import Swiper from "swiper";
import {
  Pagination,
  Navigation,
  Autoplay,
  Mousewheel,
  Scrollbar,
  FreeMode,
  EffectFade,
} from "swiper/modules";
import "swiper/css/effect-fade";
import { removeClasses, remToPx } from "../utils/utils";
import gsap from "gsap";
import { lenis } from "../anim/lenis";
import { mm } from "../utils/script";

window.addEventListener("load", function () {
  if (document.querySelector(".prices__slider")) {
    mm.add("(max-width: 48em)", () => {
      const slider = new Swiper(".prices__slider", {
        speed: 1200,
        spaceBetween: remToPx(8),
        slidesPerView: "auto",
        breakpoints: {
          768: {
            spaceBetween: remToPx(5),
          },
        },
      });

      return () => {
        slider.destroy();
      };
    });
  }
  if (document.querySelector(".service-catalog__slider")) {
    mm.add("(max-width: 48em)", () => {
      const slider = new Swiper(".service-catalog__slider", {
        speed: 1200,
        spaceBetween: remToPx(4),
        slidesPerView: "auto",
      });

      return () => {
        slider.destroy();
      };
    });
  }
  if (document.querySelector(".progress__slider")) {
    const setProgress = swiper => {
      if (swiper.realIndex !== 0) {
        swiper.el.closest(".progress").classList.add("_slide");
      } else {
        swiper.el.closest(".progress").classList.remove("_slide");
      }

      let val = parseInt((swiper.realIndex / (swiper.slides.length - 1)) * 100);
      const $circle = document.querySelector(".progress__bar");

      if (isNaN(val)) {
        val = 100;
      } else {
        const r = $circle.getAttribute("r");
        const c = Math.PI * (r * 2);

        if (val < 0) {
          val = 0;
        }
        if (val > 100) {
          val = 100;
        }

        const pct = ((100 - val) / 100) * c;

        $circle.style.strokeDashoffset = pct;
      }
    };
    mm.add("(max-width: 48em)", context => {
      document
        .querySelectorAll(".progress__table-svg circle")
        .forEach(circle => {
          circle.setAttribute("r", remToPx(20));
          circle.setAttribute("stroke-dasharray", remToPx(140));
        });

      new Swiper(".progress__slider", {
        modules: [],
        speed: 300,
        slidesPerView: "auto",
        loop: true,
        spaceBetween: remToPx(5),
        on: {
          slideChange: swiper => {
            setProgress(swiper);
          },
        },
      });
    });
    mm.add("(min-width: 48.01em)", context => {
      document
        .querySelectorAll(".progress__table-svg circle")
        .forEach(circle => {
          circle.setAttribute("r", remToPx(17.5));
          circle.setAttribute("stroke-dasharray", remToPx(110));
        });

      new Swiper(".progress__slider", {
        modules: [Mousewheel],
        speed: 300,
        slidesPerView: "auto",
        centeredSlides: true,
        mousewheel: {
          releaseOnEdges: true,
        },
        on: {
          reachEnd: () => {
            document.querySelector(".progress").classList.remove("_is-in-view");

            setTimeout(() => {
              lenis.start();
            }, 300);
          },
          reachBeginning: () => {
            document.querySelector(".progress").classList.remove("_is-in-view");
            setTimeout(() => {
              lenis.start();
            }, 300);
          },
          slideChange: swiper => {
            setProgress(swiper);

            gsap.to(".progress__text-content._is-active", {
              opacity: 0,
              display: "none",
            });
            removeClasses(
              document.querySelectorAll(".progress__text-content"),
              "_is-active",
            );
            document
              .querySelectorAll(".progress__text-content")
              [swiper.realIndex].classList.add("_is-active");
            gsap.to(".progress__text-content._is-active", {
              opacity: 1,
              display: "block",
            });
          },
        },
      });
    });
    // mm.revert();
  }
  if (document.querySelector(".clients__slider")) {
    new Swiper(".clients__slider", {
      modules: [Autoplay],
      speed: 8000,
      slidesPerView: "auto",
      loop: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
    });
  }
  if (document.querySelector(".blog__filters-slider")) {
    new Swiper(".blog__filters-slider", {
      modules: [],
      speed: 1000,
      spaceBetween: 16,
      slidesPerView: "auto",
      slideToClickedSlide: true,
      breakpoints: {
        767: {
          spaceBetween: 8,
        },
      },
    });
  }
  if (document.querySelector(".approach__slider")) {
    new Swiper(".approach__slider", {
      modules: [Navigation, Autoplay],
      speed: 1200,
      spaceBetween: remToPx(5),
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 7500,
      },
      navigation: {
        prevEl: ".approach .controls__btn_prev",
        nextEl: ".approach .controls__btn_next",
      },
      breakpoints: {
        768: {
          slidesPerView: "auto",
        },
      },
    });
  }
  if (document.querySelector(".cases__slider")) {
    new Swiper(".cases__slider", {
      modules: [Navigation, Scrollbar, FreeMode],
      speed: 1200,
      spaceBetween: remToPx(4),
      slidesPerView: "auto",

      autoplay: {
        delay: 7500,
      },
      scrollbar: {
        el: ".cases .swiper-scrollbar",
        hide: false,
        draggable: true,
        dragSize: remToPx(5.6),
      },
      breakpoints: {
        768: {
          freeMode: true,
        },
      },
    });
  }

  if (document.querySelector(".blog__slider")) {
    new Swiper(".blog__slider", {
      modules: [Navigation],
      speed: 1200,
      spaceBetween: 20,
      slidesPerView: "auto",
      navigation: {
        prevEl: ".blog .nav-btn_prev",
        nextEl: ".blog .nav-btn_next",
      },
    });
  }
  if (document.querySelector(".context-hero__slider")) {
    new Swiper(".context-hero__slider", {
      modules: [EffectFade, Autoplay],
      allowTouchMove: false,
      effect: "fade",
      fadeEffect: { crossFade: true },
      loop: true,
      observer: true,
      observeParents: true,
      speed: 1000,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
    });
  }
  if (document.querySelector(".context-services__slider")) {
    new Swiper(".context-services__slider", {
      modules: [Navigation, Pagination],
      speed: 1200,
      spaceBetween: 25,
      slidesPerView: "auto",
      navigation: {
        prevEl: ".context-services__carousel .context-services__nav-btn_prev",
        nextEl: ".context-services__carousel .context-services__nav-btn_next",
      },
      pagination: {
        el: ".context-services__pagination",
        type: "bullets",
      },
    });
  }
  if (document.querySelector(".reviews__slider")) {
    new Swiper(".reviews__slider", {
      modules: [Navigation],
      speed: 1200,
      spaceBetween: 80,
      centeredSlidesBounds: true,
      centeredSlides: true,
      loop: true,
      navigation: {
        prevEl: ".reviews .nav-btn_prev",
        nextEl: ".reviews .nav-btn_next",
      },
    });
  }
});
