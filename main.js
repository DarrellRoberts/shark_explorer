import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InteractionManager } from "three.interactive";
import data from "./data.json";

//  Three takes in three objects: Scene, camera and renderer

//  1. Scene container
const scene = new THREE.Scene();

//  2. Perspective camera (mimics what we see): field of view, aspect ratio, view frustum
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//  3. Renderer, needs to know what DOM element to use
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

// Enable interaction of three elements
const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

const depthValue = document.getElementById("depthTitle");
let depth = 0;
// depthValue.textContent = 'Depth: ' + depth + 'm'
depthValue.textContent = "Depth: " + depth + "m";

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.y = 100;

//  render method draws objects
renderer.render(scene, camera);

//  three.js library: https://threejs.org/docs/#api/en/geometries

//  ambient light lights up whole object
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

//  listens for DOM events from the mouse
const controls = new OrbitControls(camera, renderer.domElement);
//  controls.target = renderer.domElement;
//  controls.update();

//  adds randomise shapes to background
function addPlankton() {
  const geometry = new THREE.SphereGeometry(0.15);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const plankton = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  plankton.position.set(x, y, z);
  scene.add(plankton);
}
Array(100).fill().forEach(addPlankton);

// adding custom textures
const oceanTexture = new THREE.TextureLoader().load("./ocean.jpg");
scene.background = oceanTexture;

let sharkInfo = 0;

//  sharkGadget
const sharkGadget = document.getElementById("sharkGadgetCon");
const sharkGadgetTitle = document.createElement("h2");
sharkGadgetTitle.textContent = "Shark details here...";
sharkGadget.appendChild(sharkGadgetTitle);

//  map Sharks
// eslint-disable-next-line array-callback-return
const renderShark = () => {
  data?.map((shark) => {
    const number = Math.floor(Math.random() * 2);
    const Texture = new THREE.TextureLoader().load(shark.imageURL);
    const sharkBox = new THREE.Mesh(
      new THREE.BoxGeometry(
        3 * shark.length,
        3 * shark.length,
        3 * shark.length
      ),
      new THREE.MeshBasicMaterial({ map: Texture })
    );
    sharkBox.position.x = number ? Math.random() * -100 : Math.random() * 100;
    sharkBox.position.y = shark.yposition;
    sharkBox.position.z = number ? Math.random() * -100 : Math.random() * 100;
    function animate() {
      sharkBox.rotation.y += 0.01;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    interactionManager.add(sharkBox);

    sharkBox.addEventListener("click", () => {
      if (!sharkInfo) {
        sharkGadget.removeChild(sharkGadgetTitle);
        sharkInfo = sharkGadget;
        const sharkInfoTitle = document.createElement("h2");
        const sharkInfoSciTitle = document.createElement("h3");

        // need to assign <li> with class in order to change later
        const sharkInfoLength = document.createElement("li");
        sharkInfoLength.id = "sharkLength";

        const sharkInfoSpecies = document.createElement("li");
        sharkInfoSpecies.id = "sharkSpecies";

        const sharkInfoHabitat = document.createElement("li");
        sharkInfoHabitat.id = "sharkHabitat";

        const sharkInfoDiet = document.createElement("li");
        sharkInfoDiet.id = "sharkDiet";

        const sharkInfoDanger = document.createElement("li");
        sharkInfoDanger.id = "sharkDanger";

        sharkInfoTitle.textContent = shark.commonName;
        sharkInfoSciTitle.textContent = `Scientific Name: ${shark.scientificName}`;
        sharkInfoLength.textContent = `Maximum length (roughly): ${shark.length} metres`;
        sharkInfoSpecies.textContent = `Species: ${shark.species}`;
        sharkInfoHabitat.textContent = `Habitat: ${shark.habitat}`;
        sharkInfoDiet.textContent = `Typical diet: ${shark.diet}`;
        sharkInfoDanger.textContent = `Danger to humans: ${shark.dangerToHumans}`;

        document.body.appendChild(sharkInfo);
        sharkInfo.appendChild(sharkInfoTitle);
        sharkInfo.appendChild(sharkInfoSciTitle);
        sharkInfo.appendChild(sharkInfoLength);
        sharkInfo.appendChild(sharkInfoSpecies);
        sharkInfo.appendChild(sharkInfoHabitat);
        sharkInfo.appendChild(sharkInfoDiet);
        sharkInfo.appendChild(sharkInfoDanger);
      } else {
        const sharkInfoTitle = sharkInfo.querySelector("h2");
        const sharkInfoSciTitle = sharkInfo.querySelector("h3");
        const sharkInfoLength = document.getElementById("sharkLength");
        const sharkInfoSpecies = document.getElementById("sharkSpecies");
        const sharkInfoHabitat = document.getElementById("sharkHabitat");
        const sharkInfoDiet = document.getElementById("sharkDiet");
        const sharkInfoDanger = document.getElementById("sharkDanger");

        sharkInfoTitle.textContent = shark.commonName;
        sharkInfoSciTitle.textContent = `Scientific Name: ${shark.scientificName}`;
        sharkInfoLength.textContent = `Maximum length (roughly): ${shark.length} metres`;
        sharkInfoSpecies.textContent = `Species: ${shark.species}`;
        sharkInfoHabitat.textContent = `Habitat: ${shark.habitat}`;
        sharkInfoDiet.textContent = `Typical diet: ${shark.diet}`;
        sharkInfoDanger.textContent = `Danger to humans: ${shark.dangerToHumans}`;
      }
    });
    interactionManager.update();
    animate();
    scene.add(sharkBox);
  });
};

const rotateButton = document.getElementById("rotateButton");
rotateButton.addEventListener("click", () => {
  if (controls.target === 0) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
  }
});

