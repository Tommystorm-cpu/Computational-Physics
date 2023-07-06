import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { solarSystem, justPluto } from './planetData.js';
import { get_angle } from './Theta_Function.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

let scene, camera, controls, renderer, light, time, splines, planets, cameraTarget, fakeCamera, sun, timeStep, sunLock, cameraRadii, sunSprite;
let accurateScale, orbitObjects, labelRenderer, labelBool, labelList, raycaster, pointer, planetObjects

function init() {
    cameraTarget = 0;
    time = 0;
    timeStep = 0.5;
    sunLock = false;
    accurateScale = false;
    labelBool = false;

    // Scene
    scene = new THREE.Scene();

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
        0.1,
        250000000000
    );

    // 250000000000

    camera.position.y = 1000;
    camera.position.z = 1000;

    // Light and Shadows
    light = new THREE.PointLight(0xffffff, 3);
    light.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    light.shadow.camera.far = 250000000000;
    light.shadow.camera.near = 0.1;

    const ambLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambLight)

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);

    // Skybox
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('Skybox/');
    const textureCube = loader.load(['right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png']);
    scene.background = textureCube;

    // Label Renderer
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild( labelRenderer.domElement );

    // Controls
    controls = new OrbitControls(camera, labelRenderer.domElement);

    fakeCamera = camera.clone();
    controls = new OrbitControls(fakeCamera, labelRenderer.domElement);
    // controls.enablePan = false;

    // Raycasting
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

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

        if (key === "l") {
            labelBool = !labelBool;
            initLabels();
        }
    });
}

function initControls() {
    const scaleButton = document.getElementById("scaleButton");
    scaleButton.onclick = () => {
        accurateScale = !accurateScale;
        
        if (accurateScale) {
            labelBool = true;
            initLabels();
        } else {
            labelBool = false;
            initLabels();
        }

        for (var i = 0; i < orbitObjects.length; i++) {
            scene.remove(orbitObjects[i])
        }

        for (var i = 0; i < planets.length; i++) {
            if (accurateScale) {
                const scale = 1/200
                planets[i][1].scale.copy(new THREE.Vector3(scale, scale, scale));
                if (planets[i].length == 3) {
                    planets[i][2].scale.copy(new THREE.Vector3(scale*1.01, scale*1.01, scale*1.01));
                }
            } else {
                planets[i][1].scale.copy(new THREE.Vector3(1, 1, 1));
            }
        }

        splines = [];
        orbitObjects = [];

        scene.remove(sun);
        scene.remove(sunSprite);

        let c = -1;
        for (const [key, value] of Object.entries(solarSystem)) {
            if (key != Object.keys(solarSystem)[0]) {
                const splineOrbit = generateOrbit(value[0], value[1], value[2], accurateScale, colours[c]);
                splines.push(splineOrbit[0]);
                orbitObjects.push(splineOrbit[1]);
            } else {
                generateStar(value, accurateScale);
            }
            c++;
}

    };

    const timeSlider = document.getElementById("timeSlider");
    timeSlider.oninput = (event) => {
        timeStep = event.target.value;
    };

    const centreButton = document.getElementById("centreButton");
    centreButton.onclick = () => {
        sunLock = false;
        if (cameraTarget == 0) {
            controls.reset();
        } else {
            cameraTarget.remove(camera);
            fakeCamera.position.add(cameraTarget.position);
            cameraTarget = 0;
            controls.enablePan = true;
        };
    };

    const sunButton = document.getElementById("sunLock");
    sunButton.onclick = () => {
        if (cameraTarget != 0) {
            sunLock = !sunLock;
        };
    };
}

function initLabels() {
    if (labelBool) {
        for (var i = 0; i < planets.length; i++) {
            const planetDiv = document.createElement( 'div' );
            planetDiv.className = 'label';
            planetDiv.textContent = planets[i][0][6];
            planetDiv.style.backgroundColor = 'transparent';
            planetDiv.style.color = cssColours[i];

            const planetLabel = new CSS2DObject( planetDiv );
            const distance = planets[i][0][3]  * 150;
            planetLabel.position.set(distance, distance, distance);
            planets[i][1].add( planetLabel );
            labelList.push(planetLabel);
        };
    } else {
        for (var i = 0; i < planets.length; i++) {
            planets[i][1].remove(labelList[i]);
        };
        labelList = [];
    }
}

