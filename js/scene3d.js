/* ===================================================
   THREE.JS 3D SCENE SETUP & DETAILED MODELING
=================================================== */
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Dynamic Screen Canvas Setup (Dynamic boot animation texture)
const screenCanvas = document.createElement('canvas');
screenCanvas.width = 512;
screenCanvas.height = 384;
const screenCtx = screenCanvas.getContext('2d');
const screenTexture = new THREE.CanvasTexture(screenCanvas);

function updateLoadingScreen(progress) {
  screenCtx.fillStyle = '#eae4d5';
  screenCtx.fillRect(0, 0, 512, 384);

  screenCtx.fillStyle = '#000000';
  screenCtx.fillRect(110, 126, 300, 140);
  screenCtx.fillStyle = '#ffffff';
  screenCtx.fillRect(106, 122, 300, 140);
  screenCtx.strokeStyle = '#000000';
  screenCtx.lineWidth = 3;
  screenCtx.strokeRect(106, 122, 300, 140);

  screenCtx.fillStyle = '#000000';
  screenCtx.font = 'bold 22px monospace';
  screenCtx.textAlign = 'center';
  screenCtx.fillText('Starting System...', 256, 168);

  screenCtx.lineWidth = 2;
  screenCtx.strokeRect(146, 198, 220, 18);

  const maxBarWidth = 214;
  const currentWidth = maxBarWidth * Math.min(Math.max(progress, 0), 1);
  screenCtx.fillStyle = '#000000';
  screenCtx.fillRect(149, 201, currentWidth, 12);

  screenTexture.needsUpdate = true;
}

updateLoadingScreen(0);

// Warm Studio Lighting (Tungsten lamp ambiance)
const ambientLight = new THREE.AmbientLight(0xffe2be, 0.65);
scene.add(ambientLight);

const mainKeyLight = new THREE.DirectionalLight(0xffd699, 0.75);
mainKeyLight.position.set(6, 8, 6);
scene.add(mainKeyLight);

const rearLight = new THREE.DirectionalLight(0xffe0b2, 0.4);
rearLight.position.set(-5, 6, -7);
scene.add(rearLight);

const deskLampAccent = new THREE.SpotLight(0xffc266, 1.4);
deskLampAccent.position.set(-4, 5, 3);
deskLampAccent.angle = Math.PI / 4;
deskLampAccent.penumbra = 0.5;
scene.add(deskLampAccent);

// Materials
const macBeigeMat = new THREE.MeshStandardMaterial({ color: 0xd6cfc2, roughness: 0.42, metalness: 0.08 });
const macBeigeDarkMat = new THREE.MeshStandardMaterial({ color: 0xb8af9f, roughness: 0.5 });
const darkRecessMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.7 });
const keyCapMat = new THREE.MeshStandardMaterial({ color: 0xe2dad0, roughness: 0.35 });
const darkKeyCapMat = new THREE.MeshStandardMaterial({ color: 0x9e9587, roughness: 0.5 });
const ledMat = new THREE.MeshBasicMaterial({ color: 0x330000 });

const screenGlassMat = new THREE.MeshStandardMaterial({ 
  map: screenTexture,            
  emissiveMap: screenTexture,     
  emissive: 0xffffff,
  emissiveIntensity: 0.6,
  roughness: 0.3
});

/* ---------------------------------------------------
   PROCEDURAL VINTAGE TEXTURES (WOOD & PAPERS)
--------------------------------------------------- */
function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#3a2012';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#2c170b' : '#4a2c1a';
    const y = Math.random() * 512;
    const h = Math.random() * 3 + 0.5;
    ctx.fillRect(0, y, 512, h);
  }
  return new THREE.CanvasTexture(canvas);
}

const woodTex = createWoodTexture();
woodTex.wrapS = THREE.RepeatWrapping;
woodTex.wrapT = THREE.RepeatWrapping;
woodTex.repeat.set(2, 2);

const deskMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.45, metalness: 0.05 });

function createPaperTexture(headerText, lineCount = 8) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 340;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f2ebd9';
  ctx.fillRect(0, 0, 256, 340);

  if (headerText) {
    ctx.fillStyle = '#2b231d';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(headerText, 24, 38);
    ctx.fillRect(24, 46, 208, 2);
  }

  ctx.fillStyle = '#6b6154';
  for (let i = 0; i < lineCount; i++) {
    const w = 120 + Math.random() * 80;
    ctx.fillRect(24, 68 + i * 22, w, 4);
  }

  return new THREE.CanvasTexture(canvas);
}

// ---------------------------------------------------
// VINTAGE STUDIO DESK & DECORATIONS
// ---------------------------------------------------
const deskGroup = new THREE.Group();

