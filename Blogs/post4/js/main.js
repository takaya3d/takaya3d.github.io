let Colors = {
  white: 0xffffff,
  black: 0x000000,
  darkGrey: 0x4d4b54,
  thrusterOrange: 0xfea036
};


let SmokeColors = [
  0xe6b422,
  0xe4dc8a,
  0xc89932,
  0xfbd575,
  0xe6b422
];


let rot = 0,
  mouseY = 0;

let controls;

//OBJLoadによるモデルは、小要素まで個別にアニメーション可能！！


// 空で定義する場合は、元の値は取れないと思ったほうがいい。
let RocketMesh = new THREE.Object3D();
let blade = new THREE.Object3D();


function init() {
  createScene();
  createLights();
  createRocket();
  loop();
}






let scene, HEIGHT, WIDTH;
let renderer, container;
let camera, aspectRatio, fieldOfView, nearPlane, farPlane;
let uniforms = {
  resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  time: { value: 0.1 }
}

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();



  scene.fog = new THREE.Fog(0xf7d9aa, 300, 950);

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 90;
  nearPlane = 1;
  farPlane = 950;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  camera.position.x = -65;
  camera.position.z = 70;
  camera.position.y = 50;

  // Position the camera
  if(WIDTH < 400) {
    camera.position.x = -155;
    camera.position.z = 100;
    camera.position.y = 50;
  } else if(WIDTH < 768){
    camera.position.x = -105;
    camera.position.z = 80;
    camera.position.y = 50;
  } else {
    camera.position.x = -65;
    camera.position.z = 70;
    camera.position.y = 50;
  }
  camera.lookAt(new THREE.Vector3(0,0,0));


  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  document.addEventListener('mousemove', (event) => {
    mouseY = event.pageY;
  })
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);

};

let hemisphereLight, ambientLight, shadowLight, burnerLight;

const createLights = () => {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  ambientLight = new THREE.AmbientLight(0xccb8b4, 0.6);
  scene.add(ambientLight);
  shadowLight = new THREE.DirectionalLight(0xfff000, 0.8);
  shadowLight.position.set(50, 150, 0);
  shadowLight.castShadow = true;


  burnerLight = new THREE.DirectionalLight(Colors.thrusterOrange, 6.75);
  burnerLight.position.set(0, -5, 0);
  burnerLight.castShadow = true;
  burnerLight.shadow.camera.left = -100;
  burnerLight.shadow.camera.right = 100;
  shadowLight.shadow.camera.top = 100;
  burnerLight.shadow.camera.bottom = -100;
  burnerLight.shadow.camera.near = 1;
  burnerLight.shadow.camera.far = 1000;

  burnerLight.shadow.mapSize.width = 2048;
  burnerLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(burnerLight);
  scene.add(ambientLight);
};




class Rocket {
  constructor() {
    this.mesh = new THREE.Object3D();
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath("./model/");
    mtlLoader.load('plane.mtl', function (materials) {
      materials.preload();
      let objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("./model/");
      objLoader.load('plane.obj', function (object) {

        object.scale.set(20, 20, 20);
        RocketMesh = object;
        blade = RocketMesh.children[1];
        scene.add(RocketMesh);
        RocketMesh.rotation.x = Math.PI / 1;
        RocketMesh.rotation.y = Math.PI / 1;
        RocketMesh.rotation.z = Math.PI / 2;
      });
    });
  }
}



