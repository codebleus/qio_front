var container = document.getElementById('canvas-webgl');

if (container) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000000
  );

  var uScale = (container.offsetWidth / 178960000) * 80000;

  var renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  var startTime = new Date().getTime();
  var currentTime = 0;

  var planetGeom = new THREE.SphereGeometry(Math.floor(6371 * uScale), 32, 32);
  var planetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var planet1 = new THREE.Mesh(planetGeom, planetMaterial);

  //planet1.mass = 0;

  planet1.mass = 59720 * uScale;
  scene.add(planet1);

  var planetGeom = new THREE.SphereGeometry(Math.floor(1737 * uScale), 32, 32);
  var planetMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
  var planet2 = new THREE.Mesh(planetGeom, planetMaterial);
  planet2.dist = 384400 * uScale;
  planet2.mass = 735 * uScale;
  //scene.add( planet2 );

  //	adding in multi-planet support (almost there)

  var geometry = new THREE.BufferGeometry();

  var uniforms = {
    time: { value: 1.0 },
    resolution: {
      value: new THREE.Vector2(container.offsetWidth, container.offsetHeight),
    },
    planet1: {
      value: new THREE.Vector4(
        planet1.position.x,
        planet1.position.y,
        planet1.position.z,
        planet1.mass
      ),
    },
    planet2: {
      value: new THREE.Vector4(
        planet2.position.x,
        planet2.position.y,
        planet2.position.z,
        planet2.mass
      ),
    },
  };

  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexshader1').textContent,
    fragmentShader: document.getElementById('fragmentshader1').textContent,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true,
  });

  var pointDist = 1;
  var lineScale = 22;
  var scale = Math.floor(64 * 8);
  var radius = Math.floor(196);
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var sizes = [];

  function mod(x, y) {
    return x % y;
  }

  for (var x = 0; x + pointDist < scale; x += pointDist) {
    for (var y = 0; y + pointDist < scale; y += pointDist) {
      for (var z = 0; z + pointDist < scale; z += pointDist) {
        if (
          (mod(x, lineScale) < 1 && mod(y, lineScale) < 1) ||
          (mod(y, lineScale) < 1 && mod(z, lineScale) < 1) ||
          (mod(x, lineScale) < 1 && mod(z, lineScale) < 1)
        ) {
          positions.push((x - scale / 2) * radius);
          positions.push((y - scale / 2) * radius);
          positions.push((z - scale / 2) * radius);
          sizes.push(1);
        }
      }
    }
  }

  geometry.addAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  //geometry.addAttribute( 'sPosition', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.addAttribute(
    'size',
    new THREE.Float32BufferAttribute(sizes, 1).setDynamic(true)
  );
  var spacetime = new THREE.Points(geometry, shaderMaterial);
  spacetime.position.x = 0;
  spacetime.position.y = 0;
  spacetime.position.z = 0;
  scene.add(spacetime);

  camera.position.y = 0;
  camera.position.x = 0;
  camera.position.z = 20000;

  function animate() {
    var now = new Date().getTime();
    currentTime = (now - startTime) / 1000;
    uniforms.time.value = currentTime;

    planet1.position.x = Math.cos(currentTime) * 2000;
    planet1.position.y = Math.sin(-currentTime) * 2000;

    planet2.position.x =
      planet1.position.x + Math.cos(currentTime) * planet2.dist * uScale;
    planet2.position.y =
      planet1.position.y + Math.sin(currentTime) * planet2.dist * uScale;

    uniforms.planet1.value = new THREE.Vector4(
      planet1.position.x,
      planet1.position.y,
      planet1.position.z,
      planet1.mass
    );
    uniforms.planet2.value = new THREE.Vector4(
      planet2.position.x,
      planet2.position.y,
      planet2.position.z,
      planet2.mass
    );

    scene.rotation.z += 0.0002;
    scene.rotation.y += 0.001;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
