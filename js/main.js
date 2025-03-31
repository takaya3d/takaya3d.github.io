var Colors = {
  red:0xf25346,
  yellow:0xedeb27,
  white:0xd8d0d1,
  brown:0x59332e,
  // pink:0xF5986E,
  pink:0xffcccc,
  brownDark:0x23190f,
  // blue:0x68c3c0,
  blue: 0x007d80,

  //飛行船の色
  //退紅(あらぞめ)
  marineBlue: 0xd69090,
  green:0x458248,
  stgreen: 0x003300,
  stteal: 0x1e3333,
  purple:0x551A8B,
  lightgreen:0x629265,
};


var SmokeColors = [
  0xf6bfbc,
  0xf2a0a1,
  0x98d98e,
  0xfbd26b,
  0xa0d8ef,
]





var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var startTime = new Date();
var deltaTime = 0;



var seaRadius = 1300,
    seaLength = 2500,
    seaRotationSpeed = 0.006,
    wavesMinAmp = 1,
    wavesMaxAmp = 20,
    wavesMinSpeed = 0.001,
    wavesMaxSpeed = 0.003,
    plane,
    SEGX=32,
    SEGY=32;


function createScene() {
  // Get the width and height of the screen
  // and use them to setup the aspect ratio
  // of the camera and the size of the renderer.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene.
  scene = new THREE.Scene();

  // Add FOV Fog effect to the scene. Same colour as the BG int he stylesheet.
  scene.fog = new THREE.Fog(0xffcccc, 500, 950);

  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 85;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
  );
  // Position the camera
  if(WIDTH < 400) {
    camera.position.z = 400
    camera.position.y = 50
  } else if(WIDTH < 768){
    camera.position.z = 240
    camera.position.y = 20;
  } else {
    camera.position.z = 200;
    camera.position.y = 50;    
  }
  camera.lookAt(new THREE.Vector3(0,0,0));

  // Create the renderer

  renderer = new THREE.WebGLRenderer ({
  // Alpha makes the background transparent, antialias is performant heavy
      alpha: true,
      antialias:true
  });

  //set the size of the renderer to fullscreen
  renderer.setSize (WIDTH, HEIGHT);
  renderer.setClearColor(0xffccd0, 0.9);
  //enable shadow rendering
  renderer.shadowMap.enabled = true;  

  // Add the Renderer to the DOM, in the world div.
  container = document.getElementById('world');
  container.appendChild (renderer.domElement);


  //RESPONSIVE LISTENER
  window.addEventListener('resize', handleWindowResize, false);
}


// //RESPONSIVE FUNCTION
// function handleWindowResize() {
//   HEIGHT = window.innerHeight;
//   WIDTH = window.innerWidth;
//   renderer.setSize(WIDTH, HEIGHT);
//   camera.aspect = WIDTH / HEIGHT;
//   camera.updateProjectionMatrix();
// }


//RESPONSIVE FUNCTION
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}





var hemisphereLight, shadowLight;

function createLights(){
  // Gradient coloured light - Sky, Ground, Intensity
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  // Parallel rays
  shadowLight = new THREE.DirectionalLight(0xfffff0, 1);



  shadowLight.position.set(0,350,350);
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -650;
  shadowLight.shadow.camera.right = 650;
  shadowLight.shadow.camera.top = 650;
  shadowLight.shadow.camera.bottom = -650;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // Shadow map size
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // Add the lights to the scene
  scene.add(hemisphereLight);  

  scene.add(shadowLight);
}   






Land = function(){
  var geom = new THREE.CylinderGeometry(600,600,1700,40,10);
  //rotate on the x axis
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  //create a material
  var mat = new THREE.MeshPhongMaterial({
      color: Colors.lightgreen,
      shading:THREE.FlatShading,
  });

  //create a mesh of the object
  this.mesh = new THREE.Mesh(geom, mat);
  //receive shadows
  this.mesh.receiveShadow = true;
}

Orbit = function(){

  var geom =new THREE.Object3D();

  this.mesh = geom;
  // this.mesh.add(sun);
}

