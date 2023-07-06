import * as THREE from 'three';
import { BendPlane } from "./BendPlane.js";
import { GetAngle } from "./GetAngle.js";
import { RandInt } from "./RandInt.js";

export class Planet {
    constructor (name, semiMajor, eccen, inclination, radius, rotatePeriod, orbitPeriod, textureType, hasClouds, axisTilt, orbitColour) {
        this.name = name;
        this.semiMajor = semiMajor;
        this.eccen = eccen;
        this.inclination = inclination;
        this.radius = radius;
        this.rotatePeriod = rotatePeriod;
        this.orbitPeriod = orbitPeriod;
        this.textureType = textureType;
        this.hasClouds = hasClouds;
        this.axisTilt = axisTilt;
        this.mesh;
        this.meshClouds;
        this.group;

        this.orbitSpline;
        this.orbitMesh;
        this.scaledOrbitSpline;
        this.scaledOrbitMesh;

        this.init();
        this.initOrbit(orbitColour);
        this.initScaledOrbit(orbitColour);
    }

    init() {
        const radius = this.radius * 200;
        //const textureType = planet[6];
        //const clouds = planet[7];

        // let result = [planet];

        // Planet Texture
        let mapPath = "";
        let normalPath = "";
        let ringPath = "";
        if (this.textureType != "Martian") {
            mapPath = "./textures/Solar System/".concat(this.textureType).concat(" Map.jpg");
            normalPath = "./textures/Solar System/".concat(this.textureType).concat(" Normal.jpg");
        }

        if (this.textureType == "Saturn") {
            ringPath = "./textures/Solar System/Saturn Ring.png"
        } else if (this.textureType == "Uranus") {
            ringPath = "./textures/Solar System/Uranus Ring.jpg"
        };

        const variant = RandInt(1, 10);
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

        //planetObjects.push(meshPlanet);
        this.mesh = meshPlanet;


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
            //bend(ringGeometry, ringParams.rMin, ringParams.rMax);
            BendPlane(ringGeometry, ringParams.rMin, ringParams.rMax);
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

        this.group = group;

        //scene.add(group);
        //result.push(group);

        if (this.hasClouds) {
            // Clouds Texture
            let cloudPath = "";
            if (this.textureType == "Earth") {
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
            //scene.add(meshClouds);
            //result.push(meshClouds);
            this.meshClouds = meshClouds;
        }

        //planetObjects.push(result[1]);

        //return result;
    }

    initOrbit (colour) {
        // Generate spline
        const semi_major = this.semiMajor;
        const eccen = this.eccen;
        const inclination = this.inclination;

        const generatedPoints = [];
        const scalar = 2000;

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
        const resolution = 1000;
        const points = spline.getPoints(resolution);
        const splineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: colour });
        const curveObject = new THREE.Line(splineGeometry, material);
        //scene.add(curveObject);

        this.orbitSpline = spline;
        this.orbitMesh = curveObject;
    }

    initScaledOrbit (colour) {
        // Generate spline
        const semi_major = this.semiMajor;
        const eccen = this.eccen;
        const inclination = this.inclination;

        const generatedPoints = [];
        const scalar = 23450

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
        const resolution = parseInt(Math.floor(semi_major * 2500));
        const points = spline.getPoints(resolution);
        const splineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: colour });
        const curveObject = new THREE.Line(splineGeometry, material);
        //scene.add(curveObject);

        this.scaledOrbitSpline = spline;
        this.scaledOrbitMesh = curveObject;
    }

    updatePosition (orbitTime) {
        const angle = GetAngle(this.eccen, this.orbitPeriod, orbitTime);
        let pos = angle / (2 * Math.PI);
        pos = pos - Math.floor(pos)
        const position = this.orbitSpline.getPointAt(pos);
        this.group.position.copy(position);
    }

    updateClouds (orbitTime) {
        const angle = GetAngle(this.eccen, this.orbitPeriod, orbitTime);
        let pos = angle / (2 * Math.PI);
        pos = pos - Math.floor(pos)
        const position = this.orbitSpline.getPointAt(pos);
        this.meshClouds.position.copy(position);
    }

    render (time, timeStep) {
        // Rotate planet mesh
        this.mesh.rotateY(this.rotatePeriod / 100 * timeStep);
        // Move planet mesh (orbit path, planet mesh, time, planet data)
        this.updatePosition(time);

        // Same as above for clouds
        if (this.meshClouds) {
            this.meshClouds.rotateY((this.rotatePeriod / 100) * 1.5 * timeStep);
            this.updateClouds(time);
        }
    }
}