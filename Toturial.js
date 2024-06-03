import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
const axisHelper = new THREE.AxesHelper(3);
camera.position.set(-10, 30, 30);
orbit.update();
scene.add(axisHelper);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30, 10);
gridHelper.position.y=-4;
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF00FF,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-10, 10, 0);
scene.add(sphere);
sphere.castShadow = true;

// Creating Ambient light
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

// Creating spotLight 
const spotLight = new THREE.SpotLight(0xFFFFFF,760);
spotLight.position.set(-16, 23, 5.8);
spotLight.castShadow = true;
spotLight.angle=0.8;
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const gui = new dat.GUI();
const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed: 0.01,
    positionX: spotLight.position.x,
    positionY: spotLight.position.y,
    positionZ: spotLight.position.z,
    angle: spotLight.angle,
    penumbra: spotLight.penumbra,
    intensity: spotLight.intensity,
};

gui.addColor(options, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e);
});


gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 1);
gui.add(options, 'angle', 0, Math.PI).onChange((e) => {
    spotLight.angle = e;
    spotLightHelper.update();
});

gui.add(options, 'penumbra', 0, 100).onChange((e) => {
    spotLight.penumbra = e;
});

gui.add(options, 'intensity', 0, 1000).onChange((e) => {
    spotLight.intensity = e;
});

gui.add(options, 'positionX', -100, 100).onChange((e) => {
    spotLight.position.x = e;
    spotLightHelper.update();
});

gui.add(options, 'positionY', -100, 100).onChange((e) => {
    spotLight.position.y = e;
    spotLightHelper.update();
});

gui.add(options, 'positionZ', -100, 100).onChange((e) => {
    spotLight.position.z = e;
    spotLightHelper.update();
});
plane.position.y=-4;
renderer.setAnimationLoop(animate);
let step = 0;
//scene.fog= new THREE.Fog(0xFFFFFF,0,200)
scene.fog= new THREE.FogExp2(0xFFFFFF,0.01)
renderer.setClearColor(0xFFEA00)
function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    sphere.rotation.x = time / 1000;
    sphere.rotation.y = time / 1000;
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));
    renderer.render(scene, camera);
}
