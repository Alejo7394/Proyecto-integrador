/**
 * ==============================================================================
 * GEOGOLD 3D - LÓGICA DE PROGRAMACIÓN JAVASCRIPT (script.js)
 * ==============================================================================
 * Este archivo controla toda la interactividad del proyecto:
 * 1. Inicialización y renderizado 3D con la librería Three.js y OrbitControls.
 * 2. Cálculo matemático de áreas, volúmenes y generatriz en tiempo real.
 * 3. Sincronización bidireccional entre barras deslizantes (sliders) e inputs numéricos.
 * 4. Escalado dinámico de las figuras 3D en pantalla según las dimensiones elegidas.
 * 5. Navegación por pestañas para alternar entre Cubo, Esfera y Cono.
 * ==============================================================================
 */

// ==============================================================================
// SECCIÓN 1: ESTADO GLOBAL DE LA APLICACIÓN
// ==============================================================================
let currentFigure = 'cube'; // Figura activa por defecto: 'cube' | 'sphere' | 'cone'
let autoRotate = true;      // Controla si la figura gira sola en el visor 3D
let isWireframe = false;    // Controla si se visualiza como sólido o en modo alambre

// Objeto que almacena los valores numéricos actuales (en centímetros)
const state = {
    cube: { a: 5 },         // Lado o arista inicial del cubo: 5 cm
    sphere: { r: 5 },       // Radio inicial de la esfera: 5 cm
    cone: { r: 4, h: 7 }    // Radio base: 4 cm y Altura: 7 cm para el cono
};


// ==============================================================================
// SECCIÓN 2: CONFIGURACIÓN DEL MOTOR TRIDIMENSIONAL (THREE.JS)
// ==============================================================================
const container = document.getElementById('canvas-container');

// Creación de la Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x090A0C); // Color de fondo '#090A0C' (geo-void)

// Creación de la Cámara de Perspectiva
const camera = new THREE.PerspectiveCamera(
    45,                                             // FOV: 45 grados (visión natural)
    container.clientWidth / container.clientHeight, // Proporción de la pantalla
    0.1,                                            // Distancia mínima visible
    1000                                            // Distancia máxima visible
);
camera.position.set(12, 10, 16);

// Creación del Renderizador WebGL
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,              // Suaviza los bordes dentados (antialiasing)
    powerPreference: 'high-performance' 
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimizado para pantallas Retina
renderer.shadowMap.enabled = true; // Activa el cálculo de sombras realistas
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Controles de Órbita con el Ratón (OrbitControls)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;      // Agrega inercia/fricción para movimiento suave
controls.dampingFactor = 0.05;     // Factor de frenado suave
controls.maxDistance = 60;         // Límite máximo de zoom out
controls.minDistance = 4;          // Límite mínimo de zoom in
controls.autoRotate = autoRotate;  // Activa el giro automático inicial
controls.autoRotateSpeed = 1.6;    // Velocidad de rotación automática

// Iluminación del Escenario
const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
scene.add(ambientLight);

const goldKeyLight = new THREE.DirectionalLight(0xF6E05E, 1.2);
goldKeyLight.position.set(15, 20, 12);
goldKeyLight.castShadow = true;
scene.add(goldKeyLight);

const fillLight = new THREE.PointLight(0xD4AF37, 0.8, 100);
fillLight.position.set(-15, -10, -12);
scene.add(fillLight);

const topSpot = new THREE.PointLight(0xffffff, 0.6, 50);
topSpot.position.set(0, 15, 0);
scene.add(topSpot);

// Cuadrícula en el Suelo (GridHelper)
const gridHelper = new THREE.GridHelper(30, 30, 0xD4AF37, 0x1A1B20);
gridHelper.position.y = -4;
gridHelper.material.opacity = 0.35;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Materiales de las Figuras
const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,        // Color base dorado
    metalness: 0.85,        // Alta reflectividad metálica
    roughness: 0.25,        // Superficie pulida y brillante
    wireframe: isWireframe  // Modo sólido o alambre
});

const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xF6E05E,
    linewidth: 1.5,
    transparent: true,
    opacity: 0.75
});

const meshGroup = new THREE.Group();
scene.add(meshGroup);

let currentMesh = null;
let currentEdges = null;


// ==============================================================================
// SECCIÓN 3: GENERACIÓN Y ESCALADO DE MODELOS 3D EN TIEMPO REAL
// ==============================================================================
const SCALE_FACTOR = 0.7;

