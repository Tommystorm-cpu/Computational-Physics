import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer} from 'three/addons/renderers/CSS2DRenderer.js';
import { Planet } from './Planet.js';
import { InputHandler } from './InputHandler.js';
import { Sun } from './Sun.js';

export class SolarSystemViewer {
    constructor () {
        this.cameraTarget = 0;
        this.time = 0;
        this.timeStep = 0.5;
        this.sunLock = false;
        this.accurateScale = false;
        this.camera;
        this.cameraTarget;
        this.cameraRadii;
        this.labelRenderer;
        this.scene;
        this.fakeCamera;
        this.controls;
        this.planets = new Map();
        this.star;
        this.light;
        this.loaded = false;
        this.planetTextures = 0;

        this.init3d();
        this.createLabelRenderer();
        this.createControls();
        this.createPlanets();
        this.createStar();
        
        this.inputHandler = new InputHandler(this);

        this.setSunLock(false);
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

    toggleLabels (labelBool) {
        this.inputHandler.labelRadial.checked = labelBool;
        this.planets.forEach(planet => {
            planet.label.visible = labelBool;
        })
    }

    toggleAccurate (accurate) {
        this.accurateScale = accurate;
        this.planets.forEach(planet => {
            planet.toggleAccurateOrbit(accurate);
        })
        if (accurate) {
            this.toggleLabels(true);
        }
        this.star.toggleAccurate(accurate);
    }

    loadSkybox () {
        this.planetTextures++;
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('Skybox/');
        const textureCube = loader.load(
            ['right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png'],
            () => this.planetTextureLoad(), 
            null, 
            () => this.solarSystemViewer.planetTextureLoad()
        );
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
        this.light = light;
    }

    createControls () {
        this.fakeCamera = this.camera.clone();
        this.controls = new OrbitControls(this.fakeCamera, this.labelRenderer.domElement);
    }

    createPlanets () {
        const planets = this.planets;
        planets.set(1, new Planet(this, "Mercury", 0.387, 0.21, 7, 0.383, 58.646, 0.243, "Mercury", 0, 0, 0xd10000));
        planets.set(2, new Planet(this, "Venus", 0.723, 0.01, 3.39, 0.949, 243.018,  0.615, "Venus", 0, 0, 0xd17300));
        planets.set(3, new Planet(this, "Earth", 1, 0.02, 0, 1, 0.997, 1, "Earth", 1, 0, 0x2ad100));
        planets.set(4, new Planet(this, "Mars", 1.523, 0.09, 1.85, 0.533, 1.026, 1.881, "Mars", 0, 0, 0x00d1ca));
        planets.set(5, new Planet(this, "Jupiter", 5.202, 0.05, 1.31, 11.209, 0.413, 11.861, "Jupiter", 0, 0, 0x005bd1));
        planets.set(6, new Planet(this, "Saturn", 9.576, 0.06, 2.49, 9.449, 0.444, 29.628, "Saturn", 0, 0, 0x1500d1));
        planets.set(7, new Planet(this, "Uranus", 19.293, 0.05, 0.77, 4.007, 0.718, 84.747, "Uranus", 0, 0, 0x6f00d1));
        planets.set(8, new Planet(this, "Neptune", 30.246, 0.01, 1.77, 3.883, 0.671, 166.344, "Neptune", 0, 0, 0xd100c3));
        planets.set(9, new Planet(this, "Pluto", 39.509, 0.25, 17.5, 0.187, 6.387, 248.348, "Pluto", 0, 0, 0xd10046));

        planets.forEach(planet => {
            this.scene.add(planet.group);
            if (planet.meshClouds) {
                this.scene.add(planet.meshClouds);
            }
            this.scene.add(planet.orbitMesh);
            this.scene.add(planet.scaledOrbitMesh);
        });
    }

    planetTextureLoad () {
        this.planetTextures--;

        if (this.planetTextures == 0) {
            this.loaded = true;
            document.getElementById("loadingPanel").style.display = "none";
        }
    }

    createStar () {
        this.star = new Sun("Sun", 109.076, "Sun", this);
        this.scene.add(this.star.mesh);
        this.light.add(this.star.lensflare);
        this.scene.add(this.star.sunSprite);
    }

    lockOn (lockPlanet) {
        if (lockPlanet != 0) {
            this.inputHandler.focusDropDown.value = lockPlanet.name;
            if (this.cameraTarget != lockPlanet) {
                this.controls.reset();
                this.cameraTarget = lockPlanet;
                this.cameraTarget.group.add(this.camera);
                this.cameraRadii = lockPlanet.radius;
                const tempRadius = lockPlanet.radius * 300;
                const startPos = new THREE.Vector3(tempRadius, tempRadius, tempRadius);
                this.fakeCamera.position.copy(startPos);
                this.controls.enablePan = false;
                this.setSunLock(this.sunLock);
            };
        } else {
            this.inputHandler.focusDropDown.value = "Sun";
            if (this.cameraTarget == 0) {
                this.controls.reset();
            } else {
                this.cameraTarget.group.remove(this.camera);
                this.fakeCamera.position.add(this.cameraTarget.group.position);
                this.cameraTarget = 0;
                this.controls.enablePan = true;
            };
            this.setSunLock(false);
        };
    }

    setSunLock (sunBool) {
        this.sunLock = sunBool;
        this.inputHandler.sunRadial.checked = sunBool;

        if (this.cameraTarget == 0) {
            this.inputHandler.sunRadial.disabled = true;
        } else {
            this.inputHandler.sunRadial.disabled = false;
        }
    }

    updateSunLock () {
        if (this.sunLock) {
            let cameraPos = new THREE.Vector3();
            const vertOffest = new THREE.Vector3(0, this.cameraRadii * 500, 0);
            cameraPos.copy(this.cameraTarget.group.position);
            cameraPos.normalize();
            cameraPos.multiplyScalar(this.cameraRadii * 1000);
            cameraPos.add(vertOffest);
            this.fakeCamera.position.copy(cameraPos);
        }
    }

    render () {
        requestAnimationFrame(() => this.render());
        if (!this.loaded) {
            return;
        }

        this.camera.copy(this.fakeCamera);
        this.controls.update();

        this.planets.forEach(planet => {
            planet.render(this.time, this.timeStep);
        });

        this.updateSunLock();
        if (this.accurateScale) {
            this.star.changeSpriteSizeAccurate();
        }
        this.star.updateSunVisibility();
        this.star.mesh.rotateY(0.01 * this.timeStep);

        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);

        this.time += this.timeStep/50;
        this.labelRenderer.render( this.scene, this.camera );
    }
}