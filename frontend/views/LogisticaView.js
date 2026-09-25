// LogisticaView.js - Vista de Logística & Nearshoring (Torre de Control Terrestre y Copiloto)

const LogisticaView = {
  template: `
    <v-container class="pa-2 px-3 flex-grow-1 d-flex flex-column fill-height" style="max-width: 100%; box-sizing: border-box; overflow: hidden;">
      <v-row class="flex-grow-1 my-0" style="height: 100%; max-height: 100%; min-height: 0;">
        <!-- Lado Izquierdo: Mapa de Control Logístico -->
        <v-col cols="12" md="7" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column overflow-hidden bg-white" style="height: 100%; max-height: 100%; min-height: 0;">
            <v-card-title class="bg-white pa-3 border-b d-flex align-center justify-space-between flex-wrap flex-shrink-0" style="border-bottom: 1px solid #e8eaed; gap: 8px;">
              <div class="d-flex align-center">
                <v-avatar color="#e8f0fe" size="36" class="mr-3">
                  <v-icon color="#4285F4">mdi-map-marker-path</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold" style="color: #202124;">Torre de Control: Envíos & Logística Terrestre</div>
                </div>
              </div>
              <div class="d-flex align-center" style="gap: 6px;">
                <v-chip color="error" size="small" variant="flat" class="font-weight-bold">
                  <v-icon start size="14">mdi-alert-octagon</v-icon> {{ alertCount }} Alertas Críticas
                </v-chip>
                <v-chip color="#FBBC05" size="small" variant="flat" class="font-weight-bold" style="color: #202124 !important;">
                  <v-icon start size="14">mdi-package-variant-remove</v-icon> {{ faltaInvCount }} Falta Stock
                </v-chip>
                <v-chip color="#4285F4" size="small" variant="tonal" class="font-weight-bold">
                  <v-icon start size="14">mdi-truck-fast</v-icon> {{ normalCount }} Flotas OK
                </v-chip>
              </div>
            </v-card-title>
            <v-card-text class="flex-grow-1 pa-0 position-relative" style="min-height: 0; height: 100%;">
              <div v-if="selectedRouteName" class="position-absolute" style="top: 12px; right: 12px; z-index: 999;">
                <v-chip color="white" elevation="3" size="small" closable @click:close="clearActiveRoute" class="font-weight-bold" style="color: #202124;">
                  <v-icon start size="14" color="#4285F4">mdi-road-variant</v-icon> Ruta activa: {{ selectedRouteName }}
                </v-chip>
              </div>
              <div id="mapContainer" style="width: 100%; height: 100%; min-height: 100%; z-index: 1;"></div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Lado Derecho: Chatbot de Logística -->
        <v-col cols="12" md="5" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column bg-grey-lighten-4 overflow-hidden" style="height: 100%; max-height: 100%; min-height: 0;">
            <v-card-title class="bg-white pa-3 font-weight-bold d-flex align-center justify-space-between flex-shrink-0" style="color: #202124; border-bottom: 1px solid #eee;">
              <div class="d-flex align-center">
                <v-icon color="#4285F4" class="mr-2">mdi-robot-outline</v-icon>
                Agente de Logística
              </div>
              <v-chip size="x-small" color="primary" variant="outlined">BigQuery Connected</v-chip>
            </v-card-title>

            <!-- Quick Prompts -->
            <div class="px-3 py-2 bg-white d-flex flex-wrap flex-shrink-0" style="gap: 6px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('🚨 ¿Cuáles son los envíos terrestres con alerta crítica y cómo mitigarlos?')">
                🚨 Envíos en riesgo
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#FBBC05" style="color: #9A6700 !important;" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('⚠️ ¿Qué bodegas presentan falta de inventario y qué impacto tienen?')">
                ⚠️ Falta de Stock
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#34A853" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('¿Qué bodegas con stock disponible Plan B podemos activar para despachar pedidos?')">
                📦 Inventario Plan B
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#4285F4" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('¿Cuál es el estatus general de las flotas en tránsito terrestre nacional?')">
                🚚 Flotas en Ruta
              </v-chip>
            </div>

            <!-- Mensajes -->
            <v-card-text class="chat-container flex-grow-1 pa-3 overflow-y-auto custom-scrollbar" id="chat-box" style="min-height: 0; flex: 1 1 0; background-color: #f8f9fa;">
              <div v-for="(msg, index) in messages" :key="index" style="clear: both; width: 100%;">
                <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" :style="msg.role === 'ai' ? 'border-left: 4px solid #4285F4;' : ''">
                  <div v-if="msg.role === 'ai'" v-html="formatResponse(msg.content)"></div>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>
              <div v-if="loading" class="chat-bubble-ai" style="border-left: 4px solid #4285F4; clear: both;">
                <v-progress-circular indeterminate color="#4285F4" size="18" class="mr-2"></v-progress-circular>
                Consultando BigQuery & Modelos de Tránsito Terrestre...
              </div>
            </v-card-text>

            <!-- Input -->
            <v-card-actions class="pa-3 bg-white flex-shrink-0" style="border-top: 1px solid #eee;">
              <v-text-field
                v-model="userInput"
                variant="outlined"
                density="compact"
                placeholder="Escribe una pregunta para el agente logístico..."
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
        { role: 'ai', content: '¡Hola! Soy tu Agente de Logística. Estoy monitoreando en tiempo real las rutas de transporte terrestre nacional, niveles de inventario en bodegas y alertas viales en México. ¿En qué te puedo ayudar?' }
      ],
      map: null,
      mapData: [],
      activeRouteLayer: null,
      selectedRouteName: ''
    };
  },
  computed: {
    alertCount() {
      return this.mapData.filter(i => i.criticidad === 'Crítica' || i.criticidad === 'Alerta' || i.tipo === 'alerta').length;
    },
    faltaInvCount() {
      return this.mapData.filter(i => i.criticidad === 'Falta Inventario' || i.tipo === 'falta_stock').length;
    },
    normalCount() {
      return this.mapData.filter(i => i.criticidad === 'Normal' || i.tipo === 'normal').length;
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
      
      this.map = L.map('mapContainer').setView([23.6345, -102.5528], 5);
      
      L.tileLayer('https://mt0.google.com/vt/lyrs=m&hl=es&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        maxZoom: 20
      }).addTo(this.map);

      // Limpiar ruta activa al hacer clic en el fondo del mapa
      this.map.on('click', (e) => {
        if (e.originalEvent && (!e.originalEvent.target || !e.originalEvent.target.closest('.custom-leaflet-icon'))) {
          this.clearActiveRoute();
        }
      });

      this.loadMapData();
    },
    getRouteData(item) {
      const routesMap = {
        // 1. Alertas Críticas (Rojo)
        "ENV-1001": [
          {
            name: "Ruta 180 (Afectada por Inundación)",
            coords: [[19.1738, -96.1342], [19.7500, -96.5000], [20.5332, -97.4560], [20.9500, -97.4000], [22.2331, -97.8611], [25.6866, -100.3161]],
            color: '#EA4335',
            dashArray: '6, 6',
            weight: 4,
            opacity: 0.9
          },
          {
            name: "Ruta Alterna Plan B (Bodega MTY -> CEDIS Cuautitlán)",
            coords: [[25.7785, -100.1876], [25.4232, -100.9922], [22.1565, -100.9855], [20.5888, -100.3899], [19.6711, -99.1783]],
            color: '#34A853',
            dashArray: '4, 6',
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1004": [
          {
            name: "Corredor 57D (Tramo SLP Bloqueado)",
            coords: [[19.4326, -99.1332], [20.5888, -100.3899], [22.1565, -100.9855], [23.6500, -100.6400], [25.4232, -100.9922], [25.6866, -100.3161]],
            color: '#EA4335',
            dashArray: '6, 6',
            weight: 4,
            opacity: 0.9
          },
          {
            name: "Desvío Alterno Vía Aguascalientes - Zacatecas",
            coords: [[20.5888, -100.3899], [21.8853, -102.2916], [22.7709, -102.5832], [25.5428, -103.4068], [25.6866, -100.3161]],
            color: '#34A853',
            dashArray: '4, 6',
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1006": [
          {
            name: "Corredor Fronterizo Nuevo Laredo (Congestión)",
            coords: [[25.6866, -100.3161], [26.5000, -100.0000], [27.4864, -99.5075], [27.5200, -99.4900]],
            color: '#EA4335',
            dashArray: '6, 6',
            weight: 4,
            opacity: 0.9
          },
          {
            name: "Cruce Alterno Puente Colombia (Nuevo León)",
            coords: [[25.6866, -100.3161], [26.8500, -100.4500], [27.7000, -99.7500]],
            color: '#34A853',
            dashArray: '4, 6',
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1008": [
          {
            name: "Autopista México-Puebla 150D (Derrumbe Km 72 Río Frío)",
            coords: [[19.4326, -99.1332], [19.3486, -98.6811], [19.0414, -98.2063], [18.8500, -97.1000], [19.1738, -96.1342]],
            color: '#EA4335',
            dashArray: '6, 6',
            weight: 4,
            opacity: 0.9
          },
          {
            name: "Ruta Alterna Vía Arco Norte / Texcoco",
            coords: [[19.6711, -99.1783], [19.6000, -98.8000], [19.4000, -98.3000], [19.0414, -98.2063]],
            color: '#34A853',
            dashArray: '4, 6',
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1013": [
          {
            name: "Autopista Siglo XXI (Falla Mecánica de Convoy y Cierre)",
            coords: [[19.7060, -101.1950], [19.4167, -102.0667], [18.7500, -102.1000], [17.9600, -102.2000]],
            color: '#EA4335',
            dashArray: '6, 6',
            weight: 4,
            opacity: 0.9
          }
        ],
        "ENV-1014": [
          {
            name: "Autopista 15D Guadalajara - Tepic (Deslave en Barrancas)",
            coords: [[20.6597, -103.3496], [20.8800, -103.8300], [20.9500, -104.0500], [21.5000, -104.9000], [23.2494, -106.4111]],
            color: '#EA4335',
            dashArray: '6, 6',
            weight: 4,
            opacity: 0.9
          }
        ],

        // 2. Falta de Inventario (Amarillo)
        "BOD-TOL": [
          {
            name: "Línea de Reabastecimiento Toluca Lerma <-> CEDIS Cuautitlán",
            coords: [[19.2826, -99.5132], [19.3000, -99.3600], [19.3600, -99.2600], [19.4326, -99.1332], [19.6711, -99.1783]],
            color: '#FBBC05',
            dashArray: '5, 5',
            weight: 3.5,
            opacity: 0.9
          }
        ],
        "BOD-QRO": [
          {
            name: "Línea de Reabastecimiento Querétaro Hub <-> CEDIS Bajío / CDMX",
            coords: [[19.6711, -99.1783], [20.3900, -99.9900], [20.5888, -100.3899], [20.5200, -100.8100], [20.6700, -101.3500], [20.9167, -101.4000]],
            color: '#FBBC05',
            dashArray: '5, 5',
            weight: 3.5,
            opacity: 0.9
          }
        ],
        "BOD-GDL": [
          {
            name: "Corredor Industrial Guadalajara El Salto <-> Bajío",
            coords: [[20.5186, -103.2355], [20.6200, -103.0700], [20.8100, -102.7600], [21.3500, -101.9300], [20.9167, -101.4000], [20.5888, -100.3899]],
            color: '#FBBC05',
            dashArray: '5, 5',
            weight: 3.5,
            opacity: 0.9
          },
          {
            name: "Línea de Conexión El Salto <-> Manzanillo",
            coords: [[20.5186, -103.2355], [20.4200, -103.5900], [19.7047, -103.4617], [19.2433, -103.7250], [19.0522, -104.3158]],
            color: '#FBBC05',
            dashArray: '5, 5',
            weight: 3,
            opacity: 0.75
          }
        ],

        // 3. Bodegas Plan B / Stock Disponible (Verde)
        "BOD-MTY": [
          {
            name: "Red de Despacho Inmediato Monterrey Apodaca (Plan B)",
            coords: [[25.7785, -100.1876], [25.6866, -100.3161], [25.4232, -100.9922], [23.6500, -100.6400], [22.1565, -100.9855], [20.5888, -100.3899], [19.6711, -99.1783]],
            color: '#34A853',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "BOD-CDMX": [
          {
            name: "Red de Despacho Inmediato Cuautitlán CDMX (Plan B)",
            coords: [[19.6711, -99.1783], [19.2826, -99.5132], [20.5888, -100.3899], [19.0414, -98.2063]],
            color: '#34A853',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "BOD-VER": [
          {
            name: "Red de Despacho Terrestre Veracruz Puerto (Plan B)",
            coords: [[19.1738, -96.1342], [18.8900, -96.9300], [18.8500, -97.1000], [19.0414, -98.2063], [19.4326, -99.1332]],
            color: '#34A853',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],

        // 4. Flotas en Tránsito Normal (Azul)
        "ENV-1002": [
          {
            name: "Ruta Carretera 57 (Monterrey - Saltillo)",
            coords: [[25.6866, -100.3161], [25.4232, -100.9922], [24.0000, -101.0000]],
            color: '#4285F4',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1003": [
          {
            name: "Ruta Corredor Occidente (Guadalajara - Bajío)",
            coords: [[20.6597, -103.3496], [21.1200, -101.6800], [20.5888, -100.3899]],
            color: '#4285F4',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1005": [
          {
            name: "Ruta Corredor Pacífico 15D (Hermosillo - Nogales)",
            coords: [[27.4800, -109.9300], [29.0729, -110.9559], [30.7000, -111.1000], [31.3086, -110.9422]],
            color: '#4285F4',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1007": [
          {
            name: "Ruta Carretera 45D (Querétaro - Silao)",
            coords: [[20.5888, -100.3899], [20.5300, -100.8100], [20.5700, -101.2000], [20.9167, -101.4000]],
            color: '#4285F4',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1009": [
          {
            name: "Ruta Autopista del Sol (CDMX - Cuernavaca - Acapulco)",
            coords: [[19.4326, -99.1332], [18.9242, -99.2216], [17.5500, -99.5000], [16.8531, -99.8237]],
            color: '#4285F4',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1010": [
          {
            name: "Ruta Carretera 180D (Mérida - Cancún)",
            coords: [[19.8301, -90.5349], [20.9674, -89.5926], [20.6900, -88.2000], [21.1619, -86.8515]],
            color: '#4285F4',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1011": [
          {
            name: "Ruta Carretera Fed 45 (Torreón - Chihuahua - Cd. Juárez)",
            coords: [[25.5428, -103.4068], [27.1300, -104.9100], [28.6353, -106.0889], [31.6904, -106.4245]],
            color: '#4285F4',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ],
        "ENV-1012": [
          {
            name: "Ruta Corredor Fronterizo 2D (Tijuana - Mexicali - La Rumorosa)",
            coords: [[32.5149, -117.0382], [32.5724, -116.6267], [32.5300, -116.0500], [32.6245, -115.4523]],
            color: '#4285F4',
            dashArray: null,
            weight: 3.5,
            opacity: 0.85
          }
        ]
      };

      return routesMap[item.id] || null;
    },
    showRouteForMarker(item) {
      this.clearActiveRoute();
      
      const routeList = this.getRouteData(item);
      if (!routeList || routeList.length === 0) return;

      this.activeRouteLayer = L.featureGroup().addTo(this.map);
      this.selectedRouteName = item.nombre;

      routeList.forEach(r => {
        const polyline = L.polyline(r.coords, {
          color: r.color,
          weight: r.weight || 3.5,
          opacity: r.opacity || 0.85,
          dashArray: r.dashArray || null
        }).addTo(this.activeRouteLayer);

        polyline.bindTooltip(`<b>${r.name}</b>`, { sticky: true, opacity: 0.95 });
      });

      // Enfocar suavemente el mapa en el corredor seleccionado asegurando que el marcador esté visible
      try {
        const bounds = this.activeRouteLayer.getBounds();
        bounds.extend([item.lat, item.lon]);
        if (bounds.isValid()) {
          this.map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 7, duration: 0.8 });
        } else {
          this.map.flyTo([item.lat, item.lon], 6.5, { duration: 0.8 });
        }
      } catch (e) {
        this.map.flyTo([item.lat, item.lon], 6.5, { duration: 0.8 });
      }
    },
    clearActiveRoute() {
      if (this.activeRouteLayer && this.map) {
        this.map.removeLayer(this.activeRouteLayer);
        this.activeRouteLayer = null;
      }
      this.selectedRouteName = '';
    },
    async loadMapData() {
      let data = [
        // 1. Alertas Críticas (Rojo)
        { id: "ENV-1001", nombre: "Carretera Federal 180 (Costa Poza Rica - Tuxpan)", lat: 20.5332, lon: -97.4560, estado: "Retrasado (Inundación y Lluvias Torrenciales)", cliente: "AutoParts Premier", producto: "Autopartes - Motor V6", penalizacion_usd: 45000, criticidad: "Crítica", tipo: "alerta" },
        { id: "ENV-1004", nombre: "Autopista 57D (San Luis Potosí - Matehuala)", lat: 22.1565, lon: -100.9855, estado: "Retrasado (Bloqueo Carretero y Obras)", cliente: "Industrias Metálicas del Norte", producto: "Bobinas de Acero Automotriz", penalizacion_usd: 28000, criticidad: "Crítica", tipo: "alerta" },
        { id: "ENV-1006", nombre: "Puente Comercio Mundial (Nuevo Laredo)", lat: 27.4864, lon: -99.5075, estado: "Congestión Aduanal Crítica (>8 hrs espera)", cliente: "ExportLogix USA", producto: "Arneses Eléctricos Automotrices", penalizacion_usd: 18500, criticidad: "Crítica", tipo: "alerta" },
        { id: "ENV-1008", nombre: "Autopista México-Puebla (Km 72 Río Frío)", lat: 19.3486, lon: -98.6811, estado: "Retraso (Derrumbe por Lluvias Intensas)", cliente: "FarmoQuímica Central", producto: "Insumos Médicos Refrigerados", penalizacion_usd: 15000, criticidad: "Crítica", tipo: "alerta" },
        { id: "ENV-1013", nombre: "Autopista Siglo XXI (Uruapan - Lázaro Cárdenas)", lat: 18.7500, lon: -102.1000, estado: "Retrasado (Falla Mecánica de Convoy y Cierre de Carril)", cliente: "AceroMex Logistics", producto: "Planchas de Acero Estructural", penalizacion_usd: 22000, criticidad: "Crítica", tipo: "alerta" },
        { id: "ENV-1014", nombre: "Autopista 15D (Guadalajara - Tepic, Plan de Barrancas)", lat: 20.9500, lon: -104.0500, estado: "Retrasado (Accidente Múltiple y Deslave)", cliente: "AgroFarma Occidente", producto: "Medicamentos de Alta Especialidad", penalizacion_usd: 31000, criticidad: "Crítica", tipo: "alerta" },

        // 2. Falta de Inventario (Amarillo / Naranja)
        { id: "BOD-TOL", nombre: "Bodega Toluca Parque Lerma", lat: 19.2826, lon: -99.5132, estado: "Falta de Inventario (0 unidades Motor V6)", cliente: "CEDIS Central Lerma", producto: "Autopartes - Motor V6 (Agotado)", penalizacion_usd: 0, criticidad: "Falta Inventario", tipo: "falta_stock" },
        { id: "BOD-QRO", nombre: "Hub Logístico Querétaro Aeropuerto", lat: 20.5888, lon: -100.3899, estado: "Falta de Inventario (Stock Crítico Transmisiones <5%)", cliente: "CEDIS Bajío Industrial", producto: "Transmisiones Automotrices", penalizacion_usd: 0, criticidad: "Falta Inventario", tipo: "falta_stock" },
        { id: "BOD-GDL", nombre: "Almacén Guadalajara El Salto", lat: 20.5186, lon: -103.2355, estado: "Falta de Inventario (Déficit de Sensores IoT)", cliente: "CEDIS Occidente", producto: "Sensores IoT & Microchips", penalizacion_usd: 0, criticidad: "Falta Inventario", tipo: "falta_stock" },

        // 3. Inventario Disponible / Plan B (Verde)
        { id: "BOD-MTY", nombre: "Bodega Monterrey Apodaca", lat: 25.7785, lon: -100.1876, estado: "Inventario Disponible (Plan B - 450 unidades)", cliente: "Propio (Stock)", producto: "Autopartes - Motor V6", penalizacion_usd: 0, criticidad: "Mitigación", tipo: "inventario_ok" },
        { id: "BOD-CDMX", nombre: "Centro Distribución Cuautitlán CDMX", lat: 19.6711, lon: -99.1783, estado: "Inventario Disponible (Plan B - 320 unidades)", cliente: "Propio (Stock)", producto: "Autopartes - Motor V6", penalizacion_usd: 0, criticidad: "Mitigación", tipo: "inventario_ok" },
        { id: "BOD-VER", nombre: "CEDIS Terrestre Veracruz Puerto", lat: 19.1738, lon: -96.1342, estado: "Inventario Disponible (Stock Respaldo Insumos)", cliente: "Propio (Stock)", producto: "Insumos & Repuestos Industriales", penalizacion_usd: 0, criticidad: "Mitigación", tipo: "inventario_ok" },

        // 4. Flotas Correctas en Tránsito (Azul)
        { id: "ENV-1002", nombre: "Carretera 57 (Monterrey - Saltillo)", lat: 25.4232, lon: -100.9922, estado: "En Tránsito Normal (95 km/h)", cliente: "TechMéxico S.A.", producto: "Servidores & Routers Cloud", penalizacion_usd: 0, criticidad: "Normal", tipo: "normal" },
        { id: "ENV-1003", nombre: "Corredor Industrial (Guadalajara, Jal.)", lat: 20.6597, lon: -103.3496, estado: "Entregado a Tiempo", cliente: "Electrónica Bajío", producto: "Microcontroladores & Sensores", penalizacion_usd: 0, criticidad: "Normal", tipo: "normal" },
        { id: "ENV-1005", nombre: "Corredor Pacífico 15D (Hermosillo - Nogales)", lat: 29.0729, lon: -110.9559, estado: "En Tránsito A Tiempo", cliente: "AgroExport del Noroeste", producto: "Sistemas de Riego IoT & Válvulas", penalizacion_usd: 0, criticidad: "Normal", tipo: "normal" },
        { id: "ENV-1007", nombre: "Carretera 45D (Querétaro - Silao)", lat: 20.9167, lon: -101.4000, estado: "En Tránsito A Tiempo", cliente: "Bajío Assembly Corp", producto: "Componentes Electrónicos", penalizacion_usd: 0, criticidad: "Normal", tipo: "normal" },
        { id: "ENV-1009", nombre: "Autopista del Sol (Cuernavaca - Acapulco)", lat: 18.9242, lon: -99.2216, estado: "En Tránsito Normal", cliente: "Distribuidora Sur", producto: "Equipos de Telecomunicación", penalizacion_usd: 0, criticidad: "Normal", tipo: "normal" },
        { id: "ENV-1010", nombre: "Carretera 180D (Mérida - Cancún)", lat: 20.9674, lon: -89.5926, estado: "En Tránsito A Tiempo", cliente: "Riviera Logistics", producto: "Paneles Solares & Inversores", penalizacion_usd: 0, criticidad: "Normal", tipo: "normal" },
        { id: "ENV-1011", nombre: "Carretera Fed 45 (Chihuahua - Cd. Juárez)", lat: 28.6353, lon: -106.0889, estado: "En Tránsito A Tiempo", cliente: "Maquilas Frontera", producto: "Semiconductores & PCBs", penalizacion_usd: 0, criticidad: "Normal", tipo: "normal" },
        { id: "ENV-1012", nombre: "Carretera Fed 2D (Tijuana - Mexicali - La Rumorosa)", lat: 32.5149, lon: -116.6000, estado: "En Tránsito Normal", cliente: "Pacific Manufacturing", producto: "Módulos de Potencia EV", penalizacion_usd: 0, criticidad: "Normal", tipo: "normal" }
      ];

      try {
        const response = await axios.get('/api/map');
        if (Array.isArray(response.data) && response.data.length > 0) {
          data = response.data;
        }
      } catch (e) {
        console.warn('Usando dataset local para Mapa Logístico');
      }

      this.mapData = data;

      data.forEach(item => {
        let color = '#4285F4';
        let iconStr = 'mdi-truck-fast';
        let badgeColor = '#1967d2';
        let badgeBg = '#e8f0fe';
        let badgeLabel = 'Flota OK';
        
        if (item.criticidad === 'Crítica' || item.criticidad === 'Alerta' || item.tipo === 'alerta') {
          color = '#EA4335';
          iconStr = 'mdi-alert-octagon';
          badgeColor = '#c5221f';
          badgeBg = '#fce8e6';
          badgeLabel = 'Alerta Crítica';
        } else if (item.criticidad === 'Falta Inventario' || item.tipo === 'falta_stock') {
          color = '#FBBC05';
          iconStr = 'mdi-package-variant-remove';
          badgeColor = '#b06000';
          badgeBg = '#fef7e0';
          badgeLabel = 'Falta Inventario';
        } else if (item.criticidad === 'Mitigación' || item.tipo === 'inventario_ok') {
          color = '#34A853';
          iconStr = 'mdi-warehouse';
          badgeColor = '#137333';
          badgeBg = '#e6f4ea';
          badgeLabel = 'Stock Plan B';
        }
        
        const markerHtml = `
          <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${color === '#FBBC05' ? '#202124' : 'white'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer;">
            <i class="mdi ${iconStr}" style="font-size: 18px;"></i>
          </div>
        `;
        
        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-icon',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        let tooltipHtml = `
          <div style="font-family: Roboto, sans-serif; min-width: 185px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: ${badgeBg}; color: ${badgeColor}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                ${badgeLabel}
              </span>
              <span style="color: #6b7280; font-size: 11px; font-weight: 600;">${item.id}</span>
            </div>
            <div style="font-weight: bold; font-size: 13px; color: #202124; border-bottom: 1px solid #eee; padding-bottom: 3px; margin-bottom: 4px;">
              ${item.nombre}
            </div>
            <div style="font-size: 11.5px; line-height: 1.5; color: #3c4043;">
              <b>Estado:</b> ${item.estado}<br>
              <b>Producto:</b> ${item.producto}<br>
              ${item.cliente ? `<b>Cliente/Ref:</b> ${item.cliente}<br>` : ''}
              ${item.penalizacion_usd > 0 ? `<b style="color: #EA4335;">Penalización:</b> $${item.penalizacion_usd.toLocaleString()} USD` : ''}
            </div>
          </div>
        `;

        const marker = L.marker([item.lat, item.lon], { icon: customIcon })
          .addTo(this.map)
          .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -18], opacity: 0.98 });

        marker.on('click', () => {
          this.showRouteForMarker(item);
          if (item.criticidad === 'Mitigación' || item.tipo === 'inventario_ok') {
            this.userInput = `¿Qué disponibilidad de ${item.producto} tenemos en ${item.nombre} para mitigar los retrasos terrestres?`;
          } else if (item.criticidad === 'Falta Inventario' || item.tipo === 'falta_stock') {
            this.userInput = `⚠️ Alerta de Inventario: En ${item.nombre} reportan ${item.estado}. ¿Cómo afecta a la cadena de suministro terrestre y qué plan propones?`;
          } else if (item.criticidad === 'Crítica' || item.criticidad === 'Alerta' || item.tipo === 'alerta') {
            this.userInput = `🚨 Genera un reporte detallado del impacto y plan de contingencia para la alerta en ${item.nombre} (${item.id} - ${item.cliente}).`;
          } else {
            this.userInput = `¿Cuál es el estatus del envío ${item.id} en ${item.nombre} para ${item.cliente}?`;
          }
          this.$nextTick(() => {
            const inputEl = document.querySelector('.chat-input input') || document.querySelector('input[placeholder*="Escribe una pregunta"]');
            if (inputEl) inputEl.focus();
          });
        });
      });
    },
    askLogisticaPrompt(promptText) {
      this.userInput = promptText;
      this.$nextTick(() => {
        const inputEl = document.querySelector('.chat-input input') || document.querySelector('input[placeholder*="Escribe una pregunta"]');
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
        this.messages.push({ role: 'ai', content: response.data.response });
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