function update3DModel() {
    // 1. Limpiamos cualquier figura anterior de la escena
    while (meshGroup.children.length > 0) {
        const obj = meshGroup.children[0];
        if (obj.geometry) obj.geometry.dispose();
        meshGroup.remove(obj);
    }

    let geometry;

    // 2. Construcción paramétrica según la figura activa
    if (currentFigure === 'cube') {
        const size = state.cube.a * SCALE_FACTOR;
        geometry = new THREE.BoxGeometry(size, size, size);
        currentMesh = new THREE.Mesh(geometry, goldMaterial);
        currentMesh.position.y = (size / 2) - 4;

        const edgesGeo = new THREE.EdgesGeometry(geometry);
        currentEdges = new THREE.LineSegments(edgesGeo, edgeMaterial);
        currentMesh.add(currentEdges);

    } else if (currentFigure === 'sphere') {
        const radius = state.sphere.r * SCALE_FACTOR;
        geometry = new THREE.SphereGeometry(radius, 40, 40);
        currentMesh = new THREE.Mesh(geometry, goldMaterial);
        currentMesh.position.y = radius - 4;

        const edgesGeo = new THREE.WireframeGeometry(geometry);
        currentEdges = new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({
            color: 0xF6E05E,
            transparent: true,
            opacity: 0.15
        }));
        currentMesh.add(currentEdges);

    } else if (currentFigure === 'cone') {
        const radius = state.cone.r * SCALE_FACTOR;
        const height = state.cone.h * SCALE_FACTOR;
        geometry = new THREE.ConeGeometry(radius, height, 40);
        currentMesh = new THREE.Mesh(geometry, goldMaterial);
        currentMesh.position.y = (height / 2) - 4;

        const edgesGeo = new THREE.EdgesGeometry(geometry, 25);
        currentEdges = new THREE.LineSegments(edgesGeo, edgeMaterial);
        currentMesh.add(currentEdges);
    }

    currentMesh.castShadow = true;
    currentMesh.receiveShadow = true;
    meshGroup.add(currentMesh);
}


