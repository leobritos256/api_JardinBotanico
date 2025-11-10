// Especies.js
let especiesData = [];
let especiesFiltered = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarEspecies();
    configurarFormulario();
});

async function cargarEspecies() {
    const data = await fetchAPI('/especies');
    if (data && data.success) {
        especiesData = data.data;
        especiesFiltered = [...especiesData];
        mostrarEspecies();
    }
}

function mostrarEspecies() {
    const container = document.getElementById('especiesContainer');
    if (especiesFiltered.length === 0) {
        container.innerHTML = '<div class="loading-message">No se encontraron especies</div>';
        return;
    }

    const html = especiesFiltered.map(especie => `
        <div class="card">
            <img src="${especie.imagenes && especie.imagenes[0] ? especie.imagenes[0].url : '/images/especie-default.jpg'}" 
                 alt="${especie.nombreComun}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${especie.nombreComun}</h3>
                <p class="card-subtitle"><i>${especie.nombreCientifico}</i></p>
                <p class="card-description">${especie.descripcion.substring(0, 120)}...</p>
                <span class="card-badge badge-info">${especie.caracteristicas.tipo}</span>
                <span class="card-badge badge-success">${especie.origen.continente}</span>
                ${especie.estadoConservacion !== 'No amenazada' ? 
                    `<span class="card-badge badge-warning">${especie.estadoConservacion}</span>` : ''}
                <div class="card-actions">
                    <button class="btn btn-primary btn-icon" onclick="editarEspecie('${especie._id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="eliminarEspecie('${especie._id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function filterEspecies() {
    const tipo = document.getElementById('filterTipo').value;
    const search = document.getElementById('searchEspecie').value.toLowerCase();

    especiesFiltered = especiesData.filter(especie => {
        const matchTipo = !tipo || especie.caracteristicas.tipo === tipo;
        const matchSearch = !search || 
            especie.nombreComun.toLowerCase().includes(search) || 
            especie.nombreCientifico.toLowerCase().includes(search) ||
            especie.familia.toLowerCase().includes(search);
        return matchTipo && matchSearch;
    });

    mostrarEspecies();
}

function configurarFormulario() {
    document.getElementById('especieForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const especieId = document.getElementById('especieId').value;
        const especieData = {
            nombreComun: document.getElementById('nombreComun').value,
            nombreCientifico: document.getElementById('nombreCientifico').value,
            familia: document.getElementById('familia').value,
            origen: {
                continente: document.getElementById('continente').value,
                pais: document.getElementById('pais').value
            },
            descripcion: document.getElementById('descripcionEspecie').value,
            caracteristicas: {
                tipo: document.getElementById('tipoEspecie').value
            }
        };

        const method = especieId ? 'PUT' : 'POST';
        const endpoint = especieId ? `/especies/${especieId}` : '/especies';
        
        const result = await fetchAPI(endpoint, {
            method,
            body: JSON.stringify(especieData)
        });

        if (result && result.success) {
            showNotification(result.message, 'success');
            closeModal('createEspecieModal');
            cargarEspecies();
        }
    });
}

async function editarEspecie(id) {
    const especie = especiesData.find(e => e._id === id);
    if (!especie) return;

    document.getElementById('especieId').value = especie._id;
    document.getElementById('nombreComun').value = especie.nombreComun;
    document.getElementById('nombreCientifico').value = especie.nombreCientifico;
    document.getElementById('familia').value = especie.familia;
    document.getElementById('tipoEspecie').value = especie.caracteristicas.tipo;
    document.getElementById('descripcionEspecie').value = especie.descripcion;
    document.getElementById('continente').value = especie.origen.continente;
    document.getElementById('pais').value = especie.origen.pais;

    showModal('createEspecieModal');
}

async function eliminarEspecie(id) {
    if (!confirm('¿Estás seguro de eliminar esta especie?')) return;

    const result = await fetchAPI(`/especies/${id}`, { method: 'DELETE' });
    if (result && result.success) {
        showNotification('Especie eliminada exitosamente', 'success');
        cargarEspecies();
    }
}

console.log('✅ Módulo de Especies cargado');
