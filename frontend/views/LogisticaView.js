// LogisticaView.js - Vista de Logística & Nearshoring (Torre de Control y Copiloto)

const LogisticaView = {
  template: `
    <v-container class="fill-height py-3 px-4" style="max-width: 1440px;">
      <v-row class="fill-height my-0">
        <!-- Lado Izquierdo: Mapa de Control Logístico -->
        <v-col cols="12" md="7" class="d-flex flex-column">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column overflow-hidden" style="min-height: 520px;">
            <v-card-title class="bg-white pa-3 border-b d-flex align-center justify-space-between" style="border-bottom: 1px solid #e8eaed;">
              <div class="d-flex align-center">
                <v-avatar color="#e8f0fe" size="36" class="mr-3">
                  <v-icon color="#4285F4">mdi-map-marker-path</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold" style="color: #202124;">Torre de Control: Envíos & Clima Nacional</div>
                  <span class="text-caption text-grey-darken-1">Haz clic en un marcador para analizarlo con IA</span>
                </div>
              </div>
              <v-chip color="error" size="small" variant="flat" class="font-weight-bold">1 Alerta Crítica</v-chip>
            </v-card-title>
            <v-card-text class="flex-grow-1 pa-0 position-relative" style="min-height: 460px;">
              <div id="mapContainer" style="width: 100%; height: 100%; min-height: 460px; z-index: 1;"></div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Lado Derecho: Chatbot de Logística -->
        <v-col cols="12" md="5" class="d-flex flex-column">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column bg-grey-lighten-4" style="min-height: 520px;">
            <v-card-title class="bg-white pa-3 font-weight-bold d-flex align-center justify-space-between" style="color: #202124; border-bottom: 1px solid #eee;">
              <div class="d-flex align-center">
                <v-icon color="#4285F4" class="mr-2">mdi-robot-outline</v-icon>
                Agente de Logística (Gemini)
              </div>
              <v-chip size="x-small" color="primary" variant="outlined">BigQuery Connected</v-chip>
            </v-card-title>

            <!-- Quick Prompts -->
            <div class="px-3 py-2 bg-white d-flex flex-wrap" style="gap: 6px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('🚨 ¿Qué envíos están en riesgo por tormentas en el Golfo?')">
                🚨 Envíos en riesgo
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#34A853" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('¿Qué bodegas alternativas tenemos para despachar motores a AutoParts?')">
                📦 Inventario Plan B
              </v-chip>
            </div>

            <!-- Mensajes -->
            <v-card-text class="chat-container flex-grow-1 pa-4" id="chat-box">
              <div v-for="(msg, index) in messages" :key="index">
                <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" :style="msg.role === 'ai' ? 'border-left: 4px solid #4285F4;' : ''">
                  <div v-if="msg.role === 'ai'" v-html="formatResponse(msg.content)"></div>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>
              <div v-if="loading" class="chat-bubble-ai" style="border-left: 4px solid #4285F4;">
                <v-progress-circular indeterminate color="#4285F4" size="18" class="mr-2"></v-progress-circular>
                Consultando BigQuery & Modelos de Tránsito...
              </div>
            </v-card-text>

            <!-- Input -->
            <v-card-actions class="pa-3 bg-white">
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
        { role: 'ai', content: '¡Hola! Soy tu Agente Logístico. Estoy monitoreando nuestros envíos en el Golfo de México y la frontera norte. ¿En qué te puedo ayudar?' }
      ],
      map: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
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

      this.loadMapData();
    },
    async loadMapData() {
      let data = [
        { id: "ENV-1001", nombre: "Golfo de México (Marítimo)", lat: 21.1619, lon: -91.0, estado: "Retrasado (Tormenta Tropical)", cliente: "AutoParts Premier", producto: "Autopartes - Motor V6", penalizacion_usd: 45000, criticidad: "Crítica" },
        { id: "ENV-1002", nombre: "Monterrey, N.L. (Carretera 57)", lat: 25.6866, lon: -100.3161, estado: "En Tránsito Normal", cliente: "TechMéxico S.A.", producto: "Servidores & Routers", penalizacion_usd: 0, criticidad: "Normal" },
        { id: "ENV-1003", nombre: "Guadalajara, Jal.", lat: 20.6597, lon: -103.3496, estado: "Entregado a Tiempo", cliente: "Electrónica Bajío", producto: "Microcontroladores", penalizacion_usd: 0, criticidad: "Normal" },
        { id: "BOD-MTY", nombre: "Bodega Monterrey Apodaca", lat: 25.7785, lon: -100.1876, estado: "Inventario (Plan B)", cliente: "Propio (Stock)", producto: "Autopartes - Motor V6", penalizacion_usd: 0, criticidad: "Mitigación" },
        { id: "BOD-CDMX", nombre: "Centro Distribución Cuautitlán CDMX", lat: 19.6711, lon: -99.1783, estado: "Inventario (Plan B)", cliente: "Propio (Stock)", producto: "Autopartes - Motor V6", penalizacion_usd: 0, criticidad: "Mitigación" }
      ];

      try {
        const response = await axios.get('/api/map');
        if (Array.isArray(response.data) && response.data.length > 0) {
          data = response.data;
        }
      } catch (e) {
        console.warn('Usando dataset local para Mapa Logístico');
      }

      data.forEach(item => {
        let color = '#4285F4';
        let iconStr = 'mdi-truck';
        
        if (item.estado && item.estado.includes('Retrasado')) {
          color = '#EA4335';
          iconStr = 'mdi-alert';
        } else if (item.estado && item.estado.includes('Inventario')) {
          color = '#34A853';
          iconStr = 'mdi-warehouse';
        }
        
        const markerHtml = `<div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white;"><i class="mdi ${iconStr}" style="font-size: 18px;"></i></div>`;
        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-icon',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        let tooltipHtml = `
          <div style="font-family: Roboto, sans-serif; min-width: 170px;">
            <div style="font-weight: bold; font-size: 13px; border-bottom: 1px solid #eee; padding-bottom: 3px; margin-bottom: 4px;">
              ${item.nombre} <span style="color: #6b7280; font-size: 11px;">(${item.id})</span>
            </div>
            <div style="font-size: 11.5px; line-height: 1.5;">
              <b>Estado:</b> ${item.estado}<br>
              <b>Producto:</b> ${item.producto}<br>
              ${item.cliente ? `<b>Cliente:</b> ${item.cliente}<br>` : ''}
              ${item.penalizacion_usd > 0 ? `<b style="color: #EA4335">Riesgo:</b> $${item.penalizacion_usd.toLocaleString()} USD` : ''}
            </div>
          </div>
        `;

        const marker = L.marker([item.lat, item.lon], { icon: customIcon })
          .addTo(this.map)
          .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -18], opacity: 0.95 });

        marker.on('click', () => {
          if (item.criticidad === 'Mitigación') {
            this.userInput = `¿Qué disponibilidad de ${item.producto} tenemos en ${item.nombre} para mitigar los retrasos?`;
          } else if (item.criticidad === 'Crítica') {
            this.userInput = `🚨 Genera un reporte detallado del impacto y opciones de mitigación para el envío ${item.id} de ${item.cliente}.`;
          } else {
            this.userInput = `¿Cuál es el estatus del envío ${item.id} de ${item.cliente}?`;
          }
          this.sendMessage();
        });
      });
    },
    askLogisticaPrompt(promptText) {
      this.userInput = promptText;
      this.sendMessage();
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