Sun = function(){

  this.mesh = new THREE.Object3D();

  //
  var sunGeom = new THREE.SphereGeometry( 300, 220, 130 );
  var sunMat = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0.33,
      // color: 0x6699FF,
      shading:THREE.FlatShading,
      side: THREE.BackSide,

  });
  var sun = new THREE.Mesh(sunGeom, sunMat);
  //sun.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  sun.castShadow = false;
  sun.receiveShadow = false;
  this.mesh.add(sun);
}

Cloud = function(){
  // Create an empty container for the cloud
  this.mesh = new THREE.Object3D();
  // Cube geometry and material
  var geom = new THREE.DodecahedronGeometry(18,0);
  var mat = new THREE.MeshLambertMaterial({
      color:Colors.white,  
      shading: THREE.smoothShading
  });

  var nBlocs = 5+Math.floor(Math.random()*3);

  for (var i=0; i<nBlocs; i++ ){
      //Clone mesh geometry
      var m = new THREE.Mesh(geom, mat);
          //Randomly position each cube
          m.position.x = i*15;
          m.position.y = Math.random()*10;
          m.position.z = Math.random()*10;
          m.rotation.z = Math.random()*Math.PI*2;
          m.rotation.y = Math.random()*Math.PI*2;

          //Randomly scale the cubes
          var s = .1 + Math.random()*1.1;
          m.scale.set(s,s,s);
          this.mesh.add(m);
  }
}

Sky = function(){

  this.mesh = new THREE.Object3D();

  // Number of cloud groups
  this.nClouds = 25;

  // Space the consistenly
  var stepAngle = Math.PI*2 / this.nClouds;

  // Create the Clouds

  for(var i=0; i<this.nClouds; i++){
  
      var c = new Cloud();

      //set rotation and position using trigonometry
      var a = stepAngle*i;
      // this is the distance between the center of the axis and the cloud itself
      var h = 800 + Math.random()*200;
      c.mesh.position.y = Math.sin(a)*h;
      c.mesh.position.x = Math.cos(a)*h;      

      // rotate the cloud according to its position
      c.mesh.rotation.z = a + Math.PI/2;

      // random depth for the clouds on the z-axis
      c.mesh.position.z = -500-Math.random()*400;

      // random scale for each cloud
      var s = 1+Math.random()*2;
      c.mesh.scale.set(s,s,s);

      this.mesh.add(c.mesh);
  }
}



Sea = function(){
  var geom = new THREE.CylinderGeometry(seaRadius,seaRadius,seaLength,120,30);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  geom.mergeVertices();
  var l = geom.vertices.length;

  this.waves = [];

  for (var i=0;i<l;i++){
    var v = geom.vertices[i];
    //v.y = Math.random()*30;
    this.waves.push({y:v.y,
                     x:v.x,
                     z:v.z,
                     ang:Math.random()*Math.PI*2,
                     amp:wavesMinAmp + Math.random()*(wavesMaxAmp-wavesMinAmp),
                     speed:wavesMinSpeed + Math.random()*(wavesMaxSpeed - wavesMinSpeed)
                    });
  };
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.pink,
    transparent:true,
    opacity:.8,
    shading:THREE.FlatShading,

  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.name = "waves";
  this.mesh.receiveShadow = true;

}

Sea.prototype.moveWaves = function (){
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;
  for (var i=0; i<l; i++){
    var v = verts[i];
    var vprops = this.waves[i];
    v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
    vprops.ang += vprops.speed*deltaTime;
    this.mesh.geometry.verticesNeedUpdate=true;
  }
}



Stars = function() {
  this.mesh = new THREE.Object3D();
  var geometry = new THREE.SphereGeometry(),
      SIZE = 2800,
      POINT_NUM = 1300;

  for(let i=0; i<POINT_NUM; i++) {
    geometry.vertices.push(new THREE.Vector3(
      SIZE * (Math.random() - 0.5),
      SIZE * (Math.random() - 0.5),
      SIZE * (Math.random() - 0.5),
    ));
  }

  var material = new THREE.PointsMaterial({
    size: 5,
    color: 0xcd8c5c,
  });

  var meshStars = new THREE.Points(geometry, material);
  this.mesh.add(meshStars);
}




