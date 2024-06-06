import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import starTexture from './img/stars.jpg';
import earthTexture from './img/earth.jpg';
import jupiterTexture from './img/jupiter.jpg';
import marsTexture from './img/mars.jpg';
import neptuneTexture from './img/neptune.jpg';
import plutoTexture from './img/pluto.jpg';
import saturnTexture from './img/saturn.jpg';
import venusTexture from './img/venus.jpg';
import uranusTexture from './img/uranus.jpg';
import sunTexture from './img/sun.jpg';
import mercuryTexture from './img/mercury.jpg';
import saturnRingTexture from './img/saturnring.png';
import uranusRingTexture from './img/uranusRing.png';

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333, 20);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starTexture,
    starTexture,
    starTexture,
    starTexture,
    starTexture,
    starTexture,
]);

const textureLoader = new THREE.TextureLoader();

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Adding a point light for the planets
const pointLight = new THREE.PointLight(0xFFFFFF, 5000, 3000);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

// Add sun
const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function for the creation of planets
function createPlanet(size, texture, distance, ring) {
    const planetGeometry = new THREE.SphereGeometry(size, 30, 30);
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    const pivot = new THREE.Object3D();
    scene.add(pivot);

    const planetGroup = new THREE.Object3D();
    planetGroup.position.x = distance;
    pivot.add(planetGroup);
    planetGroup.add(planetMesh);

    if (ring) {
        // Adding Ring
        const ringGeometry = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

        ringMesh.rotation.x = -0.5 * Math.PI;
        planetMesh.add(ringMesh);
    }

    return { planetMesh, pivot };
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.7, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);

const saturn = createPlanet(8, saturnTexture, 120, { innerRadius: 10, outerRadius: 20, texture: saturnRingTexture });
const uranus = createPlanet(8, uranusTexture, 150, { innerRadius: 7, outerRadius: 12, texture: uranusRingTexture });
const neptune = createPlanet(7, neptuneTexture, 170);
const pluto = createPlanet(7,plutoTexture, 190);


function animate() {
    sun.rotation.y += 0.004;

    mercury.pivot.rotation.y += 0.01;
    mercury.planetMesh.rotation.y += 0.01;

    venus.pivot.rotation.y += 0.008;
    venus.planetMesh.rotation.y += 0.01;

    earth.pivot.rotation.y += 0.006;
    earth.planetMesh.rotation.y += 0.01;

    mars.pivot.rotation.y += 0.005;
    mars.planetMesh.rotation.y += 0.01;

    jupiter.pivot.rotation.y += 0.004;
    jupiter.planetMesh.rotation.y += 0.01;

    saturn.pivot.rotation.y += 0.003;
    saturn.planetMesh.rotation.y += 0.01;

    uranus.pivot.rotation.y += 0.002;
    uranus.planetMesh.rotation.y += 0.01;

    neptune.pivot.rotation.y += 0.001;
    neptune.planetMesh.rotation.y += 0.01;

    pluto.pivot.rotation.y += 0.0008;
    pluto.planetMesh.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();
