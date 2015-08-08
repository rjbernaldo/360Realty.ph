var camera, scene, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();
var imageUrl = 'images/download2-resized.jpg';

init(imageUrl);
animate();

function init(imageUrl) {
  if (renderer) renderer = null;

  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 10, 0);
  scene.add(camera);

  controls = new THREE.OrbitControls(camera, element);
  controls.rotateUp(Math.PI / 4);
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );
  controls.noZoom = true;
  controls.noPan = true;

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }

  window.addEventListener('deviceorientation', setOrientationControls, true);

  var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  //var imageUrl = 'images/download2-resized.jpg';

  //var texture = THREE.ImageUtils.loadTexture(
  //  'textures/patterns/checker.png'
  //);
  var texture = THREE.ImageUtils.loadTexture(imageUrl);
  //texture.wrapS = THREE.RepeatWrapping;
  //texture.wrapT = THREE.RepeatWrapping;
  //texture.repeat = new THREE.Vector2(50, 50);
  //texture.anisotropy = renderer.getMaxAnisotropy();

  //var material = new THREE.MeshPhongMaterial({
  //  color: 0xffffff,
  //  specular: 0xffffff,
  //  shininess: 20,
  //  shading: THREE.FlatShading,
  //  map: texture
  //});
  var material = new THREE.MeshBasicMaterial({
    map: texture
  });

  //var geometry = new THREE.PlaneGeometry(1000, 1000);
  var geometry = new THREE.SphereGeometry(100, 32, 32);

  var mesh = new THREE.Mesh(geometry, material);
  //mesh.rotation.x = -Math.PI / 2;
  mesh.scale.x = -1;
  scene.add(mesh);

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  resize();

  camera.updateProjectionMatrix();

  controls.update(dt);
}

function render(dt) {
  effect.render(scene, camera);
}

function animate(t) {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}