var AirPlane = function() {
  
  this.mesh = new THREE.Object3D();


  
  var EffectGeometry = new THREE.CylinderGeometry(
    38,
    18,
    150,
    25,
    25,
    true
  );
  var EffectTexture = new THREE.TextureLoader().load( 'img/pillar.png' );
  
  var EffectMaterial = new THREE.MeshBasicMaterial({
    map: EffectTexture, // テクスチャーを指定
    color: 0xeb6ea5, // 色
    transparent: true, // 透明の表示許可
    opacity: 0.1,
    blending: THREE.AdditiveBlending, // ブレンドモード
    side: THREE.DoubleSide, // 表裏の表示設定
    depthWrite: false // デプスバッファへの書き込み可否
  });

  this.EffectMesh = new THREE.Mesh(EffectGeometry,EffectMaterial);
  this.EffectMesh.position.x = -150;
  this.EffectMesh.rotation.z = 1.58;
  this.EffectMesh.castShadow = true;
  this.EffectMesh.receiveShadow = true;

  this.mesh.add(this.EffectMesh);



  //TKStudio Flag
  var texture = THREE.ImageUtils.loadTexture('img/Flag2.png');
  var FlagGeometry = new THREE.PlaneGeometry(108, 64, SEGX, SEGY);
  var FlagMaterial = new THREE.MeshLambertMaterial({map:texture});
  plane = new THREE.Mesh(FlagGeometry, FlagMaterial);
  plane.position.x = -180;
  this.mesh.add(plane);   

  //Flag Stic
  var FlagSticGeometry = new THREE.CylinderGeometry(1,5,30,12,12);
  var FlagSticMaterial = new THREE.MeshStandardMaterial({color:Colors.marineBlue,});
  var FlagStic = new THREE.Mesh(FlagSticGeometry, FlagSticMaterial);
  FlagStic.position.x = -120;
  FlagStic.rotation.z = 1.5;
  this.mesh.add(FlagStic);
  


  var geomCockpit = new THREE.CylinderGeometry(15,26,120,18,12);
  var matCockpit = new THREE.MeshPhongMaterial({color:Colors.marineBlue, shading:THREE.FlatShading});
 
  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.rotation.z = Math.PI * 0.5;
  cockpit.position.x = -27;
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);




  var geomCockpit2 = new THREE.CylinderGeometry(5,15,50,18,12);
  var matCockpit2 = new THREE.MeshPhongMaterial({color:Colors.marineBlue, shading:THREE.FlatShading});
 
  var cockpit2 = new THREE.Mesh(geomCockpit2, matCockpit2);
  cockpit2.rotation.z = Math.PI * 0.5;
  cockpit2.position.x = -87;
  cockpit2.castShadow = true;
  cockpit2.receiveShadow = true;
  this.mesh.add(cockpit2);




  var geomCockpit3 = new THREE.TorusGeometry(10,5,16,10);
  var matCockpit3 = new THREE.MeshPhongMaterial({color:Colors.marineBlue, shading:THREE.FlatShading});
 
  var cockpit3 = new THREE.Mesh(geomCockpit3, matCockpit3);
  cockpit3.rotation.y = Math.PI * 0.5;
  cockpit3.position.x = -100;
  cockpit3.castShadow = true;
  cockpit3.receiveShadow = true;
  this.mesh.add(cockpit3);



  //### メッシュに角度をつけるには、度数法ではなく、ラジアンに変換してから計算させる必要がある。

  var geomEngine = new THREE.CylinderGeometry(20,17,30,20,8);
  var matEngine = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.rotation.z = Math.PI * 0.5;
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);
  
  // Create the tail
  var geomTailPlane = new THREE.BoxGeometry(25,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.marineBlue, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-72,25,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
  this.mesh.add(tailPlane);
  
  // Create the wing
  var geomSideWing = new THREE.BoxGeometry(50,3,280,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:Colors.marineBlue, shading:THREE.FlatShading});
  //翼の形状を補正 前面
  geomSideWing.vertices[0].x -= 20;
  geomSideWing.vertices[2].x -= 20;
  geomSideWing.vertices[0].z -= 30;
  geomSideWing.vertices[2].z -= 30;
  geomSideWing.vertices[1].x -= 20;
  geomSideWing.vertices[3].x -= 20;
  geomSideWing.vertices[1].z += 30;
  geomSideWing.vertices[3].z += 30;
  //
  geomSideWing.vertices[4].x -= 20
  geomSideWing.vertices[6].x -= 20
  geomSideWing.vertices[5].x -= 20;
  geomSideWing.vertices[7].x -= 20;


  var sideWingTop = new THREE.Mesh(geomSideWing, matSideWing);
  var sideWingBottom = new THREE.Mesh(geomSideWing, matSideWing);
  sideWingTop.castShadow = true;
  sideWingTop.receiveShadow = true;
  sideWingBottom.castShadow = true;
  sideWingBottom.receiveShadow = true;

  sideWingTop.position.set(20,-6,0);
  // sideWingBottom.position.set(20,-3,0);
  this.mesh.add(sideWingTop);
  // this.mesh.add(sideWingBottom);


  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
  sideWing.position.set(20,-11,0);
  this.mesh.add(sideWing);






  var geomSideWing2 = new THREE.BoxGeometry(40,4,330,1,1,1);
  var matSideWing2 = new THREE.MeshPhongMaterial({color:Colors.marineBlue, shading:THREE.FlatShading});
  //翼の形状を補正 前面
  geomSideWing2.vertices[0].x -= 20;
  geomSideWing2.vertices[2].x -= 20;
  geomSideWing2.vertices[0].z -= 30;
  geomSideWing2.vertices[2].z -= 30;
  geomSideWing2.vertices[1].x -= 20;
  geomSideWing2.vertices[3].x -= 20;
  geomSideWing2.vertices[1].z += 30;
  geomSideWing2.vertices[3].z += 30;
  //
  geomSideWing2.vertices[4].x -= 20
  geomSideWing2.vertices[6].x -= 20
  geomSideWing2.vertices[5].x -= 20;
  geomSideWing2.vertices[7].x -= 20;
  // var sideWingTop = new THREE.Mesh(geomSideWing, matSideWing);
  // var sideWingBottom = new THREE.Mesh(geomSideWing, matSideWing);
  // sideWingTop.castShadow = true;
  // sideWingTop.receiveShadow = true;
  // sideWingBottom.castShadow = true;
  // sideWingBottom.receiveShadow = true;

  // sideWingTop.position.set(20,12,0);
  // sideWingBottom.position.set(20,-3,0);
  // this.mesh.add(sideWingTop);
  // this.mesh.add(sideWingBottom);


  var sideWing2 = new THREE.Mesh(geomSideWing2, matSideWing2);
  sideWing2.castShadow = true;
  sideWing2.receiveShadow = true;
  sideWing2.position.set(20,5,0);
  this.mesh.add(sideWing2);




  var geomTailWing = new THREE.BoxGeometry(30,4,170,1,1,1);
  var matTailWing = new THREE.MeshPhongMaterial({color:Colors.marineBlue, shading:THREE.FlatShading});
  //翼の形状を補正 前面
  geomTailWing.vertices[0].x -= 20;
  geomTailWing.vertices[2].x -= 20;
  geomTailWing.vertices[0].z -= 30;
  geomTailWing.vertices[2].z -= 30;
  geomTailWing.vertices[1].x -= 20;
  geomTailWing.vertices[3].x -= 20;
  geomTailWing.vertices[1].z += 30;
  geomTailWing.vertices[3].z += 30;
  //
  geomTailWing.vertices[4].x -= 20
  geomTailWing.vertices[6].x -= 20
  geomTailWing.vertices[5].x -= 20;
  geomTailWing.vertices[7].x -= 20;
  // var sideWingTop = new THREE.Mesh(geomSideWing, matSideWing);
  // var sideWingBottom = new THREE.Mesh(geomSideWing, matSideWing);
  // sideWingTop.castShadow = true;
  // sideWingTop.receiveShadow = true;
  // sideWingBottom.castShadow = true;
  // sideWingBottom.receiveShadow = true;

  // sideWingTop.position.set(20,12,0);
  // sideWingBottom.position.set(20,-3,0);
  // this.mesh.add(sideWingTop);
  // this.mesh.add(sideWingBottom);


  var TailWing = new THREE.Mesh(geomTailWing, matTailWing);
  TailWing.castShadow = true;
  TailWing.receiveShadow = true;
  TailWing.position.set(-37,0,0);
  this.mesh.add(TailWing);








  var geomWindshield = new THREE.BoxGeometry(38,20,20,1,1,1);
  var matWindshield = new THREE.MeshPhongMaterial({color:Colors.white,transparent:true, opacity:.3, shading:THREE.FlatShading});;
  var windshield = new THREE.Mesh(geomWindshield, matWindshield);
  windshield.position.set(5,27,0);

  windshield.castShadow = true;
  windshield.receiveShadow = true;

  this.mesh.add(windshield);

  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  geomPropeller.vertices[4].y-=5;
  geomPropeller.vertices[4].z+=5;
  geomPropeller.vertices[5].y-=5;
  geomPropeller.vertices[5].z-=5;
  geomPropeller.vertices[6].y+=5;
  geomPropeller.vertices[6].z+=5;
  geomPropeller.vertices[7].y+=5;
  geomPropeller.vertices[7].z-=5;
  var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;


  var geomBlade1 = new THREE.BoxGeometry(1,100,10,1,1,1);
  var geomBlade2 = new THREE.BoxGeometry(1,10,100,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
  
  var blade1 = new THREE.Mesh(geomBlade1, matBlade);
  blade1.position.set(8,0,0);
  blade1.castShadow = true;
  blade1.receiveShadow = true;

  var blade2 = new THREE.Mesh(geomBlade2, matBlade);
  blade2.position.set(8,0,0);
  blade2.castShadow = true;
  blade2.receiveShadow = true;
  this.propeller.add(blade1, blade2);
  this.propeller.position.set(50,0,0);
  this.mesh.add(this.propeller);

  var wheelProtecGeom = new THREE.BoxGeometry(30,15,10,1,1,1);
  var wheelProtecMat = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  var wheelProtecR = new THREE.Mesh(wheelProtecGeom,wheelProtecMat);
  wheelProtecR.position.set(0,-16,35);
  this.mesh.add(wheelProtecR);

  var wheelTireGeom = new THREE.BoxGeometry(24,24,4);
  var wheelTireMat = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
  var wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
  wheelTireR.position.set(0,-26,35);

  var wheelAxisGeom = new THREE.BoxGeometry(10,10,6);
  var wheelAxisMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  var wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);
  wheelTireR.add(wheelAxis);


  this.mesh.add(wheelTireR);

  var wheelProtecL = wheelProtecR.clone();
  wheelProtecL.position.z = -wheelProtecR.position.z ;
  this.mesh.add(wheelProtecL);

  var wheelTireL = wheelTireR.clone();
  wheelTireL.position.z = -wheelTireR.position.z;
  this.mesh.add(wheelTireL);

  var wheelTireB = wheelTireR.clone();
  wheelTireB.scale.set(.5,.5,.5);
  wheelTireB.position.set(-35,-5,0);
  this.mesh.add(wheelTireB);

  var suspensionGeom = new THREE.BoxGeometry(4,20,4);
  suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0))
  var suspensionMat = new THREE.MeshPhongMaterial({color:Colors.marineBlue, shading:THREE.FlatShading});
  var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
  suspension.position.set(-35,-5,0);
  suspension.rotation.z = -.3;
  this.mesh.add(suspension);
};






