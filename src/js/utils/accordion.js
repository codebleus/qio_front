import gsap from 'gsap';
import { removeClasses } from './utils';

const items = gsap.utils.toArray('[data-accordion]');

if (items.length) {
  items.forEach(accordion => {
    accordion.addEventListener('click', function (e) {
      if (e.target.closest('[data-accordion-item]._is-active')) {
        e.target
          .closest('[data-accordion-item]')
          .classList.remove('_is-active');
      } else if (e.target.closest('[data-accordion-item]')) {
        removeClasses(
          accordion.querySelectorAll('[data-accordion-item]'),
          '_is-active'
        );
        e.target.closest('[data-accordion-item]').classList.add('_is-active');
      }
    });
  });
}
