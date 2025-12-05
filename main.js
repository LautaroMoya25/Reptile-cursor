// Configuración del reptil
const SEGMENT_COUNT = 15; // Número de segmentos del cuerpo
const SEGMENT_SPACING = 15; // Espaciado entre segmentos
const FOLLOW_SPEED = 0.15; // Velocidad de seguimiento (0-1, más alto = más rápido)

// Array para almacenar las posiciones de cada segmento
let segments = [];
let mouseX = 0;
let mouseY = 0;
let isMoving = false;

// Clase para cada segmento del reptil
class ReptileSegment {
    constructor(index) {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.element = document.createElement('div');
        this.element.className = 'reptile-segment';
        this.index = index;

        // Determinar el tipo de segmento
        if (index === 0) {
            // Cabeza
            this.element.classList.add('reptile-head');
            this.size = 30;
        } else if (index < SEGMENT_COUNT - 3) {
            // Cuerpo
            this.element.classList.add('reptile-body');
            // Los segmentos del cuerpo disminuyen gradualmente de tamaño
            this.size = 28 - (index * 1.2);
        } else {
            // Cola
            this.element.classList.add('reptile-tail');
            this.size = 25 - (index * 1.5);
        }

        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;

        document.body.appendChild(this.element);
    }

    // Actualizar posición del segmento
    update(targetX, targetY) {
        // Interpolación suave hacia la posición objetivo
        this.x += (targetX - this.x) * FOLLOW_SPEED;
        this.y += (targetY - this.y) * FOLLOW_SPEED;

        // Aplicar transformaciones
        this.element.style.left = `${this.x - this.size / 2}px`;
        this.element.style.top = `${this.y - this.size / 2}px`;

        // Rotación basada en la dirección del movimiento
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.element.style.transform = `rotate(${angle}rad)`;
    }
}

// Inicializar segmentos
function init() {
    for (let i = 0; i < SEGMENT_COUNT; i++) {
        segments.push(new ReptileSegment(i));
    }

    // Iniciar el loop de animación
    animate();
}

// Seguir el cursor
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
});

// Loop de animación
function animate() {
    // La cabeza sigue al cursor
    if (segments.length > 0) {
        segments[0].update(mouseX, mouseY);

        // Cada segmento sigue al anterior
        for (let i = 1; i < segments.length; i++) {
            const prev = segments[i - 1];

            // Calcular la posición objetivo basada en el segmento anterior
            const dx = prev.x - segments[i].x;
            const dy = prev.y - segments[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const targetX = prev.x - (dx / distance) * SEGMENT_SPACING;
                const targetY = prev.y - (dy / distance) * SEGMENT_SPACING;

                segments[i].update(targetX, targetY);
            }
        }
    }

    requestAnimationFrame(animate);
}

// Efectos adicionales al hacer clic
document.addEventListener('mousedown', (event) => {
    if (segments.length > 0) {
        const head = segments[0].element;

        if (event.button === 0) { // Clic izquierdo
            // Efecto de "morder"
            head.style.transform += ' scale(1.3)';
            setTimeout(() => {
                head.style.transform = head.style.transform.replace(' scale(1.3)', '');
            }, 150);
        }
    }
});

// Prevenir menú contextual
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Inicializar cuando se carga la página
window.addEventListener('load', init);