import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import data from "./data.json"

//Three takes in three objects: Scene, camera and renderer

//1. Scene container
const scene = new THREE.Scene();

//2. Perspective camera (mimics what we see): field of view, aspect ratio, view frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)


//3. Renderer, needs to know what DOM element to use
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg"),})

const depthValue = document.getElementById("depthTitle")
const depth = 0
depthValue.textContent = "Depth: " + depth + "m"

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.y = 100

//render method draws objects
renderer.render( scene, camera );

//three.js library: https://threejs.org/docs/#api/en/geometries

//Light object
// "0x" in .js means you are dealing with a hexidecimal value
const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(5, 5, 5);

//ambient light lights up whole object
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(pointLight, ambientLight);

//helpers show where e.g. where the point light is, where object sits
// const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)

//listens for DOM events from the mouse
const controls = new OrbitControls(camera, renderer.domElement);
// controls.target = renderer.domElement;
// controls.update();

//adds randomise shapes to background
function addPlankton() {
  const geometry = new THREE.SphereGeometry( 0.15);
  const material = new THREE.MeshStandardMaterial({color: 0xFFFFFF})
  const plankton = new THREE.Mesh( geometry, material)
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100))
  plankton.position.set(x, y, z);
  scene.add(plankton)
}
Array(100).fill().forEach(addPlankton)

// adding custom textures
const oceanTexture = new THREE.TextureLoader().load("./ocean.jpg");
scene.background = oceanTexture;

//map Sharks
data?.map((shark) => {
  const number = Math.floor(Math.random() * 2)
  const Texture = new THREE.TextureLoader().load(shark.imageURL);
  const sharkBox = new THREE.Mesh(
    new THREE.BoxGeometry(3 * shark.length, 3 * shark.length, 3 * shark.length),
    new THREE.MeshBasicMaterial({map: Texture})
  )
  sharkBox.position.x = number ? Math.random() * -100 : Math.random() * 100
  sharkBox.position.y = shark.yposition
  sharkBox.position.z = number ? Math.random() * -100 : Math.random() * 100
  function animate() {
    sharkBox.rotation.y += 0.01
    requestAnimationFrame( animate );
    renderer.render( scene, camera)
  }
  animate()
  scene.add(sharkBox)
})

const rotateButton = document.getElementById("rotateButton")
rotateButton.addEventListener("click", () => {
  if (controls.target === 0) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update()
  }
    // renderer.render(scene, camera);
  }
)

const navigateButton = document.getElementById("navigateButton")
navigateButton.addEventListener("click", () => {
  controls.target = 0
  // renderer.render(scene, camera);
  }
)

document.addEventListener("keydown", (event) => {
  switch (event.key) {
  case 'ArrowUp':
    // Move camera up
    if (camera.position.z === -100){
    camera.position.z = -100;
    } else {
    camera.position.z -= 5;
    }
    break;
  case 'ArrowDown':
    // Move camera down
    if (camera.position.z === 100){
      camera.position.z = 100;
      } else {
        camera.position.z += 5;
        }
    break;
  case 'ArrowLeft':
    // Move camera left
    if (camera.position.x === -100){
      camera.position.x = -100;
      } else {
        camera.position.x -= 3;
        }
    break;
  case 'ArrowRight':
    // Move camera right
    if (camera.position.x === 100){
      camera.position.x = 100;
      } else {
        camera.position.x += 3;
        }
    break;
}
camera.updateMatrixWorld();
controls.update()
renderer.render(scene, camera);
})

document.addEventListener("keypress", (event) => {
  switch (event.key) {
  case 's':
    // Move camera up
    if (camera.position.y === -100){
      camera.position.y = -100;
      } else {
        camera.position.y -= 1;
        depth += 1;
        }
    break;
  case 'w':
    // Move camera down
    if (camera.position.y === 100){
      camera.position.y = 100;
      } else {
        camera.position.y += 1;
        depth -= 1;
        }
    break;
}
camera.updateMatrixWorld();
controls.update()
renderer.render(scene, camera);
})


// recursive function that renders the app automatically
// reduces the need to have to call the function every time
function animate() {
  tigerShark.rotation.y += 0.01
  greatShark.rotation.y += 0.01
  requestAnimationFrame( animate );
  renderer.render( scene, camera)
}

animate()