const navigateButton = document.getElementById("navigateButton");
navigateButton.addEventListener("click", () => {
  controls.target = 0;
});

//  Welcome Message
// const controlCon = document.getElementById('controlsCon')
const welcomeMessage = document.getElementById("mouseControls");
const welcomeCross = document.createElement("button");
welcomeCross.textContent = "Okay";
welcomeCross.style.backgroundColor = "red";
welcomeCross.addEventListener("click", () => {
  const sharkTitle = document.getElementById("sharkTitle");
  const controls = document.getElementById("controls");
  const ascControls = document.getElementById("ascDescControls");
  sharkTitle.style.display = "none";
  controls.style.display = "none";
  ascControls.style.display = "none";
  welcomeMessage.style.display = "none";
  renderShark();
});
welcomeMessage.appendChild(welcomeCross);

//  Arrows keys on click
const arrowUp = document.getElementById("arrowButtonUp");
let holdUpTimer;
function handleUp() {
  if (camera.position.z < -100) {
    camera.position.z = -100;
  } else {
    camera.position.z -= 4;
  }
}
arrowUp.addEventListener("touchstart", () => {
  holdUpTimer = setInterval(handleUp, 25);
});
arrowUp.addEventListener("touchend", () => {
  clearTimeout(holdUpTimer);
});

const arrowDown = document.getElementById("arrowButtonDown");
let holdDownTimer;
function handleDown() {
  if (camera.position.z > 100) {
    camera.position.z = 100;
  } else {
    camera.position.z += 4;
  }
}
arrowDown.addEventListener("touchstart", () => {
  holdDownTimer = setInterval(handleDown, 25);
});
arrowDown.addEventListener("touchend", () => {
  clearTimeout(holdDownTimer);
});

const arrowLeft = document.getElementById("arrowButtonLeft");
let holdLeftTimer;
function handleLeft() {
  if (camera.position.x < -100) {
    camera.position.x = -100;
  } else {
    camera.position.x -= 3;
  }
}
arrowLeft.addEventListener("touchstart", () => {
  holdLeftTimer = setInterval(handleLeft, 25);
});
arrowLeft.addEventListener("touchend", () => {
  clearTimeout(holdLeftTimer);
});

