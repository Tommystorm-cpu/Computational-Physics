import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { solarSystem, justPluto } from './planetData.js';
import { get_angle } from './Theta_Function.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, controls, renderer, light, time, splines, planets, cameraTarget, fakeCamera, sun, timeStep, sunLock, cameraRadii, sunSprite;
let bloomComposer, finalComposer, sunScene, renderTarget1, renderTarget2, baseScene

function init() {
    cameraTarget = 0;
    time = 0;
    timeStep = 0.5;
    sunLock = false;

    // Scene
    scene = new THREE.Scene();
    sunScene = new THREE.Scene();

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000000
    );
    camera.position.y = 1000;
    camera.position.z = 1000;

    // Light and Shadows
    light = new THREE.PointLight(0xffffff, 3);
    light.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.radius = 50;
    scene.add(light);

    light.shadow.camera.far = 1000000;

    const ambLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambLight)
    sunScene.add(ambLight);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);

    // Skybox
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('Skybox/');
    const textureCube = loader.load(['right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png']);
    scene.background = textureCube;

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);

    fakeCamera = camera.clone();
    controls = new OrbitControls(fakeCamera, renderer.domElement);
    // controls.enablePan = false;

    

    document.addEventListener('keyup', (event) => {

        const key = event.key;

        if (isFinite(key)) {
            if (key === "0") {
                sunLock = false;
                if (cameraTarget == 0) {
                    controls.reset();
                } else {
                    cameraTarget.remove(camera);
                    fakeCamera.position.add(cameraTarget.position);
                    cameraTarget = 0;
                    controls.enablePan = true;
                };
            } else {
                controls.reset();
                cameraTarget = planets[parseInt(key) - 1][1];
                cameraTarget.add(camera);
                cameraRadii = planets[parseInt(key) - 1][0][3];
                const tempRadius = planets[parseInt(key) - 1][0][3] * 300;
                const startPos = new THREE.Vector3(tempRadius, tempRadius, tempRadius);
                fakeCamera.position.copy(startPos);
                controls.enablePan = false;
                sunLock = false;
            };
        }
        if (key === "s") {
            if (cameraTarget != 0) {
                sunLock = !sunLock;
            }
        }
    });
}

function initControls() {
    const sunButton = document.getElementById("sunButton");
    sunButton.onclick = () => {
        sun.visible = !sun.visible;
    };

    const timeSlider = document.getElementById("timeSlider");
    timeSlider.oninput = (event) => {
        timeStep = event.target.value;
    };
}

function initBloom() {
    
    const BLOOM_SCENE = 1;

    //const bloomLayer = new THREE.Layers();
    //bloomLayer.set( BLOOM_SCENE );

    const params = {
        threshold: 0,
        strength: 5,
        radius: 1,
        exposure: 2
    };

    const renderSun = new RenderPass( sunScene, camera );
    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth*4, window.innerHeight*4 ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    bloomComposer = new EffectComposer( renderer );
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass( renderSun );
    bloomComposer.addPass( bloomPass );

    const mixPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            defines: {}
        } ), 'baseTexture'
    );
    mixPass.needsSwap = true;

    const outputPass = new OutputPass( THREE.ReinhardToneMapping );

    finalComposer = new EffectComposer( renderer );
    
    finalComposer.addPass( renderSun );
    finalComposer.addPass( renderScene );
    finalComposer.addPass( mixPass );
    
    finalComposer.addPass( outputPass );
    
    
    return
}

function generatePlanet(planet) {
    const radius = planet[3] * 200;
    const textureType = planet[6];
    const clouds = planet[7];

    let result = [planet];

    // Planet Texture
    let mapPath = "";
    let normalPath = "";
    if (textureType != "Martian") {
        mapPath = "./textures/Solar System/".concat(textureType).concat(" Map.jpg");
        normalPath = "./textures/Solar System/".concat(textureType).concat(" Normal.jpg");
    }

    const variant = randInt(1, 10);
    const textureLoader = new THREE.TextureLoader();
    const materialNormalMap = new THREE.MeshPhongMaterial({
        map: textureLoader.load(mapPath),
        normalMap: textureLoader.load(normalPath)
    });
    materialNormalMap.map.colorSpace = THREE.SRGBColorSpace;

    // Planet Mesh
    const geometry = new THREE.SphereGeometry(radius, 500, 250);
    const meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
    meshPlanet.castShadow = true;
    meshPlanet.receiveShadow = true;

    // Point Geometry (for camera locking)
    const pointgeo = new THREE.Points();
    const group = new THREE.Group();
    group.add(meshPlanet);
    group.add(pointgeo);

    scene.add(group);
    result.push(group);

    if (clouds == 1) {
        // Clouds Texture
        let cloudPath = "";
        if (textureType == "Earth") {
            cloudPath = "./textures/Solar System/Earth Clouds.jpg"
        } else {
            cloudPath = './textures/Martian/Martian Clouds ('.concat(variant).concat(').png');
        }

        const materialClouds = new THREE.MeshLambertMaterial({
            map: textureLoader.load(cloudPath),
            transparent: true
        });
        materialClouds.map.colorSpace = THREE.SRGBColorSpace;

        // Clouds Mesh
        const meshClouds = new THREE.Mesh(geometry, materialClouds);
        meshClouds.scale.set(1.005, 1.005, 1.005);
        meshClouds.receiveShadow = true;
        scene.add(meshClouds);
        result.push(meshClouds);
    }

    return result;
}

