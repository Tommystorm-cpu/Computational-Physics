import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, Light, splines, time, planets;

function init() {
    time = 0;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        50, 
        10000 
    );
    camera.position.z = 1000;

    // Light
    Light = new THREE.PointLight(0xffffff, 3);
    Light.position.set(0, 0, 0);
    scene.add(Light);

    const pointLightHelper = new THREE.PointLightHelper(Light, 100);
    // scene.add(pointLightHelper);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambLight)

    // Helper
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Skybox
    const loader = new THREE.CubeTextureLoader();
    loader.setPath( 'Skybox/' );
    const textureCube = loader.load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );
    scene.background = textureCube;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement );
}

function animate() {
    requestAnimationFrame(animate);
    planets[0].rotateY(0.01);
    for (var i = 0; i < planets.length; i++) {
        positionObject(splines[0], planets[i], time);
    }
    time += 0.01;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function positionObject(curve, object, angle){
    let pos = angle / (2 * Math.PI);
    pos = pos - Math.floor(pos)
    const position = curve.getPointAt(pos);
    object.position.copy(position);
}

function generate_planet(radius) {
    // Earth
    const textureLoader = new THREE.TextureLoader();
    const materialNormalMap = new THREE.MeshPhongMaterial( {

        specular: 0x7c7c7c,
        shininess: 15,
        map: textureLoader.load( 'textures/earth_atmos_2048.jpg' ),
        specularMap: textureLoader.load( 'textures/earth_specular_2048.jpg' ),
        normalMap: textureLoader.load( 'textures/earth_normal_2048.jpg' ),

        // y scale is negated to compensate for normal map handedness.
        normalScale: new THREE.Vector2( 0.85, - 0.85 )

    } );
    materialNormalMap.map.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(radius, 100, 50);
    const meshPlanet = new THREE.Mesh( geometry, materialNormalMap);

    // Clouds
    const materialClouds = new THREE.MeshLambertMaterial( {

        map: textureLoader.load( 'textures/earth_clouds_1024.png' ),
        transparent: true

    } );
    materialClouds.map.colorSpace = THREE.SRGBColorSpace;

    const meshClouds = new THREE.Mesh( geometry, materialClouds );
    meshClouds.scale.set( 1.005, 1.005, 1.005);

    // Group
    const group = new THREE.Group();
    group.add(meshPlanet);
    group.add(meshClouds);

    group.rotation.z = 0.4;

    scene.add(group);

    return group;
}

function generate_orbit(semi_major, eccen) {
    // Generate spline
    const generated_points = [];
    const scalar = 500;

    for (var angle = 0; angle < 2*Math.PI; angle+=0.01){
        const radius = (semi_major*(1-(Math.pow(eccen, 2))))/(1-eccen*Math.cos(angle))
        const x_pos = radius * Math.sin(angle) * scalar;
        const y_pos = radius * Math.cos(angle) * scalar;
        const vector = new THREE.Vector3(x_pos, 0, y_pos);
        generated_points.push(vector);
    }
    generated_points.push(generated_points[0].clone());
    const spline = new THREE.CatmullRomCurve3(generated_points);

    // Draw Spline
    const points = spline.getPoints(150);
    const spline_geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color: 0xff0000});
    const curveObject = new THREE.Line(spline_geometry, material);
    scene.add(curveObject);

    return spline;
}

window.addEventListener('resize', onWindowResize, false);


init();
splines = [generate_orbit(1, 0.02)]
planets = [generate_planet(100)]
animate();