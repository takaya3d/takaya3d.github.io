

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Fog
// const fog = new THREE.Fog('#262837', 1, 15);
// scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const pillarTexture = textureLoader.load('img/pillar.png')


const FlagTexture = textureLoader.load('img/fdaa.jpg');

const doorColorTexture = textureLoader.load('img/door/color.jpg');
const doorAlphaTexture = textureLoader.load('img/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('img/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('img/door/height.jpg');
const doorNormalTexture = textureLoader.load('img/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('img/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('img/door/roughness.jpg');


const bricksColorTexture = textureLoader.load('img/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('img/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('img/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('img/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('img/grass3/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('img/grass3/ao.jpg')
const grassNormalTexture = textureLoader.load('img/grass3/normal.jpg')
const grassRoughnessTexture = textureLoader.load('img/grass3/rough.jpg')

grassColorTexture.repeat.set(8,8);
grassAmbientOcclusionTexture.repeat.set(8,8);
grassNormalTexture.repeat.set(8,8);
grassRoughnessTexture.repeat.set(8,8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);


const RoofCol = new THREE.MeshStandardMaterial({color: '#b22222'});


//Pillar Effect
const pillarGeom = new THREE.CylinderGeometry(1.7,1.75,6,25,25,true);
const pillarMat = new THREE.MeshBasicMaterial({
    map: pillarTexture,
    color: 0xff8c00,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
});
const pillar = new THREE.Mesh(pillarGeom,pillarMat);
pillar.position.y = 2.35;
house.add(pillar);


//Pillar Effect
const pillarGeom2 = new THREE.CylinderGeometry(3.5,3.55,5.5,25,25,true);
const pillarMat2 = new THREE.MeshBasicMaterial({
    map: pillarTexture,
    color: 0xb22222,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
});
const pillar2 = new THREE.Mesh(pillarGeom2,pillarMat2);
pillar2.position.y = 2.3
house.add(pillar2);




//Carpet
const Carpet1 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1.2,0.2,1.8),
    new THREE.MeshPhongMaterial({color: 0x808080})
)

Carpet1.position.x = 0.3;
Carpet1.position.y = 0.1;
Carpet1.position.z = 2.5;
Carpet1.rotation.y = Math.PI * 0.06;
house.add(Carpet1);


const Carpet2 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.8,0.03,1.6),
    new THREE.MeshPhongMaterial({color: 0x801818})
)

Carpet2.position.x = 0.3;
Carpet2.position.y = 0.2;
Carpet2.position.z = 2.5;
Carpet2.rotation.y = Math.PI * 0.06;
house.add(Carpet2);


//catsleWalls
const catsleWallMaterial = new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture
});

const Catslewalls = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(2.5,2.5,2.1,7),
    new THREE.MeshStandardMaterial({color:0xffe3b3})
)


// Catslewalls.geometry.setAttribute(
//     'uv2',
//     new THREE.Float32BufferAttribute(Catslewalls.geometry.attributes.uv.array, 2)
// )
Catslewalls.position.y = 1;
Catslewalls.rotation.y = Math.PI * 0.2;
house.add(Catslewalls);





const Catslewalls2 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(2.7,2.7,0.5,7),
    catsleWallMaterial
)
Catslewalls2.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(Catslewalls2.geometry.attributes.uv.array, 2)
)
Catslewalls2.position.y = 0.2;
Catslewalls2.rotation.y = Math.PI * 0.2;
house.add(Catslewalls2);


const Catslewalls3 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(2.6,2.6,0.5,7),
    catsleWallMaterial
)
Catslewalls3.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(Catslewalls3.geometry.attributes.uv.array, 2)
)
Catslewalls3.position.y = 2.1;
Catslewalls3.rotation.y = Math.PI * 0.2;
house.add(Catslewalls3);








//wall && Catsle
const walls = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(1.3,1.35,5.2,12),
    catsleWallMaterial
)
// walls.geometry.setAttribute(
//     'uv2',
//     new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
// )
walls.position.y = 2.25;
house.add(walls);





