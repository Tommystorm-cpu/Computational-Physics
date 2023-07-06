import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { solarSystem, justPluto } from './planetData.js';
import { get_angle } from './Theta_Function.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { BendPlane } from './BendPlane.js';
import { Planet } from './Planet.js';

export class SolarSystemViewer {
    constructor () {
        this.cameraTarget = 0;
        this.time = 0;
        this.timeStep = 0.5;
        this.sunLock = false;
        this.accurateScale = false;
        this.labelBool = false;
        this.camera;
        this.labelRenderer;
        this.scene;
        this.fakeCamera;
        this.controls;
        this.raycaster;
        this.pointer;
        this.planets = new Set();

        this.init3d();
        this.createLabelRenderer();
        this.createControls();
        //this.createKeyHandler();
        this.createPlanets();

        window.toggleOrbit = (accurate) => {
            this.planets.forEach(planet => {
                planet.toggleAccurateOrbit(accurate);
            })
        }
    }

    init3d () {
        // Scene
        this.scene = new THREE.Scene();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.id = "solarCanvas";

        // Raycasting
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            250000000000
        );

        this.camera.position.y = 1000;
        this.camera.position.z = 1000;

        this.createLights();
        
        this.loadSkybox();
    }

    initControlPanel () {
        const timeSlider = document.getElementById("timeSlider");
        timeSlider.oninput = (event) => {
            timeStep = event.target.value;
        };
    
        const centreButton = document.getElementById("centreButton");
        centreButton.onclick = (event) => {
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
    
        sunRadial = document.getElementById("sunRadial");
        sunRadial.onchange = () => {
            sunLock = sunRadial.checked;
        };
    
        labelRadial = document.getElementById("labelRadial");
        labelRadial.onchange = (event) => {
            //event.stopPropagation();
            labelBool = labelRadial.checked;
            initLabels();
        };
    
        const scalingRadial = document.getElementById("scalingRadial");
        scalingRadial.onchange = () => {
            accurateScale = scalingRadial.checked;
            updateScale();
        };
    
        const planetNames = []
        focusDropDown = document.getElementById("focusDropDown");
        for (let i = 0; i < planets.length; i++) {
            const optionElement = document.createElement("option")
            const textNode = document.createTextNode(planets[i][0][6]);
            planetNames.push(planets[i][0][6]);
            optionElement.appendChild(textNode);
            focusDropDown.appendChild(optionElement);
        }
    
        focusDropDown.onchange = () => {
            let planetIndex = -1;
            for (let v = 0; v < planetNames.length; v++) {
                if (focusDropDown.value == planetNames[v]) {
                    planetIndex = v;
                };
            };
            if (planetIndex == -1) {
                lockOn(null, true);
            } else {
                lockOn(planets[planetIndex], false);
            };
        };
    }

    toggleLabels() {
        labelRadial.checked = labelBool;
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

    loadSkybox () {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('Skybox/');
        const textureCube = loader.load(['right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png']);
        this.scene.background = textureCube;
    }

    createLabelRenderer () {
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize( window.innerWidth, window.innerHeight );
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        document.body.appendChild( labelRenderer.domElement );
        this.labelRenderer = labelRenderer;
    }

    createLights () {
        const light = new THREE.PointLight(0xffffff, 3);
        light.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this.scene.add(light);

        light.shadow.camera.far = 250000000000;
        light.shadow.camera.near = 0.1;

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    }

    createControls () {
        this.fakeCamera = this.camera.clone();
        this.controls = new OrbitControls(this.fakeCamera, this.labelRenderer.domElement);
    }

    createKeyHandler () {
        document.addEventListener('keyup', (event) => {

            const key = event.key;

            if (isFinite(key)) {
                if (key === "0") {
                    lockOn(null, true);
                } else {
                    const planet = planets[parseInt(key) - 1];
                    lockOn(planet, false);
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

    createPlanets () {
        const planets = this.planets;
        planets.add(new Planet("Mercury", 0.387, 0.21, 7, 0.383, 58.646, 0.243, "Mercury", 0, 0, 0xd10000));
        planets.add(new Planet("Venus", 0.723, 0.01, 3.39, 0.949, 243.018,  0.615, "Venus", 0, 0, 0xd17300));
        planets.add(new Planet("Earth", 1, 0.02, 0, 1, 0.997, 1, "Earth", 1, 0, 0x2ad100));
        planets.add(new Planet("Mars", 1.523, 0.09, 1.85, 0.533, 1.026, 1.881, "Mars", 0, 0, 0x00d1ca));
        planets.add(new Planet("Jupiter", 5.202, 0.05, 1.31, 11.209, 0.413, 11.861, "Jupiter", 0, 0, 0x005bd1));
        planets.add(new Planet("Saturn", 9.576, 0.06, 2.49, 9.449, 0.444, 29.628, "Saturn", 0, 0, 0x1500d1));
        planets.add(new Planet("Uranus", 19.293, 0.05, 0.77, 4.007, 0.718, 84.747, "Uranus", 0, 0, 0x6f00d1));
        planets.add(new Planet("Neptune", 30.246, 0.01, 1.77, 3.883, 0.671, 166.344, "Neptune", 0, 0, 0xd100c3));
        planets.add(new Planet("Pluto", 39.509, 0.25, 17.5, 0.187, 6.387, 248.348, "Pluto", 0, 0, 0xd10046));

        planets.forEach(planet => {
            this.scene.add(planet.group);
            if (planet.meshClouds) {
                this.scene.add(planet.meshClouds);
            }
            this.scene.add(planet.orbitMesh);
            this.scene.add(planet.scaledOrbitMesh);
        });
    }

    render () {
        requestAnimationFrame(() => this.render());

        this.camera.copy(this.fakeCamera);
        this.controls.update();

        this.planets.forEach(planet => {
            planet.render(this.time, this.timeStep);
        });

        this.renderer.render(this.scene, this.camera);

        this.time += this.timeStep/50;
        this.labelRenderer.render( this.scene, this.camera );
    }
}