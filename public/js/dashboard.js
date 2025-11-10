// Dashboard.js - Funcionalidad del panel de control

let estadisticas = {
    zonas: null,
    especies: null,
    servicios: null
};

// Cargar todas las estadísticas al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        cargarEstadisticasZonas(),
        cargarEstadisticasEspecies(),
        cargarEstadisticasServicios()
    ]);
});

// Cargar estadísticas de zonas
async function cargarEstadisticasZonas() {
    const data = await fetchAPI('/zonas');
    if (data && data.success) {
        document.getElementById('totalZonas').textContent = data.count;
        estadisticas.zonas = data.data;
    }
}

// Cargar estadísticas de especies
async function cargarEstadisticasEspecies() {
    const [dataEspecies, dataEstadisticas] = await Promise.all([
        fetchAPI('/especies'),
        fetchAPI('/especies/estadisticas/generales')
    ]);

    if (dataEspecies && dataEspecies.success) {
        document.getElementById('totalEspecies').textContent = dataEspecies.count;
        estadisticas.especies = dataEspecies.data;
    }

    if (dataEstadisticas && dataEstadisticas.success) {
        mostrarEspeciesPorContinente(dataEstadisticas.data.porContinente);
        mostrarTiposEspecies(dataEstadisticas.data.porTipo);
        mostrarEspeciesEnPeligro(dataEstadisticas.data.especiesEnPeligro, dataEstadisticas.data.total);
    }
}

// Cargar estadísticas de servicios
async function cargarEstadisticasServicios() {
    const [dataServicios, dataEstadisticas] = await Promise.all([
        fetchAPI('/servicios'),
        fetchAPI('/servicios/estadisticas/generales')
    ]);

    if (dataServicios && dataServicios.success) {
        document.getElementById('totalServicios').textContent = dataServicios.count;
        estadisticas.servicios = dataServicios.data;
    }

    if (dataEstadisticas && dataEstadisticas.success) {
        document.getElementById('serviciosDisponibles').textContent = dataEstadisticas.data.disponibles;
        mostrarTiposServicios(dataEstadisticas.data.porTipo);
    }
}

// Mostrar especies por continente
function mostrarEspeciesPorContinente(datos) {
    const container = document.getElementById('especiesPorContinente');
    if (!datos || datos.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay datos disponibles</p>';
        return;
    }

    const html = datos.map(item => `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong>${item._id}</strong>
                <span>${item.count} especies</span>
            </div>
            <div style="height: 8px; background-color: #e0e0e0; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #2e7d32, #66bb6a); width: ${(item.count / datos[0].count) * 100}%; transition: width 0.3s ease;"></div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// Mostrar tipos de especies
function mostrarTiposEspecies(datos) {
    const container = document.getElementById('tiposEspecies');
    if (!datos || datos.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay datos disponibles</p>';
        return;
    }

    const html = datos.map(item => `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong>${item._id}</strong>
                <span>${item.count}</span>
            </div>
            <div style="height: 6px; background-color: #e0e0e0; border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #558b2f, #8bc34a); width: ${(item.count / datos[0].count) * 100}%;"></div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// Mostrar especies en peligro
function mostrarEspeciesEnPeligro(enPeligro, total) {
    const container = document.getElementById('especiesEnPeligro');
    const porcentaje = total > 0 ? ((enPeligro / total) * 100).toFixed(1) : 0;

    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: ${enPeligro > 0 ? '#f57c00' : '#4caf50'}; margin-bottom: 1rem;">
                ${enPeligro}
            </div>
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                <strong>Especies en riesgo</strong>
            </p>
            <p style="color: #757575;">
                ${porcentaje}% del total de especies
            </p>
            ${enPeligro > 0 ? 
                '<p style="color: #f57c00; margin-top: 1rem;"><i class="fas fa-exclamation-triangle"></i> Requieren atención especial</p>' :
                '<p style="color: #4caf50; margin-top: 1rem;"><i class="fas fa-check-circle"></i> Todas las especies están seguras</p>'
            }
        </div>
    `;
}

// Mostrar tipos de servicios
function mostrarTiposServicios(datos) {
    const container = document.getElementById('tiposServicios');
    if (!datos || datos.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay datos disponibles</p>';
        return;
    }

    const iconos = {
        'Juego': 'fa-gamepad',
        'Kiosco': 'fa-store',
        'Paseo': 'fa-walking',
        'Baño': 'fa-restroom',
        'Banco': 'fa-chair',
        'Fuente': 'fa-water',
        'Mirador': 'fa-binoculars'
    };

    const html = datos.map(item => `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding: 0.75rem; background-color: #f5f5f5; border-radius: 8px;">
            <i class="fas ${iconos[item._id] || 'fa-circle'}" style="font-size: 1.5rem; color: #f57c00;"></i>
            <div style="flex: 1;">
                <strong>${item._id}</strong>
            </div>
            <span style="background-color: #fff; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 600;">
                ${item.count}
            </span>
        </div>
    `).join('');

    container.innerHTML = html;
}

console.log('✅ Dashboard cargado');