//Grass
const Grass = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.6,0.8,0.05),
    new THREE.MeshStandardMaterial({    
        color: 0x663410,
        transparent: true,
        opacity: 0.7
    })
)
Grass.position.x = 0.2
Grass.position.y = 3.6;
Grass.position.z = 1.3;
Grass.rotation.y = Math.PI * 0.06;
house.add(Grass);


const Grass2 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.45,0.55,0.05),
    new THREE.MeshStandardMaterial({
        color: 0xffebcd,
        transparent: true,
        opacity: 0.7
    })
)
Grass2.position.x = 0.2
Grass2.position.y = 3.6;
Grass2.position.z = 1.35;
Grass2.rotation.y = Math.PI * 0.06;
house.add(Grass2);




//CatsleFlag

const CatsleFlagBase1 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.03,0.03,1,8),
    new THREE.MeshStandardMaterial({color:0xffe3b3})
)
CatsleFlagBase1.position.y = 7;
CatsleFlagBase1.rotation.y = Math.PI * 0.2;
house.add(CatsleFlagBase1);

const CatsleFlagGeom = new THREE.PlaneGeometry(0.8,0.5, 12,12);
const CatsleFlagMat = new THREE.MeshLambertMaterial({map:FlagTexture});
const CatsleFlag1 = new THREE.Mesh(CatsleFlagGeom,CatsleFlagMat);

CatsleFlag1.position.y = 7.2;
CatsleFlag1.position.x = 0.37;
house.add(CatsleFlag1);









//CatsleWallRoundTower
const CatsleWallRound1 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.4,0.4,2.8,16),
    catsleWallMaterial
)
CatsleWallRound1.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(CatsleWallRound1.geometry.attributes.uv.array, 2)
)
CatsleWallRound1.position.y = 1.15;
CatsleWallRound1.position.x = 1.3;
CatsleWallRound1.position.z = 2;
house.add(CatsleWallRound1);



const CatsleWallRound1High1 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.6,0.5,0.6,16),
    RoofCol
)
CatsleWallRound1High1.position.y = 2.65;
CatsleWallRound1High1.position.x = 1.3;
CatsleWallRound1High1.position.z = 2;
house.add(CatsleWallRound1High1);


const CatsleWallRound2 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.4,0.4,2.8,16),
    catsleWallMaterial
)
CatsleWallRound2.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(CatsleWallRound2.geometry.attributes.uv.array, 2)
)
CatsleWallRound2.position.y = 1.15;
CatsleWallRound2.position.x = -0.8;
CatsleWallRound2.position.z = 2.3;
house.add(CatsleWallRound2);


const CatsleWallRound2High1 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.6,0.5,0.6,16),
    RoofCol
)

CatsleWallRound2High1.position.y = 2.65;
CatsleWallRound2High1.position.x = -0.8;
CatsleWallRound2High1.position.z = 2.3;
house.add(CatsleWallRound2High1);



const CatsleWallRound3 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.4,0.4,2.8,16),
    catsleWallMaterial
)
CatsleWallRound3.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(CatsleWallRound3.geometry.attributes.uv.array, 2)
)
CatsleWallRound3.position.y = 1.15;
CatsleWallRound3.position.x = -2.2;
CatsleWallRound3.position.z = 1;
house.add(CatsleWallRound3);


const CatsleWallRound3High1 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.5, 0.7,12),
    RoofCol
)
CatsleWallRound3High1.position.y = 2.85;
CatsleWallRound3High1.position.x = -2.2;
CatsleWallRound3High1.position.z = 1;
house.add(CatsleWallRound3High1);



const CatsleWallRound4 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.4,0.4,2.8,16),
    catsleWallMaterial
)
CatsleWallRound4.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(CatsleWallRound4.geometry.attributes.uv.array, 2)
)
CatsleWallRound4.position.y = 1.15;
CatsleWallRound4.position.x = 2.4;
CatsleWallRound4.position.z = 0.2;
house.add(CatsleWallRound4);


const CatsleWallRound4High1 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.5, 0.7,12),
    RoofCol
)
CatsleWallRound4High1.position.y = 2.85;
CatsleWallRound4High1.position.x = 2.4;
CatsleWallRound4High1.position.z = 0.2;
house.add(CatsleWallRound4High1);






