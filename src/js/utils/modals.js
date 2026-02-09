import { lenis } from '../anim/lenis';

export const openModal = id => {
  if (document.getElementById(id)) {
    document.getElementById(id).classList.add('modal_show');
    document.documentElement.classList.add('modal-show');
    lenis.stop();
  }
};
export const closeModal = id => {
  if (document.getElementById(id)) {
    document.getElementById(id).classList.remove('modal_show');
    document.documentElement.classList.remove('modal-show');
    lenis.start();
  }
};