const deskMesh = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 4.5), deskMat);
deskMesh.position.set(0, -1.82, 1);
deskGroup.add(deskMesh);

const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1b241e, roughness: 0.75 });
const leatherPad = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.02, 2.2), leatherMat);
leatherPad.position.set(0.2, -1.71, 2.0);
deskGroup.add(leatherPad);

scene.add(deskGroup);

// ---------------------------------------------------
// PAPERS & DOCUMENTS STACK
// ---------------------------------------------------
const docsGroup = new THREE.Group();

const folderMat = new THREE.MeshStandardMaterial({ color: 0xcba163, roughness: 0.6 });
const folderMesh = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.015, 1.65), folderMat);
folderMesh.position.set(-2.0, -1.71, 1.8);
folderMesh.rotation.y = 0.22;
docsGroup.add(folderMesh);

const docMat1 = new THREE.MeshStandardMaterial({ map: createPaperTexture('SYSTEM DRAFT v1', 9), roughness: 0.6 });
const docMat2 = new THREE.MeshStandardMaterial({ map: createPaperTexture('MEMORANDUM', 7), roughness: 0.6 });
const docMat3 = new THREE.MeshStandardMaterial({ map: createPaperTexture('NOTES', 11), roughness: 0.6 });

const paper1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.008, 1.4), docMat1);
paper1.position.set(-1.98, -1.698, 1.82);
paper1.rotation.y = 0.15;
docsGroup.add(paper1);

const paper2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.008, 1.4), docMat2);
paper2.position.set(-1.92, -1.688, 1.85);
paper2.rotation.y = 0.35;
docsGroup.add(paper2);

const paper3 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.008, 1.4), docMat3);
paper3.position.set(-2.05, -1.678, 1.75);
paper3.rotation.y = -0.08;
docsGroup.add(paper3);

const paper4 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.008, 1.3), docMat2);
paper4.position.set(2.0, -1.71, 1.4);
paper4.rotation.y = -0.38;
docsGroup.add(paper4);

scene.add(docsGroup);

// Procedural Apple Logo Texture
function createAppleLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const colors = ['#61BB46', '#FDB827', '#F58220', '#E03A3E', '#963D97', '#009DDC'];
  const h = 64 / colors.length;
  colors.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, i * h, 64, h);
  });
  return new THREE.CanvasTexture(canvas);
}

const appleLogoMat = new THREE.MeshBasicMaterial({ map: createAppleLogoTexture() });

// ---------------------------------------------------
// MACINTOSH COMPUTER ASSEMBLY
// ---------------------------------------------------
const macGroup = new THREE.Group();

const bodyGeo = new THREE.BoxGeometry(2.44, 3.45, 2.70);
const macBody = new THREE.Mesh(bodyGeo, macBeigeMat);
macGroup.add(macBody);

const frontBezel = new THREE.Mesh(new THREE.BoxGeometry(2.44, 3.45, 0.08), macBeigeMat);
frontBezel.position.set(0, 0, 1.36);
frontBezel.rotation.x = -0.02;
macGroup.add(frontBezel);

const seamMesh = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.015, 0.02), darkRecessMat);
seamMesh.position.set(0, -0.82, 1.40);
macGroup.add(seamMesh);

const screenBezelOuter = new THREE.Mesh(new THREE.BoxGeometry(1.92, 1.48, 0.06), macBeigeDarkMat);
screenBezelOuter.position.set(0, 0.42, 1.38);
macGroup.add(screenBezelOuter);

const screenBezelInner = new THREE.Mesh(new THREE.BoxGeometry(1.82, 1.38, 0.05), darkRecessMat);
screenBezelInner.position.set(0, 0.42, 1.40);
macGroup.add(screenBezelInner);

const crtScreenGeo = new THREE.PlaneGeometry(1.76, 1.32, 16, 16);
const posAttr = crtScreenGeo.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
  const x = posAttr.getX(i);
  const y = posAttr.getY(i);
  const bulge = (1 - (x / 0.88) * (x / 0.88)) * (1 - (y / 0.66) * (y / 0.66)) * 0.06;
  posAttr.setZ(i, bulge);
}
crtScreenGeo.computeVertexNormals();
const crtScreenMesh = new THREE.Mesh(crtScreenGeo, screenGlassMat);
crtScreenMesh.position.set(0, 0.42, 1.40);
macGroup.add(crtScreenMesh);

const floppySlot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.035, 0.06), darkRecessMat);
floppySlot.position.set(0, -0.42, 1.41);
macGroup.add(floppySlot);

const floppyLed = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.02), ledMat);
floppyLed.position.set(0.48, -0.42, 1.41);
macGroup.add(floppyLed);

