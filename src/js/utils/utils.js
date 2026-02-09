import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

export const randomNumber = () => {
  Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRange = (min, max) => {
  const range = [];
  for (let count = min; count <= max; count++) {
    range.push(count);
  }
  return range;
};

export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

export const invertColor = () => {
  const elements = document.querySelectorAll('[data-invert-color]');

  if (elements.length) {
    elements.forEach(element => {
      const color = '#' + element.getAttribute('style').split('#')[1];

      if (color) {
        if (color.length === 7) {
          const rgb = [
            parseInt(color.substring(1, 3), 16),
            parseInt(color.substring(3, 5), 16),
            parseInt(color.substring(5), 16),
          ];
          const luminance =
            (0.2126 * rgb[0]) / 255 +
            (0.7152 * rgb[1]) / 255 +
            (0.0722 * rgb[2]) / 255;

          if (luminance > 0.5) {
            element.classList.add('_is-light-color');
          }
        }
      }
    });
  }
};

export const customEase = CustomEase.create(
  'custom',
  'M0,0 C0.02,0.04 0.137,0.017 0.224,0.031 0.289,0.041 0.37,0.053 0.442,0.067 0.476,0.073 0.529,0.086 0.57,0.095 0.621,0.106 0.656,0.148 0.686,0.184 0.843,0.37 0.734,1 1,1 '
);

export const shuffle = array => {
  return Array(array.length)
    .fill(null)
    .map((_, i) => [Math.random(), i])
    .sort(([a], [b]) => a - b)
    .map(([, i]) => array[i]);
};

export const getOffset = element => {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  let rect = element.getBoundingClientRect();
  let win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
};

export const removeClasses = (items, className) => {
  if (items.length) {
    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      element.classList.remove(className);
    }
  }
};

export const dynamicDOM = () => {
  const sortByNumber = (a, b) => a.targetIdx - b.targetIdx;

  const elementsData = [];

  // create
  const mm = gsap.matchMedia();

  if (document.querySelectorAll('[data-dd]').length) {
    document.querySelectorAll('[data-dd]').forEach((element, idx) => {
      const parent = element.parentElement;
      const dataset = element.dataset.dd.trim().split(',');
      const data = {
        element,
        parent,
        target: document.querySelector(dataset[0]),
        targetIdx: +dataset[1],
        parentIdx: Array(parent.childNodes).indexOf(element),
      };
      elementsData.push(data);
    });
  }

  // add a media query. When it matches, the associated function will run
  mm.add('(max-width: 767px)', () => {
    // this setup code only runs when viewport is at least 800px wide

    elementsData.forEach(el => {
      const { element, target, targetIdx } = el;

      target.insertBefore(element, target.childNodes[targetIdx + 1]);
    });

    return () => {
      // optional
      // custom cleanup code here (runs when it STOPS matching)
      elementsData.forEach(el => {
        const { parent, element, parentIdx } = el;

        parent.insertBefore(element, parent.childNodes[parentIdx + 1]);
      });
    };
  });

  elementsData.sort(sortByNumber);
};

export const remToPx = rem => {
  const baseFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  const px = rem * baseFontSize;

  return px;
};