const CatsleWallRound5 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.5,0.5,3.6,16),
    catsleWallMaterial
)
CatsleWallRound5.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(CatsleWallRound5.geometry.attributes.uv.array, 2)
)
CatsleWallRound5.position.y = 1.95;
CatsleWallRound5.position.x = -2.3;
CatsleWallRound5.position.z = -0.8;
house.add(CatsleWallRound5);



const CatsleWallRound5High1 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.6, 1,12),
    RoofCol
)
CatsleWallRound5High1.position.y = 4.1;
CatsleWallRound5High1.position.x = -2.3;
CatsleWallRound5High1.position.z = -0.8;
house.add(CatsleWallRound5High1);




const CatsleWallRound6 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.5,0.5,3.6,16),
    catsleWallMaterial
)
CatsleWallRound6.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(CatsleWallRound6.geometry.attributes.uv.array, 2)
)
CatsleWallRound6.position.y = 1.95;
CatsleWallRound6.position.x = 2.1;
CatsleWallRound6.position.z = -1.5;
house.add(CatsleWallRound6);



const CatsleWallRound6High1 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.6, 1,12),
    RoofCol
)
CatsleWallRound6High1.position.y = 4.1;
CatsleWallRound6High1.position.x = 2.1;
CatsleWallRound6High1.position.z = -1.5;
house.add(CatsleWallRound6High1);



// Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(1.38, 1.7,16),
    RoofCol
)
roof.position.y = 5.7;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);




// Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.3,1.3,100,100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
　
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.x = 0.3;
door.position.y = 1.1;
door.position.z = 2.2 + 0.02;
door.rotation.y = Math.PI * 0.06;
house.add(door)







const bushGeometry = new THREE.SphereBufferGeometry();
const bushMaterial = new THREE.MeshStandardMaterial({color: '#ff8c00'})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5,0.5,0.5);
bush1.position.set(1.8,0.2,3.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25,0.25,0.25);
bush2.position.set(1.4, 0.1, 4.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4,0.4,0.4);
bush3.position.set(-0.8, 0.1, 4.1);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15,0.15,0.15);
bush4.position.set(-1, 0.05, 4.6);

const bush5 = new THREE.Mesh(bushGeometry, bushMaterial);
bush5.scale.set(0.3,0.3,0.3);
bush5.position.set(-0.8, 0.1, 2.8);

const bush6 = new THREE.Mesh(bushGeometry, bushMaterial);
bush6.scale.set(0.15,0.15,0.15);
bush6.position.set(-0.8, 0.05, 3.2);


house.add(bush1,bush2,bush3,bush4,bush5,bush6);



/**
 * Graves
 */

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.2, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color: '#4d260b'});

for(let i = 0; i<20; i++) {
    const angle = Math.random() * Math.PI * 0.2 + 0.6;
    const radius = 3 + Math.random() * 0.5;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = Math.random() * 0.6;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x,y,z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;
    graves.add(grave);
}




// Tree & Flower && Forest
// Tree

class Trees {
    constructor() {
        this.mesh = new THREE.Object3D();
        
        const matTreeLeaves = new THREE.MeshPhongMaterial( { color:0xb22222,});
        
        const geonTreeBase = new THREE.BoxGeometry( 0.2,2.6,0.2 );
        const matTreeBase = new THREE.MeshStandardMaterial( { color:0x59332e});
        const treeBase = new THREE.Mesh(geonTreeBase,matTreeBase);
        treeBase.castShadow = true;
        treeBase.receiveShadow = true;
        this.mesh.add(treeBase);
        
        const geomTreeLeaves1 = new THREE.CylinderGeometry(0.05, 0.9, 0.9, 5 );
        const treeLeaves1 = new THREE.Mesh(geomTreeLeaves1,matTreeLeaves);
        treeLeaves1.castShadow = true;
        treeLeaves1.receiveShadow = true;
        treeLeaves1.position.y = 0.5
        this.mesh.add(treeLeaves1);
        
        const geomTreeLeaves2 = new THREE.CylinderGeometry( 0.05, 0.6, 0.6, 5 );
        const treeLeaves2 = new THREE.Mesh(geomTreeLeaves2,matTreeLeaves);
        treeLeaves2.castShadow = true;
        treeLeaves2.receiveShadow = true;
        treeLeaves2.position.y = 0.95;
        this.mesh.add(treeLeaves2);
        
        const geomTreeLeaves3 = new THREE.CylinderGeometry( 0.05, 0.3, 0.3, 5);
        const treeLeaves3 = new THREE.Mesh(geomTreeLeaves3,matTreeLeaves);
        treeLeaves3.castShadow = true;
        treeLeaves3.receiveShadow = true;
        treeLeaves3.position.y = 1.33;
        this.mesh.add(treeLeaves3);
    }
}