const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.11), appleLogoMat);
logoMesh.position.set(-0.92, -1.25, 1.41);
macGroup.add(logoMesh);

const kbPortRecess = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.04), darkRecessMat);
kbPortRecess.position.set(0.82, -1.25, 1.40);
macGroup.add(kbPortRecess);

const handleRecess = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.15), macBeigeDarkMat);
handleRecess.position.set(0, 1.5, -1.30);
macGroup.add(handleRecess);

const rearPortInset = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.02), macBeigeDarkMat);
rearPortInset.position.set(0, -1.0, -1.351);
macGroup.add(rearPortInset);

for (let side of [-1.225, 1.225]) {
  for (let i = 0; i < 8; i++) {
    const ventSlot = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.7), darkRecessMat);
    ventSlot.position.set(side, -1.1 + (i * 0.065), -0.2);
    macGroup.add(ventSlot);
  }
}

scene.add(macGroup);

// ---------------------------------------------------
// DETAILED 3D MACINTOSH KEYBOARD (M0110)
// ---------------------------------------------------
const keyboardGroup = new THREE.Group();

const kbBaseGeo = new THREE.BoxGeometry(2.3, 0.22, 0.9);
const kbBaseMesh = new THREE.Mesh(kbBaseGeo, macBeigeMat);
kbBaseMesh.rotation.x = 0.08;
keyboardGroup.add(kbBaseMesh);

const kbBedMesh = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.72), darkRecessMat);
kbBedMesh.position.set(0, 0.08, 0);
kbBedMesh.rotation.x = 0.08;
keyboardGroup.add(kbBedMesh);

const keyRows = 5;
const keyCols = 13;
const keyWidth = 0.12;
const keyDepth = 0.11;
const startX = -0.92;
const startZ = -0.26;

for (let r = 0; r < keyRows; r++) {
  for (let c = 0; c < keyCols; c++) {
    if (r === 4 && c > 2 && c < 10) continue;

    const isSpecialKey = (c === 0 || c === keyCols - 1 || r === 0);
    const kMat = isSpecialKey ? darkKeyCapMat : keyCapMat;
    const keyMesh = new THREE.Mesh(new THREE.BoxGeometry(keyWidth, 0.08, keyDepth), kMat);

    keyMesh.position.set(
      startX + c * 0.155,
      0.13 + (r * 0.008),
      startZ + r * 0.135
    );
    keyMesh.rotation.x = 0.08;
    keyboardGroup.add(keyMesh);
  }
}

const spacebarMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, keyDepth), keyCapMat);
spacebarMesh.position.set(0, 0.17, startZ + 4 * 0.135);
spacebarMesh.rotation.x = 0.08;
keyboardGroup.add(spacebarMesh);

keyboardGroup.position.set(-0.2, -1.60, 2.38);
keyboardGroup.rotation.y = -0.05;
scene.add(keyboardGroup);

// ---------------------------------------------------
// DETAILED 3D MACINTOSH MOUSE (M0100)
// ---------------------------------------------------
const mouseGroup = new THREE.Group();

const mouseBodyGeo = new THREE.BoxGeometry(0.42, 0.18, 0.62);
const mouseBody = new THREE.Mesh(mouseBodyGeo, macBeigeMat);
mouseGroup.add(mouseBody);

const mouseBtnGeo = new THREE.BoxGeometry(0.36, 0.05, 0.22);
const mouseBtn = new THREE.Mesh(mouseBtnGeo, macBeigeDarkMat);
mouseBtn.position.set(0, 0.08, 0.14);
mouseGroup.add(mouseBtn);

mouseGroup.position.set(1.55, -1.63, 2.25);
mouseGroup.rotation.y = -0.18;
scene.add(mouseGroup);

// ---------------------------------------------------
// CAMERA & BOOT ANIMATION TIMELINE
// ---------------------------------------------------
const macOsOverlay = document.getElementById('mac-os');
const camState = { angle: 0, radius: 30, y: 2 };
const bootState = { progress: 0 };

function updateCamera() {
  camera.position.x = Math.sin(camState.angle) * camState.radius;
  camera.position.z = Math.cos(camState.angle) * camState.radius;
  camera.position.y = camState.y;
  camera.lookAt(0, 0.42, 0);
  renderer.render(scene, camera);
}

updateCamera();

const tl = gsap.timeline({
  onUpdate: updateCamera,
  onComplete: () => {
    macOsOverlay.classList.add('active');
  }
});

tl.to(camState, { radius: 4, y: 0.42, duration: 2, ease: 'power2.inOut' }, "-=0.2");
tl.to(bootState, {
  progress: 1, duration: 2, ease: 'power1.inOut',
  onUpdate: () => updateLoadingScreen(bootState.progress)
}, "<");