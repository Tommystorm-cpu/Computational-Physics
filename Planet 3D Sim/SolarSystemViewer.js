import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer} from 'three/addons/renderers/CSS2DRenderer.js';
import { Planet } from './Planet.js';
import { InputHandler } from './InputHandler.js';
import { Sun } from './Sun.js';
import { system_list, system_scales, sun_radii } from './PlanetData.js';


// Main class to handle nearly all rendering and logic
export class SolarSystemViewer {
    constructor () {
        // Initialize all the variables
        this.cameraTarget = 0;
        this.time = 0;
        this.timeStep = 0.5;
        this.sunLock = false;
        this.accurateScale = false;
        this.camera;
        this.cameraTarget;
        this.cameraRadii;
        this.renderer;
        this.labelRenderer;
        this.scene;
        this.fakeCamera;
        this.controls;
        this.planets = new Map();
        this.star;
        this.light;
        this.loaded = false;
        this.planetTextures = 0;
        this.systemName = "Solar";
        this.inaccurateScalar;
        this.endTime = [];
        this.smallestOrbit = 100000;

        // Call initialisation functions
        this.init3d();
        this.createLabelRenderer();
        this.createPlanets();
        this.createControls();
        this.createStar();
        
        // Create input handler
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
        
        // Load lights and skybox
        this.createLights();
        this.loadSkybox();
        
        // Resizing event
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize () {
        // Resizing script
        this.fakeCamera.aspect = window.innerWidth / window.innerHeight;
        this.fakeCamera.updateProjectionMatrix();

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.controls.update();

        this.labelRenderer.domElement.style.width = this.renderer.domElement.width + 'px';
        this.labelRenderer.domElement.style.height = this.renderer.domElement.height + 'px';
    }

    toggleLabels (labelBool) {
        // Toggles labels for each planet
        this.inputHandler.labelRadial.checked = labelBool;
        this.planets.forEach(planet => {
            planet.label.visible = labelBool;
        })
    }

    toggleAccurate (accurate) {
        // Toggles accurate scaling mode
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
        this.planetTextures++; // for the loading screen

        // Loads textures
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('Skybox/');
        const textureCube = loader.load(
            ['right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png'],
            () => this.planetTextureLoad(), 
            null, 
            () => this.solarSystemViewer.planetTextureLoad()
        );
        // Sets skybox
        this.scene.background = textureCube;
    }

    createLabelRenderer () {
        // Creates the label renderer to handle labels
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize( window.innerWidth, window.innerHeight );
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        document.body.appendChild( labelRenderer.domElement );
        this.labelRenderer = labelRenderer;
    }

    createLights () {
        // Creates the main light in the scene
        const light = new THREE.PointLight(0xffffff, 3);
        light.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this.scene.add(light);

        light.shadow.camera.far = 250000000000; // This has to be really high. It causes some artifacts unfortunately.
        light.shadow.camera.near = 0.1;

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.1));
        this.light = light;
    }

    createControls () {
        // Creates a fake camera to allow orbit controls when locked onto a planet
        this.fakeCamera = this.camera.clone();
        this.controls = new OrbitControls(this.fakeCamera, this.labelRenderer.domElement);

        this.fakeCamera.position.set(0, this.smallestOrbit * 10000, this.smallestOrbit * 10000);
        this.fakeCamera.lookAt(new THREE.Vector3(0,0,0))
    }

    createPlanets () {
        // Creates all the orbits
        const planets = this.planets;
        const colourList = [0xd10000, 0xd17300, 0x2ad100, 0x00d1ca, 0x005bd1, 0x1500d1, 0x6f00d1, 0xd100c3, 0xd10046];

        this.inaccurateScalar = system_scales[this.systemName];

        const systemPlanets = system_list[this.systemName];
        let index = 0;
        for (const planetIndex in systemPlanets) {
            const planet = systemPlanets[planetIndex];
            // (solarSystemViewer, name, semiMajor, eccen, inclination, radius, rotatePeriod, orbitPeriod, textureType, cloudType, axisTilt, orbitColour)
            planets.set(index, new Planet(this, planet[7], planet[1], planet[2], planet[3], planet[4], planet[5], planet[6], planet[8], planet[9], 0, colourList[index]));
            index ++;
        }
        

        // Grabs the smallest orbit in the system
        this.smallestOrbit = 100000;
        planets.forEach(planet => {
            this.scene.add(planet.group);
            if (planet.meshClouds) {
                this.scene.add(planet.meshClouds);
            }
            this.scene.add(planet.orbitMesh);
            this.scene.add(planet.scaledOrbitMesh);

            if (planet.semiMajor < this.smallestOrbit) {
                this.smallestOrbit = planet.semiMajor;
            }
        });
    }

    planetTextureLoad () {
        // Called when a planet texture is loaded
        this.planetTextures--;

        // Destroys loading screen
        if (this.planetTextures == 0) {
            this.loaded = true;
            document.getElementById("loadingRing").style.display = "none";
            document.getElementById("loadingTitle").style.display = "none";
            document.getElementById("loadingButton").style.display = "block";

            document.getElementById("loadingButton").onclick = () => {

                const loadingPanel = document.getElementById("loadingPanel");

                while (loadingPanel.firstChild) {
                    loadingPanel.removeChild(loadingPanel.firstChild);
                }

                loadingPanel.remove();
            };
        }
    }

    createStar () {
        // Creates the sun
        const radius = sun_radii[this.systemName];
        this.star = new Sun("Sun", radius, "Sun", this);
        this.scene.add(this.star.mesh);
        this.light.add(this.star.lensflare);
        this.scene.add(this.star.sunSprite);
    }

    lockOn (lockPlanet) {
        // Locks on to planet. 0 = lock onto sun.
        if (lockPlanet != 0) {
            this.inputHandler.focusDropDown.value = lockPlanet.name;
            if (this.cameraTarget != lockPlanet) {
                // Positions camera
                this.controls.reset();
                this.cameraTarget = lockPlanet;
                this.cameraTarget.group.add(this.camera);
                this.cameraRadii = lockPlanet.radius;
                const tempRadius = (this.cameraRadii * this.inaccurateScalar * 3) / Math.sqrt(3);
                const startPos = new THREE.Vector3(tempRadius, tempRadius, tempRadius);
                this.fakeCamera.position.copy(startPos);
                this.controls.enablePan = false;
                this.setSunLock(this.sunLock);
            };
        } else {
            // Locks onto sun.
            let text = "";
            if (["Inner Solar", "Outer Solar", "Solar"].includes(this.systemName)) {
                text = "Sun";
            } else {
                text = this.systemName.concat(" a");
            }
            this.inputHandler.focusDropDown.value = text;
            if (this.cameraTarget == 0) {
                this.controls.reset();
                //2584
                this.fakeCamera.position.set(0, this.smallestOrbit * 10000, this.smallestOrbit * 10000);
                this.fakeCamera.lookAt(new THREE.Vector3(0,0,0))
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
        // Sets sunlock and updates variables
        this.sunLock = sunBool;
        this.inputHandler.sunRadial.checked = sunBool;

        if (this.cameraTarget == 0) {
            this.inputHandler.sunRadial.disabled = true;
        } else {
            this.inputHandler.sunRadial.disabled = false;
        }
    }

    updateSunLock () {
        // Positions camera according to sunlock
        if (this.sunLock) {
            let cameraPos = new THREE.Vector3();
            const vertOffest = new THREE.Vector3(0, this.cameraRadii * this.inaccurateScalar * 1.5, 0);
            cameraPos.copy(this.cameraTarget.group.position);
            cameraPos.normalize();
            cameraPos.multiplyScalar(this.cameraRadii * this.inaccurateScalar * 3);
            cameraPos.add(vertOffest);
            this.fakeCamera.position.copy(cameraPos);
        }
    }

    render () {
        // Main render loop

        // Calculates fps
        this.endTime.push(Date.now());
        let fps = 1000 / (this.endTime[this.endTime.length - 1] - this.endTime[this.endTime.length - 2]);
        if (!fps) {
            fps = 60;
        }
        this.time += this.timeStep/fps;
        
        // Doesn't render if not loaded
        requestAnimationFrame(() => this.render());
        if (!this.loaded) {
            return;
        }

        // Fake camera shenanigans
        this.camera.copy(this.fakeCamera);
        this.controls.update();

        // Renders each planet
        this.planets.forEach(planet => {
            planet.render(this.time, this.timeStep/fps);
        });

        // Updates camera and star
        this.updateSunLock();
        if (this.accurateScale) {
            this.star.changeSpriteSizeAccurate();
        }
        this.star.updateSunVisibility();
        this.star.mesh.rotateY(0.01 * this.timeStep);

        // Renders scene and labels
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);

        // Updates time UI
        this.inputHandler.updateTimeLabel();
    }
}