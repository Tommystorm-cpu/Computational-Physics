import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//https://www.youtube.com/watch?v=_OwJV2xL8M8

let scene, camera, renderer, sphere;

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth /  window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 20;

    // Light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 10);
    scene.add(light);

    /*
    const light2 = new THREE.PointLight(0xffffff, 0.1, 100);
    light2.position.set(0, -10, 10);
    scene.add(light2);
    */

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    // Sphere
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshStandardMaterial({color: 0x00ff83});
    
    sphere = new THREE.Mesh(geometry, material);
    // scene.add(sphere);

    // // Cube
    // const geometry2 = new THREE.BoxGeometry(8, 8, 8);
    
    // const texture = new THREE.TextureLoader().load('dirt.png');
    // const material2 = new THREE.MeshBasicMaterial({map: texture});

    // const cube = new THREE.Mesh(geometry2, material);
    // scene.add(cube);

    // cube.position.x = 10;

    for (let i = 0; i < 32; i++){
        const width = Math.random()*8;
        const height = Math.random()*8;
        const depth = Math.random()*8;

        const geometry2 = new THREE.BoxGeometry(width, height, depth);
        const cube = new THREE.Mesh(geometry2, material);
        scene.add(cube);
        
        const x = -10 + Math.random()*20;
        const y = -10 + Math.random()*20;
        const z = -10 + Math.random()*20;
        
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
    }

    

    // Controls
    const controls = new OrbitControls( camera, renderer.domElement );
}

function animate() {
    requestAnimationFrame(animate);

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