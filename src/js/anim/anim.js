import './lenis';
import './scramble-text';
import './particles';
import './dots';
import gsap from 'gsap';
import Lottie from 'lottie-web';

const lottieItems = gsap.utils.toArray('.c-lottie-icon');

if (lottieItems) {
  lottieItems.forEach(lottieItem => {
    Lottie.loadAnimation({
      container: lottieItem, // Required
      path: lottieItem.dataset.lottiePlayerPath, // Required
      renderer: 'svg', // Required
      loop: true, // Optional
      autoplay: true, // Optional
    });
  });
}
