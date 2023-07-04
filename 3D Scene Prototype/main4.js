import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { solarSystem } from './planetData.js';
import { get_angle } from './Theta_Function.js';

let scene, camera, renderer, light, time, splines, planets;

function init() {
    time = 0;

    // Scene
    scene = new THREE.Scene();

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true});
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
    loader.setPath( 'Skybox/' );
    const textureCube = loader.load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );
    scene.background = textureCube;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement );
}

function generatePlanet(planet) {
    const radius = planet[3] * 100;
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
    const materialNormalMap = new THREE.MeshPhongMaterial( {
        map: textureLoader.load(mapPath),
        normalMap: textureLoader.load(normalPath)
    } );
    materialNormalMap.map.colorSpace = THREE.SRGBColorSpace;

    // Planet Mesh
    const geometry = new THREE.SphereGeometry(radius, 500, 250);
    const meshPlanet = new THREE.Mesh( geometry, materialNormalMap);
    meshPlanet.castShadow = true;
    meshPlanet.receiveShadow = true;
    scene.add(meshPlanet);
    result.push(meshPlanet);

    if (clouds == 1) {
        // Clouds Texture
        var cloudPath = "";
        if (textureType == "Earth") {
            cloudPath = "./textures/Solar System/Earth Clouds.jpg"
        } else {
            cloudPath = './textures/Martian/Martian Clouds ('.concat(variant).concat(').png');
        }
        
        const materialClouds = new THREE.MeshLambertMaterial( {
            map: textureLoader.load(cloudPath),
            transparent: true
        } );
        materialClouds.map.colorSpace = THREE.SRGBColorSpace;

        // Clouds Mesh
        const meshClouds = new THREE.Mesh( geometry, materialClouds );
        meshClouds.scale.set( 1.005, 1.005, 1.005);
        meshClouds.receiveShadow = true;
        scene.add(meshClouds);
        result.push(meshClouds);
    }

    return result;
}

function generateOrbit(semi_major, eccen, inclination) {
    // Generate spline
    const generatedPoints = [];
    const scalar = 1000;

    for (var angle = 0; angle < 2*Math.PI; angle+=0.01){
        const radius = (semi_major*(1-(Math.pow(eccen, 2))))/(1-eccen*Math.cos(angle))
        const xPos = radius * Math.sin(angle) * scalar;
        const yPos = radius * Math.cos(angle) * scalar;
        const zPos = xPos * Math.tan(inclination * (Math.PI/180));
        const vector = new THREE.Vector3(xPos, zPos, yPos);
        generatedPoints.push(vector);
    }
    generatedPoints.push(generatedPoints[0].clone());
    const spline = new THREE.CatmullRomCurve3(generatedPoints);

    // Draw Spline
    const points = spline.getPoints(150);
    const splineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color: 0xff0000});
    const curveObject = new THREE.Line(splineGeometry, material);
    scene.add(curveObject);

    return spline;
}

function positionObject(curve, object, orbitTime, planetData){
    const period = planetData[5];
    const eccen = planetData[1];
    //const angle = (2 * Math.PI *  orbitTime) / period;
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
        planets[i][1].rotateY(planets[i][0][4] / 100);
        // Move planet mesh (orbit path, planet mesh, time, planet data)
        positionObject(splines[i], planets[i][1], time, planets[i][0]);
        
        // Same as above for clouds
        if (planets[i].length == 3)  {
            planets[i][2].rotateY((planets[i][0][4] / 100) * 1.5);
            positionObject(splines[i], planets[i][2], time, planets[i][0]);
        }
    }
    time += 0.001;
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

splines = []
planets = []
for (const [key, value] of Object.entries(solarSystem)) {
  splines.push(generateOrbit(value[0], value[1], value[2]));
  planets.push(generatePlanet(value))
}



animate();