function generateOrbit(semi_major, eccen, inclination) {
    // Generate spline
    const generatedPoints = [];
    const scalar = 2000;

    for (let angle = 0; angle < 2 * Math.PI; angle += 0.01) {
        const radius = (semi_major * (1 - (Math.pow(eccen, 2)))) / (1 - eccen * Math.cos(angle));
        let xPos = radius * Math.sin(angle) * scalar;
        const yPos = radius * Math.cos(angle) * scalar;
        const zPos = xPos * Math.sin(inclination * (Math.PI / 180));
        xPos = xPos * Math.cos(inclination * (Math.PI / 180));
        const vector = new THREE.Vector3(xPos, zPos, yPos);
        generatedPoints.push(vector);
    }
    generatedPoints.push(generatedPoints[0].clone());
    const spline = new THREE.CatmullRomCurve3(generatedPoints);

    // Draw Spline
    const points = spline.getPoints(1000);
    const splineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const curveObject = new THREE.Line(splineGeometry, material);
    scene.add(curveObject);

    return spline;
}

function generateStar(starData) {
    const radius = starData[0] * 3;
    const textureType = starData[2];
    let mapPath = "";
    if (textureType == "Sun") {
        mapPath = "./textures/Solar System/Sun Map.jpg"
    }

    const textureLoader = new THREE.TextureLoader();
    const materialMap = new THREE.MeshPhongMaterial({
        map: textureLoader.load(mapPath),
    });

    const geometry = new THREE.SphereGeometry(radius, 500, 250);
    const starMesh = new THREE.Mesh(geometry, materialMap);
    const starMesh2 = new THREE.Mesh(geometry, materialMap);
    sunScene.add(starMesh);
    scene.add(starMesh2);
    sun = starMesh;

    const lensflare = new Lensflare();

    const textureFlare0 = textureLoader.load('./textures/lensflare/lensflare0_alpha.png' );
	const textureFlare3 = textureLoader.load('./textures/lensflare/lensflare3.png' );

    // lensflare.addElement( new LensflareElement( textureFlare0, 200, 0, light.color ) );
	lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
	lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
	lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
	lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );

    // light.add(lensflare);

    const spriteMaterial = new THREE.SpriteMaterial({map: textureFlare0});
    sunSprite = new THREE.Sprite(spriteMaterial);
    sunSprite.scale.multiplyScalar(50000);
    //sunScene.add(sunSprite);

}

function positionObject(curve, object, orbitTime, planetData) {
    const period = planetData[5];
    const eccen = planetData[1];
    const angle = get_angle(eccen, period, orbitTime);
    let pos = angle / (2 * Math.PI);
    pos = pos - Math.floor(pos)
    const position = curve.getPointAt(pos);
    object.position.copy(position);
}

function animate() {
    requestAnimationFrame(animate);
    // Loop through all planets
    for (let i = 0; i < planets.length; i++) {

        // Rotate planet mesh
        planets[i][1].children[0].rotateY(planets[i][0][4] / 100 * timeStep);
        // Move planet mesh (orbit path, planet mesh, time, planet data)
        positionObject(splines[i], planets[i][1], time, planets[i][0]);

        // Same as above for clouds
        if (planets[i].length == 3) {
            planets[i][2].rotateY((planets[i][0][4] / 100) * 1.5 * timeStep);
            positionObject(splines[i], planets[i][2], time, planets[i][0]);
        }
    }
    time += timeStep/50;
    
    if (sunLock) {
        let cameraPos = new THREE.Vector3();
        const vertOffest = new THREE.Vector3(0, cameraRadii * 500, 0);
        cameraPos.copy(cameraTarget.position);
        cameraPos.normalize();
        cameraPos.multiplyScalar(cameraRadii * 1000);
        cameraPos.add(vertOffest);
        fakeCamera.position.copy(cameraPos);
    }

    if ((camera.position.distanceTo(sun.position) < 50000)) {
        sunSprite.visible = false;
    } else if ((cameraTarget != 0) && (cameraTarget.position.distanceTo(sun.position) < 50000)) {
        sunSprite.visible = false;
    } else {
        sunSprite.visible = true;
    }

    // console.log(cameraTarget.position);

    camera.copy(fakeCamera);
    controls.update();

    //renderer.autoClear = true;
    //renderer.render(scene, camera);
    //renderer.autoClear = false;


    //renderer.setRenderTarget(renderTarget1);
    //renderer.render(sunScene, camera);

    bloomComposer.render();
    finalComposer.render();

    //renderer.setRenderTarget(null);
    //renderer.render(baseScene, camera);

    // renderer.autoClear = true;

    // renderer.setRenderTarget(renderTarg1);
    // renderer.render(scene, camera);

    // renderer.autoClear = false;

    // renderer.setRenderTarget(renderTarg2);
    // renderer.render(sunScene, camera);

    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log(window.innerWidth, window.innerHeight);
}



function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


window.addEventListener('resize', onWindowResize, false);

init();
initControls();
initBloom();

splines = []
planets = []
for (const [key, value] of Object.entries(solarSystem)) {
    if (key != Object.keys(solarSystem)[0]) {
        splines.push(generateOrbit(value[0], value[1], value[2]));
        planets.push(generatePlanet(value));
    } else {
        generateStar(value);
    }
}

animate();