function bend(g, rMin, rMax) {
    let pos = g.attributes.position;
    let uv = g.attributes.uv;
    let v3 = new THREE.Vector3();
    let v2 = new THREE.Vector2();
    let fullTurn = Math.PI * 2;
    for(let i = 0; i < pos.count; i++){
      v2.fromBufferAttribute(uv, i);
      let a = fullTurn * v2.x;
      let r = THREE.MathUtils.lerp(rMax, rMin, v2.y);
      pos.setXY(i, Math.cos(a) * r, Math.sin(a) * r);
    }
    pos.needsUpdate = true;
}

function generatePlanet(planet) {
    const radius = planet[3] * 200;
    const textureType = planet[6];
    const clouds = planet[7];

    let result = [planet];

    // Planet Texture
    let mapPath = "";
    let normalPath = "";
    let ringPath = "";
    if (textureType != "Martian") {
        mapPath = "./textures/Solar System/".concat(textureType).concat(" Map.jpg");
        normalPath = "./textures/Solar System/".concat(textureType).concat(" Normal.jpg");
    }

    if (textureType == "Saturn") {
        ringPath = "./textures/Solar System/Saturn Ring.png"
    } else if (textureType == "Uranus") {
        ringPath = "./textures/Solar System/Uranus Ring.jpg"
    };

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

    planetObjects.push(meshPlanet);

    // Point Geometry (for camera locking)
    const pointgeo = new THREE.Points();
    const group = new THREE.Group();
    group.add(meshPlanet);
    group.add(pointgeo);

    // Ring Geometry
    if (ringPath != "") {
        let ringParams = {
            rMin: radius*1.2,
            rMax: radius*2,
            texRepeat: 32
            }
            
        let ringGeometry = new THREE.PlaneGeometry(1, 1, 72, 3);
        bend(ringGeometry, ringParams.rMin, ringParams.rMax);
        let ringMaterial = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(ringPath, tex => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set( ringParams.texRepeat, 1 );
        })});
        ringMaterial.side = THREE.DoubleSide;
        let ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotateX(Math.PI/2)
        
        ringMesh.receiveShadow = true;

        ringMesh.rotateX(26.73 * Math.PI/180)
        meshPlanet.rotateX(26.73 * Math.PI/180)

        group.add(ringMesh);
    }

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

    //planetObjects.push(result[1]);

    return result;
}

function generateOrbit(semi_major, eccen, inclination, accurate, colour) {
    // Generate spline
    const generatedPoints = [];
    let scalar = 1
    if (!accurate) {
        scalar = 2000;
    } else {
        scalar = 23450;
    }

    for (let angle = 0; angle < 2 * Math.PI; angle += 0.1) {
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
    let resolution = 1000;
    if (accurate) {
        resolution = parseInt(Math.floor(semi_major * 2500));
    }
    const points = spline.getPoints(resolution);
    const splineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: colour });
    const curveObject = new THREE.Line(splineGeometry, material);
    scene.add(curveObject);

    return [spline, curveObject];
}