const TreeGroup = new THREE.Group();
scene.add(TreeGroup);
for(let i = 0; i<50; i++) {
    let t = new Trees();
    const angle = Math.random() * Math.PI * 1.8 + 0.4;
    const radius = 3.8 + Math.random() * 6;
    const x = Math.sin(angle) * radius; 
    const z = Math.cos(angle) * radius;

    let s = .3+Math.random() * .75;
    t.mesh.scale.set(s,s,s);
    t.mesh.position.set(x,0.3,z);
    t.mesh.rotation.y = (Math.random() - 0.5) * 0.4;
    t.mesh.rotation.z = (Math.random() - 0.5) * 0.4;
    t.mesh.castShadow = true;
    TreeGroup.add(t.mesh);
}

    



// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)





//Particles

const particlesGeometry = new THREE.BufferGeometry();
const count = 9000;
const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)

for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
{
    positions[i] = (Math.random() - 0.5) * 28 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.015
particlesMaterial.color = new THREE.Color('#ffd700');
particlesMaterial.sizeAttenuation = true

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.position.y = 7
particles.position.z = -9
scene.add(particles);




/**
 * Lights 
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.35)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.55)
moonLight.position.set(4, 5, - 2)
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


const doorLight = new THREE.PointLight('#ff7d46', 1,7);
doorLight.position.set(0,2.2, 2.7);
house.add(doorLight);

/**
 * Ghost
 */
 const ghost1 = new THREE.PointLight('#ff00ff', 2,3);
 ghost1.position.set(3.6,2.2, 1.7);
 scene.add(ghost1);
 
 const ghost2 = new THREE.PointLight('#00ffff', 2,3);
 ghost2.position.set(-3,2.2, 2.7);
 scene.add(ghost2);
 
 const ghost3 = new THREE.PointLight('#ffff00', 2,3);
 ghost3.position.set(0,2.2, -2);
 scene.add(ghost3);
 
 const ghost4 = new THREE.PointLight('#ff8c00', 0.5);
 ghost4.position.set(0,3,3.8);
 scene.add(ghost4);
 

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(95, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 2
camera.position.z = 11
camera.lookAt(new THREE.Vector3(0,0,0));
scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#191533');

/**
 * Shadows
 */

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;


ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;
/**
 * Animate
 */
const clock = new THREE.Clock()
const startTime = clock.getElapsedTime();


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    let time = (new Date() - startTime)/1000;

    // house.scale.x = 1.2;
    // house.scale.y = 1.5;
    // house.scale.z = 1.2;

    walls.rotation.y = time;

    //Stars
    particles.rotation.y += 0.005;
    particles.rotation.x += 0.001
    //Pillar
    pillar.rotation.y = time;
    pillar2.rotation.y = time /2;
    //CatsleFlag
    CatsleFlag1.position.y = Math.sin(time*2) / 16  +7.2;
    CatsleFlag1.rotation.y = Math.sin(time) / 16 ;



    TreeGroup.rotation.x = Math.sin(time) / 50
    
    // //Ghosts
    // const ghost1Angle = elapsedTime * 0.5;
    // ghost1.position.x = Math.cos(ghost1Angle) * 4;
    // ghost1.position.z = Math.sin(ghost1Angle) * 4;
    // ghost1.position.y = Math.sin(elapsedTime * 3);

    // const ghost2Angle = - elapsedTime * 0.32;
    // ghost2.position.x = Math.cos(ghost2Angle) * 5;
    // ghost2.position.z = Math.sin(ghost2Angle) * 5;
    // ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    // const ghost3Angle = - elapsedTime * 0.18;
    // ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    // ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    // ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);


    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()