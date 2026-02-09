import gsap, { Power2, Power3 } from 'gsap';

if (document.getElementById('dots-canvas')) {
  const el = document.getElementById('dots-canvas');

  class Canvas {
    constructor() {
      this.domElement = document.getElementById('dots-canvas');

      this.context = this.domElement.getContext('2d');
      this.setSize();
      window.addEventListener('resize', () => {
        this.setSize();
      });
    }

    getContext() {
      return this.context;
    }

    setSize() {
      this.domElement.width = window.innerWidth;
      this.domElement.height = window.innerHeight;
    }

    getSize() {
      return {
        width: this.domElement.width,
        height: this.domElement.height,
      };
    }

    clear() {
      const { width, height } = this.getSize();
      this.context.clearRect(0, 0, width, height);
      this.context.fillStyle = '#ffffff';
      this.context.fillRect(0, 0, width, height);
    }
  }

  class Point {
    constructor(x, y, radius = 3) {
      this.startX = x;
      this.startY = y;
      this.x = x;
      this.y = y;
      this.fill = Math.random() > 0.5 ? '#ffffff' : '#0d0d0d';
      this.radius = radius;
    }

    render(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.fill;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#0d0d0d';
      ctx.stroke();
      ctx.fill();
    }
  }

  let ev = {
    clientX: 0,
    clientY: 0,
  };

  const canvas = new Canvas();
  canvas.clear();
  const { width, height } = canvas.getSize();
  const points = [];
  const interval = 80;
  let attractive = 100;

  const render = () => {
    canvas.clear();

    points.forEach(point => {
      const squareRoot = Math.sqrt(
        Math.pow(Math.abs(ev.clientX - point.startX), 2) +
          Math.pow(Math.abs(ev.clientY - point.startY), 2)
      );
      if (squareRoot < attractive) {
        gsap.killTweensOf(point);
        const xDirection = Math.sign(ev.clientX - point.startX);
        const yDirection = Math.sign(ev.clientY - point.startY);
        let forceX = Math.abs(ev.clientX - point.startX) / 6;
        let forceY = Math.abs(ev.clientY - point.startY) / 6;

        gsap.to(point, {
          x: point.startX + forceX * xDirection,
          y: point.startY + forceY * yDirection,
          ease: Power2.easeInOut,
        });
      } else {
        if (!gsap.isTweening(point)) {
          gsap.to(point, {
            x: point.startX,
            y: point.startY,
            ease: Power3.easeInOut,
            delay: 0.1,
          });
        }
      }
      point.render(canvas.getContext());
    });

    requestAnimationFrame(render);
  };

  for (let x = interval; x < width - interval; x += interval) {
    for (let y = interval; y < height - interval; y += interval) {
      const point = new Point(x, y);
      points.push(point);
    }
  }

  const getByX = x => {
    return points.filter(point => {
      return point.x === x;
    });
  };

  const getByY = y => {
    return points.filter(point => {
      return point.y === y;
    });
  };

  el.addEventListener('mousedown', ev => {
    attractive = 350;
  });

  el.addEventListener('mouseup', ev => {
    attractive = 150;
  });

  el.addEventListener('mousemove', event => {
    ev.clientX = event.clientX;
    ev.clientY = event.clientY;
  });

  render();
}
