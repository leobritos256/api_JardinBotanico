// Funciones globales
const API_BASE_URL = '/api';

// Función para hacer peticiones a la API
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (response.status === 401) {
            window.location.href = '/login';
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en petición API:', error);
        showNotification('Error de conexión', 'error');
        return null;
    }
}

// Función para cerrar sesión
async function logout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        try {
            await fetch('/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }
}

// Función para mostrar/ocultar modales
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        // Limpiar formulario si existe
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            const hiddenId = form.querySelector('input[type="hidden"]');
            if (hiddenId) hiddenId.value = '';
        }
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        event.target.style.display = 'none';
    }
};

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Función para formatear fechas
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para formatear números
function formatNumber(number) {
    return new Intl.NumberFormat('es-AR').format(number);
}

// Función para crear badge de estado
function createStatusBadge(estado) {
    const badges = {
        'Abierta': 'badge-success',
        'Disponible': 'badge-success',
        'Cerrada': 'badge-danger',
        'No disponible': 'badge-danger',
        'Mantenimiento': 'badge-warning'
    };
    return `<span class="card-badge ${badges[estado] || 'badge-info'}">${estado}</span>`;
}

// Exportar funciones para uso global
window.fetchAPI = fetchAPI;
window.logout = logout;
window.showModal = showModal;
window.closeModal = closeModal;
window.showNotification = showNotification;
window.formatDate = formatDate;
window.formatNumber = formatNumber;
window.createStatusBadge = createStatusBadge;

console.log('✅ Sistema de gestión del Parque Botánico cargado correctamente');
