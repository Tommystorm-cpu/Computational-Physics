import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, dirLight, meshPlanet, meshClouds;

function init() {

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        50, 
        1000 
    );
    camera.position.z = 1000;

    // Light
    dirLight = new THREE.DirectionalLight( 0xffffff, 3);
    dirLight.position.set( - 1, 0, 1 ).normalize();
    scene.add( dirLight );

    const ambLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambLight)

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Skybox
    const loader = new THREE.CubeTextureLoader();
    loader.setPath( 'Skybox/' );

    const textureCube = loader.load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );

    scene.background = textureCube;

    // Spheres
    const material = new THREE.MeshPhongMaterial({color: 0x00ff83});

    for (let i = 0; i < 32; i++){
        const width = Math.random()*8;
        const height = Math.random()*8;
        const depth = Math.random()*8;

        const geometry = new THREE.SphereGeometry(width);
        const sphere = new THREE.Mesh(geometry, material);
        // scene.add(sphere);

        const x = -20 + Math.random()*40;
        const y = -20 + Math.random()*40;
        const z = -20 + Math.random()*40;

        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;
        
    }

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

    const geometry = new THREE.SphereGeometry( 100, 100, 50 );

    meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
    meshPlanet.rotation.y = 0;
    meshPlanet.rotation.z = 0.4;
    scene.add( meshPlanet );

    // Clouds
    const materialClouds = new THREE.MeshLambertMaterial( {

        map: textureLoader.load( 'textures/earth_clouds_1024.png' ),
        transparent: true

    } );
    materialClouds.map.colorSpace = THREE.SRGBColorSpace;

    meshClouds = new THREE.Mesh( geometry, materialClouds );
    meshClouds.scale.set( 1.005, 1.005, 1.005);
    meshClouds.rotation.z = 0.4;
    scene.add( meshClouds );

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement );
}

function animate() {
    requestAnimationFrame(animate);
    meshPlanet.rotateY(0.003);
    meshClouds.rotateY(0.0045);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);


init();
animate();