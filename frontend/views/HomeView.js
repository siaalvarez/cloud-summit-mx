// HomeView.js - Vista de Inicio (Catálogo de Agentes y Asistente Gemini)

const HomeView = {
  template: `
    <v-container class="fill-height d-flex flex-column justify-center align-center py-4 px-4" style="max-width: 1200px;">
      
      <!-- Transición entre Catálogo y Modo Chat -->
      <transition name="chat-fade" mode="out-in">
        
        <!-- MODO INICIAL: Catálogo de Agentes y Búsqueda -->
        <div v-if="!isChatActive" key="catalog-view" class="w-100 my-auto">
          
          <!-- Encabezado Principal -->
          <div class="text-center mb-6">
            <h1 class="text-h3 font-weight-bold mb-3" style="color: #202124; font-family: 'Google Sans', 'Product Sans', sans-serif; letter-spacing: -0.5px;">
              BigQuery Data Agents
            </h1>
            <p class="text-body-1 text-grey-darken-1 mx-auto" style="max-width: 780px; font-size: 16px; line-height: 1.6;">
              Agentes autónomos de IA impulsados por Gemini y BigQuery para resolver problemas de alto impacto en las industrias clave de México.
            </p>
          </div>

          <!-- Barra de Búsqueda Centrada -->
          <v-row justify="center" class="mb-8">
            <v-col cols="12" sm="10" md="8" lg="7" class="py-0">
              <v-text-field
                v-model="homeSearchInput"
                @keyup.enter="handleHomeSearch"
                variant="solo"
                placeholder="Pregúntale a Gemini sobre tendencias, eventos, Retail, Logística o Fintech..."
                rounded="pill"
                hide-details
                bg-color="white"
                class="elevation-2"
                style="border: 1px solid #dadce0; border-radius: 9999px;"
              >
                <template v-slot:prepend-inner>
                  <v-img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" max-height="22" max-width="22" class="mr-2"></v-img>
                </template>
                <template v-slot:append-inner>
                  <v-btn 
                    icon="mdi-send" 
                    variant="text" 
                    color="#5f6368" 
                    class="mr-n2" 
                    :loading="generalLoading" 
                    :disabled="generalLoading || !homeSearchInput.trim()" 
                    @click="handleHomeSearch"
                  ></v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <!-- 3 Tarjetas Principales de Agentes de Demostración -->
          <v-row justify="center" align="stretch">
            
            <!-- Tarjeta 1: Logística -->
            <v-col cols="12" md="4" class="d-flex">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 8 : 2"
                  class="pa-5 rounded-xl cursor-pointer transition-swing fill-height w-100 d-flex flex-column bg-white"
                  @click="openAgent('logistica')"
                  style="border: 1px solid #e8eaed;"
                >
                  <v-card-item class="pa-0 mb-3">
                    <template v-slot:prepend>
                      <v-avatar color="#e8f0fe" size="52" class="mr-3">
                        <v-icon color="#4285F4" size="28">mdi-truck-fast</v-icon>
                      </v-avatar>
                    </template>
                    <v-card-title class="text-subtitle-1 font-weight-bold" style="color: #202124;">Logística & Nearshoring</v-card-title>
                    <v-card-subtitle class="text-caption text-grey-darken-1">Monitoreo de Envíos & Clima</v-card-subtitle>
                  </v-card-item>
                  <v-card-text class="pa-0 text-caption text-grey-darken-2 flex-grow-1" style="font-size: 13.5px; line-height: 1.55;">
                    Resuelve disrupciones y retrasos en tiempo real con BigQuery, detectando tormentas y despachando rutas alternativas.
                  </v-card-text>
                  <v-card-actions class="pa-0 pt-4">
                    <v-chip color="#4285F4" size="small" variant="tonal" class="font-weight-bold">Demostración Activa</v-chip>
                    <v-spacer></v-spacer>
                    <v-icon color="#4285F4">mdi-arrow-right</v-icon>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-col>

            <!-- Tarjeta 2: Retail & E-commerce -->
            <v-col cols="12" md="4" class="d-flex">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 8 : 2"
                  class="pa-5 rounded-xl cursor-pointer transition-swing fill-height w-100 d-flex flex-column bg-white"
                  @click="openAgent('retail')"
                  style="border: 1px solid #e8eaed;"
                >
                  <v-card-item class="pa-0 mb-3">
                    <template v-slot:prepend>
                      <v-avatar color="#fce8e6" size="52" class="mr-3">
                        <v-icon color="#EA4335" size="28">mdi-shopping</v-icon>
                      </v-avatar>
                    </template>
                    <v-card-title class="text-subtitle-1 font-weight-bold" style="color: #202124;">Retail & E-commerce</v-card-title>
                    <v-card-subtitle class="text-caption text-grey-darken-1">Hiper-personalización de Demanda</v-card-subtitle>
                  </v-card-item>
                  <v-card-text class="pa-0 text-caption text-grey-darken-2 flex-grow-1" style="font-size: 13.5px; line-height: 1.55;">
                    Cruza ventas internas por macro-categoría con <strong>Google Trends</strong> para desbloquear inventario inmovilizado mediante campañas inteligentes.
                  </v-card-text>
                  <v-card-actions class="pa-0 pt-4">
                    <v-chip color="#EA4335" size="small" variant="tonal" class="font-weight-bold">Demostración Activa</v-chip>
                    <v-spacer></v-spacer>
                    <v-icon color="#EA4335">mdi-arrow-right</v-icon>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-col>

            <!-- Tarjeta 3: Fintech & Banca -->
            <v-col cols="12" md="4" class="d-flex">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 8 : 2"
                  class="pa-5 rounded-xl cursor-pointer transition-swing fill-height w-100 d-flex flex-column bg-white"
                  @click="openAgent('fintech')"
                  style="border: 1px solid #e8eaed;"
                >
                  <v-card-item class="pa-0 mb-3">
                    <template v-slot:prepend>
                      <v-avatar color="#e6f4ea" size="52" class="mr-3">
                        <v-icon color="#34A853" size="28">mdi-bank</v-icon>
                      </v-avatar>
                    </template>
                    <v-card-title class="text-subtitle-1 font-weight-bold" style="color: #202124;">Fintech & Banca</v-card-title>
                    <v-card-subtitle class="text-caption text-grey-darken-1">Predicción de Churn & Next-Best-Action</v-card-subtitle>
                  </v-card-item>
                  <v-card-text class="pa-0 text-caption text-grey-darken-2 flex-grow-1" style="font-size: 13.5px; line-height: 1.55;">
                    Analiza riesgo de fuga de capitales en clientes de alto valor y formula ofertas financieras personalizadas en tiempo real.
                  </v-card-text>
                  <v-card-actions class="pa-0 pt-4">
                    <v-chip color="#34A853" size="small" variant="tonal" class="font-weight-bold">Demostración Activa</v-chip>
                    <v-spacer></v-spacer>
                    <v-icon color="#34A853">mdi-arrow-right</v-icon>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-col>

          </v-row>
        </div>

        <!-- MODO CHAT ACTIVO: Ventana Ampliada del Asistente Gemini con Barra de Seguimiento Inferior -->
        <div v-else key="chat-view" class="w-100 my-auto">
          
          <div class="text-center mb-4">
            <h2 class="text-h4 font-weight-bold" style="color: #202124; font-family: 'Google Sans', 'Product Sans', sans-serif;">
              BigQuery Data Agents
            </h2>
          </div>

          <v-row justify="center">
            <v-col cols="12" md="10" lg="9" class="px-0">
              <v-card class="rounded-xl bg-white elevation-3 d-flex flex-column overflow-hidden" style="border: 1px solid #dadce0; min-height: 520px; max-height: calc(100vh - 210px);">
                
                <!-- Encabezado del Asistente Gemini -->
                <div class="d-flex align-center justify-space-between px-5 py-3 bg-white flex-shrink-0" style="border-bottom: 1px solid #e8eaed;">
                  <div class="d-flex align-center">
                    <v-avatar color="#e8f0fe" size="38" class="mr-3">
                      <v-icon color="#4285F4" size="22">mdi-google</v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold text-subtitle-1" style="color: #202124; line-height: 1.2;">
                        Asistente Gemini
                      </div>
                      <div class="d-flex align-center mt-1">
                        <v-chip size="x-small" color="#4285F4" variant="tonal" class="font-weight-bold">
                          <v-icon start size="11">mdi-magnify</v-icon> Google Search Grounding
                        </v-chip>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-center">
                    <v-btn
                      size="small"
                      variant="text"
                      color="grey-darken-1"
                      icon="mdi-close"
                      @click="clearGeneralChat"
                      title="Cerrar chat y volver al inicio"
                    >
                    </v-btn>
                  </div>
                </div>
                
                <!-- Historial de Conversación con Formato Espaciado y Legible -->
                <div class="chat-container flex-grow-1 px-5 py-4 custom-scrollbar" id="chat-box-general" style="overflow-y: auto; background-color: #f8fafd;">
                  <div v-for="(msg, index) in generalMessages" :key="index" class="mb-4" style="clear: both; width: 100%;">
                    <div 
                      :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" 
                      :style="msg.role === 'ai' ? 'border-left: 4px solid #4285F4; max-width: 100%; width: 100%;' : ''"
                    >
                      
                      <!-- Contenido del mensaje renderizado en Markdown -->
                      <div v-if="msg.role === 'ai'" class="text-body-1" style="color: #202124; font-size: 14px; line-height: 1.65;" v-html="formatResponse(msg.content)"></div>
                      <div v-else class="text-body-1" style="font-size: 14px;">{{ msg.content }}</div>

                      <!-- Sitios de interés y fuentes verificadas con Google Search -->
                      <div v-if="msg.role === 'ai' && msg.sources && msg.sources.length > 0" class="mt-4 pt-3" style="border-top: 1px solid #e8eaed;">
                        <div class="text-caption font-weight-bold mb-2 d-flex align-center" style="color: #5f6368;">
                          <v-icon size="15" color="#4285F4" class="mr-1">mdi-link-variant</v-icon>
                          Sitios de Interés & Fuentes Web Verificadas:
                        </div>
                        <div class="d-flex flex-wrap" style="gap: 8px;">
                          <v-chip
                            v-for="(source, sIdx) in msg.sources"
                            :key="sIdx"
                            size="small"
                            variant="outlined"
                            color="#1a73e8"
                            :href="source.url"
                            target="_blank"
                            class="text-caption font-weight-medium text-none"
                            style="background: #ffffff; border-color: #dadce0;"
                          >
                            <v-icon start size="13" color="#4285F4">mdi-open-in-new</v-icon>
                            {{ source.title || source.url }}
                          </v-chip>
                        </div>
                      </div>

                      <!-- Botón de Acción Sugerida hacia el Agente correspondiente -->
                      <div v-if="msg.role === 'ai' && msg.agente_sugerido" class="mt-4 pt-3 d-flex align-center justify-space-between flex-wrap" style="border-top: 1px solid #e8eaed; gap: 10px;">
                        <span class="text-caption text-grey-darken-1 font-weight-medium">
                          💡 Acción recomendada para profundizar en este análisis:
                        </span>
                        <v-btn
                          :color="getAgentButtonColor(msg.agente_sugerido)"
                          rounded="pill"
                          size="small"
                          class="font-weight-bold text-white text-capitalize elevation-1 px-4"
                          @click="openAgent(msg.agente_sugerido)"
                        >
                          <v-icon start size="16">{{ getAgentButtonIcon(msg.agente_sugerido) }}</v-icon>
                          {{ getAgentButtonLabel(msg.agente_sugerido) }}
                        </v-btn>
                      </div>

                    </div>
                  </div>

                  <!-- Indicador de Carga -->
                  <div v-if="generalLoading" class="chat-bubble-ai d-flex align-center pa-4" style="border-left: 4px solid #4285F4; width: 100%; max-width: 100%; clear: both;">
                    <v-progress-circular indeterminate color="#4285F4" size="20" class="mr-3"></v-progress-circular>
                    <span class="text-body-2 font-weight-medium" style="color: #5f6368;">Consultando al Asistente Gemini y verificando fuentes en Google Search...</span>
                  </div>
                </div>

                <!-- Barra de Entrada para Preguntas de Seguimiento (Abajo del Historial) -->
                <div class="pa-3 px-4 bg-white flex-shrink-0" style="border-top: 1px solid #e8eaed;">
                  <v-text-field
                    v-model="homeSearchInput"
                    @keyup.enter="handleHomeSearch"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Escribe una pregunta de seguimiento para el Asistente Gemini..."
                    rounded="pill"
                    hide-details
                    bg-color="#ffffff"
                    color="#4285F4"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="#4285F4" class="mr-1">mdi-chat-question-outline</v-icon>
                    </template>
                    <template v-slot:append-inner>
                      <v-btn
                        icon="mdi-send"
                        variant="text"
                        color="#4285F4"
                        class="mr-n2"
                        :loading="generalLoading"
                        :disabled="generalLoading || !homeSearchInput.trim()"
                        @click="handleHomeSearch"
                      ></v-btn>
                    </template>
                  </v-text-field>
                </div>

              </v-card>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-container>
  `,
  data() {
    return {
      sessionId: 'demo-general-' + Math.random().toString(36).substr(2, 9),
      homeSearchInput: '',
      generalMessages: [],
      generalLoading: false
    };
  },
  computed: {
    isChatActive() {
      return this.generalMessages.length > 0 || this.generalLoading;
    }
  },
  methods: {
    scrollToBottomGeneral() {
      setTimeout(() => {
        const chatBox = document.getElementById('chat-box-general');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 100);
    },
    clearGeneralChat() {
      this.generalMessages = [];
      this.homeSearchInput = '';
      this.sessionId = 'demo-general-' + Math.random().toString(36).substr(2, 9);
    },
    async handleHomeSearch() {
      const text = this.homeSearchInput.trim();
      if (!text || this.generalLoading) return;
      this.homeSearchInput = '';
      await this.sendGeneralMessage(text);
    },
    async sendGeneralMessage(text) {
      this.generalMessages.push({ role: 'user', content: text });
      this.generalLoading = true;
      this.scrollToBottomGeneral();

      try {
        const response = await axios.post('/api/chat/general', {
          session_id: this.sessionId,
          message: text
        });
        this.generalMessages.push({
          role: 'ai',
          content: response.data.response,
          sources: response.data.sources || [],
          agente_sugerido: response.data.agente_sugerido
        });
      } catch (error) {
        console.error('Error al consultar /api/chat/general:', error);
        const errDetail = error.response?.data?.detail || error.message || 'Error de conexión con Gemini.';
        this.generalMessages.push({
          role: 'ai',
          content: `⚠️ **Error de conexión con el Asistente Gemini:**\n\n${errDetail}`,
          sources: [],
          agente_sugerido: null
        });
      } finally {
        this.generalLoading = false;
        this.scrollToBottomGeneral();
      }
    },
    openAgent(agentRoute) {
      this.$router.push('/' + agentRoute);
    },
    getAgentButtonLabel(agentKey) {
      if (agentKey === 'retail') return '🛍️ Explorar Agente de Retail & E-commerce';
      if (agentKey === 'logistica') return '🚚 Explorar Agente de Logística & Nearshoring';
      if (agentKey === 'fintech') return '🏦 Explorar Agente de Fintech & Banca';
      return '🚀 Abrir Agente Sugerido';
    },
    getAgentButtonColor(agentKey) {
      if (agentKey === 'retail') return '#EA4335';
      if (agentKey === 'logistica') return '#4285F4';
      if (agentKey === 'fintech') return '#34A853';
      return '#4285F4';
    },
    getAgentButtonIcon(agentKey) {
      if (agentKey === 'retail') return 'mdi-shopping';
      if (agentKey === 'logistica') return 'mdi-truck-fast';
      if (agentKey === 'fintech') return 'mdi-bank';
      return 'mdi-arrow-right';
    },
    formatResponse(text) {
      return marked.parse(text);
    }
  }
};