function generateStar(starData, accurate) {
    let radius = 1;
    if (!accurate) {
        radius = starData[0] * 3;
    } else {
        radius = starData[0];
    };

    const textureType = starData[2];
    let mapPath = "";
    if (textureType == "Sun") {
        mapPath = "./textures/Solar System/Sun Map.jpg"
    }

    const textureLoader = new THREE.TextureLoader();
    const materialMap = new THREE.MeshBasicMaterial({
        map: textureLoader.load(mapPath),
    });

    const geometry = new THREE.SphereGeometry(radius, 500, 250);
    const starMesh = new THREE.Mesh(geometry, materialMap);
    scene.add(starMesh);
    sun = starMesh;

    const lensflare = new Lensflare();

    const textureFlare0 = textureLoader.load('./textures/Lensflare/lensflare0_alpha.png' );
	const textureFlare3 = textureLoader.load('./textures/Lensflare/lensflare3.png' );

    // lensflare.addElement( new LensflareElement( textureFlare0, 200, 0, light.color ) );
	lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
	lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
	lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
	lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));

    light.remove(light.children[0]);
    light.add(lensflare);

    const spriteMaterial = new THREE.SpriteMaterial({map: textureFlare0});
    sunSprite = new THREE.Sprite(spriteMaterial);
    sunSprite.scale.set(50000, 50000, 50000);
    scene.add(sunSprite);

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

        // Rotate sun
        sun.rotateY(0.05 / 100 * timeStep);

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

    let distanceThreshold = 25000;

    if ((camera.position.distanceTo(sun.position) < distanceThreshold) && (!accurateScale)) {
        sunSprite.visible = false;
    } else {
        sunSprite.visible = true;
    };

    if (camera.parent != null) {
        if ((camera.parent.position.distanceTo(sun.position) < distanceThreshold)) {
            sunSprite.visible = false;
        } else {
            sunSprite.visible = true;
        }
    };

    if ((camera.parent != null) && (accurateScale)) {
        const distanceToSun = camera.parent.position.distanceTo(sun.position)
        sunSprite.visible = true;
        const intensity = Math.pow(distanceToSun, 0.6) * 10000;
        sunSprite.scale.set(intensity, intensity, intensity);
    };

    if ((camera.parent == null) && (accurateScale)) {
        const distanceToSun = camera.position.distanceTo(sun.position)
        const intensity = Math.pow(distanceToSun, 0.6) * 100;
        sunSprite.scale.set(intensity, intensity, intensity);
    };


    if ((cameraTarget == planets[8][1]) && (accurateScale)) {
        const scale = 1/25;
        planets[8][1].scale.set(scale, scale, scale);

        const distanceToSun = camera.parent.position.distanceTo(sun.position)
        const intensity = Math.pow(distanceToSun, 0.6) * 700;
        sunSprite.scale.set(intensity, intensity, intensity);
    };

    sun.visible = !sunSprite.visible;

    camera.copy(fakeCamera);
    controls.update();

    renderer.render(scene, camera);

    labelRenderer.render( scene, camera );
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

function onMouseDown(event)  {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    lockOn();
};

function onTouchDown(event) {
    var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    const x = touch.pageX;
    const y = touch.pageY;
    pointer.x = ( x / window.innerWidth ) * 2 - 1;
	pointer.y = - ( y / window.innerHeight ) * 2 + 1;

    lockOn();
};

function lockOn(){
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( planetObjects );
    if (intersects[0] != null) {
        let  planet = 0;
        for (let t = 0;  t < planetObjects.length; t ++) {
            if (intersects[0].object == planetObjects[t]) {
                planet = planets[t];
            };
        };

        controls.reset();
        cameraTarget = planet[1];
        cameraTarget.add(camera);
        cameraRadii = planet[0][3];
        const tempRadius = planet[0][3] * 300;
        const startPos = new THREE.Vector3(tempRadius, tempRadius, tempRadius);
        fakeCamera.position.copy(startPos);
        controls.enablePan = false;
        sunLock = false;
    };
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('touchstart', onTouchDown);

splines = []
planets = []
orbitObjects = []
planetObjects = []

labelList = [];

init();
initControls();

const colours =  [0xd10000, 0xd17300, 0x2ad100, 0x00d1ca, 0x005bd1, 0x1500d1, 0x6f00d1, 0xd100c3, 0xd10046];
const cssColours = ["#d10000", "#d17300", "#2ad100", "#00d1ca", "#005bd1", "#1500d1", "#6f00d1", "#d100c3", "#d10046"];

let i = -1;
for (const [key, value] of Object.entries(solarSystem)) {
    if (key != Object.keys(solarSystem)[0]) {
        const splineOrbit = generateOrbit(value[0], value[1], value[2], false, colours[i]);
        splines.push(splineOrbit[0]);
        orbitObjects.push(splineOrbit[1]);
        planets.push(generatePlanet(value));
    } else {
        generateStar(value, false);
    }
    i++;
}

initLabels();

//scene.scale.set(0.0001, 0.0001, 0.0001);

let frameCount = 0;
animate();