var sky;
var stars;
var forest;
var land;
var orbit;
var airplane;
var sun;
// var fox;

var mousePos={x:0, y:0};
var offSet = -600;

function createSea(){
  sea = new Sea();
  sea.mesh.position.y = -seaRadius;
  scene.add(sea.mesh);
}

function createSky(){
sky = new Sky();
sky.mesh.position.y = offSet;
scene.add(sky.mesh);
}

function createLand(){
land = new Land();
land.mesh.position.y = offSet;
scene.add(land.mesh);
}


function createStars() {
  stars = new Stars();
  stars.mesh.position.y = 500;
  stars.mesh.position.z = -2000;
  scene.add(stars.mesh);
}

function createOrbit(){
orbit = new Orbit();
orbit.mesh.position.y = offSet;
orbit.mesh.rotation.z = -Math.PI/6; 
scene.add(orbit.mesh);
}

function createForest(){
forest = new Forest();
forest.mesh.position.y = offSet;
scene.add(forest.mesh);
}

function createSun(){ 
  sun = new Sun();
  sun.mesh.scale.set(1.2,1.2,1.2);
  sun.mesh.position.set(0, 400,-1350);
  scene.add(sun.mesh);
}


function createPlane(){ 
  airplane = new AirPlane();
  airplane.mesh.scale.set(.59,.55,.55);
  airplane.mesh.position.set(-40,110,-230);
  // airplane.mesh.rotation.z = Math.PI/15;
  scene.add(airplane.mesh);
}