// ==============================================================================
// SECCIÓN 4: CÁLCULOS MATEMÁTICOS Y ACTUALIZACIÓN EN VIVO DE LA INTERFAZ
// ==============================================================================
function calculateAndRender() {
    const volElem = document.getElementById('metric-volume');
    const areaElem = document.getElementById('metric-area');
    const calcBox = document.getElementById('instant-calculation-box');
    const badge = document.getElementById('live-dimension-badge');

    // CASO 1: CUBO
    if (currentFigure === 'cube') {
        const a = parseFloat(state.cube.a);
        const volume = Math.pow(a, 3);
        const area = 6 * Math.pow(a, 2);

        volElem.textContent = volume.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        areaElem.textContent = area.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        badge.textContent = `Arista a = ${a} cm`;

        if (calcBox) {
            calcBox.innerHTML = `
                <div class="text-geo-muted border-b border-geo-border pb-1">
                    Cálculo para Arista (<span class="text-geo-gold font-bold">a</span> = ${a} cm):
                </div>
                <div>
                    <span class="text-geo-gold font-bold">Volumen:</span> V = a³ = ${a} × ${a} × ${a}
                    <br>
                    <span class="text-geo-ink font-semibold">V = ${volume.toFixed(2)} cm³</span>
                </div>
                <div class="pt-1">
                    <span class="text-geo-gold font-bold">Área Superficial:</span> A = 6 · a² = 6 × (${a} × ${a}) = 6 × ${(a * a).toFixed(2)}
                    <br>
                    <span class="text-geo-ink font-semibold">A = ${area.toFixed(2)} cm²</span>
                </div>
            `;
        }

    // CASO 2: ESFERA
    } else if (currentFigure === 'sphere') {
        const r = parseFloat(state.sphere.r);
        const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
        const area = 4 * Math.PI * Math.pow(r, 2);

        volElem.textContent = volume.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        areaElem.textContent = area.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        badge.textContent = `Radio r = ${r} cm`;

        if (calcBox) {
            calcBox.innerHTML = `
                <div class="text-geo-muted border-b border-geo-border pb-1">
                    Cálculo para Radio (<span class="text-geo-gold font-bold">r</span> = ${r} cm):
                </div>
                <div>
                    <span class="text-geo-gold font-bold">Volumen:</span> V = 4/3 · π · r³ = 4/3 × π × ${Math.pow(r, 3).toFixed(2)}
                    <br>
                    <span class="text-geo-ink font-semibold">V ≈ 1.333 × 3.1416 × ${Math.pow(r, 3).toFixed(2)} = ${volume.toFixed(2)} cm³</span>
                </div>
                <div class="pt-1">
                    <span class="text-geo-gold font-bold">Área Total:</span> A = 4 · π · r² = 4 × π × ${(r * r).toFixed(2)}
                    <br>
                    <span class="text-geo-ink font-semibold">A ≈ 4 × 3.1416 × ${(r * r).toFixed(2)} = ${area.toFixed(2)} cm²</span>
                </div>
            `;
        }

    // CASO 3: CONO
    } else if (currentFigure === 'cone') {
        const r = parseFloat(state.cone.r);
        const h = parseFloat(state.cone.h);

        const g = Math.sqrt(Math.pow(r, 2) + Math.pow(h, 2));
        const baseArea = Math.PI * Math.pow(r, 2);
        const lateralArea = Math.PI * r * g;
        const totalArea = baseArea + lateralArea;
        const volume = (1 / 3) * Math.PI * Math.pow(r, 2) * h;

        volElem.textContent = volume.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        areaElem.textContent = totalArea.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        document.getElementById('metric-slant').textContent = g.toFixed(2);
        document.getElementById('metric-cone-base').textContent = `${baseArea.toFixed(2)} cm²`;
        document.getElementById('metric-cone-lateral').textContent = `${lateralArea.toFixed(2)} cm²`;

        badge.textContent = `r = ${r} cm | h = ${h} cm`;

        if (calcBox) {
            calcBox.innerHTML = `
                <div class="text-geo-muted border-b border-geo-border pb-1">
                    Cálculo para Base (<span class="text-geo-gold font-bold">r</span> = ${r} cm) y Altura (<span class="text-geo-gold font-bold">h</span> = ${h} cm):
                </div>
                <div>
                    <span class="text-geo-gold font-bold">Generatriz (g):</span> g = √(r² + h²) = √(${r * r} + ${h * h}) = √${(r * r + h * h).toFixed(1)}
                    <br>
                    <span class="text-geo-ink font-semibold">g = ${g.toFixed(2)} cm</span>
                </div>
                <div class="pt-1">
                    <span class="text-geo-gold font-bold">Volumen:</span> V = 1/3 · π · r² · h = 1/3 × π × ${(r * r).toFixed(2)} × ${h}
                    <br>
                    <span class="text-geo-ink font-semibold">V = ${volume.toFixed(2)} cm³</span>
                </div>
                <div class="pt-1">
                    <span class="text-geo-gold font-bold">Área Total:</span> A = π · r · (r + g) = π × ${r} × (${r} + ${g.toFixed(2)})
                    <br>
                    <span class="text-geo-ink font-semibold">A = ${totalArea.toFixed(2)} cm²</span>
                </div>
            `;
        }
    }

    // Actualizamos la figura tridimensional en la pantalla
    update3DModel();
}


// ==============================================================================
// SECCIÓN 5: SINCRONIZACIÓN BIDIRECCIONAL (SLIDERS E INPUTS NUMÉRICOS)
// ==============================================================================
function onCubeInput(val) {
    const num = Math.max(0.1, Math.min(50, parseFloat(val) || 1));
    state.cube.a = num;
    document.getElementById('slider-cube-a').value = num;
    document.getElementById('num-cube-a').value = num;
    calculateAndRender();
}

function onSphereInput(val) {
    const num = Math.max(0.1, Math.min(50, parseFloat(val) || 1));
    state.sphere.r = num;
    document.getElementById('slider-sphere-r').value = num;
    document.getElementById('num-sphere-r').value = num;
    calculateAndRender();
}

function onConeInput() {
    const rVal = parseFloat(document.getElementById('slider-cone-r').value);
    const hVal = parseFloat(document.getElementById('slider-cone-h').value);
    state.cone.r = rVal;
    state.cone.h = hVal;
    document.getElementById('num-cone-r').value = rVal;
    document.getElementById('num-cone-h').value = hVal;
    calculateAndRender();
}

function syncConeNumToSlider(type) {
    if (type === 'r') {
        const val = Math.max(0.1, Math.min(30, parseFloat(document.getElementById('num-cone-r').value) || 1));
        state.cone.r = val;
        document.getElementById('slider-cone-r').value = val;
    } else {
        const val = Math.max(0.1, Math.min(40, parseFloat(document.getElementById('num-cone-h').value) || 1));
        state.cone.h = val;
        document.getElementById('slider-cone-h').value = val;
    }
    calculateAndRender();
}

