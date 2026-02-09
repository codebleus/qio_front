import gsap from 'gsap';

const mm = gsap.matchMedia();

export const animNextProject = () => {
  mm.add('(min-width: 48em)', () => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.next-project',
          pin: true,
          scrub: true,
          pinType: 'transform',
          onLeaveBack: () => {
            document
              .querySelector('.next-project')
              .classList.remove('_is-active');
          },
          onEnter: () => {
            document.querySelector('.next-project').classList.add('_is-active');
          },
        },
      })
      .fromTo(
        '.next-project__wrap',
        { top: '30rem' },
        {
          top: 0,
        }
      )
      .fromTo('.next-project__image-wrap', { scale: 0.75 }, { scale: 1 }, 0);
  });
};
