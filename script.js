import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene();

// Caméra
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const initialCameraPosition = new THREE.Vector3(0, 0, 100);
camera.position.copy(initialCameraPosition);

// Rendu
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lumières
const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
mainLight.position.copy(camera.position.clone().add(new THREE.Vector3(0, 0, -50)));
scene.add(mainLight);

const pointLight = new THREE.PointLight(0xffa500, 0.8, 150);
pointLight.position.set(30, 50, 30);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

// Pivot
const pivot = new THREE.Object3D();
scene.add(pivot);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isAnimating = true;
let interactionsEnabled = false;

const clock = new THREE.Clock();

// Contrôles
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Chargement du modèle
let model;
const interactiveComponents = [];

const groups = {
    resistances: [],
    connecteurs: [],
    transistors: [],
    petites_resistances: [],
    diodes: [],
    potentiometres: [],
    pcb: []
};

const objectGroupMapping = {
    resistances: [4, 5],
    connecteurs: [6, 7],
    transistors: [8, 9, 10, 17],
    petites_resistances: [11, 12, 13, 14],
    diodes: [15, 16],
    potentiometres: [20, 21, 22],
    pcb: [23]
};

function getComponentCenter(component) {
    const bbox = new THREE.Box3().setFromObject(component);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    return center;
}

function animateCamera(targetPosition, lookAtPosition, duration = 1.5) {
    const startPosition = camera.position.clone();
    const startLookAt = controls.target.clone();
    const startTime = clock.getElapsedTime();

    function animate() {
        const elapsed = clock.getElapsedTime() - startTime;
        const t = Math.min(elapsed / duration, 1);

        camera.position.lerpVectors(startPosition, targetPosition, t);
        controls.target.lerpVectors(startLookAt, lookAtPosition, t);
        mainLight.position.copy(camera.position.clone().add(new THREE.Vector3(0, 0, -50)));

        controls.update();

        if (t < 1) requestAnimationFrame(animate);
    }

    animate();
}

const loader = new GLTFLoader();
loader.load(
    './card/scene.gltf',
    (gltf) => {
        model = gltf.scene;

        const bbox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        model.position.sub(center);
        pivot.add(model);
        pivot.position.set(0, 0, 0);
        controls.target.copy(pivot.position);
        controls.update();

        model.traverse((child) => {
            if (child.isMesh) {
                interactiveComponents.push(child);

                const match = child.name.match(/Object_(\d+)/);
                if (match) {
                    const objNum = parseInt(match[1], 10);
                    for (const groupName in objectGroupMapping) {
                        if (objectGroupMapping[groupName].includes(objNum)) {
                            groups[groupName].push(child);
                            break;
                        }
                    }
                }
            }
        });
    },
    undefined,
    (error) => console.error('Erreur chargement du modèle :', error)
);

// ---- Ajout de la grille de points statique ----

// Paramètres pour la grille
const nb = 200;
const space = 6;
const amp = 0.1;
let geometry = computeGeometry();
const material = new THREE.PointsMaterial({ size: 0.3, vertexColors: true });
const mesh = new THREE.Points(geometry, material);
scene.add(mesh);

// Mise à l'échelle plus grande (x100)
mesh.scale.set(300, 300, 300);
// Le positionner plus bas
mesh.position.y = -200;

// Fonction pour calculer la géométrie initiale
function computeGeometry() {
    const pi2 = Math.PI * 2;
    const fre = 1; // fréquence
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(nb * nb * 3);
    const colors = new Float32Array(nb * nb * 3);

    let k = 0;
    for (let i = 0; i < nb; i++) {
        for (let j = 0; j < nb; j++) {
            const x = i * (space / nb) - space / 2;
            const z = j * (space / nb) - space / 2;
            const y = amp * (Math.cos(x * pi2 * fre) + Math.sin(z * pi2 * fre));

            positions[3 * k + 0] = x;
            positions[3 * k + 1] = y;
            positions[3 * k + 2] = z;

            // Intensité entre 0 (noir) en bas et 1 (blanc) en haut
            const intensity = (y + amp) / (2 * amp);
            colors[3 * k + 0] = intensity;
            colors[3 * k + 1] = intensity;
            colors[3 * k + 2] = intensity;

            k++;
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeBoundingBox();
    return geometry;
}

function animate() {
    requestAnimationFrame(animate);

    if (isAnimating && model) {
        const elapsed = clock.getElapsedTime();
        pivot.rotation.x = THREE.MathUtils.degToRad(15) * Math.sin((elapsed / 3) * Math.PI * 2);
        pivot.rotation.y += 0.007;
    }

    mainLight.position.copy(camera.position.clone().add(new THREE.Vector3(0, 0, -50)));
    renderer.render(scene, camera);
}

function findGroupForObject(obj, groups) {
    for (const groupName in groups) {
        if (groups[groupName].includes(obj)) return groupName;
    }
    return null;
}

function showGroupInfo(groupName) {
    const infoBox = document.getElementById('info-box');
    const allBlocks = infoBox.querySelectorAll('.info-block');

    allBlocks.forEach(block => {
        block.style.display = (block.getAttribute('data-group') === groupName) ? 'block' : 'none';
    });
}

function onMouseClick(event) {
    if (!interactionsEnabled) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(interactiveComponents);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const groupName = findGroupForObject(clickedObject, groups);

        if (groupName) {
            const groupObjects = groups[groupName];
            let groupCenter = new THREE.Vector3();

            groupObjects.forEach(obj => groupCenter.add(getComponentCenter(obj)));
            groupCenter.divideScalar(groupObjects.length);

            animateCamera(groupCenter.clone().add(new THREE.Vector3(0, 0, 30)), groupCenter, 1);

            const originalColors = groupObjects.map(obj => obj.material.color.clone());
            groupObjects.forEach(obj => obj.material.color.set(0xff0000));

            setTimeout(() => {
                groupObjects.forEach((obj, i) => obj.material.color.copy(originalColors[i]));
            }, 1500);

            showGroupInfo(groupName);
        } else {
            animateCamera(initialCameraPosition, pivot.position, 1);
            showGroupInfo('');
        }
    } else {
        animateCamera(initialCameraPosition, pivot.position, 1);
        showGroupInfo('');
    }
}

document.querySelector('.styled-button').addEventListener('click', () => {
    document.querySelectorAll('p.gradient').forEach(text => text.style.display = 'none');
    document.querySelector('.styled-button').style.display = 'none';

    isAnimating = false;

    const targetPivotRotation = {
        x: THREE.MathUtils.degToRad(45),
        y: THREE.MathUtils.degToRad(30)
    };

    const startPivotRotation = {
        x: pivot.rotation.x,
        y: pivot.rotation.y,
    };

    const animationDuration = 1;
    const startTime = clock.getElapsedTime();

    function animateTransition() {
        const elapsed = clock.getElapsedTime() - startTime;
        const t = Math.min(elapsed / animationDuration, 1);

        pivot.rotation.x = THREE.MathUtils.lerp(startPivotRotation.x, targetPivotRotation.x, t);
        pivot.rotation.y = THREE.MathUtils.lerp(startPivotRotation.y, targetPivotRotation.y, t);

        if (t < 1) {
            requestAnimationFrame(animateTransition);
        } else {
            interactionsEnabled = true;
        }
    }

    animateTransition();
});

window.addEventListener('click', onMouseClick);

animate();
