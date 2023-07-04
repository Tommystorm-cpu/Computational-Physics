import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { solarSystem } from './planetData.js';
import { get_angle } from './Theta_Function.js';

let scene, camera, controls, renderer, light, time, splines, planets, cameraTarget, fakeCamera, sun, timeStep;

function init() {
    cameraTarget = 0;
    time = 0;
    timeStep = 0.5;

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

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

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
                const tempRadius = planets[parseInt(key) - 1][0][3] * 300;
                const startPos = new THREE.Vector3(tempRadius, tempRadius, tempRadius);
                fakeCamera.position.copy(startPos);
                controls.enablePan = false;
            };
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

function generatePlanet(planet) {
    const radius = planet[3] * 200;
    const textureType = planet[6];
    const clouds = planet[7];

    var result = [planet];

    // Planet Texture
    var mapPath = "";
    var normalPath = "";
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
        var cloudPath = "";
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

    for (var angle = 0; angle < 2 * Math.PI; angle += 0.01) {
        const radius = (semi_major * (1 - (Math.pow(eccen, 2)))) / (1 - eccen * Math.cos(angle))
        const xPos = radius * Math.sin(angle) * scalar;
        const yPos = radius * Math.cos(angle) * scalar;
        const zPos = xPos * Math.tan(inclination * (Math.PI / 180));
        const vector = new THREE.Vector3(xPos, zPos, yPos);
        generatedPoints.push(vector);
    }
    generatedPoints.push(generatedPoints[0].clone());
    const spline = new THREE.CatmullRomCurve3(generatedPoints);

    // Draw Spline
    const points = spline.getPoints(300);
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
    scene.add(starMesh);
    sun = starMesh;

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
    for (var i = 0; i < planets.length; i++) {

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

    camera.copy(fakeCamera);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


window.addEventListener('resize', onWindowResize, false);

init();
initControls();

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