var _properties = [
  {
    id: 0,
    name: '#30Z Greenbelt Suites',
    description: 'Beautiful villa facing greenbelt lorem ipsum blabla etc yadayada description ipsum.',
    photospheres: [
      {
        name: 'Balcony',
        imageUrl: 'photosphere/images/a-resized.jpg'
      }
    ]
  },
  {
    id: 1,
    name: '#501 Glorietta Apartments',
    description: 'One bedroom, one bathroom apartment 100sqm facing bla',
    photospheres: [
      {
        name: 'Balcony',
        imageUrl: 'photosphere/images/b-resized.jpg'
      }
    ]
  },
  {
    id: 2,
    name: '#240J Studio Loft',
    description: 'Near blabla mall, walking distance from etc food',
    photospheres: [
      {
        name: 'Balcony',
        imageUrl: 'photosphere/images/c-resized.jpg'
      }
    ]
  },
  {
    id: 3,
    name: '#55N Penthouse',
    description: 'Penthouse at the top of blabla mountain',
    photospheres: [
      {
        name: 'Balcony',
        imageUrl: 'photosphere/images/d-resized.jpg'
      }
    ]
  },
  {
    id: 4,
    name: '#11Z Richbelt Terraces',
    description: 'First floor facing beautiful garden',
    photospheres: [
      {
        name: 'Balcony',
        imageUrl: 'photosphere/images/e-resized.jpg'
      }
    ]
  }
];

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);
  //
  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.properties = _properties;
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
  var property = _properties[$stateParams.propertyId];

  var camera, scene, renderer;
  var effect, controls;
  var element, container;

  var clock = new THREE.Clock();

  console.log(property.photospheres[0].imageUrl);
  init(property.photospheres[0].imageUrl);
  animate();
  // fullscreen();

  function init(imageUrl) {
    if (camera) camera = null;
    if (scene) scene = null;
    if (renderer) renderer = null;
    if (effect) effect = null;
    if (controls) controls = null;
    if (element) {
      container.removeChild(element);
      element = null;
    }
    //if (container) container = null;

    renderer = new THREE.WebGLRenderer();
    element = renderer.domElement;
    container = document.getElementById('photosphere');
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

    window.mesh = mesh;
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

});
