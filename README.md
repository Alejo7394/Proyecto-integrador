# Proyecto-integrador
calculadora de volumenes, figuras geometricas 3D
## 🌟 Resumen del Proyecto

**GeoGold 3D** resuelve la dificultad tradicional de estudiar geometría espacial en planos 2D estáticos. Permite a estudiantes, docentes y entusiastas experimentar con las dimensiones de figuras tridimensionales, calculando en tiempo real su **Volumen** y **Área Superficial Total**, mientras manipulan libremente un modelo 3D renderizado a 60 FPS.

---

## 🚀 Características Principales

- **🎲 3 Sólidos Espaciales Fundamentales:**
  - **Cubo:** Parámetro de arista ($a$).
  - **Esfera:** Parámetro de radio ($r$).
  - **Cono:** Parámetros independientes de radio ($r$) y altura ($h$).
- **⚡ Sincronización Bidireccional:** Ajusta valores mediante barras deslizantes (*sliders*) o cajas de texto numéricas con sincronización inmediata.
- **🌐 Motor 3D Interactivo (WebGL / Three.js):**
  - Rotación 360°, paneo y zoom con ratón o gestos táctiles mediante `OrbitControls`.
  - Escalado visual de los modelos proporcional a las medidas ingresadas.
- **🛠️ Controles de Cámara y Visualización:**
  - **⟳ Auto-Giro:** Pausa o activa la rotación automática de la figura.
  - **⬡ Modo Malla (Wireframe):** Alterna entre renderizado de cuerpo sólido y estructura de alambre para inspeccionar la geometría interna.
  - **🎯 Centrar:** Restaura instantáneamente la cámara a su perspectiva isométrica original.
- **🎨 Interfaz Moderna & Temática "GeoGold":**
  - Paleta elegante en tonos carbón oscuro (`#090A0C`) y acentos dorados (`#D4AF37`).
  - Tipografías modernas (*Cinzel*, *Outfit* y *Fira Code*).
  - Diseño responsivo adaptado a dispositivos móviles, tablets y escritorios.

---

## 🔄 Cambios y Mejoras Recientes

Durante las últimas fases del proyecto se realizaron optimizaciones clave para elevar la calidad visual y el rendimiento técnico:

1. **Modularización y Centralización del Código:**
   - Organización estricta de responsabilidades en tres archivos independientes (`index.html`, `style.css` y `js/script.js`).
   - Lógica protegida bajo el evento `DOMContentLoaded` para evitar fallos de renderizado.
2. **Gestión Óptima de Recursos WebGL:**
   - Implementación de limpieza de geometrías y materiales mediante `dispose()` al cambiar de pestaña, evitando fugas de memoria (*memory leaks*).
3. **Simplificación y Unificación de Métricas:**
   - **Retiro de fórmulas estáticas:** Se limpió la cabecera visual para dar protagonismo a los datos y a la vista 3D.
   - **Estandarización de tarjetas:** En el caso del Cono, la generatriz ($g$) se calcula internamente para obtener el área superficial exacta, logrando una interfaz homogénea con solo dos métricas principales: **Volumen Total** ($\text{cm}^3$) y **Área Superficial Total** ($\text{cm}^2$).

---

## 📁 Estructura del Proyecto

```text
proyecto-integrado-js-css/
│
├── index.html                  # Maquetación semántica y vistas por pestañas
├── style.css                   # Personalización de sliders, sombras doradas y cursores
├── js/
│   └── script.js               # Motor Three.js, fórmulas matemáticas y reactividad
├── INFORME_PROYECTO_INCONTEC.md # Documento técnico formal bajo norma INCONTEC
└── README.md                   # Documentación general para GitHub
```

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Semántica web estructurada.
- **CSS3 & Tailwind CSS (CDN):** Estilizado utilitario ágil y personalización avanzada de controles de usuario.
- **JavaScript (Vanilla ES6+):** Programación orientada a eventos sin dependencias de frameworks pesados.
- **Three.js (r128) & OrbitControls:** Motor gráfico 3D basado en WebGL.
- **Google Fonts:** Fuentes *Cinzel*, *Outfit* y *Fira Code*.

---

## 💻 Instalación y Uso Local

Este proyecto es una aplicación web puramente frontend, por lo que **no requiere compilar ni instalar dependencias de Node.js**:

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/geogold-3d.git
   ```

2. **Accede al directorio del proyecto:**
   ```bash
   cd geogold-3d
   ```

3. **Ejecuta la aplicación:**
   - Puedes abrir directamente el archivo `index.html` en tu navegador web favorito (Chrome, Edge, Firefox, Brave, etc.).
   - O si utilizas Visual Studio Code, haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

---

## 👤 Autor
- **Alejandro Buitrago**
- Proyecto Integrador de Desarrollo Web Frontend — **Politécnico Internacional**
- Año: 2026