// function createFox(){ 
//   fox = new Fox();
//   fox.mesh.scale.set(.35,.35,.35);
//   fox.mesh.position.set(-40,110,-250);
//   scene.add(fox.mesh);
// }


function updatePlane() {

  var targetY = normalize(mousePos.y,-.75,.75, 50, 190);
  var targetX = normalize(mousePos.x,-.75,.75,-100, -20);
  
  // Move the plane at each frame by adding a fraction of the remaining distance
  airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.3;

  airplane.mesh.position.x += (targetX-airplane.mesh.position.x +70)*0.1;

  // Rotate the plane proportionally to the remaining distance
  airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0128;
  airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0064;
  airplane.mesh.rotation.y = 0.3-(airplane.mesh.position.x-targetX)*0.0064;

  airplane.propeller.rotation.x += 0.3;
  airplane.EffectMesh.rotation.x += 0.01;
}

function normalize(v,vmin,vmax,tmin, tmax){

  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;

}






let particleArray = [],
  slowMoFactor = 1;

  const getParticle = () => {
    let p;
    if (particleArray.length > 0) {
      p = particleArray.pop();
    } else {
      p = new Particle();
    }
    return p;
  };
  
  const createSmoke = (airplane) => {
    let p = getParticle();
    dropParticle(p, airplane);
  };










