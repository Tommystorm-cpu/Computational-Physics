import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

export class Sun {
    constructor (name, radius, textureType, solarSystemViewer) {
        this.radius = radius;
        this.name = name;
        this.mesh;
        this.lensflare;
        this.sunSprite;
        this.solarSystemViewer = solarSystemViewer;

        this.loadSunMesh(textureType);
        this.createLensFlare();
        this.createSunSprite();
    }

    loadSunMesh (textureType) {
        let mapPath = "";
        if (textureType == "Sun") {
            mapPath = "./textures/Solar System/Sun Map.jpg"
        }

        const textureLoader = new THREE.TextureLoader();
        const materialMap = new THREE.MeshBasicMaterial({
            map: textureLoader.load(mapPath),
        });

        const geometry = new THREE.SphereGeometry(this.radius * 3, 500, 250);
        this.mesh = new THREE.Mesh(geometry, materialMap);
    }

    toggleAccurate (accurate) {
        if (accurate) {
            this.mesh.scale.copy(new THREE.Vector3(1/3, 1/3, 1/3));
        } else {
            this.mesh.scale.copy(new THREE.Vector3(1, 1, 1));
            this.sunSprite.scale.copy(new THREE.Vector3(50000, 50000, 50000));
        };
    }

    createLensFlare () {
        const lensflare = new Lensflare();

        const textureLoader = new THREE.TextureLoader();
        const textureFlare3 = textureLoader.load('./textures/Lensflare/lensflare3.png' );

        lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));

        this.lensflare = lensflare;
    }

    createSunSprite () {
        const textureLoader = new THREE.TextureLoader();
        const textureFlare0 = textureLoader.load('./textures/Lensflare/lensflare0_alpha.png' );
        const spriteMaterial = new THREE.SpriteMaterial({map: textureFlare0, transparent: true});
        this.sunSprite = new THREE.Sprite(spriteMaterial);
        this.sunSprite.scale.set(50000, 50000, 50000);
    }

    changeSpriteSizeAccurate () {
        const camera = this.solarSystemViewer.camera;
        const cameraTarget = this.solarSystemViewer.cameraTarget;

        if ((camera.parent != null)) {
            const distanceToSun = camera.parent.position.distanceTo(this.mesh.position)
            const intensity = Math.pow(distanceToSun, 0.6) * 10000;
            this.sunSprite.scale.set(intensity, intensity, intensity);
        };

        if ((camera.parent == null)) {
            const distanceToSun = camera.position.distanceTo(this.mesh.position)
            const intensity = Math.pow(distanceToSun, 0.6) * 100;
            this.sunSprite.scale.set(intensity, intensity, intensity);
        };

        if ((cameraTarget.name == "Pluto")) {
            const distanceToSun = camera.parent.position.distanceTo(this.mesh.position)
            const intensity = Math.pow(distanceToSun, 0.6) * 700;
            this.sunSprite.scale.set(intensity, intensity, intensity);
        }
    }

    updateSunVisibility () {
        let distanceThreshold = 25000;
        if (this.solarSystemViewer.accurateScale) {
            distanceThreshold = 2500;
        }
        const camera = this.solarSystemViewer.camera;
        const fadeOutThreshold = distanceThreshold * 0.8
        const innerFadeThreshold = distanceThreshold * 0.3

        const target = (camera.parent) ? camera.parent : camera;
        const distanceTo = target.position.distanceTo(this.mesh.position)
        if (distanceTo < fadeOutThreshold && distanceTo > innerFadeThreshold) {
            this.sunSprite.material.opacity = (distanceTo - innerFadeThreshold) / (fadeOutThreshold - innerFadeThreshold);
        } 
        
        if (distanceTo > fadeOutThreshold) {
            this.sunSprite.material.opacity = 1;
        }

        if (distanceTo < innerFadeThreshold) {
            this.sunSprite.material.opacity = 0;
        }

        if (this.solarSystemViewer.accurateScale && camera.parent != null) {
            this.sunSprite.visible = true;
        }

        this.mesh.visible = (this.sunSprite.material.opacity != 1)
    }
}