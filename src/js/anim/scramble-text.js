import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Splitting from 'splitting';
gsap.registerPlugin(ScrollTrigger);

export function genString() {
  let len = anime.random(10, 69);
  let arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return btoa(arr).replaceAll('=', '').substr(0, len);
}

let dmp = new diff_match_patch();
const elements = document.querySelectorAll('main [data-scramble-text]');

if (elements.length) {
  elements.forEach(el => {
    el.innerHTML = ' ';
    ScrollTrigger.create({
      trigger: el,
      once: true,
      onEnter: () => {
        scramble(el, () => {
          el.addEventListener('mouseenter', function () {
            el.removeAttribute('data-scramble-text');

            gsap.to(el.querySelectorAll('.char'), {
              opacity: 0,
              duration: 0.3,
              'clip-path': 'inset(0% 100% 0% 100%)',
            });
            gsap.to(el.querySelectorAll('.char'), {
              opacity: 1,
              stagger: 0.05,
              'clip-path': 'inset(0% 0% 0% 0%)',
              delay: 0.3,
            });
          });
        });
      },
    });
  });
}

export async function scramble(newText, callback) {
  let el = newText;
  newText = newText.dataset.scrambleText
    ? newText.dataset.scrambleText
    : newText.dataset.scrambleHover;
  let text = el.textContent;
  let diff = dmp.diff_main(text, newText);
  // dmp.diff_cleanupSemantic(diff)

  let obj = [];
  let rems = [];
  let adds = [];

  el.innerHTML = '';
  for (let str of diff) {
    if (str[0] == -1) {
      let substr = document.createElement('div');
      substr.textContent = str[1];
      substr.className = 'remove';
      rems.push(substr);
      el.appendChild(substr);
    } else if (str[0] == 1) {
      let substr = document.createElement('div');
      substr.textContent = str[1];
      substr.className = 'add';
      adds.push(substr);
      el.appendChild(substr);
    } else if (str[0] == 0) {
      let substr = document.createElement('div');
      substr.textContent = str[1];
      el.appendChild(substr);
    }
  }
  gsap.to(rems, { width: 0, duration: 2, stagger: 2, ease: 'sine.inOut' });

  adds.forEach(add => {
    gsap.fromTo(
      add,
      { opacity: 0, width: 0 },
      {
        opacity: 1,
        width: add.offsetWidth,
        stagger: 2,
        duration: 2,
        ease: 'sine.inOut',
        onComplete: () => {
          el.textContent = newText;

          setTimeout(() => {
            if (el.hasAttribute('data-splitting')) {
              Splitting({ target: el });

              if (callback) {
                callback();
              }
            }
          }, 0);
        },
      }
    );
  });
}