let rot = 0;

function loop(){

  newTime = new Date().getTime();
  deltaTime = newTime-oldTime;
  oldTime = newTime;

  //Camera Intaractive

  // var targetX = normalize(mousePos.x,-.75,.75,-100, -20);
  var targetRot = (mousePos.x*600 / window.innerWidth) * 360;

  //イージング関数による反応の原則
  rot += (targetRot - rot) * 0.02;
  //ラジアン変換


  // const radian = rot * Math.PI / 180;
  // camera.position.x = 100 * Math.sin(radian) ;
  // camera.position.y = 35 * Math.sin(radian) + 60;
  // camera.position.z = 180 * Math.cos(radian) +50;
  // camera.lookAt(-80,0,0);


  //TKStudioFlag Animation
  var time = (new Date() - startTime)/1000;
    plane.geometry.verticesNeedUpdate=true;
    for (var i=0;i<SEGX+1;i++) {
		for (var j=0;j<SEGY+1;j++) {
			var index = j * (SEGX + 1) + i % (SEGX + 1);
            var vertex = plane.geometry.vertices[index];
			vertex.z = 8 * Math.sin( -i/2.2 + time*7 );
		}			
	}

    // plane.position.x += Math.sin(time * 2);
    // plane.position.y += Math.sin(time * 2);



    //effect

    setTimeout(() => {
      createSmoke(airplane);
    }, 1000);
    


    // land.mesh.rotation.z += .005;
    orbit.mesh.rotation.z += .001;
    sky.mesh.rotation.z += .001;
    stars.mesh.rotation.y += 0.001;
    sea.mesh.rotation.z += 0.003 + Math.abs(Math.sin(newTime / 10000) * 0.005);
    sun.mesh.rotation.z += 0.1;
    sun.mesh.rotation.y += 0.01;
    sun.mesh.scale.x = 1.71 + Math.cos(newTime / 2000) * 0.2;
    sun.mesh.scale.y = 1.7 + Math.cos(newTime / 2000) * 0.2;
    sun.mesh.scale.z = 1.7 + Math.sin(newTime / 2000) * 0.2;

    updatePlane();
    sea.moveWaves();

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}


