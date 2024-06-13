import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias:true});
const textureLoader = new THREE.TextureLoader();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0,10, 10);
orbit.update();

const spherePhyMat = new CANNON.Material();
const groundPhyMat = new CANNON.Material();
renderer.shadowMap.enabled=true;

// creating the world 

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0),
})

const timeStep= 1/60;


const ambiantLight = new THREE.AmbientLight(0x333333);
scene.add(ambiantLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF,3)
scene.add(directionalLight);
directionalLight.position.set(0,50,0);
directionalLight.castShadow=true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// const axisHelper = new THREE.AxesHelper(20);
// scene.add(axisHelper);

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const rayCaster = new THREE.Raycaster();

window.addEventListener('mousemove',(e)=>{
    mouse.x = (e.clientX/window.innerWidth)*2-1;
    mouse.y=-(e.clientY/window.innerHeight)*2+1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal,scene.position);
    rayCaster.setFromCamera(mouse,camera);
    rayCaster.ray.intersectPlane(plane,intersectionPoint);
})


const spheres = [];
const sphereBodies = [];

scene.background = new THREE.Color(0xFFFF00)

window.addEventListener("click",()=>{
 //   const sphereColor = new THREE.Color(Math.random(),Math.random(),Math.random());
    const sphereGeo= new THREE.SphereGeometry(0.25);
    const sphereMat= new THREE.MeshStandardMaterial({
        color:Math.random()* 0xFF00FF,
        metalness:0,
        roughness:0,
    })
    const sphere = new THREE.Mesh(sphereGeo,sphereMat)
    scene.add(sphere);
    sphere.position.copy(intersectionPoint);
    sphere.castShadow=true;
spheres.push(sphere);
    const sphereBody = new CANNON.Body(
        {
            shape:new CANNON.Sphere(0.25),
            mass:2,
            position: new CANNON.Vec3().copy(intersectionPoint),
            material:spherePhyMat,
        }
    )
    world.addBody(sphereBody)
    sphereBodies.push(sphereBody);
})

const groundGeo = new THREE.PlaneGeometry(10,10);
const groundMat = new THREE.MeshStandardMaterial({
    color:0xFFFFFF,
    side:THREE.DoubleSide,
}) 

const ground = new THREE.Mesh(groundGeo,groundMat);
scene.add(ground);

const groundbody = new CANNON.Body(
    {
        shape: new CANNON.Box(new CANNON.Vec3(5,5,0.1)),
        mass:0,
        material:groundPhyMat,
    }
)

groundbody.quaternion.setFromEuler(-Math.PI/2,0,0)
world.addBody(groundbody);
ground.receiveShadow=true;
const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhyMat,
    spherePhyMat,
    {
        restitution:0.9,
    }
)

world.addContactMaterial(groundSphereContactMat);
function animate() {
    ground.position.copy(groundbody.position);
    ground.quaternion.copy(groundbody.quaternion);
    for(let i=0;i<spheres.length;i++)
        {
            spheres[i].position.copy(sphereBodies[i].position);
            spheres[i].quaternion.copy(sphereBodies[i].quaternion);
        }

    world.step(timeStep)
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});