import * as THREE from 'three';
import { system_list } from './PlanetData.js';

export class InputHandler {
    constructor (solarSystemViewer) {
        this.centreButton;
        this.timeSlider;
        this.sunRadial;
        this.labelRadial;
        this.scalingRadial;
        this.focusDropDown;
        this.solarSystemViewer = solarSystemViewer;
        this.raycaster;
        this.pointer;
        this.loadButton;
        this.exoplanetDropDown;

        this.initUI();
        this.initKeyHandler();
        this.initRaycaster();
    }

    initUI () {
        this.timeSlider = document.getElementById("timeSlider");
        this.timeSlider.oninput = () => {this.timeSliderEvent()};

        this.centreButton = document.getElementById("centreButton");
        this.centreButton.onclick = () => {this.centreButtonEvent()};

        this.sunRadial = document.getElementById("sunRadial");
        this.sunRadial.onchange = () => {this.sunRadialEvent()};

        this.labelRadial = document.getElementById("labelRadial");
        this.labelRadial.onchange = () => {this.labelRadialEvent()};

        this.scalingRadial = document.getElementById("scalingRadial");
        this.scalingRadial.onchange = () => {this.scalingRadialEvent()};

        this.focusDropDown = document.getElementById("focusDropDown");
        this.solarSystemViewer.planets.forEach(planet => {
            const optionElement = document.createElement("option")
            const textNode = document.createTextNode(planet.name);
            optionElement.appendChild(textNode);
            focusDropDown.appendChild(optionElement);
        })

        focusDropDown.onchange = () => {this.focusDropDownEvent()};

        this.exoplanetDropDown = document.getElementById("exoplanetDropDown");
        Object.keys(system_list).forEach(planetSystem => {
            const optionElement = document.createElement("option")
            const textNode = document.createTextNode(planetSystem);
            optionElement.appendChild(textNode);
            exoplanetDropDown.appendChild(optionElement);
        })

        this.loadButton = document.getElementById("loadButton");
        this.loadButton.onclick = () => {this.loadButtonEvent()};
    }

    initKeyHandler () {
        document.addEventListener('keyup', (event) => {

            const key = event.key;

            if (isFinite(key)) {
                if (key === "0") {
                    this.solarSystemViewer.lockOn(0);
                } else {
                    this.solarSystemViewer.lockOn(this.solarSystemViewer.planets.get(parseInt(key)));
                }
            }
            if (key === "s") {
                if (this.sunRadial.disabled == false) {
                    this.solarSystemViewer.setSunLock(!this.sunRadial.checked);
                }
            }

            if (key === "l") {
                this.solarSystemViewer.toggleLabels(!this.labelRadial.checked);
            }

            if (key === "h") {
                document.getElementById("controlPanel").style.display = "none";

                document.getElementById("timeSliderContainer").style.display = "none !important";
                document.getElementById("timeLabel").style.display = "none !important";
                document.getElementById("timeSlider").style.display = "none !important";
            }
        });
    }

    initRaycaster () {
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        window.addEventListener('mousedown', event => this.onMouseDown(event));
        window.addEventListener('touchstart', event => this.onTouchDown(event));
    }

    timeSliderEvent () {
        this.solarSystemViewer.timeStep = this.timeSlider.value;
    }

    sunRadialEvent () {
        this.solarSystemViewer.setSunLock(sunRadial.checked);
    }

    centreButtonEvent () {
        this.solarSystemViewer.lockOn(0);
    }

    labelRadialEvent () {
        this.solarSystemViewer.toggleLabels(this.labelRadial.checked);
    }

    scalingRadialEvent () {
        this.solarSystemViewer.toggleAccurate(this.scalingRadial.checked);
    }

    focusDropDownEvent () {
        let quitBool = false;
        this.solarSystemViewer.planets.forEach(planet => {
            if (planet.name == this.focusDropDown.value) {
                this.solarSystemViewer.lockOn(planet);
                quitBool = true;
            }
        })
        if (!quitBool) {
            this.solarSystemViewer.lockOn(0);
        }
    }

    loadButtonEvent () {
        this.solarSystemViewer.lockOn(0);
        this.labelRadial.checked = false;
        this.labelRadialEvent();
        this.scalingRadial.checked = false;
        this.scalingRadialEvent();

        this.solarSystemViewer.planets.forEach(planet => {
            planet.removePlanet();
        })
        this.solarSystemViewer.renderer.renderLists.dispose();
        const LabelElements = document.getElementsByClassName("label");
        Array.from(LabelElements).forEach(label => {
            label.remove();
        })

        this.solarSystemViewer.planets = new Map();;
        this.solarSystemViewer.systemName = this.exoplanetDropDown.value;
        this.solarSystemViewer.createPlanets();

        this.focusDropDown.innerHTML = "";
        let text = "";
        if (["Inner Solar", "Outer Solar", "Solar"].includes(this.solarSystemViewer.systemName)) {
            text = "Sun";
        } else {
            text = this.solarSystemViewer.systemName.concat(" a");
        }
        const optionElement = document.createElement("option")
        const textNode = document.createTextNode(text);
        optionElement.appendChild(textNode);
        focusDropDown.appendChild(optionElement);
        
        this.solarSystemViewer.planets.forEach(planet => {
            const optionElement = document.createElement("option")
            const textNode = document.createTextNode(planet.name);
            optionElement.appendChild(textNode);
            focusDropDown.appendChild(optionElement);
        })

        this.solarSystemViewer.star.removeStar();
        this.solarSystemViewer.createStar();

        let tempOrbitPeriod = 0;
        this.solarSystemViewer.planets.forEach(planet => {
            if (planet.orbitPeriod > tempOrbitPeriod) {
                tempOrbitPeriod = planet.orbitPeriod;
            }
        })
        this.timeSlider.value = 0;
        this.timeSlider.max = tempOrbitPeriod /  10;
        this.timeSlider.step = this.timeSlider.max / 1000;
    }

    onMouseDown (event) {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
        if (!event.target.classList.contains("blockPlanetFocus")) {
            this.raycast();
        }
    }

    onTouchDown (event) {
        var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        const x = touch.pageX;
        const y = touch.pageY;
        this.pointer.x = ( x / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( y / window.innerHeight ) * 2 + 1;

        if (!event.target.classList.contains("blockPlanetFocus")) {
            this.raycast();
        }
    }

    raycast () {
        this.raycaster.setFromCamera( this.pointer, this.solarSystemViewer.camera );
        let planetObjects = [];
        this.solarSystemViewer.planets.forEach(planet => {
            planetObjects.push(planet.mesh);
        })
        const intersects = this.raycaster.intersectObjects(planetObjects);
        if (intersects[0] != null) {
            let intersectPlanet;
            this.solarSystemViewer.planets.forEach(planet => {
                if (intersects[0].object == planet.mesh) {
                    intersectPlanet = planet;
                }
            })
            this.solarSystemViewer.lockOn(intersectPlanet);
        };
    }
}