function handleMouseMove (event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};    
}



function init(event) {
  createScene();
  createLights();
  createPlane();
  createOrbit();
  createSun();
  // createLand();
  // createForest();
  createSky();
  createStars();
  createSea();
  // createFox();

  document.addEventListener('mousemove', handleMouseMove, false);

  loop();
}

window.addEventListener('load', init, false);
















class Base {
  constructor() {
    this.mesh = new THREE.Object3D();
    let geo = new THREE.CylinderGeometry(70, 80, 50, 8);
    let mat = new THREE.MeshPhongMaterial({
      color: Colors.darkGrey
    });
    let m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}


class Particle {
  constructor() {
    this.isFlying = false;
    var scale = 16 + Math.random() * 20;
    var nLines = 3 + Math.floor(Math.random() * 5);
    var nRows = 3 + Math.floor(Math.random() * 5);
    this.geometry = new THREE.SphereGeometry(scale, nLines, nRows);

    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading,
      transparent: true
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    recycleParticle(this);
  }
}




function recycleParticle(p) {
  // p.mesh.position.x = 0;
  // p.mesh.position.y = 0;
  // p.mesh.position.z = 0;
  p.mesh.rotation.x = Math.random() * Math.PI * 2;
  p.mesh.rotation.y = Math.random() * Math.PI * 2;
  p.mesh.rotation.z = Math.random() * Math.PI * 2;
  p.mesh.scale.set(0.1, 0.1, 0.1);
  p.mesh.material.opacity = 0.9;
  var randomCol = Math.random();
  if(randomCol > 0.8) {
    p.color = SmokeColors[0];
  }else if(randomCol > 0.6) {
    p.color = SmokeColors[1];
  }else if(randomCol > 0.4) {
    p.color = SmokeColors[2];
  }else if(randomCol > 0.2) {
    p.color = SmokeColors[3];
  } else {
    p.color = SmokeColors[4];
  }
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



const dropParticle = (p, airplane) => {
  p.mesh.material.opacity = 0.6;
  p.mesh.position.x = airplane.mesh.position.x - 100;
  p.mesh.position.y = airplane.mesh.position.y;
  p.mesh.position.z = -270;
  var s = Math.random(0.2) + 0.35;
  p.mesh.scale.set(0.4 * s, 0.4 * s, 0.4 * s);

  cloudTargetPosX = airplane.mesh.position.x - 600;
  cloudTargetPosY = airplane.mesh.position.y +1;
  cloudTargetSpeed = 0.8 + Math.random() * 0.6;
  cloudTargetColor = 0xf2a0a1;

  TweenMax.to(p.mesh.position, 1.3 * cloudTargetSpeed * cloudSlowMoFactor, {
    x: cloudTargetPosX,
    y: cloudTargetPosY,
    ease: Linear.easeNone,
    onComplete: recycleParticle,
    onCompleteParams: [p]
  });

  TweenMax.to(p.mesh.scale, cloudTargetSpeed * cloudSlowMoFactor, {
    x: s * 1.8,
    y: s * 1.8,
    z: s * 1.8,
    ease: Linear.ease
  });
};
