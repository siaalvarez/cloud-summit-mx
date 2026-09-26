// LogisticaView.js - Vista de Logística & Nearshoring (Torre de Control Terrestre & Copiloto Inteligente)

const LogisticaView = {
  template: `
    <v-container class="pa-2 px-3 flex-grow-1 d-flex flex-column fill-height" style="max-width: 100%; box-sizing: border-box; overflow: hidden;">
      <v-row class="flex-grow-1 my-0" style="height: 100%; max-height: 100%; min-height: 0;">
        
        <!-- ========================================== -->
        <!-- LADO IZQUIERDO: MAPA DE CONTROL LOGÍSTICO  -->
        <!-- ========================================== -->
        <v-col cols="12" md="7" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column overflow-hidden bg-white position-relative" style="height: 100%; max-height: 100%; min-height: 0;">
            
            <!-- Header Superior del Mapa con Estadísticas en Tiempo Real -->
            <v-card-title class="bg-white pa-3 border-b d-flex align-center justify-space-between flex-wrap flex-shrink-0" style="border-bottom: 1px solid #e8eaed; gap: 8px;">
              <div class="d-flex align-center">
                <v-avatar color="#e8f0fe" size="36" class="mr-3">
                  <v-icon color="#4285F4">mdi-truck-delivery-outline</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold" style="color: #202124;">Torre de Control: Corredores & Flotas Terrestres</div>
                  <div class="text-caption text-grey-darken-1" style="font-size: 11px;">Red Nacional: CEDIS Orígenes ➔ Corredores ➔ Hubs Destino</div>
                </div>
              </div>
              <div class="d-flex align-center flex-wrap" style="gap: 6px;">
                <v-chip color="error" size="small" variant="flat" class="font-weight-bold">
                  <v-icon start size="14">mdi-alert-octagon</v-icon> {{ disruptedRoutesCount }} Rutas Afectadas
                </v-chip>
                <v-chip color="#FBBC05" size="small" variant="flat" class="font-weight-bold" style="color: #202124 !important;">
                  <v-icon start size="14">mdi-truck-alert</v-icon> {{ affectedVehiclesCount }} Transportes Detenidos
                </v-chip>
                <v-chip color="#34A853" size="small" variant="flat" class="font-weight-bold text-white">
                  <v-icon start size="14">mdi-warehouse</v-icon> {{ planBWarehousesCount }} Plan B Activo
                </v-chip>
              </div>
            </v-card-title>

            <!-- Barra de Filtros y Acciones Rápidas del Mapa -->
            <div class="px-3 py-1 bg-grey-lighten-4 border-b d-flex align-center justify-space-between flex-wrap flex-shrink-0" style="border-bottom: 1px solid #f0f0f0; gap: 6px; font-size: 11.5px;">
              <div class="d-flex align-center flex-wrap" style="gap: 4px;">
                <span class="text-caption font-weight-bold text-grey-darken-2 mr-1">Filtrar:</span>
                <v-btn
                  size="x-small"
                  rounded="pill"
                  :variant="activeFilter === 'all' ? 'flat' : 'text'"
                  :color="activeFilter === 'all' ? '#4285F4' : '#5f6368'"
                  class="text-capitalize"
                  :class="activeFilter === 'all' ? 'text-white' : ''"
                  @click="setFilter('all')"
                >
                  Todos
                </v-btn>
                <v-btn
                  size="x-small"
                  rounded="pill"
                  :variant="activeFilter === 'disrupted' ? 'flat' : 'text'"
                  :color="activeFilter === 'disrupted' ? '#EA4335' : '#5f6368'"
                  class="text-capitalize"
                  :class="activeFilter === 'disrupted' ? 'text-white' : ''"
                  @click="setFilter('disrupted')"
                >
                  🚨 Solo Disrupciones
                </v-btn>
                <v-btn
                  size="x-small"
                  rounded="pill"
                  :variant="activeFilter === 'vehicles' ? 'flat' : 'text'"
                  :color="activeFilter === 'vehicles' ? '#1967d2' : '#5f6368'"
                  class="text-capitalize"
                  :class="activeFilter === 'vehicles' ? 'text-white' : ''"
                  @click="setFilter('vehicles')"
                >
                  🚚 Flotas
                </v-btn>
                <v-btn
                  size="x-small"
                  rounded="pill"
                  :variant="activeFilter === 'warehouses' ? 'flat' : 'text'"
                  :color="activeFilter === 'warehouses' ? '#137333' : '#5f6368'"
                  class="text-capitalize"
                  :class="activeFilter === 'warehouses' ? 'text-white' : ''"
                  @click="setFilter('warehouses')"
                >
                  📦 CEDIS / Hubs
                </v-btn>
              </div>

              <div class="d-flex align-center" style="gap: 6px;">
                <v-btn size="x-small" variant="text" color="#5f6368" @click="resetMapView">
                  <v-icon start size="14">mdi-crosshairs-gps</v-icon> Centrar México
                </v-btn>
              </div>
            </div>

            <!-- Contenedor del Mapa Google Maps -->
            <v-card-text class="flex-grow-1 pa-0 position-relative" style="min-height: 0; height: 100%;">
              
              <!-- Badge Flotante de Ruta Activa -->
              <div v-if="selectedRoute" class="position-absolute" style="top: 12px; left: 12px; z-index: 999; max-width: 90%;">
                <v-chip color="white" elevation="3" size="small" closable @click:close="clearActiveSelection" class="font-weight-bold" style="color: #202124; border: 1px solid #dadce0;">
                  <v-icon start size="14" :color="selectedRoute.color">mdi-road-variant</v-icon>
                  {{ selectedRoute.nombre }}
                </v-chip>
              </div>

              <!-- Banner / Notificación de Re-enrutamiento Aplicado -->
              <v-fade-transition>
                <div v-if="rerouteSuccessMessage" class="position-absolute" style="top: 12px; right: 12px; z-index: 1000;">
                  <v-alert
                    density="compact"
                    type="success"
                    variant="elevated"
                    elevation="4"
                    class="font-weight-bold text-caption rounded-lg"
                    closable
                    @click:close="rerouteSuccessMessage = ''"
                  >
                    {{ rerouteSuccessMessage }}
                  </v-alert>
                </div>
              </v-fade-transition>

              <!-- ============================================== -->
              <!-- TARJETA FLOTANTE DE CONSIDERACIONES Y DESVÍO   -->
              <!-- ============================================== -->
              <v-slide-y-reverse-transition>
                <div
                  v-if="activeConsideration"
                  class="position-absolute px-3 pb-3"
                  style="bottom: 0px; left: 0px; right: 0px; z-index: 999; pointer-events: none;"
                >
                  <v-card
                    elevation="8"
                    class="rounded-xl pa-3 bg-white"
                    style="border: 1.5px solid #34A853; pointer-events: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.18) !important;"
                  >
                    <div class="d-flex align-center justify-space-between mb-2 pb-1 border-b">
                      <div class="d-flex align-center">
                        <v-avatar color="#e6f4ea" size="28" class="mr-2">
                          <v-icon color="#34A853" size="18">mdi-routes</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-caption font-weight-bold" style="color: #137333;">PROPUESTA DE DESVÍO ALTERNATIVO</div>
                          <div class="text-subtitle-2 font-weight-bold" style="color: #202124;">
                            {{ activeConsideration.alt_route_name || activeConsideration.nombre }}
                          </div>
                        </div>
                      </div>
                      <v-btn icon size="x-small" variant="text" @click="activeConsideration = null">
                        <v-icon size="16">mdi-close</v-icon>
                      </v-btn>
                    </div>

                    <!-- Métricas de Impacto y Comparativa -->
                    <v-row dense class="my-1">
                      <v-col cols="6" sm="3">
                        <div class="pa-2 rounded-lg bg-grey-lighten-4 text-center">
                          <div class="text-caption text-grey-darken-1" style="font-size: 10px;">Delta Tiempo</div>
                          <div class="font-weight-bold text-caption" style="color: #1967d2;">
                            {{ activeConsideration.consideraciones.delta_tiempo || '+1.2 hrs de tránsito' }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <div class="pa-2 rounded-lg bg-grey-lighten-4 text-center">
                          <div class="text-caption text-grey-darken-1" style="font-size: 10px;">Costo Extra (Diesel/Casetas)</div>
                          <div class="font-weight-bold text-caption" style="color: #c5221f;">
                            + {{ (activeConsideration.consideraciones.delta_combustible_usd || 0) + (activeConsideration.consideraciones.delta_peajes_usd || 0) || activeConsideration.consideraciones.delta_costo_usd || 93 }} USD
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <div class="pa-2 rounded-lg bg-green-lighten-5 text-center">
                          <div class="text-caption text-green-darken-3" style="font-size: 10px;">Ahorro Penalización SLA</div>
                          <div class="font-weight-bold text-caption text-green-darken-3">
                            {{ (activeConsideration.consideraciones.ahorro_penalizacion_usd || 28000).toLocaleString() }} USD
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <div class="pa-2 rounded-lg bg-blue-lighten-5 text-center">
                          <div class="text-caption text-blue-darken-3" style="font-size: 10px;">Ahorro Neto Empresa</div>
                          <div class="font-weight-bold text-caption text-blue-darken-3">
                            {{ (activeConsideration.consideraciones.ahorro_neto_usd || 27907).toLocaleString() }} USD
                          </div>
                        </div>
                      </v-col>
                    </v-row>

                    <!-- Acciones de Aprobación -->
                    <div class="d-flex align-center justify-space-between mt-2 pt-2 border-t" style="gap: 8px;">
                      <div class="text-caption text-grey-darken-2" style="font-size: 11px;">
                        <v-icon size="14" color="#34A853" class="mr-1">mdi-shield-check</v-icon>
                        <b>Seguridad:</b> {{ activeConsideration.consideraciones.seguridad_vial || activeConsideration.consideraciones.seguridad || 'Alta (Vía de cuota satelital)' }}
                      </div>
                      <div class="d-flex align-center" style="gap: 6px;">
                        <v-btn size="small" variant="text" color="grey-darken-2" class="text-capitalize" @click="activeConsideration = null">
                          Descartar
                        </v-btn>
                        <v-btn
                          size="small"
                          color="#34A853"
                          variant="flat"
                          class="text-white text-capitalize font-weight-bold"
                          @click="applyReroute(activeConsideration)"
                          :loading="reroutingAnimation"
                        >
                          <v-icon start size="16">mdi-check-decagram</v-icon>
                          Aprobar y Re-enrutar Flota
                        </v-btn>
                      </div>
                    </div>
                  </v-card>
                </div>
              </v-slide-y-reverse-transition>

              <!-- Canvas del Mapa -->
              <div id="mapContainer" style="width: 100%; height: 100%; min-height: 100%; z-index: 1;"></div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- ========================================== -->
        <!-- LADO DERECHO: AGENTE CONVERSACIONAL       -->
        <!-- ========================================== -->
        <v-col cols="12" md="5" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column bg-grey-lighten-4 overflow-hidden" style="height: 100%; max-height: 100%; min-height: 0;">
            
            <!-- Título del Asistente -->
            <v-card-title class="bg-white pa-3 font-weight-bold d-flex align-center justify-space-between flex-shrink-0" style="color: #202124; border-bottom: 1px solid #eee;">
              <div class="d-flex align-center">
                <v-avatar color="#e8f0fe" size="28" class="mr-2">
                  <v-icon color="#4285F4" size="18">mdi-robot-outline</v-icon>
                </v-avatar>
                <div>
                  <div style="font-size: 14px; line-height: 1.2;">Agente de Logística</div>
                  <div class="text-caption text-grey" style="font-size: 10.5px;">Torre de Control • Rutas & Flotas en Tiempo Real</div>
                </div>
              </div>
              <v-chip size="x-small" color="primary" variant="outlined" class="font-weight-bold">
                Google Maps Tooling
              </v-chip>
            </v-card-title>

            <!-- Quick Prompts / Sugerencias de Consultas -->
            <div class="px-3 py-2 bg-white d-flex flex-wrap flex-shrink-0" style="gap: 6px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('🚨 ¿Cuáles son los transportes afectados por disrupciones críticas en carreteras y cuál es el plan de desvío?')">
                🚨 Envíos en Riesgo
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#34A853" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('¿Qué bodegas con inventario Plan B (Monterrey, CDMX, Veracruz) podemos activar para mitigar las entregas demoradas?')">
                📦 Stock Plan B
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#FBBC05" style="color: #9A6700 !important;" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('⚠️ ¿Qué hubs presentan falta de inventario (Toluca, Querétaro) y cómo reabastecerlos?')">
                ⚠️ Déficit en Hubs
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#4285F4" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('¿Cuál es el estatus general de todas las flotas de transporte en tránsito nacional?')">
                🚚 Flotas en Tránsito
              </v-chip>
            </div>

            <!-- Contenedor del Chat -->
            <v-card-text class="chat-container flex-grow-1 pa-3 overflow-y-auto custom-scrollbar" id="chat-box" style="min-height: 0; flex: 1 1 0; background-color: #f8f9fa;">
              <div v-for="(msg, index) in messages" :key="index" style="clear: both; width: 100%;">
                <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" :style="msg.role === 'ai' ? 'border-left: 4px solid #4285F4;' : ''">
                  <div v-if="msg.role === 'ai'" v-html="formatResponse(msg.content)"></div>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>
              <div v-if="loading" class="chat-bubble-ai" style="border-left: 4px solid #4285F4; clear: both;">
                <v-progress-circular indeterminate color="#4285F4" size="18" class="mr-2"></v-progress-circular>
                Analizando red logística y evaluando rutas alternas...
              </div>
            </v-card-text>

            <!-- Input de Preguntas -->
            <v-card-actions class="pa-3 bg-white flex-shrink-0" style="border-top: 1px solid #eee;">
              <v-text-field
                v-model="userInput"
                variant="outlined"
                density="compact"
                placeholder="Pregunta al agente sobre rutas, camiones, bloqueos o bodegas..."
                hide-details
                rounded="pill"
                @keyup.enter="sendMessage"
                color="#4285F4"
              >
                <template v-slot:append-inner>
                  <v-btn icon color="#4285F4" @click="sendMessage" :disabled="loading || !userInput.trim()" variant="text">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  `,
  data() {
    return {
      sessionId: 'demo-logistica-' + Math.random().toString(36).substr(2, 9),
      userInput: '',
      loading: false,
      messages: [
        {
          role: 'ai',
          content: '¡Hola! Soy tu **Agente Inteligente de Logística y Control de Rutas Terrestres**. Estoy monitoreando en tiempo real la red nacional de transporte (CEDIS Orígenes, Corredores Carreteros, Hubs de Destino y Flotas en tránsito).\\n\\n¿Deseas evaluar el impacto de las disrupciones viales activas o analizar planes de re-enrutamiento para los transportes en riesgo?'
        }
      ],
      map: null,
      masterData: (typeof LOGISTICA_MASTER_DATA !== 'undefined') ? JSON.parse(JSON.stringify(LOGISTICA_MASTER_DATA)) : {
        warehouses: [],
        hubs: [],
        routes: [],
        vehicles: [],
        alerts: []
      },
      activeFilter: 'all',
      selectedRoute: null,
      activeConsideration: null,
      rerouteSuccessMessage: '',
      reroutingAnimation: false,
      
      // Grupos de capas para gestión limpia en el mapa
      routesLayerGroup: null,
      altRoutesLayerGroup: null,
      markersLayerGroup: null,
      vehiclesLayerGroup: null,
      alertsLayerGroup: null,
      vehicleMarkers: {}
    };
  },
  computed: {
    disruptedRoutesCount() {
      return (this.masterData.routes || []).filter(r => r.estado === 'Disrumpida').length;
    },
    affectedVehiclesCount() {
      return (this.masterData.vehicles || []).filter(v => v.estado_operativo === 'Afectado').length;
    },
    planBWarehousesCount() {
      return (this.masterData.warehouses || []).filter(w => w.inventario_plan_b).length;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 250);
      if (this.$route.query.prompt) {
        this.userInput = this.$route.query.prompt;
        setTimeout(() => this.sendMessage(), 300);
      }
    });
  },
  unmounted() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },
  methods: {
    initMap() {
      const mapEl = document.getElementById('mapContainer');
      if (!mapEl) return;
      if (this.map) {
        this.map.invalidateSize();
        return;
      }

      // Inicializar mapa sin etiqueta ni atribución de Leaflet
      this.map = L.map('mapContainer', {
        attributionControl: false,
        zoomControl: true,
        renderer: L.svg({ padding: 0.5 })
      }).setView([23.6345, -102.5528], 5);

      // Capa de Google Maps oficial (limpia, nítida y rápida)
      L.tileLayer('https://mt0.google.com/vt/lyrs=m&hl=es&x={x}&y={y}&z={z}', {
        maxZoom: 20
      }).addTo(this.map);

      // Crear grupos de capas dedicados
      this.routesLayerGroup = L.featureGroup().addTo(this.map);
      this.altRoutesLayerGroup = L.featureGroup().addTo(this.map);
      this.markersLayerGroup = L.featureGroup().addTo(this.map);
      this.vehiclesLayerGroup = L.featureGroup().addTo(this.map);
      this.alertsLayerGroup = L.featureGroup().addTo(this.map);

      // Clic en fondo de mapa deselecciona
      this.map.on('click', (e) => {
        if (e.originalEvent && !e.originalEvent.target.closest('.custom-map-marker')) {
          this.clearActiveSelection();
        }
      });

      this.renderMasterTopology();
    },

    setFilter(filterType) {
      this.activeFilter = filterType;
      this.renderMasterTopology();
    },

    resetMapView() {
      this.clearActiveSelection();
      if (this.map) {
        this.map.flyTo([23.6345, -102.5528], 5.2, { duration: 0.8 });
      }
    },

    clearActiveSelection() {
      this.selectedRoute = null;
      this.activeConsideration = null;
      if (this.altRoutesLayerGroup) this.altRoutesLayerGroup.clearLayers();
      this.renderMasterTopology();
    },

    renderMasterTopology() {
      if (!this.map) return;

      // Limpiar capas previas
      this.routesLayerGroup.clearLayers();
      this.markersLayerGroup.clearLayers();
      this.vehiclesLayerGroup.clearLayers();
      this.alertsLayerGroup.clearLayers();
      this.vehicleMarkers = {};

      const showWarehouses = this.activeFilter === 'all' || this.activeFilter === 'warehouses';
      const showVehicles = this.activeFilter === 'all' || this.activeFilter === 'vehicles';
      const showDisruptedOnly = this.activeFilter === 'disrupted';

      // 1. RENDERIZAR RUTAS / CORREDORES TERRESTRES CONTINUOS
      (this.masterData.routes || []).forEach(route => {
        if (showDisruptedOnly && route.estado !== 'Disrumpida') return;

        const isDisrupted = route.estado === 'Disrumpida';
        const polyline = L.polyline(route.coordenadas, {
          color: route.color || (isDisrupted ? '#EA4335' : '#4285F4'),
          weight: isDisrupted ? 4.5 : 3.5,
          opacity: isDisrupted ? 0.9 : 0.75,
          dashArray: route.dashArray || null
        }).addTo(this.routesLayerGroup);

        const statusLabel = isDisrupted ? '🚨 RUTA DISRUMPIDA' : '✅ CORREDOR OPERATIVO';
        polyline.bindTooltip(`
          <div style="font-family: Roboto, sans-serif; font-size: 11.5px; padding: 2px;">
            <b style="color: ${isDisrupted ? '#EA4335' : '#1967d2'};">${statusLabel}</b><br>
            <b>${route.nombre}</b><br>
            <span>Distancia: ${route.distancia_km} km | Tiempo base: ${route.tiempo_base_hrs} hrs</span>
            ${route.estado_motivo ? `<br><span style="color: #EA4335; font-size: 10.5px;"><b>Motivo:</b> ${route.estado_motivo}</span>` : ''}
          </div>
        `, { sticky: true, opacity: 0.95 });

        polyline.on('click', () => {
          this.selectRoute(route);
        });
      });

      // 2. RENDERIZAR BODEGAS / CEDIS (ORÍGENES)
      if (showWarehouses) {
        (this.masterData.warehouses || []).forEach(wh => {
          const isPlanB = wh.inventario_plan_b;
          const bgGradient = isPlanB ? 'linear-gradient(135deg, #137333, #34A853)' : 'linear-gradient(135deg, #1a73e8, #4285F4)';
          const badgeText = isPlanB ? 'CEDIS (Plan B)' : 'CEDIS Central';

          const markerHtml = `
            <div class="custom-map-marker" style="background: ${bgGradient}; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid white; cursor: pointer; transition: transform 0.2s;">
              <i class="mdi ${wh.icono || 'mdi-warehouse'}" style="font-size: 19px;"></i>
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-icon',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          });

          const tooltipHtml = `
            <div style="font-family: Roboto, sans-serif; min-width: 190px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="background: #e6f4ea; color: #137333; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  ${badgeText}
                </span>
                <span style="color: #5f6368; font-size: 10.5px; font-weight: 600;">${wh.id}</span>
              </div>
              <div style="font-weight: bold; font-size: 13px; color: #202124; margin-bottom: 3px;">${wh.nombre}</div>
              <div style="font-size: 11px; color: #3c4043; line-height: 1.45;">
                <b>Ubicación:</b> ${wh.ubicacion}<br>
                <b>Capacidad:</b> ${wh.capacidad_m2.toLocaleString()} m²<br>
                <b>Stock:</b> ${wh.stock_descripcion}<br>
                ${wh.inventario_plan_b ? `<b style="color: #137333;">Disponibilidad Plan B:</b> ${wh.unidades_disponibles_plan_b} uds` : ''}
              </div>
            </div>
          `;

          const marker = L.marker([wh.lat, wh.lon], { icon: customIcon })
            .addTo(this.markersLayerGroup)
            .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -18], opacity: 0.98 });

          marker.on('click', () => {
            this.askLogisticaPrompt(`¿Cuál es la disponibilidad de inventario y capacidad de despacho Plan B en ${wh.nombre} (${wh.id}) para contingencias terrestres?`);
          });
        });

        // 3. RENDERIZAR HUBS LOGÍSTICOS (DESTINOS)
        (this.masterData.hubs || []).forEach(hub => {
          const isFalta = hub.stock_status === 'Falta_Inventario';
          const bgGradient = isFalta ? 'linear-gradient(135deg, #b06000, #FBBC05)' : 'linear-gradient(135deg, #5f6368, #80868b)';
          const badgeBg = isFalta ? '#fef7e0' : '#f1f3f4';
          const badgeColor = isFalta ? '#b06000' : '#3c4043';

          const markerHtml = `
            <div class="custom-map-marker" style="background: ${bgGradient}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2.5px solid white; cursor: pointer;">
              <i class="mdi ${hub.icono || 'mdi-transit-connection-variant'}" style="font-size: 18px;"></i>
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-icon',
            iconSize: [34, 34],
            iconAnchor: [17, 17]
          });

          const tooltipHtml = `
            <div style="font-family: Roboto, sans-serif; min-width: 180px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="background: ${badgeBg}; color: ${badgeColor}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  Hub Destino
                </span>
                <span style="color: #5f6368; font-size: 10.5px; font-weight: 600;">${hub.id}</span>
              </div>
              <div style="font-weight: bold; font-size: 13px; color: #202124; margin-bottom: 3px;">${hub.nombre}</div>
              <div style="font-size: 11px; color: #3c4043; line-height: 1.45;">
                <b>Cobertura:</b> ${hub.cobertura}<br>
                <b>Estatus:</b> ${hub.stock_status}<br>
                <span style="color: ${isFalta ? '#c5221f' : '#3c4043'};"><b>Detalle:</b> ${hub.stock_detalle}</span>
              </div>
            </div>
          `;

          const marker = L.marker([hub.lat, hub.lon], { icon: customIcon })
            .addTo(this.markersLayerGroup)
            .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -18], opacity: 0.98 });

          marker.on('click', () => {
            this.askLogisticaPrompt(`¿Cuál es el estatus de recepción y faltante de inventario en ${hub.nombre} (${hub.id})?`);
          });
        });
      }

      // 4. RENDERIZAR ALERTAS VIALES (VINCULADAS A SEGMENTOS OPERATIVOS)
      (this.masterData.alerts || []).forEach(alert => {
        const markerHtml = `
          <div class="custom-map-marker" style="background: #EA4335; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 0 0 6px rgba(234,67,53,0.3), 0 4px 12px rgba(0,0,0,0.4); border: 2.5px solid white; cursor: pointer; animation: pulse 2s infinite;">
            <i class="mdi ${alert.icono || 'mdi-alert-octagon'}" style="font-size: 20px;"></i>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-icon',
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const tooltipHtml = `
          <div style="font-family: Roboto, sans-serif; min-width: 210px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: #fce8e6; color: #c5221f; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                ALERTA OPERATIVA CRÍTICA
              </span>
              <span style="color: #5f6368; font-size: 10.5px; font-weight: 600;">${alert.id}</span>
            </div>
            <div style="font-weight: bold; font-size: 13px; color: #202124; margin-bottom: 3px;">${alert.tipo_incidencia}</div>
            <div style="font-size: 11px; color: #3c4043; line-height: 1.45;">
              <b>Ruta Afectada:</b> ${alert.ruta_nombre}<br>
              <b>Segmento:</b> ${alert.segmento}<br>
              <b>Transportes Afectados:</b> ${alert.vehiculos_afectados_ids.join(', ')}<br>
              <b style="color: #EA4335;">Retraso Estimado:</b> +${alert.retraso_estimado_hrs} hrs<br>
              <b style="color: #EA4335;">Penalización en Riesgo:</b> $${alert.impacto_financiero_usd.toLocaleString()} USD
            </div>
          </div>
        `;

        const marker = L.marker([alert.lat, alert.lon], { icon: customIcon })
          .addTo(this.alertsLayerGroup)
          .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -20], opacity: 0.98 });

        marker.on('click', () => {
          const matchingRoute = (this.masterData.routes || []).find(r => r.id === alert.ruta_id);
          if (matchingRoute) this.selectRoute(matchingRoute);
          this.askLogisticaPrompt(`🚨 Analiza el impacto operativo y financiero del bloqueo/alerta en ${alert.ruta_nombre} (${alert.segmento}). ¿Qué ruta alterna y plan de desvío se recomienda para las unidades ${alert.vehiculos_afectados_ids.join(', ')}?`);
        });
      });

      // 5. RENDERIZAR VEHÍCULOS / FLOTAS EN TRÁNSITO
      if (showVehicles) {
        (this.masterData.vehicles || []).forEach(v => {
          if (showDisruptedOnly && v.estado_operativo !== 'Afectado') return;

          const isAfectado = v.estado_operativo === 'Afectado';
          const isReenrutado = v.estado_operativo === 'Reenrutado';
          
          let bgColor = '#4285F4';
          let iconName = 'mdi-truck-fast';
          let badgeText = 'En Ruta OK';
          let badgeBg = '#e8f0fe';
          let badgeColor = '#1967d2';

          if (isReenrutado) {
            bgColor = '#34A853';
            iconName = 'mdi-truck-check';
            badgeText = 'Re-enrutado';
            badgeBg = '#e6f4ea';
            badgeColor = '#137333';
          } else if (isAfectado) {
            bgColor = '#EA4335';
            iconName = 'mdi-truck-alert';
            badgeText = 'Detenido / Riesgo';
            badgeBg = '#fce8e6';
            badgeColor = '#c5221f';
          }

          const markerHtml = `
            <div class="custom-map-marker vehicle-marker-${v.id}" style="background: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white; cursor: pointer; transition: all 0.5s ease;">
              <i class="mdi ${iconName}" style="font-size: 18px;"></i>
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-icon',
            iconSize: [34, 34],
            iconAnchor: [17, 17]
          });

          const tooltipHtml = `
            <div style="font-family: Roboto, sans-serif; min-width: 200px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="background: ${badgeBg}; color: ${badgeColor}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  ${badgeText}
                </span>
                <span style="color: #5f6368; font-size: 10.5px; font-weight: 600;">${v.id}</span>
              </div>
              <div style="font-weight: bold; font-size: 13px; color: #202124; margin-bottom: 3px;">${v.nombre}</div>
              <div style="font-size: 11px; color: #3c4043; line-height: 1.45;">
                <b>Carga:</b> ${v.carga}<br>
                <b>Cliente:</b> ${v.cliente}<br>
                <b>Origen ➔ Destino:</b> ${v.origen} ➔ ${v.destino}<br>
                <b>Progreso:</b> ${v.progreso_pct}% | <b>Velocidad:</b> ${v.velocidad_kmh} km/h<br>
                <b>Estatus:</b> ${v.estado_transito}<br>
                ${v.penalizacion_usd > 0 ? `<b style="color: #EA4335;">Penalización en Riesgo:</b> $${v.penalizacion_usd.toLocaleString()} USD` : ''}
              </div>
            </div>
          `;

          const marker = L.marker([v.posicion_actual.lat, v.posicion_actual.lon], { icon: customIcon })
            .addTo(this.vehiclesLayerGroup)
            .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -18], opacity: 0.98 });

          this.vehicleMarkers[v.id] = marker;

          marker.on('click', () => {
            const matchingRoute = (this.masterData.routes || []).find(r => r.id === v.ruta_id);
            if (matchingRoute) this.selectRoute(matchingRoute);
            this.askLogisticaPrompt(`¿Cuál es el estatus y plan de contingencia para la unidad ${v.nombre} (${v.id}) que transporta ${v.carga} para ${v.cliente}?`);
          });
        });
      }
    },

    selectRoute(route) {
      if (!this.map) return;

      this.selectedRoute = route;
      this.altRoutesLayerGroup.clearLayers();

      // Si la ruta tiene alternativa sugerida, dibujarla en verde brillante
      if (route.alternativa) {
        const altRoute = route.alternativa;
        const altPolyline = L.polyline(altRoute.coordenadas, {
          color: altRoute.color || '#34A853',
          weight: 4.5,
          opacity: 0.95,
          dashArray: altRoute.dashArray || '6, 6'
        }).addTo(this.altRoutesLayerGroup);

        altPolyline.bindTooltip(`
          <div style="font-family: Roboto, sans-serif; font-size: 11.5px; padding: 2px;">
            <b style="color: #137333;">🛣️ RUTA ALTERNATIVA SUGERIDA</b><br>
            <b>${altRoute.nombre}</b><br>
            <span>Distancia: ${altRoute.distancia_km} km | ETA Estimado: ${altRoute.tiempo_estimado_hrs} hrs</span>
          </div>
        `, { sticky: true, opacity: 0.98 });

        this.activeConsideration = {
          ...altRoute,
          ruta_origen_id: route.id,
          ruta_origen_nombre: route.nombre
        };
      }

      // Ajustar la vista suavemente a la extensión de la ruta sin distorsiones
      try {
        const allCoords = [...route.coordenadas];
        if (route.alternativa && route.alternativa.coordenadas) {
          allCoords.push(...route.alternativa.coordenadas);
        }
        const bounds = L.latLngBounds(allCoords);
        if (bounds.isValid()) {
          this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: true, duration: 0.6 });
        }
      } catch (e) {
        console.warn('Error al ajustar límites de ruta:', e);
      }
    },

    applyReroute(consideration) {
      if (!consideration) return;

      this.reroutingAnimation = true;
      const routeId = consideration.ruta_origen_id || (this.selectedRoute ? this.selectedRoute.id : null);
      
      // Encontrar vehículos en la ruta
      const affectedVehicles = (this.masterData.vehicles || []).filter(v => v.ruta_id === routeId);
      const altCoords = consideration.coordenadas || (this.selectedRoute?.alternativa?.coordenadas);

      // Animar el desplazamiento del vehículo hacia el vector de la ruta alterna
      if (affectedVehicles.length > 0 && altCoords && altCoords.length > 0) {
        const targetCoord = altCoords[Math.floor(altCoords.length / 2)];
        
        affectedVehicles.forEach((veh, idx) => {
          const marker = this.vehicleMarkers[veh.id];
          if (marker) {
            // Animar transición
            const startLat = veh.posicion_actual.lat;
            const startLon = veh.posicion_actual.lon;
            const endLat = targetCoord[0] + (idx * 0.05);
            const endLon = targetCoord[1] + (idx * 0.05);

            let step = 0;
            const steps = 20;
            const interval = setInterval(() => {
              step++;
              const curLat = startLat + (endLat - startLat) * (step / steps);
              const curLon = startLon + (endLon - startLon) * (step / steps);
              marker.setLatLng([curLat, curLon]);
              
              if (step >= steps) {
                clearInterval(interval);
                veh.posicion_actual = { lat: endLat, lon: endLon };
                veh.estado_operativo = 'Reenrutado';
                veh.estado_transito = 'En tránsito por Ruta Alterna (ETA Recuperado)';
                veh.penalizacion_usd = 0;
                
                // Actualizar icono visual
                const el = document.querySelector(`.vehicle-marker-${veh.id}`);
                if (el) {
                  el.style.backgroundColor = '#34A853';
                  el.innerHTML = '<i class="mdi mdi-truck-check" style="font-size: 18px;"></i>';
                }
              }
            }, 30);
          }
        });
      }

      setTimeout(() => {
        this.reroutingAnimation = false;
        this.activeConsideration = null;
        this.rerouteSuccessMessage = `✅ ¡Re-enrutamiento aprobado! ${affectedVehicles.map(v => v.id).join(', ')} incorporados al corredor alterno. Penalización evitada.`;
        
        // Agregar confirmación al chat
        this.messages.push({
          role: 'ai',
          content: `### 🚀 Re-enrutamiento Operativo Aplicado con Éxito\n\n- **Ruta Alterna Activada:** ${consideration.nombre || consideration.alt_route_name}\n- **Unidades Desviadas:** ${affectedVehicles.map(v => `**${v.nombre}** (${v.id})`).join(', ')}\n- **Ahorro Neto Estimado:** $${(consideration.consideraciones?.ahorro_neto_usd || 27907).toLocaleString()} USD\n- **Nuevo ETA:** En tiempo contractual sin penalización SLA.\n\n*Las unidades han actualizado su trayectoria en el mapa en tiempo real.*`
        });
        this.scrollToBottom();

        // Ocultar mensaje de éxito después de 6 segundos
        setTimeout(() => {
          this.rerouteSuccessMessage = '';
        }, 6000);
      }, 1000);
    },

    askLogisticaPrompt(promptText) {
      this.userInput = promptText;
      this.$nextTick(() => {
        const inputEl = document.querySelector('input[placeholder*="Pregunta al agente"]');
        if (inputEl) inputEl.focus();
      });
    },

    scrollToBottom() {
      setTimeout(() => {
        const chatBox = document.getElementById('chat-box');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 100);
    },

    async sendMessage() {
      if (!this.userInput.trim()) return;

      const text = this.userInput;
      this.messages.push({ role: 'user', content: text });
      this.userInput = '';
      this.loading = true;
      this.scrollToBottom();

      try {
        const response = await axios.post('/api/chat/logistica', {
          session_id: this.sessionId,
          message: text
        });

        const data = response.data;
        const aiMessage = data.response || 'Respuesta generada.';
        this.messages.push({ role: 'ai', content: aiMessage });

        // Si la IA emitió una sugerencia de re-enrutamiento estructurada (action_payload)
        if (data.action_payload && data.action_payload.action === 'suggest_reroute') {
          const act = data.action_payload;
          const matchingRoute = (this.masterData.routes || []).find(r => r.id === act.route_id);
          if (matchingRoute) {
            this.selectRoute(matchingRoute);
          }
        }
      } catch (error) {
        console.error('Error en Agente de Logística:', error);
        const errDetail = error.response?.data?.detail || error.message || 'Error de conexión con Gemini.';
        this.messages.push({
          role: 'ai',
          content: `⚠️ **Error en el Agente de Logística:**\n\n${errDetail}`
        });
      } finally {
        this.loading = false;
        this.scrollToBottom();
      }
    },

    formatResponse(text) {
      return marked.parse(text);
    }
  }
};
