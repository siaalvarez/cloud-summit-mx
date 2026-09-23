// FintechView.js - Vista de Fintech & Banca (CDP 360°, Predicción de Abandono y Next-Best-Action)

const FintechView = {
  template: `
    <v-container class="pa-2 px-3 flex-grow-1 d-flex flex-column fill-height" style="max-width: 100%; box-sizing: border-box; overflow: hidden;">
      <v-row class="flex-grow-1 my-0" style="height: 100%; max-height: 100%; min-height: 0;">
        
        <!-- Lado Izquierdo: Dashboard Fintech & CDP (Overview o Riesgo de Abandono) -->
        <v-col cols="12" sm="7" md="7" lg="7" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column overflow-hidden bg-white" style="height: 100%; max-height: 100%; min-height: 0;">
            
            <!-- Header con Switcher de Tabs & Contexto -->
            <v-card-title class="bg-white pa-3 border-b d-flex align-center justify-space-between flex-shrink-0" style="border-bottom: 1px solid #e8eaed;">
              <div class="d-flex align-center">
                <v-avatar color="#e6f4ea" size="36" class="mr-3">
                  <v-icon color="#34A853">mdi-bank</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold" style="color: #34A853; line-height: 1.2;">
                    Inteligencia Financiera & Banca
                  </div>
                  <span class="text-caption text-grey-darken-1">CDP 360° & Retención Proactiva de Clientes | QTD</span>
                </div>
              </div>
              
              <div class="d-flex align-center">
                <v-btn-toggle
                  v-model="fintechTab"
                  mandatory
                  rounded="pill"
                  density="compact"
                  color="#34A853"
                  variant="outlined"
                  class="mr-2"
                  style="border-color: #dadce0;"
                  @update:model-value="onFintechTabChange"
                >
                  <v-btn value="overview" size="small" class="text-capitalize font-weight-bold" style="font-size: 11.5px;">
                    <v-icon start size="15">mdi-account-group-outline</v-icon> Visión CDP & Segmentos
                  </v-btn>
                  <v-btn value="churn" size="small" class="text-capitalize font-weight-bold" style="font-size: 11.5px;">
                    <v-icon start size="15" color="#EA4335">mdi-shield-alert-outline</v-icon> Clientes en Riesgo & NBA
                  </v-btn>
                </v-btn-toggle>

                <v-chip color="#34A853" size="small" variant="flat" class="font-weight-bold text-white d-none d-md-inline-flex">
                  <v-icon start size="14">mdi-lightning-bolt</v-icon> Next-Best-Action
                </v-chip>
              </div>
            </v-card-title>
            
            <v-card-text class="flex-grow-1 pa-3 overflow-y-auto custom-scrollbar" style="background-color: #f8f9fa; min-height: 0;">
              
              <!-- ========================================== -->
              <!-- TAB 1: VISIÓN CDP & SEGMENTOS (OVERVIEW)  -->
              <!-- ========================================== -->
              <div v-show="fintechTab === 'overview'">
                <!-- 4 Macro KPI Cards -->
                <v-row class="mb-2" dense>
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-lg pa-2 text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #34A853;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px;">Total Clientes CDP</div>
                      <div class="text-subtitle-1 font-weight-bold mt-1" style="color: #202124;">48,250</div>
                      <v-chip size="x-small" color="success" class="font-weight-bold mt-1" variant="flat">
                        <v-icon start size="10">mdi-arrow-up</v-icon> +6.3% YoY
                      </v-chip>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-lg pa-2 text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #34A853;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px;">Saldo AUM Total</div>
                      <div class="text-subtitle-1 font-weight-bold mt-1" style="color: #202124;">$1,845M</div>
                      <v-chip size="x-small" color="success" class="font-weight-bold mt-1" variant="flat">
                        <v-icon start size="10">mdi-arrow-up</v-icon> +8.4% YoY
                      </v-chip>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-lg pa-2 text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #5f6368;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px;">Tasa Retención</div>
                      <div class="text-subtitle-1 font-weight-bold mt-1" style="color: #202124;">94.8%</div>
                      <span class="text-caption font-weight-bold" style="color: #5f6368; font-size: 10px;">Meta: 95.0%</span>
                    </v-card>
                  </v-col>

                  <v-col cols="6" sm="3">
                    <v-card class="rounded-lg pa-2 text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #EA4335;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px;">Capital en Riesgo</div>
                      <div class="text-subtitle-1 font-weight-bold mt-1" style="color: #EA4335;">$38.4M</div>
                      <v-chip size="x-small" color="error" class="font-weight-bold mt-1" variant="flat">
                        312 Cuentas
                      </v-chip>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Gráfica de Distribución de Cartera por Segmento -->
                <v-card class="mb-2 rounded-lg pa-3 bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <div>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                        <v-icon size="14" color="#34A853" class="mr-1">mdi-chart-bar</v-icon> Saldo Gestionado por Segmento ($M MXN)
                      </span>
                    </div>
                    <div class="d-flex align-center" style="gap: 8px;">
                      <span class="text-caption" style="font-size: 10px; color: #137333;"><v-icon size="9" color="#34A853">mdi-circle</v-icon> Empresarial</span>
                      <span class="text-caption" style="font-size: 10px; color: #b06000;"><v-icon size="9" color="#FBBC05">mdi-circle</v-icon> Patrimonial</span>
                      <span class="text-caption" style="font-size: 10px; color: #185abc;"><v-icon size="9" color="#4285F4">mdi-circle</v-icon> PyME</span>
                      <span class="text-caption" style="font-size: 10px; color: #7b1fa2;"><v-icon size="9" color="#9C27B0">mdi-circle</v-icon> Premium</span>
                      <span class="text-caption" style="font-size: 10px; color: #5f6368;"><v-icon size="9" color="#64748B">mdi-circle</v-icon> Joven Digital</span>
                    </div>
                  </div>
                  <div style="position: relative; height: 160px; width: 100%;">
                    <canvas id="fintechCdpChart"></canvas>
                  </div>
                </v-card>

                <!-- Matriz Ejecutiva de Segmentos del CDP -->
                <v-card class="mb-2 rounded-lg overflow-hidden bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="pa-2 px-3 d-flex align-center justify-space-between" style="background-color: #f8f9fa; border-bottom: 1px solid #e8eaed;">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                      <v-icon size="16" color="#34A853" class="mr-1">mdi-table</v-icon> Matriz de Segmentos del Customer Data Platform (CDP)
                    </span>
                    <span class="text-caption text-grey-darken-1" style="font-size: 11px;">5 Segmentos Estratégicos | Clic en <strong>Analizar</strong></span>
                  </div>
                  
                  <div class="fintech-matrix-container custom-scrollbar">
                    <table class="retail-matrix-table">
                      <colgroup>
                        <col style="width: 27%;">
                        <col style="width: 15%;">
                        <col style="width: 16%;">
                        <col style="width: 15%;">
                        <col style="width: 15%;">
                        <col style="width: 12%;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th style="text-align: left; padding: 8px 12px;">Segmento CDP</th>
                          <th style="text-align: right; padding: 8px 12px;">Clientes</th>
                          <th style="text-align: right; padding: 8px 12px;">Saldo Total (AUM)</th>
                          <th style="text-align: right; padding: 8px 12px;">Saldo Prom.</th>
                          <th style="text-align: center; padding: 8px 4px;">Tasa Abandono</th>
                          <th style="text-align: center; padding: 8px 6px;">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="(seg, idx) in cdpSegments" 
                          :key="seg.name" 
                          :style="seg.badgeColor === 'warning' ? 'background-color: #fffbf0; border-left: 4px solid #FBBC05;' : ''"
                        >
                          <td style="text-align: left; padding: 6px 12px;">
                            <div class="d-flex align-center" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                              <v-icon :color="seg.barColor" size="16" class="mr-2 flex-shrink-0">{{ seg.icon }}</v-icon>
                              <span class="font-weight-bold text-truncate" style="color: #202124; font-size: 11.5px;">{{ seg.name }}</span>
                              <v-chip 
                                v-if="seg.badge" 
                                size="x-small" 
                                :color="seg.badgeColor" 
                                class="ml-1 font-weight-bold flex-shrink-0" 
                                :variant="seg.badgeVariant || 'flat'" 
                                style="height: 16px; font-size: 8.5px; padding: 0 5px;"
                              >
                                {{ seg.badge }}
                              </v-chip>
                            </div>
                          </td>
                          <td style="text-align: right; padding: 6px 12px; font-weight: 600; color: #202124; font-size: 11.5px;">
                            {{ seg.clientsFormatted }}
                          </td>
                          <td style="text-align: right; padding: 6px 12px; font-weight: 700; color: #202124; font-size: 11.5px;">
                            {{ seg.aum }}
                          </td>
                          <td style="text-align: right; padding: 6px 12px; color: #3c4043; font-weight: 500; font-size: 11.5px;">
                            {{ seg.avgBalance }}
                          </td>
                          <td style="text-align: center; padding: 6px 4px;">
                            <v-chip 
                              size="x-small" 
                              :color="seg.churnRate > 6 ? 'error' : (seg.churnRate > 4 ? 'warning' : 'success')" 
                              variant="flat" 
                              class="font-weight-bold justify-center" 
                              style="height: 18px; font-size: 10px; min-width: 48px;"
                            >
                              {{ seg.churnRate }}%
                            </v-chip>
                          </td>
                          <td style="text-align: center; padding: 6px 6px;">
                            <v-btn 
                              size="x-small" 
                              variant="flat" 
                              rounded="pill" 
                              class="font-weight-bold text-capitalize retail-action-btn-neutral"
                              style="height: 22px; font-size: 10px; padding: 0 8px;"
                              @click="drillDownSegment(seg)"
                            >
                              <v-icon start size="11">mdi-robot-outline</v-icon> Analizar
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </v-card>

                <!-- Tarjetas de Retos Estratégicos -->
                <v-row dense class="mt-1">
                  <v-col cols="12" sm="6" class="d-flex">
                    <v-card class="h-100 w-100 rounded-lg pa-2 px-3 bg-white cursor-pointer transition-swing d-flex flex-column justify-space-between" elevation="1" style="border: 1px solid #e8eaed; border-left: 4px solid #EA4335; min-height: 82px;" @click="setFintechTab('churn')">
                      <div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #EA4335; font-size: 11px;">🚨 Riesgo de Abandono Patrimonial</span>
                          <v-icon color="#EA4335" size="16">mdi-arrow-right-circle</v-icon>
                        </div>
                        <div class="text-caption font-weight-bold mt-1" style="color: #202124;">Cuentas de Alto Valor ($38.4M en Riesgo)</div>
                        <p class="text-caption text-grey-darken-2 mb-0" style="font-size: 11px; line-height: 1.35;">
                          Empresas y clientes de banca privada muestran alta propensión a migrar saldos a competidores.
                        </p>
                      </div>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" class="d-flex">
                    <v-card class="h-100 w-100 rounded-lg pa-2 px-3 bg-white cursor-pointer transition-swing d-flex flex-column justify-space-between" elevation="1" style="border: 1px solid #e8eaed; border-left: 4px solid #34A853; min-height: 82px;" @click="askFintechPrompt('¿Qué estrategia de cross-selling y crédito podemos desplegar en el segmento PyME para elevar el AUM?')">
                      <div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #137333; font-size: 11px;">💡 Oportunidad Crédito PyME</span>
                          <v-icon color="#34A853" size="16">mdi-trending-up</v-icon>
                        </div>
                        <div class="text-caption font-weight-bold mt-1" style="color: #202124;">PyMEs & Negocios (8,600 Cuentas)</div>
                        <p class="text-caption text-grey-darken-2 mb-0" style="font-size: 11px; line-height: 1.35;">
                          Potencial de colocación de líneas de factoraje y terminales punto de venta con 98.2% de cumplimiento.
                        </p>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- ============================================================ -->
              <!-- TAB 2: CLIENTES EN RIESGO & NEXT-BEST-ACTION (DISPERSIÓN/NBA)-->
              <!-- ============================================================ -->
              <div v-show="fintechTab === 'churn'">
                
                <!-- Gráfica de Dispersión / Matriz de Riesgo de Abandono vs Saldo -->
                <v-card class="mb-2 rounded-lg pa-3 bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <div>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                        <v-icon size="14" color="#EA4335" class="mr-1">mdi-chart-bubble</v-icon> Matriz de Riesgo de Abandono vs Saldo ($ MXN)
                      </span>
                    </div>
                    <span class="text-caption text-grey-darken-1" style="font-size: 10.5px;">Clic en una burbuja para consultar con el Agente</span>
                  </div>
                  <div style="position: relative; height: 190px; width: 100%;">
                    <canvas id="fintechChart"></canvas>
                  </div>
                </v-card>

                <!-- Tabla Detallada de Clientes con Alta Propensión al Abandono -->
                <v-card class="mb-2 rounded-lg overflow-hidden bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="pa-2 px-3 d-flex align-center justify-space-between" style="background-color: #f8f9fa; border-bottom: 1px solid #e8eaed;">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                      <v-icon size="16" color="#EA4335" class="mr-1">mdi-account-alert</v-icon> Clientes Identificados con Mayor Riesgo de Abandono
                    </span>
                    <span class="text-caption text-grey-darken-1" style="font-size: 11px;">Motor Predictivo BigQuery ML & NBA</span>
                  </div>
                  
                  <div class="fintech-matrix-container custom-scrollbar">
                    <table class="retail-matrix-table">
                      <colgroup>
                        <col style="width: 28%;">
                        <col style="width: 14%;">
                        <col style="width: 14%;">
                        <col style="width: 32%;">
                        <col style="width: 12%;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th style="text-align: left; padding: 8px 12px;">Cliente & Segmento</th>
                          <th style="text-align: right; padding: 8px 12px;">Saldo ($ MXN)</th>
                          <th style="text-align: center; padding: 8px 4px;">Riesgo Abandono</th>
                          <th style="text-align: left; padding: 8px 12px;">Oferta Next-Best-Action</th>
                          <th style="text-align: center; padding: 8px 6px;">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="(client, idx) in riskClients" 
                          :key="client.name" 
                          :style="client.churnRisk >= 70 ? 'background-color: #fff8f7; border-left: 4px solid #EA4335;' : ''"
                        >
                          <td style="text-align: left; padding: 6px 12px;">
                            <div class="d-flex align-center" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                              <v-icon :color="client.segmentColor" size="15" class="mr-2 flex-shrink-0">mdi-account-circle</v-icon>
                              <div class="d-flex flex-column" style="min-width: 0;">
                                <span class="font-weight-bold text-truncate" style="color: #202124; font-size: 11px;">{{ client.name }}</span>
                                <span class="text-caption text-grey-darken-1" style="font-size: 9.5px; line-height: 1;">{{ client.segment }}</span>
                              </div>
                            </div>
                          </td>
                          <td style="text-align: right; padding: 6px 12px; font-weight: 700; color: #202124; font-size: 11.5px;">
                            {{ client.balance }}
                          </td>
                          <td style="text-align: center; padding: 6px 4px;">
                            <v-chip 
                              size="x-small" 
                              :color="client.riskColor" 
                              variant="flat" 
                              class="font-weight-bold justify-center" 
                              style="height: 18px; font-size: 10px; min-width: 50px;"
                            >
                              {{ client.churnRisk }}%
                            </v-chip>
                          </td>
                          <td style="text-align: left; padding: 6px 12px;">
                            <div class="d-flex align-center" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #137333; font-weight: 600; font-size: 10.5px;">
                              <v-icon size="13" color="#34A853" class="mr-1 flex-shrink-0">{{ client.nbaIcon }}</v-icon>
                              <span class="text-truncate">{{ client.nbaOffer }}</span>
                            </div>
                          </td>
                          <td style="text-align: center; padding: 6px 6px;">
                            <v-btn 
                              size="x-small" 
                              variant="flat" 
                              rounded="pill" 
                              class="font-weight-bold text-capitalize"
                              :class="client.churnRisk >= 70 ? 'retail-action-btn-alert' : 'retail-action-btn-neutral'"
                              style="height: 22px; font-size: 10px; padding: 0 8px;"
                              @click="drillDownClient(client)"
                            >
                              <v-icon start size="11">mdi-robot-outline</v-icon> Analizar
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </v-card>

                <!-- Resumen de Impacto Financiero -->
                <v-card class="pa-3 rounded-lg bg-grey-lighten-4" elevation="0" style="border: 1px solid #e8eaed; border-left: 4px solid #34A853;">
                  <div class="font-weight-bold text-caption" style="color: #137333;">🎯 Impacto Financiero del Motor Next-Best-Action:</div>
                  <div class="text-caption text-grey-darken-3 mt-1" style="line-height: 1.4;">
                    La activación proactiva de ofertas NBA en estos clientes retiene <strong>$4.79M MXN</strong> en saldos gestionados, con un ROI estimado del <strong>340%</strong> sobre el costo del incentivo bancario.
                  </div>
                </v-card>

              </div>

            </v-card-text>
          </v-card>
        </v-col>

        <!-- Lado Derecho: Chatbot Fintech & Retención -->
        <v-col cols="12" sm="5" md="5" lg="5" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column bg-grey-lighten-4 overflow-hidden" style="height: 100%; max-height: 100%; min-height: 0;">
            <v-card-title class="bg-white pa-3 font-weight-bold d-flex align-center justify-space-between flex-shrink-0" style="color: #202124; border-bottom: 1px solid #eee;">
              <div class="d-flex align-center">
                <v-icon color="#34A853" class="mr-2">mdi-robot-outline</v-icon>
                Agente Fintech & Retención
              </div>
              <v-chip size="x-small" color="success" variant="outlined">NBA Engine</v-chip>
            </v-card-title>

            <!-- Sugerencias / Chips de Preguntas Rápidas -->
            <div class="px-3 py-2 bg-white d-flex flex-wrap flex-shrink-0" style="gap: 5px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('¿Cuáles clientes empresariales tienen mayor riesgo de abandono y cuánto saldo representan?')">
                🚨 Clientes en mayor riesgo
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#34A853" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('Recomienda una oferta Next-Best-Action para retener a Empresa Aceros del Norte S.A.')">
                💡 Oferta NBA Aceros del Norte
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#FBBC05" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('Analiza el riesgo de fuga en la cartera de Banca Patrimonial')">
                👑 Cartera Patrimonial
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#4285F4" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('¿Qué oportunidades de cross-selling y crédito tenemos en el segmento PyME?')">
                💼 Oportunidades PyME
              </v-chip>
            </div>

            <!-- Área de mensajes -->
            <v-card-text class="chat-container flex-grow-1 pa-3 overflow-y-auto custom-scrollbar" id="chat-box-fintech" style="min-height: 0; flex: 1 1 0; background-color: #f8f9fa;">
              <div v-for="(msg, index) in messagesFintech" :key="index" style="clear: both; width: 100%;">
                <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" :style="msg.role === 'ai' ? 'border-left: 4px solid #34A853;' : ''">
                  <div v-if="msg.role === 'ai'" v-html="formatResponse(msg.content)"></div>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>
              
              <div v-if="loadingFintech" class="chat-bubble-ai" style="border-left: 4px solid #34A853; clear: both;">
                <v-progress-circular indeterminate color="#34A853" size="18" class="mr-2"></v-progress-circular>
                Calculando probabilidad de abandono y oferta Next-Best-Action...
              </div>

              <!-- Tarjeta de Acción / Activación de Oferta NBA -->
              <div v-if="showOfferAction" class="my-3" style="clear: both; width: 100%;">
                <v-card class="pa-3 rounded-lg bg-white elevation-1" style="border: 1px solid #c8e6c9; border-left: 4px solid #34A853;">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #137333;">
                      <v-icon size="16" color="#34A853" class="mr-1">mdi-lightning-bolt</v-icon> Oferta NBA Personalizada Lista
                    </span>
                    <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">Aprobación Inmediata</v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-2 my-2" style="line-height: 1.4;">
                    Tasa preferencial garantizada Cetes +0.5% con asignación de banquero dedicado y exención de comisiones de tesorería.
                  </div>
                  <v-btn color="#34A853" size="small" block rounded="pill" elevation="1" @click="launchOffer" class="font-weight-bold text-white text-capitalize">
                    <v-icon start size="16">mdi-send-check</v-icon> Desplegar Oferta NBA en App y Notificar al Banquero
                  </v-btn>
                </v-card>
              </div>

              <div v-if="offerLaunched" class="my-3 pa-3 rounded-lg bg-green-lighten-5 text-center text-success font-weight-bold text-caption" style="clear: both; border: 1px solid #ceead6; width: 100%;">
                <v-icon left color="success" size="18">mdi-check-circle</v-icon> ¡Oferta NBA desplegada exitosamente en el perfil digital del cliente y asignada al Wealth Advisor!
              </div>

            </v-card-text>

            <!-- Input -->
            <v-card-actions class="pa-3 bg-white flex-shrink-0" style="border-top: 1px solid #eee;">
              <v-text-field
                v-model="userInputFintech"
                variant="outlined"
                density="compact"
                placeholder="Pregúntale al agente bancario..."
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
      fintechTab: 'overview',
      userInputFintech: '',
      loadingFintech: false,
      messagesFintech: [
        { role: 'ai', content: '¡Hola! Soy tu Agente Fintech & Next-Best-Action. Analizo el riesgo de abandono de clientes de alto valor patrimonial y empresarial para formular ofertas personalizadas de retención. ¿En qué te ayudo?' }
      ],
      fintechChartInstance: null,
      fintechCdpChartInstance: null,
      showOfferAction: false,
      offerLaunched: false,
      cdpSegments: [
        {
          name: "Empresarial & Corporativo",
          icon: "mdi-domain",
          iconColor: "#5f6368",
          barColor: "#34A853",
          badge: "Mayor Saldo",
          badgeColor: "success",
          badgeVariant: "flat",
          clientsFormatted: "1,850",
          aum: "$720.5M",
          aumNum: 720.5,
          avgBalance: "$389.4k",
          churnRate: 3.8,
          prompt: "Analiza el segmento Empresarial & Corporativo en el CDP: ¿Qué riesgo de fuga presentan las cuentas con mayor saldo?"
        },
        {
          name: "Banca Patrimonial (Wealth)",
          icon: "mdi-shield-crown-outline",
          iconColor: "#5f6368",
          barColor: "#FBBC05",
          badge: "Riesgo Fuga",
          badgeColor: "warning",
          badgeVariant: "flat",
          clientsFormatted: "2,400",
          aum: "$540.2M",
          aumNum: 540.2,
          avgBalance: "$225.0k",
          churnRate: 8.4,
          prompt: "Evalúa el segmento Banca Patrimonial en el CDP: ¿Por qué tenemos 8.4% de riesgo de abandono y cómo retener a los clientes clave?"
        },
        {
          name: "PyMEs & Negocios",
          icon: "mdi-store-outline",
          iconColor: "#5f6368",
          barColor: "#4285F4",
          badge: "Alta Rentabilidad",
          badgeColor: "info",
          badgeVariant: "flat",
          clientsFormatted: "8,600",
          aum: "$315.8M",
          aumNum: 315.8,
          avgBalance: "$36.7k",
          churnRate: 4.6,
          prompt: "Revisa el segmento PyMEs & Negocios en el CDP: ¿Qué oportunidades de crédito y terminales TPV podemos desplegar?"
        },
        {
          name: "Banca Premium & Signature",
          icon: "mdi-credit-card-chip-outline",
          iconColor: "#5f6368",
          barColor: "#9C27B0",
          badge: "Fidelización",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          clientsFormatted: "14,200",
          aum: "$198.5M",
          aumNum: 198.5,
          avgBalance: "$14.0k",
          churnRate: 5.1,
          prompt: "Analiza el segmento Banca Premium: ¿Cómo podemos elevar la retención en tarjetas de crédito de alta gama?"
        },
        {
          name: "Joven & Banca Digital",
          icon: "mdi-cellphone-check",
          iconColor: "#5f6368",
          barColor: "#64748B",
          badge: "Crecimiento",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          clientsFormatted: "21,200",
          aum: "$70.0M",
          aumNum: 70.0,
          avgBalance: "$3.3k",
          churnRate: 6.2,
          prompt: "Evalúa la adopción del segmento Joven & Digital: ¿Qué estrategia de micro-inversiones podemos implementar?"
        }
      ],
      riskClients: [
        {
          name: "Empresa Aceros del Norte S.A.",
          segment: "Empresarial",
          segmentColor: "#EA4335",
          balance: "$1,850,000",
          balanceNum: 1850000,
          churnRisk: 82,
          riskColor: "error",
          nbaOffer: "Tasa Rendimiento Cetes +0.5% & Banquero Senior",
          nbaIcon: "mdi-percent",
          prompt: "🚨 Genera la estrategia Next-Best-Action para retener a Empresa Aceros del Norte S.A. (82% de riesgo, $1.85M MXN en saldo)"
        },
        {
          name: "Roberto Garza Sada",
          segment: "Patrimonial",
          segmentColor: "#FBBC05",
          balance: "$1,420,000",
          balanceNum: 1420000,
          churnRisk: 74,
          riskColor: "error",
          nbaOffer: "Asignación Wealth Advisor Senior & Exención Comisiones",
          nbaIcon: "mdi-account-tie-voice",
          prompt: "Formular oferta Next-Best-Action para Roberto Garza Sada (74% de riesgo, $1.42M MXN en Banca Patrimonial)"
        },
        {
          name: "Distribuidora Médica del Centro",
          segment: "Pyme",
          segmentColor: "#4285F4",
          balance: "$650,000",
          balanceNum: 650000,
          churnRisk: 68,
          riskColor: "warning",
          nbaOffer: "Línea de Crédito Revolvente PyME Tasa Fija 12.5%",
          nbaIcon: "mdi-cash-fast",
          prompt: "¿Cuál es la propuesta NBA recomendada para Distribuidora Médica del Centro (68% riesgo, $650k MXN)?"
        },
        {
          name: "Sofía Martínez Treviño",
          segment: "Premium",
          segmentColor: "#9C27B0",
          balance: "$480,000",
          balanceNum: 480000,
          churnRisk: 59,
          riskColor: "warning",
          nbaOffer: "Upgrade Tarjeta Black Metal + Cashback Inversión 2%",
          nbaIcon: "mdi-credit-card-plus",
          prompt: "Recomienda una acción NBA para Sofía Martínez Treviño (59% riesgo, $480k MXN en segmento Premium)"
        },
        {
          name: "Innovación Digital S.C.",
          segment: "Pyme",
          segmentColor: "#4285F4",
          balance: "$390,000",
          balanceNum: 390000,
          churnRisk: 51,
          riskColor: "warning",
          nbaOffer: "Cuenta Maestra Nómina + TPV sin comisión por 6 meses",
          nbaIcon: "mdi-store",
          prompt: "Diseña oferta de retención NBA para Innovación Digital S.C. (51% riesgo, $390k MXN)"
        },
        {
          name: "Valeria Morales Ruiz",
          segment: "Joven",
          segmentColor: "#64748B",
          balance: "$115,000",
          balanceNum: 115000,
          churnRisk: 45,
          riskColor: "info",
          nbaOffer: "Fondos Indexados Digitales en App sin monto mínimo",
          nbaIcon: "mdi-cellphone-arrow-down",
          prompt: "Analiza el caso de Valeria Morales Ruiz (45% riesgo, $115k MXN en Banca Digital)"
        }
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initFintechCdpChart();
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
    if (this.fintechCdpChartInstance) {
      this.fintechCdpChartInstance.destroy();
      this.fintechCdpChartInstance = null;
    }
  },
  methods: {
    setFintechTab(tab) {
      this.fintechTab = tab;
      this.onFintechTabChange(tab);
    },
    onFintechTabChange(tab) {
      this.$nextTick(() => {
        if (tab === 'overview') {
          this.initFintechCdpChart();
        } else if (tab === 'churn') {
          this.initFintechChart();
        }
      });
    },
    initFintechCdpChart() {
      const canvas = document.getElementById('fintechCdpChart');
      if (!canvas) return;

      if (this.fintechCdpChartInstance) {
        this.fintechCdpChartInstance.destroy();
        this.fintechCdpChartInstance = null;
      }

      const ctx = canvas.getContext('2d');
      this.fintechCdpChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.cdpSegments.map(s => s.name),
          datasets: [
            {
              label: 'Saldo Gestionado ($M MXN)',
              data: this.cdpSegments.map(s => s.aumNum),
              backgroundColor: this.cdpSegments.map(s => s.barColor),
              borderRadius: 6,
              maxBarThickness: 34
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const seg = this.cdpSegments[context.dataIndex];
                  return `Saldo Total: ${seg.aum} | ${seg.clientsFormatted} clientes (Saldo Prom: ${seg.avgBalance})`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Saldo Total ($M MXN)', font: { size: 10 } },
              ticks: { font: { size: 10 } }
            },
            x: {
              ticks: {
                font: { size: 9.5, weight: 'bold' },
                callback: function(val, index) {
                  const label = this.getLabelForValue(val);
                  return label.length > 18 ? label.substring(0, 16) + '...' : label;
                }
              }
            }
          }
        }
      });
    },
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
         'Empresarial': '#EA4335',
         'Patrimonial': '#FBBC05',
         'Pyme': '#4285F4',
         'Premium': '#9C27B0',
         'Joven': '#64748B'
      };

      const segments = [...new Set(data.map(item => item.segmento))];
      const datasets = segments.map(seg => ({
        label: seg,
        backgroundColor: segmentColors[seg] || '#5f6368',
        borderColor: segmentColors[seg] || '#5f6368',
        data: data.filter(d => d.segmento === seg).map(d => ({
          x: d.riesgo_abandono_pct,
          y: d.saldo_mxn,
          r: 10,
          nombre: d.nombre,
          segmento: d.segmento
        }))
      }));
      
      const ctx = canvas.getContext('2d');
      const self = this;
      this.fintechChartInstance = new Chart(ctx, {
        type: 'bubble',
        data: { datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (event, elements) => {
            if (elements && elements.length > 0) {
              const el = elements[0];
              const item = datasets[el.datasetIndex].data[el.index];
              if (item && item.nombre) {
                self.userInputFintech = `Analiza el caso de ${item.nombre} con riesgo de abandono del ${item.x}% y saldo de $${item.y.toLocaleString()} MXN. ¿Qué oferta Next-Best-Action recomendamos?`;
                self.$nextTick(() => {
                  const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
                  if (inputEl) inputEl.focus();
                });
              }
            }
          },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const item = context.raw;
                  return `${item.nombre} (${item.segmento}): Riesgo ${item.x}%, Saldo $${item.y.toLocaleString()} MXN`;
                }
              }
            }
          },
          scales: {
            x: { 
              title: { display: true, text: 'Riesgo de Abandono (%)', font: { size: 10 } },
              min: 0, 
              max: 100,
              ticks: { font: { size: 10 } }
            },
            y: { 
              title: { display: true, text: 'Saldo del Cliente ($ MXN)', font: { size: 10 } },
              beginAtZero: true,
              ticks: { 
                font: { size: 10 },
                callback: function(val) {
                  return '$' + (val / 1000000).toFixed(1) + 'M';
                }
              }
            }
          }
        }
      });
    },
    drillDownSegment(seg) {
      this.userInputFintech = seg.prompt;
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
        if (inputEl) inputEl.focus();
      });
    },
    drillDownClient(client) {
      this.userInputFintech = client.prompt;
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
        if (inputEl) inputEl.focus();
      });
    },
    askFintechPrompt(promptText) {
      this.userInputFintech = promptText;
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
        if (inputEl) inputEl.focus();
      });
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
        if (lowerReply.includes('deseas que') || lowerReply.includes('activar') || lowerReply.includes('oferta') || lowerReply.includes('next-best-action')) {
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
