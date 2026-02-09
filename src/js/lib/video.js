import { ScrollTrigger } from "gsap/all";
import videojs from "video.js";
import { removeClasses } from "../utils/utils";

const videos = document.querySelectorAll("[data-videojs]");
videos.forEach(video => {
  const autoplay =
    video.closest(".item-projects") || video.closest(".context-cases__item") ?
      false
    : "muted";
  let player = videojs(
    video,
    {
      autoplay,
      loop: true,
      muted: true,
      playsinline: true,
      normalizeAutoplay: true,
      noUITitleAttributes: true,
      disablePictureInPicture: true,
      controlBar: false,
      controls: false,
      bigPlayButton: false,
      titleBar: false,
      textTrackDisplay: false,
      paused: true,
    },
    function () {
      console.log(autoplay);
    },
  );

  setTimeout(() => {
    if (
      !player.el_.closest(".item-projects") &&
      !player.el_.closest(".context-cases__item")
    ) {
      player.ready(() => {
        player.play();
      });
    }
  }, 100);
});
window.addEventListener("load", function () {
  if (document.querySelector(".projects")) {
    document.addEventListener("mouseover", function (e) {
      if (
        e.target.closest(".item-projects__group") &&
        window.innerWidth > 768
      ) {
        document.querySelectorAll(".item-projects video").forEach(video => {
          videojs.getPlayer(video).pause();
        });
        document.querySelector(".projects").classList.add("_hover");
        removeClasses(
          document.querySelectorAll(".item-projects"),
          "_is-active",
        );
        e.target.closest(".item-projects").classList.add("_is-active");
        e.target
          .closest(".item-projects")
          .querySelectorAll("video")
          .forEach(video => {
            videojs.getPlayer(video).play();
          });
      } else if (window.innerWidth > 768) {
        document.querySelector(".projects").classList.remove("_hover");
        if (document.querySelector(".item-projects._is-active")) {
          document
            .querySelectorAll(".item-projects._is-active video")
            .forEach(video => {
              videojs.getPlayer(video).pause();
            });
          document
            .querySelector(".item-projects._is-active")
            .classList.remove("_is-active");
        }
      }
    });
  }
});
