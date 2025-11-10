// Servicios.js
let serviciosData = [];
let serviciosFiltered = [];
let zonasDisponibles = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarZonasParaSelect();
    cargarServicios();
    configurarFormulario();
});

async function cargarZonasParaSelect() {
    const data = await fetchAPI('/zonas');
    if (data && data.success) {
        zonasDisponibles = data.data;
        const select = document.getElementById('zonaAsociada');
        if (select) {
            select.innerHTML = '<option value="">Seleccionar zona...</option>' +
                zonasDisponibles.map(zona => 
                    `<option value="${zona._id}">${zona.nombre}</option>`
                ).join('');
        }
    }
}

async function cargarServicios() {
    const data = await fetchAPI('/servicios');
    if (data && data.success) {
        serviciosData = data.data;
        serviciosFiltered = [...serviciosData];
        mostrarServicios();
    }
}

function mostrarServicios() {
    const container = document.getElementById('serviciosContainer');
    if (serviciosFiltered.length === 0) {
        container.innerHTML = '<div class="loading-message">No se encontraron servicios</div>';
        return;
    }

    const iconos = {
        'Juego': 'fa-gamepad',
        'Kiosco': 'fa-store',
        'Paseo': 'fa-walking',
        'Baño': 'fa-restroom',
        'Banco': 'fa-chair',
        'Fuente': 'fa-water',
        'Mirador': 'fa-binoculars',
        'Centro de Información': 'fa-info-circle'
    };

    const html = serviciosFiltered.map(servicio => `
        <div class="card">
            <div class="card-content">
                <div style="font-size: 3rem; text-align: center; color: var(--primary-color); margin-bottom: 1rem;">
                    <i class="fas ${iconos[servicio.tipo] || 'fa-concierge-bell'}"></i>
                </div>
                <h3 class="card-title">${servicio.nombre}</h3>
                <p class="card-subtitle"><i class="fas fa-map-marker-alt"></i> ${servicio.zonaAsociada ? servicio.zonaAsociada.nombre : 'Sin zona'}</p>
                <p class="card-description">${servicio.descripcion}</p>
                <span class="card-badge badge-info">${servicio.tipo}</span>
                ${createStatusBadge(servicio.estado)}
                ${servicio.costoAdicional.tieneCosto ? 
                    `<span class="card-badge badge-warning">$${servicio.costoAdicional.precio}</span>` : 
                    '<span class="card-badge badge-success">Gratuito</span>'}
                <div class="card-actions">
                    <button class="btn btn-primary btn-icon" onclick="editarServicio('${servicio._id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="eliminarServicio('${servicio._id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function filterServicios() {
    const tipo = document.getElementById('filterTipo').value;
    const estado = document.getElementById('filterEstado').value;

    serviciosFiltered = serviciosData.filter(servicio => {
        const matchTipo = !tipo || servicio.tipo === tipo;
        const matchEstado = !estado || servicio.estado === estado;
        return matchTipo && matchEstado;
    });

    mostrarServicios();
}

function configurarFormulario() {
    document.getElementById('servicioForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const servicioId = document.getElementById('servicioId').value;
        const servicioData = {
            nombre: document.getElementById('nombreServicio').value,
            tipo: document.getElementById('tipoServicio').value,
            descripcion: document.getElementById('descripcionServicio').value,
            zonaAsociada: document.getElementById('zonaAsociada').value,
            estado: document.getElementById('estadoServicio').value,
            ubicacion: {
                coordenadas: {
                    latitud: parseFloat(document.getElementById('latitudServicio').value),
                    longitud: parseFloat(document.getElementById('longitudServicio').value)
                }
            }
        };

        const method = servicioId ? 'PUT' : 'POST';
        const endpoint = servicioId ? `/servicios/${servicioId}` : '/servicios';
        
        const result = await fetchAPI(endpoint, {
            method,
            body: JSON.stringify(servicioData)
        });

        if (result && result.success) {
            showNotification(result.message, 'success');
            closeModal('createServicioModal');
            cargarServicios();
        }
    });
}

async function editarServicio(id) {
    const servicio = serviciosData.find(s => s._id === id);
    if (!servicio) return;

    document.getElementById('servicioId').value = servicio._id;
    document.getElementById('nombreServicio').value = servicio.nombre;
    document.getElementById('tipoServicio').value = servicio.tipo;
    document.getElementById('descripcionServicio').value = servicio.descripcion;
    document.getElementById('zonaAsociada').value = servicio.zonaAsociada ? servicio.zonaAsociada._id : '';
    document.getElementById('estadoServicio').value = servicio.estado;
    document.getElementById('latitudServicio').value = servicio.ubicacion.coordenadas.latitud;
    document.getElementById('longitudServicio').value = servicio.ubicacion.coordenadas.longitud;

    showModal('createServicioModal');
}

async function eliminarServicio(id) {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    const result = await fetchAPI(`/servicios/${id}`, { method: 'DELETE' });
    if (result && result.success) {
        showNotification('Servicio eliminado exitosamente', 'success');
        cargarServicios();
    }
}

console.log('✅ Módulo de Servicios cargado');
