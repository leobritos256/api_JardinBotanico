// Zonas.js
let zonasData = [];
let zonasFiltered = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarZonas();
    configurarFormulario();
});

async function cargarZonas() {
    const data = await fetchAPI('/zonas');
    if (data && data.success) {
        zonasData = data.data;
        zonasFiltered = [...zonasData];
        mostrarZonas();
    }
}

function mostrarZonas() {
    const container = document.getElementById('zonasContainer');
    if (zonasFiltered.length === 0) {
        container.innerHTML = '<div class="loading-message">No se encontraron zonas</div>';
        return;
    }

    const html = zonasFiltered.map(zona => `
        <div class="card">
            <img src="${zona.mapaUrl || '/images/zona-default.jpg'}" alt="${zona.nombre}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${zona.nombre}</h3>
                <p class="card-subtitle"><i class="fas fa-map-marked-alt"></i> ${zona.tipo}</p>
                <p class="card-description">${zona.descripcion.substring(0, 150)}...</p>
                ${createStatusBadge(zona.estado)}
                <span class="card-badge badge-info">${formatNumber(zona.extension)} m²</span>
                <div class="card-actions">
                    <button class="btn btn-primary btn-icon" onclick="editarZona('${zona._id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="eliminarZona('${zona._id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function filterZonas() {
    const tipo = document.getElementById('filterTipo').value;
    const estado = document.getElementById('filterEstado').value;
    const search = document.getElementById('searchZona').value.toLowerCase();

    zonasFiltered = zonasData.filter(zona => {
        const matchTipo = !tipo || zona.tipo === tipo;
        const matchEstado = !estado || zona.estado === estado;
        const matchSearch = !search || zona.nombre.toLowerCase().includes(search) || zona.descripcion.toLowerCase().includes(search);
        return matchTipo && matchEstado && matchSearch;
    });

    mostrarZonas();
}

function configurarFormulario() {
    document.getElementById('zonaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const zonaId = document.getElementById('zonaId').value;
        const zonaData = {
            nombre: document.getElementById('nombre').value,
            tipo: document.getElementById('tipo').value,
            descripcion: document.getElementById('descripcion').value,
            extension: parseFloat(document.getElementById('extension').value),
            estado: document.getElementById('estado').value,
            ubicacion: {
                coordenadas: {
                    latitud: parseFloat(document.getElementById('latitud').value),
                    longitud: parseFloat(document.getElementById('longitud').value)
                },
                descripcionUbicacion: document.getElementById('descripcionUbicacion').value
            }
        };

        const method = zonaId ? 'PUT' : 'POST';
        const endpoint = zonaId ? `/zonas/${zonaId}` : '/zonas';
        
        const result = await fetchAPI(endpoint, {
            method,
            body: JSON.stringify(zonaData)
        });

        if (result && result.success) {
            showNotification(result.message, 'success');
            closeModal('createZonaModal');
            cargarZonas();
        }
    });
}

async function editarZona(id) {
    const zona = zonasData.find(z => z._id === id);
    if (!zona) return;

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Zona';
    document.getElementById('zonaId').value = zona._id;
    document.getElementById('nombre').value = zona.nombre;
    document.getElementById('tipo').value = zona.tipo;
    document.getElementById('descripcion').value = zona.descripcion;
    document.getElementById('extension').value = zona.extension;
    document.getElementById('estado').value = zona.estado;
    document.getElementById('latitud').value = zona.ubicacion.coordenadas.latitud;
    document.getElementById('longitud').value = zona.ubicacion.coordenadas.longitud;
    document.getElementById('descripcionUbicacion').value = zona.ubicacion.descripcionUbicacion || '';

    showModal('createZonaModal');
}

async function eliminarZona(id) {
    if (!confirm('¿Estás seguro de eliminar esta zona?')) return;

    const result = await fetchAPI(`/zonas/${id}`, { method: 'DELETE' });
    if (result && result.success) {
        showNotification('Zona eliminada exitosamente', 'success');
        cargarZonas();
    }
}

console.log('✅ Módulo de Zonas cargado');