class Base {
  constructor() {
    this.mesh = new THREE.Object3D();
    let geo = new THREE.CylinderGeometry(70, 80, 50, 8);
    let mat = new THREE.MeshPhongMaterial({
      color: Colors.white
    });
    let m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

let rocket;

const createRocket = () => {
  rocket = new Rocket();
  RocketMesh.scale.set(0.3, 0.3, 0.3);
  rocket.mesh.position.x = -70;
  rocket.mesh.rotation.y = 1.5;
  scene.add(rocket.mesh);
};


const getParticle = () => {
  let p;
  if (particleArray.length > 0) {
    p = particleArray.pop();
  } else {
    p = new Particle();
  }
  return p;
};

const createSmoke = (rocket) => {
  let p = getParticle();
  dropParticle(p, rocket);
};





class Particle {
  constructor() {
    this.isFlying = false;
    var scale = 16 + Math.random() * 20;
    var nLines = 3 + Math.floor(Math.random() * 5);
    var nRows = 3 + Math.floor(Math.random() * 5);
    this.geometry = new THREE.SphereGeometry(scale, nLines, nRows);

    this.material = new THREE.MeshLambertMaterial({
      color: 0xe3e3e3,
      transparent: true
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    recycleParticle(this);
  }
}



let SmokeNum = 0;

function recycleParticle(p) {
  p.mesh.position.x = 0;
  p.mesh.position.y = 0;
  p.mesh.position.z = 0;
  p.mesh.rotation.x = Math.random() * Math.PI * 2;
  p.mesh.rotation.y = Math.random() * Math.PI * 2;
  p.mesh.rotation.z = Math.random() * Math.PI * 2;
  p.mesh.scale.set(0.1, 0.1, 0.1);
  p.mesh.material.opacity = 0;

  let SmokeNum = Math.random();
  if(SmokeNum > 0.8) {
    p.color = SmokeColors[0];
  } else if(SmokeNum > 0.6) {
    p.color = SmokeColors[1];
  } else if(SmokeNum > 0.4) {
    p.color = SmokeColors[2];
  } else if(SmokeNum > 0.2) { 
    p.color = SmokeColors[3];
  } else {
    p.color = SmokeColors[4];
  }
  
  // p.color = 0xe6b422;
  p.mesh.material.color.set(p.color);
  p.material.needUpdate = true;
  scene.add(p.mesh);
  particleArray.push(p);
}



let cloudTargetPosX,
  cloudTargetPosY,
  cloudTargetSpeed,
  cloudTargetColor,
  cloudSlowMoFactor = 0.65;




const dropParticle = (p, rocket) => {
  p.mesh.material.opacity = 0.6;
  p.mesh.position.x = rocket.mesh.position.x +200;
  p.mesh.position.y = rocket.mesh.position.y - 1;
  p.mesh.position.z = 0;
  var s = Math.random(0.2) + 0.35;
  p.mesh.scale.set(0.4 * s, 0.4 * s, 0.4 * s);
  cloudTargetPosX = rocket.mesh.position.x + 1000;
  cloudTargetPosY = rocket.mesh.position.y;
  cloudTargetSpeed = 0.8 + Math.random() * 0.6;
  cloudTargetColor = 0xa3a3a3;

  TweenMax.to(p.mesh.position, 1.3 * cloudTargetSpeed * cloudSlowMoFactor, {
    x: cloudTargetPosX,
    y: cloudTargetPosY,
    ease: Linear.easeNone,
    onComplete: recycleParticle,
    onCompleteParams: [p]
  });

  TweenMax.to(p.mesh.scale, cloudTargetSpeed * cloudSlowMoFactor, {
    x: s * 2.1,
    y: s * 2.1,
    z: s * 2.1,
    ease: Linear.ease
  });
};










let particleArray = [],
  slowMoFactor = 1;

let count = 0;



const loop = () => {
  count++;
  blade.rotation.z -= 0.2;
  const targetRot = (mouseY / window.innerHeight) * 720;
  rot += (targetRot - rot) * 0.02;
  const radian = (rot * Math.PI) / 180;
  uniforms.time.value += 0.01;


  camera.lookAt(new THREE.Vector3(0, 0, 0));
  if (rocket.mesh.position.x < 5) {
    rocket.mesh.position.x += 1;
    rocket.mesh.position.y = Math.sin(radian) * 30+20  + Math.sin(count / 30) * 10;
  } else {
    rocket.mesh.position.y = Math.sin(radian) * 30+20  + Math.sin(count / 30) * 10;
  }
  RocketMesh.rotation.y = Math.PI * 1.5;
  RocketMesh.rotation.x = Math.PI * 0.5
  RocketMesh.position.set(rocket.mesh.position.x, rocket.mesh.position.y, rocket.mesh.position.z)

  setTimeout(() => {
    createSmoke(rocket);
  }, 1000);

  requestAnimationFrame(loop);
  renderer.render(scene, camera);
};





window.onresize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};



window.addEventListener("load", init, false);