const arrowRight = document.getElementById("arrowButtonRight");
let holdRightTimer;
function handleRight() {
  if (camera.position.x > 100) {
    camera.position.x = 100;
  } else {
    camera.position.x += 3;
  }
}
arrowRight.addEventListener("touchstart", () => {
  holdRightTimer = setInterval(handleRight, 25);
});
arrowRight.addEventListener("touchend", () => {
  clearTimeout(holdRightTimer);
});

//  W Key on click-----
const wKey = document.getElementById("wKey");
let holdWTimer;
function handleAscend() {
  if (camera.position.y > 99) {
    camera.position.y = 100;
    depth = 0;
    depthValue.textContent = "Depth: 0m";
  } else {
    camera.position.y += 1;
    depth = 100 - Math.round(camera.position.y);
    depthValue.textContent = "Depth: " + depth + "m";
  }
}

wKey.addEventListener("touchstart", () => {
  holdWTimer = setInterval(handleAscend, 25);
});

wKey.addEventListener("touchend", () => {
  clearTimeout(holdWTimer);
});

//  S Key on click-----
const sKey = document.getElementById("sKey");
let holdSTimer;
function handleDescend() {
  if (camera.position.y < -99) {
    camera.position.y = -100;
    depth = 200;
    depthValue.textContent = "Depth: 200m";
  } else {
    camera.position.y -= 1;
    depth = 100 - Math.round(camera.position.y);
    depthValue.textContent = "Depth: " + depth + "m";
  }
}

sKey.addEventListener("touchstart", () => {
  holdSTimer = setInterval(handleDescend, 25);
});

sKey.addEventListener("touchend", () => {
  clearTimeout(holdSTimer);
});

// W and S keys on press
document.addEventListener("keypress", (event) => {
  switch (event.key) {
    case "s":
      // Move camera down
      if (camera.position.y < -99) {
        camera.position.y = -100;
        depth = 200;
        depthValue.textContent = "Depth: 200m";
      } else {
        camera.position.y -= 1;
        depth = 100 - Math.round(camera.position.y);
        depthValue.textContent = "Depth: " + depth + "m";
      }
      break;
    case "w":
      // Move camera up
      if (camera.position.y > 99) {
        camera.position.y = 100;
        depth = 0;
        depthValue.textContent = "Depth: 0m";
      } else {
        camera.position.y += 1;
        depth = 100 - Math.round(camera.position.y);
        depthValue.textContent = "Depth: " + depth + "m";
      }
      break;
  }
});

//  Arrow keys---
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      // Move camera up
      if (camera.position.z < -100) {
        camera.position.z = -100;
      } else {
        arrowUp.style.filter = "invert(1)";
        camera.position.z -= 5;
        setTimeout(() => {
          arrowUp.style.filter = "none";
        }, 50);
      }
      // arrowUp.style.filter = 'none';
      break;
    case "ArrowDown":
      // Move camera down
      if (camera.position.z > 100) {
        camera.position.z = 100;
      } else {
        arrowDown.style.filter = "invert(1)";
        camera.position.z += 5;
        setTimeout(() => {
          arrowDown.style.filter = "none";
        }, 50);
      }
      break;
    case "ArrowLeft":
      // Move camera left
      if (camera.position.x < -100) {
        camera.position.x = -100;
      } else {
        arrowLeft.style.filter = "invert(1)";
        camera.position.x -= 3;
        setTimeout(() => {
          arrowLeft.style.filter = "none";
        }, 50);
      }
      break;
    case "ArrowRight":
      // Move camera right
      // eslint-disable-next-line no-case-declarations
      const arrowRight = document.getElementById("arrowButtonRight");
      if (camera.position.x > 100) {
        camera.position.x = 100;
      } else {
        arrowRight.style.filter = "invert(1)";
        camera.position.x += 3;
        setTimeout(() => {
          arrowRight.style.filter = "none";
        }, 50);
      }
      break;
  }
});

// recursive function that renders the app automatically
// reduces the need to have to call the function every time
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
