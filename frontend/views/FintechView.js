// FintechView.js - Vista de Fintech & Banca (Predicción de Churn y Next-Best-Action)

const FintechView = {
  template: `
    <v-container class="fill-height py-3 px-4" style="max-width: 1440px;">
      <v-row class="fill-height my-0">
        <!-- Lado Izquierdo: Gráfica de Burbujas Churn vs Saldo -->
        <v-col cols="12" md="7" class="d-flex flex-column">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column overflow-hidden" style="min-height: 520px;">
            <v-card-title class="bg-white pa-3 border-b d-flex align-center justify-space-between" style="border-bottom: 1px solid #e8eaed;">
              <div class="d-flex align-center">
                <v-avatar color="#e6f4ea" size="36" class="mr-3">
                  <v-icon color="#34A853">mdi-chart-bubble</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold" style="color: #202124;">Matriz de Riesgo de Abandono (Churn) vs Saldo</div>
                  <span class="text-caption text-grey-darken-1">Clientes de Alto Valor en Riesgo de Fuga</span>
                </div>
              </div>
              <v-chip color="warning" size="small" variant="flat" class="font-weight-bold">Next-Best-Action</v-chip>
            </v-card-title>
            <v-card-text class="flex-grow-1 pa-2 position-relative d-flex align-center justify-center" style="min-height: 460px;">
              <canvas id="fintechChart" style="max-height: 420px; width: 100%; padding: 10px;"></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Lado Derecho: Chatbot Fintech -->
        <v-col cols="12" md="5" class="d-flex flex-column">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column bg-grey-lighten-4" style="min-height: 520px;">
            <v-card-title class="bg-white pa-3 font-weight-bold d-flex align-center justify-space-between" style="color: #202124; border-bottom: 1px solid #eee;">
              <div class="d-flex align-center">
                <v-icon color="#34A853" class="mr-2">mdi-robot-outline</v-icon>
                Agente Fintech & Retención (Gemini)
              </div>
              <v-chip size="x-small" color="success" variant="outlined">NBA Engine</v-chip>
            </v-card-title>

            <!-- Quick Prompts -->
            <div class="px-3 py-2 bg-white d-flex flex-wrap" style="gap: 6px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('¿Cuáles clientes empresariales tienen mayor riesgo de abandono?')">
                🚨 Clientes en riesgo
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#34A853" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('Recomienda una oferta Next-Best-Action para retener a Empresa Aceros del Norte')">
                💡 Oferta NBA Retención
              </v-chip>
            </div>

            <!-- Mensajes -->
            <v-card-text class="chat-container flex-grow-1 pa-4" id="chat-box-fintech">
              <div v-for="(msg, index) in messagesFintech" :key="index">
                <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" :style="msg.role === 'ai' ? 'border-left: 4px solid #34A853;' : ''">
                  <div v-if="msg.role === 'ai'" v-html="formatResponse(msg.content)"></div>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>
              <div v-if="loadingFintech" class="chat-bubble-ai" style="border-left: 4px solid #34A853;">
                <v-progress-circular indeterminate color="#34A853" size="18" class="mr-2"></v-progress-circular>
                Calculando probabilidad de Churn y Oferta Óptima...
              </div>

              <div v-if="showOfferAction" class="mt-3 text-center">
                <v-btn color="#34A853" size="small" rounded="pill" elevation="2" @click="launchOffer" class="font-weight-bold text-white text-capitalize">
                  <v-icon start>mdi-send-check</v-icon> Activar Oferta NBA en App Móvil
                </v-btn>
              </div>

              <div v-if="offerLaunched" class="mt-3 pa-2 rounded bg-green-lighten-5 border text-center text-success font-weight-bold text-caption">
                <v-icon left color="success" size="16">mdi-check-circle</v-icon> ¡Oferta personalizada activada en el perfil digital del cliente!
              </div>
            </v-card-text>

            <!-- Input -->
            <v-card-actions class="pa-3 bg-white">
              <v-text-field
                v-model="userInputFintech"
                variant="outlined"
                density="compact"
                placeholder="Escribe una consulta para el agente bancario..."
                hide-details
                rounded="pill"
                @keyup.enter="sendMessageFintech"
                color="#34A853"
              >
                <template v-slot:append-inner>
                  <v-btn icon color="#34A853" @click="sendMessageFintech" :disabled="loadingFintech || !userInputFintech.trim()" variant="text">
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
      sessionId: 'demo-fintech-' + Math.random().toString(36).substr(2, 9),
      userInputFintech: '',
      loadingFintech: false,
      messagesFintech: [
        { role: 'ai', content: '¡Hola! Soy tu Agente Fintech & Next-Best-Action. Analizo el riesgo de abandono (churn) de clientes de alto valor patrimonial y empresarial para formular ofertas personalizadas de retención. ¿En qué te ayudo?' }
      ],
      fintechChartInstance: null,
      showOfferAction: false,
      offerLaunched: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initFintechChart();
      if (this.$route.query.prompt) {
        this.userInputFintech = this.$route.query.prompt;
        setTimeout(() => this.sendMessageFintech(), 300);
      }
    });
  },
  unmounted() {
    if (this.fintechChartInstance) {
      this.fintechChartInstance.destroy();
      this.fintechChartInstance = null;
    }
  },
  methods: {
    async initFintechChart() {
      const canvas = document.getElementById('fintechChart');
      if (!canvas) return;

      if (this.fintechChartInstance) {
        this.fintechChartInstance.destroy();
        this.fintechChartInstance = null;
      }

      let data = [
        { nombre: "Empresa Aceros del Norte S.A.", segmento: "Empresarial", riesgo_abandono_pct: 82, saldo_mxn: 1850000 },
        { nombre: "Roberto Garza Sada", segmento: "Patrimonial", riesgo_abandono_pct: 74, saldo_mxn: 1420000 },
        { nombre: "Distribuidora Médica del Centro", segmento: "Pyme", riesgo_abandono_pct: 68, saldo_mxn: 650000 },
        { nombre: "Sofía Martínez Treviño", segmento: "Premium", riesgo_abandono_pct: 59, saldo_mxn: 480000 },
        { nombre: "Innovación Digital S.C.", segmento: "Pyme", riesgo_abandono_pct: 51, saldo_mxn: 390000 },
        { nombre: "Carlos Slim Domit", segmento: "Patrimonial", riesgo_abandono_pct: 24, saldo_mxn: 3200000 },
        { nombre: "Valeria Morales Ruiz", segmento: "Joven", riesgo_abandono_pct: 45, saldo_mxn: 115000 },
        { nombre: "Javier Hernández Balcázar", segmento: "Premium", riesgo_abandono_pct: 18, saldo_mxn: 890000 }
      ];

      try {
        const response = await axios.get('/api/fintech/chart');
        if (Array.isArray(response.data) && response.data.length > 0) {
          data = response.data;
        }
      } catch(e) {
        console.warn('Usando dataset local para Fintech Chart');
      }
      
      const segmentColors = {
         'Premium': '#4285F4',
         'Pyme': '#34A853',
         'Patrimonial': '#FBBC05',
         'Empresarial': '#EA4335',
         'Joven': '#9C27B0'
      };

      const segments = [...new Set(data.map(item => item.segmento))];
      const datasets = segments.map(seg => ({
        label: seg,
        backgroundColor: segmentColors[seg] || '#5f6368',
        data: data.filter(d => d.segmento === seg).map(d => ({
          x: d.riesgo_abandono_pct,
          y: d.saldo_mxn,
          r: 10,
          nombre: d.nombre
        }))
      }));
      
      const ctx = canvas.getContext('2d');
      this.fintechChartInstance = new Chart(ctx, {
        type: 'bubble',
        data: { datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const item = context.raw;
                  return item.nombre + ': Riesgo ' + item.x + '%, Saldo $' + item.y.toLocaleString() + ' MXN';
                }
              }
            }
          },
          scales: {
            x: { 
              title: { display: true, text: 'Riesgo de Abandono (Churn %)', font: { size: 10 } },
              min: 0, 
              max: 100,
              ticks: { font: { size: 10 } }
            },
            y: { 
              title: { display: true, text: 'Saldo del Cliente ($ MXN)', font: { size: 10 } },
              beginAtZero: true,
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
    },
    askFintechPrompt(promptText) {
      this.userInputFintech = promptText;
      this.sendMessageFintech();
    },
    scrollToBottomFintech() {
      setTimeout(() => {
        const chatBox = document.getElementById('chat-box-fintech');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 100);
    },
    launchOffer() {
      this.showOfferAction = false;
      this.offerLaunched = true;
      this.scrollToBottomFintech();
    },
    async sendMessageFintech() {
      if (!this.userInputFintech.trim()) return;

      const text = this.userInputFintech;
      this.messagesFintech.push({ role: 'user', content: text });
      this.userInputFintech = '';
      this.loadingFintech = true;
      this.showOfferAction = false;
      this.offerLaunched = false;
      this.scrollToBottomFintech();

      try {
        const response = await axios.post('/api/chat/fintech', {
          session_id: this.sessionId,
          message: text
        });
        
        const reply = response.data.response;
        this.messagesFintech.push({ role: 'ai', content: reply });
        
        const lowerReply = reply.toLowerCase();
        if (lowerReply.includes('deseas que') || lowerReply.includes('activar') || lowerReply.includes('oferta')) {
          this.showOfferAction = true;
        }
      } catch (error) {
        console.error('Error en Agente de Fintech:', error);
        const errDetail = error.response?.data?.detail || error.message || 'Error de conexión con Gemini.';
        this.messagesFintech.push({ 
          role: 'ai', 
          content: `⚠️ **Error en el Agente de Fintech:**\n\n${errDetail}` 
        });
      } finally {
        this.loadingFintech = false;
        this.scrollToBottomFintech();
      }
    },
    formatResponse(text) {
      return marked.parse(text);
    }
  }
};
