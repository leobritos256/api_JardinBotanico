// Mapa.js - Versión con Leaflet
let map;
let marcadoresZonas = [];
let marcadoresEspecies = [];
let marcadoresServicios = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargarEstadisticasMapa();
    await inicializarMapa();
});

async function cargarEstadisticasMapa() {
    const [zonasData, especiesData, serviciosData] = await Promise.all([
        fetchAPI('/zonas'),
        fetchAPI('/especies'),
        fetchAPI('/servicios')
    ]);

    if (zonasData && zonasData.success) {
        document.getElementById('mapZonasCount').textContent = zonasData.count;
    }

    if (especiesData && especiesData.success) {
        document.getElementById('mapEspeciesCount').textContent = especiesData.count;
    }

    if (serviciosData && serviciosData.success) {
        document.getElementById('mapServiciosCount').textContent = serviciosData.count;
    }
}

async function inicializarMapa() {
    try {
        // Inicializar mapa
        map = L.map('map').setView([-31.416, -64.183], 15);

        // Agregar capa base
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Cargar marcadores
        await cargarMarcadores();

        // Configurar filtros
        configurarFiltros();

        console.log('✅ Mapa inicializado');
    } catch (error) {
        console.error('❌ Error inicializando mapa:', error);
    }
}

async function cargarMarcadores() {
    try {
        const [zonasData, especiesData, serviciosData] = await Promise.all([
            fetchAPI('/zonas'),
            fetchAPI('/especies'),
            fetchAPI('/servicios')
        ]);

        // Limpiar marcadores anteriores
        limpiarMarcadores();

        // Agregar zonas
        if (zonasData?.success && zonasData.data) {
            zonasData.data.forEach(zona => {
                if (zona.ubicacion?.coordenadas) {
                    const { latitud, longitud } = zona.ubicacion.coordenadas;
                    
                    const marker = L.circleMarker([latitud, longitud], {
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.7,
                        radius: 10
                    }).addTo(map);

                    marker.bindPopup(`
                        <b>${zona.nombre}</b><br>
                        Tipo: ${zona.tipo}<br>
                        Extensión: ${zona.extension} m²<br>
                        Estado: ${zona.estado}
                    `);

                    marcadoresZonas.push(marker);
                }
            });
        }

        // Agregar especies
        if (especiesData?.success && especiesData.data) {
            especiesData.data.forEach(especie => {
                // Ubicación aleatoria cerca del centro
                const lat = -31.416 + (Math.random() - 0.5) * 0.005;
                const lng = -64.183 + (Math.random() - 0.5) * 0.005;
                
                const marker = L.circleMarker([lat, lng], {
                    color: '#22c55e',
                    fillColor: '#22c55e',
                    fillOpacity: 0.7,
                    radius: 8
                }).addTo(map);

                marker.bindPopup(`
                    <b>${especie.nombreComun}</b><br>
                    <i>${especie.nombreCientifico}</i><br>
                    Familia: ${especie.familia}<br>
                    Origen: ${especie.origen.pais}
                `);

                marcadoresEspecies.push(marker);
            });
        }

        // Agregar servicios
        if (serviciosData?.success && serviciosData.data) {
            serviciosData.data.forEach(servicio => {
                if (servicio.ubicacion?.coordenadas) {
                    const { latitud, longitud } = servicio.ubicacion.coordenadas;
                    
                    const marker = L.circleMarker([latitud, longitud], {
                        color: '#f97316',
                        fillColor: '#f97316',
                        fillOpacity: 0.7,
                        radius: 8
                    }).addTo(map);

                    const costo = servicio.costoAdicional?.tieneCosto 
                        ? `$${servicio.costoAdicional.precio}` 
                        : 'Gratuito';

                    marker.bindPopup(`
                        <b>${servicio.nombre}</b><br>
                        Tipo: ${servicio.tipo}<br>
                        ${costo}<br>
                        Estado: ${servicio.estado}
                    `);

                    marcadoresServicios.push(marker);
                }
            });
        }

        console.log(`✅ Cargados: ${marcadoresZonas.length} zonas, ${marcadoresEspecies.length} especies, ${marcadoresServicios.length} servicios`);
    } catch (error) {
        console.error('❌ Error cargando marcadores:', error);
    }
}

function limpiarMarcadores() {
    marcadoresZonas.forEach(m => map.removeLayer(m));
    marcadoresEspecies.forEach(m => map.removeLayer(m));
    marcadoresServicios.forEach(m => map.removeLayer(m));
    
    marcadoresZonas = [];
    marcadoresEspecies = [];
    marcadoresServicios = [];
}

function configurarFiltros() {
    document.getElementById('toggleZonas')?.addEventListener('change', (e) => {
        marcadoresZonas.forEach(m => {
            if (e.target.checked) m.addTo(map);
            else map.removeLayer(m);
        });
    });

    document.getElementById('toggleEspecies')?.addEventListener('change', (e) => {
        marcadoresEspecies.forEach(m => {
            if (e.target.checked) m.addTo(map);
            else map.removeLayer(m);
        });
    });

    document.getElementById('toggleServicios')?.addEventListener('change', (e) => {
        marcadoresServicios.forEach(m => {
            if (e.target.checked) m.addTo(map);
            else map.removeLayer(m);
        });
    });
}

console.log('✅ Módulo de Mapa cargado');