function resetCurrentFigure() {
    if (currentFigure === 'cube') {
        onCubeInput(5);
    } else if (currentFigure === 'sphere') {
        onSphereInput(5);
    } else if (currentFigure === 'cone') {
        document.getElementById('slider-cone-r').value = 4;
        document.getElementById('slider-cone-h').value = 7;
        onConeInput();
    }
}


// ==============================================================================
// SECCIÓN 6: SISTEMA DE PESTAÑAS (CAMBIO ENTRE CUBO, ESFERA Y CONO)
// ==============================================================================
function switchFigure(fig) {
    currentFigure = fig;

    const tabs = {
        cube: document.getElementById('tab-cube'),
        sphere: document.getElementById('tab-sphere'),
        cone: document.getElementById('tab-cone')
    };

    const controls = {
        cube: document.getElementById('controls-cube'),
        sphere: document.getElementById('controls-sphere'),
        cone: document.getElementById('controls-cone')
    };

    const titles = {
        cube: 'Calculadora de <span class="text-geo-gold">Cubo</span>',
        sphere: 'Calculadora de <span class="text-geo-gold">Esfera</span>',
        cone: 'Calculadora de <span class="text-geo-gold">Cono</span>'
    };

    const formulas = {
        cube: 'V = a³ &nbsp;|&nbsp; A = 6·a²',
        sphere: 'V = 4/3·π·r³ &nbsp;|&nbsp; A = 4·π·r²',
        cone: 'V = 1/3·π·r²·h &nbsp;|&nbsp; A = π·r·(r+g)'
    };

    const badges = {
        cube: 'Figura 01',
        sphere: 'Figura 02',
        cone: 'Figura 03'
    };

    // Aplicar estilos de pestaña activa (dorada) o inactiva (oscura) con tamaño ampliado
    Object.keys(tabs).forEach(key => {
        if (key === fig) {
            tabs[key].className = "figure-tab flex items-center space-x-2.5 px-5 sm:px-6 py-2.5 rounded-lg text-base font-bold transition duration-200 bg-geo-gold text-black shadow-md";
            controls[key].classList.remove('hidden');
        } else {
            tabs[key].className = "figure-tab flex items-center space-x-2.5 px-5 sm:px-6 py-2.5 rounded-lg text-base font-semibold text-geo-muted hover:text-geo-ink transition duration-200";
            controls[key].classList.add('hidden');
        }
    });

    document.getElementById('fig-title').innerHTML = titles[fig];
    document.getElementById('fig-formula-preview').innerHTML = formulas[fig];
    document.getElementById('fig-number-badge').textContent = badges[fig];

    const slantCard = document.getElementById('metric-slant-card');
    if (fig === 'cone') {
        slantCard.classList.remove('hidden');
    } else {
        slantCard.classList.add('hidden');
    }

    calculateAndRender();
}


// ==============================================================================
// SECCIÓN 7: BOTONES DE UTILIDAD DEL VISOR 3D
// ==============================================================================
function toggleAutoRotate() {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
    const btn = document.getElementById('btn-autorotate');
    if (autoRotate) {
        btn.classList.add('text-geo-gold');
        btn.classList.remove('text-geo-muted');
    } else {
        btn.classList.remove('text-geo-gold');
        btn.classList.add('text-geo-muted');
    }
}

function toggleWireframe() {
    isWireframe = !isWireframe;
    goldMaterial.wireframe = isWireframe;
    const btn = document.getElementById('btn-wireframe');
    if (isWireframe) {
        btn.classList.add('text-geo-gold', 'border-geo-gold');
    } else {
        btn.classList.remove('text-geo-gold', 'border-geo-gold');
    }
}

function resetCamera() {
    camera.position.set(12, 10, 16);
    controls.target.set(0, 0, 0);
    controls.update();
}


// ==============================================================================
// SECCIÓN 8: BUCLE DE ANIMACIÓN (CICLO DE RENDERIZADO A 60 FPS)
// ==============================================================================
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});


// ==============================================================================
// SECCIÓN 9: INICIALIZACIÓN DE LA APLICACIÓN
// ==============================================================================
window.addEventListener('DOMContentLoaded', () => {
    calculateAndRender();
    animate();
});
