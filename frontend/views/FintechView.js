// FintechView.js - Vista de Inteligencia Financiera: Crédito a Personas, PyMEs y Terminales de Pago (TPVs)

const FintechView = {
  template: `
    <v-container class="pa-2 px-3 flex-grow-1 d-flex flex-column fill-height" style="max-width: 100%; box-sizing: border-box; overflow: hidden;">
      <v-row class="flex-grow-1 my-0" style="height: 100%; max-height: 100%; min-height: 0;">
        
        <!-- Lado Izquierdo: Dashboard Comercial y CDP (3 Pestañas Estratégicas) -->
        <v-col cols="12" sm="7" md="7" lg="7" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column overflow-hidden bg-white" style="height: 100%; max-height: 100%; min-height: 0;">
            
            <!-- Header con Switcher de Tabs & Contexto -->
            <v-card-title class="bg-white pa-3 border-b d-flex align-center justify-space-between flex-shrink-0" style="border-bottom: 1px solid #e8eaed;">
              <div class="d-flex align-center">
                <v-avatar color="#e6f4ea" size="38" class="mr-3">
                  <v-icon color="#188038">mdi-bank</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold" style="color: #188038; line-height: 1.2;">
                    Inteligencia Financiera & Negocios
                  </div>
                  <span class="text-caption text-grey-darken-1">Crédito a Personas, Crédito a PyMEs y Terminales de Pago (TPV)</span>
                </div>
              </div>
              
              <div class="d-flex align-center">
                <v-btn-toggle
                  v-model="fintechTab"
                  mandatory
                  rounded="pill"
                  density="compact"
                  color="#188038"
                  variant="outlined"
                  class="mr-2"
                  style="border-color: #dadce0;"
                  @update:model-value="onFintechTabChange"
                >
                  <v-btn value="overview" size="small" class="text-capitalize font-weight-bold" style="font-size: 11px;">
                    <v-icon start size="14">mdi-account-group-outline</v-icon> Visión CDP
                  </v-btn>
                  <v-btn value="deepdive" size="small" class="text-capitalize font-weight-bold" style="font-size: 11px;">
                    <v-icon start size="14" color="#188038">mdi-store-alert-outline</v-icon> Deep Dive: Comercios
                  </v-btn>
                  <v-btn value="nba" size="small" class="text-capitalize font-weight-bold" style="font-size: 11px;">
                    <v-icon start size="14" color="#188038">mdi-tag-multiple-outline</v-icon> Catálogo & Ofertas
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-card-title>
            
            <v-card-text class="flex-grow-1 pa-3 overflow-y-auto custom-scrollbar" style="background-color: #f8f9fa; min-height: 0;">
              
              <!-- ========================================== -->
              <!-- TAB 1: VISIÓN CDP & SEGMENTOS (OVERVIEW)  -->
              <!-- ========================================== -->
              <div v-show="fintechTab === 'overview'">
                <!-- 4 Macro KPI Cards (Estilo Retail: rounded-xl, 116px altura, números 26px) -->
                <v-row class="mb-2" dense>
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-xl pa-3 pa-md-4 text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #188038; min-height: 116px;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px; letter-spacing: 0.4px;">Clientes & Comercios</div>
                      <div class="font-weight-bold mt-1" style="color: #202124; font-size: 26px; line-height: 1.15;">56,540</div>
                      <v-chip size="x-small" color="#188038" class="font-weight-bold mt-1" variant="tonal">
                        <v-icon start size="10">mdi-bullseye-arrow</v-icon> 10 Micro-Segmentos
                      </v-chip>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-xl pa-3 pa-md-4 text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #188038; min-height: 116px;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px; letter-spacing: 0.4px;">Cartera & Facturación</div>
                      <div class="font-weight-bold mt-1" style="color: #202124; font-size: 26px; line-height: 1.15;">$1,958M</div>
                      <v-chip size="x-small" color="#188038" class="font-weight-bold mt-1" variant="tonal">
                        <v-icon start size="10">mdi-arrow-up</v-icon> +14.2% YoY
                      </v-chip>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-xl pa-3 pa-md-4 text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #5f6368; min-height: 116px;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px; letter-spacing: 0.4px;">Tasa Retención</div>
                      <div class="font-weight-bold mt-1" style="color: #202124; font-size: 26px; line-height: 1.15;">94.1%</div>
                      <v-chip size="x-small" color="#5f6368" class="font-weight-bold mt-1" variant="tonal">
                        +2.8 pts vs Mercado
                      </v-chip>
                    </v-card>
                  </v-col>

                  <v-col cols="6" sm="3">
                    <v-card class="rounded-xl pa-3 pa-md-4 text-center d-flex flex-column justify-center align-center h-100 cursor-pointer" elevation="1" style="border: 1px solid #ceead6; border-top: 3px solid #137333; background-color: #f6fbf7 !important; min-height: 116px;" @click="setFintechTab('deepdive')">
                      <div class="text-caption text-uppercase font-weight-bold" style="color: #137333; font-size: 10px; letter-spacing: 0.4px;">Cartera en Riesgo</div>
                      <div class="font-weight-bold mt-1" style="color: #137333; font-size: 26px; line-height: 1.15;">$38.4M</div>
                      <v-chip size="x-small" color="#188038" class="font-weight-bold mt-1 text-white" variant="flat">
                        <v-icon start size="10">mdi-alert-circle</v-icon> 3 Focos de Riesgo
                      </v-chip>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Gráfica a Toda la Fila: Distribución de Cartera y Tasa de Abandono (Dual Axis) -->
                <v-row dense class="mb-2">
                  <v-col cols="12">
                    <v-card class="pa-3 pa-md-4 rounded-xl bg-white d-flex flex-column" elevation="1" style="border: 1px solid #e8eaed;">
                      <div class="d-flex align-center justify-space-between mb-1">
                        <div>
                          <div class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                            <v-icon size="15" color="#188038" class="mr-1">mdi-chart-line</v-icon> Distribución de Cartera y Tasa de Abandono
                          </div>
                          <span class="text-caption text-grey-darken-1" style="font-size: 10px;">
                            Créditos otorgados y cobros mensuales ($M MXN) vs % Abandono anualizado en los 10 micro-segmentos
                          </span>
                        </div>
                        <v-chip size="x-small" color="#188038" variant="tonal" class="font-weight-bold">
                          Eje Dual
                        </v-chip>
                      </div>

                      <!-- Leyenda de Alto Contraste estilo Retail -->
                      <div class="d-flex align-center flex-wrap my-1" style="gap: 14px; font-size: 10.5px;">
                        <span class="d-flex align-center font-weight-medium" style="color: #188038;">
                          <span style="display:inline-block; width: 10px; height: 10px; border-radius: 2px; background-color: #188038; margin-right: 5px;"></span> Cartera / Facturación ($M MXN)
                        </span>
                        <span class="d-flex align-center font-weight-medium" style="color: #202124;">
                          <v-icon size="14" color="#202124" class="mr-1">mdi-chart-line-variant</v-icon> Tasa Abandono (%)
                        </span>
                        <span class="d-flex align-center font-weight-medium" style="color: #EA4335;">
                          <v-icon size="9" color="#EA4335" class="mr-1">mdi-circle</v-icon> Alerta &gt; 7.5%
                        </span>
                      </div>

                      <div style="position: relative; height: 195px; width: 100%;">
                        <canvas id="fintechCdpChart"></canvas>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Matriz de 10 Micro-Segmentos del CDP & Campañas Digitales Objetivo -->
                <v-card class="mb-2 rounded-xl overflow-hidden bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="pa-2 px-3 d-flex align-center justify-space-between flex-wrap" style="background-color: #f8f9fa; border-bottom: 1px solid #e8eaed; gap: 8px;">
                    <div>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                        <v-icon size="16" color="#188038" class="mr-1">mdi-target-account</v-icon> Matriz de Micro-Segmentos CDP & Campañas de Retención
                      </span>
                      <span class="d-none d-md-inline text-caption text-grey-darken-1 ml-2" style="font-size: 11px;">
                        Crédito a Personas, Crédito a PyMEs y Terminales de Pago (TPV)
                      </span>
                    </div>
                    <v-chip size="x-small" color="#188038" variant="tonal" class="font-weight-bold">
                      10 Audiencias Activas
                    </v-chip>
                  </div>
                  
                  <div class="fintech-matrix-container custom-scrollbar">
                    <table class="retail-matrix-table" style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
                      <colgroup>
                        <col style="width: 40%;">
                        <col style="width: 12%;">
                        <col style="width: 14%;">
                        <col style="width: 11%;">
                        <col style="width: 11%;">
                        <col style="width: 12%;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th style="text-align: left; padding: 8px 12px;">Micro-Segmento & Campaña Digital</th>
                          <th style="text-align: center; padding: 8px 6px;">Total de Clientes</th>
                          <th style="text-align: center; padding: 8px 6px;">Cartera / Facturación</th>
                          <th style="text-align: center; padding: 8px 6px;">Promedio</th>
                          <th style="text-align: center; padding: 8px 4px;">Tasa Abandono</th>
                          <th style="text-align: center; padding: 8px 6px;">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="(seg, idx) in cdpSegments" 
                          :key="seg.name" 
                          :style="seg.isTopOffender ? 'background-color: #f6fbf7; border-left: 4px solid #188038;' : ''"
                        >
                          <td style="text-align: left; padding: 6px 12px; vertical-align: middle;">
                            <div class="d-flex flex-column" style="line-height: 1.35;">
                              <div class="d-flex align-center flex-wrap" style="gap: 4px;">
                                <v-icon color="#188038" size="14" class="mr-1 flex-shrink-0">{{ seg.icon }}</v-icon>
                                <span class="font-weight-bold" style="color: #202124; font-size: 11px;">{{ seg.name }}</span>
                                <v-chip 
                                  v-if="seg.badge" 
                                  size="x-small" 
                                  :color="seg.isTopOffender ? '#188038' : '#5f6368'" 
                                  class="font-weight-bold flex-shrink-0" 
                                  variant="tonal" 
                                  style="height: 15px; font-size: 8px; padding: 0 5px;"
                                >
                                  {{ seg.badge }}
                                </v-chip>
                              </div>
                              <div class="text-caption mt-1" style="font-size: 9.5px; color: #3c4043; white-space: normal; line-height: 1.3; display: flex; align-items: flex-start;">
                                <v-icon size="12" color="#188038" class="mr-1 flex-shrink-0" style="margin-top: 1px;">mdi-bullhorn-outline</v-icon>
                                <span style="white-space: normal; word-break: break-word;">{{ seg.campaign }}</span>
                              </div>
                            </div>
                          </td>
                          <td style="text-align: center; padding: 6px 6px; vertical-align: middle; font-weight: 600; color: #202124; font-size: 11px;">
                            {{ seg.clientsFormatted }}
                          </td>
                          <td style="text-align: center; padding: 6px 6px; vertical-align: middle; font-weight: 700; color: #202124; font-size: 11px;">
                            {{ formatAmount(seg.aum) }}
                          </td>
                          <td style="text-align: center; padding: 6px 6px; vertical-align: middle; color: #3c4043; font-weight: 500; font-size: 11px;">
                            {{ formatAmount(seg.avgBalance) }}
                          </td>
                          <td style="text-align: center; padding: 6px 4px; vertical-align: middle;">
                            <v-chip 
                              size="x-small" 
                              :color="seg.churnRate >= 7.5 ? 'error' : 'success'" 
                              variant="tonal" 
                              class="font-weight-bold justify-center" 
                              style="height: 18px; font-size: 9.5px; min-width: 44px;"
                            >
                              {{ seg.churnRate }}%
                            </v-chip>
                          </td>
                          <td style="text-align: center; padding: 6px 6px; vertical-align: middle;">
                            <v-btn 
                              size="x-small" 
                              variant="flat" 
                              rounded="pill" 
                              :class="seg.isTopOffender ? 'fintech-action-btn-alert' : 'fintech-action-btn-neutral'"
                              style="height: 22px; font-size: 10px; padding: 0 10px;"
                              @click="analyzeSegment(seg)"
                            >
                              <v-icon start size="11">mdi-magnify</v-icon> Analizar
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </v-card>

                <!-- Layout Inferior de 2 Columnas: Donut Chart de Factores de Abandono (1/3) + Tarjetas Estratégicas Apiladas (2/3) -->
                <v-row dense class="mt-2">
                  <!-- Columna 1: Gráfica Monocromática Verde de Causas de Abandono (1/3 de ancho) -->
                  <v-col cols="12" md="4" class="d-flex">
                    <v-card class="pa-3 rounded-xl w-100 bg-white d-flex flex-column justify-space-between" elevation="1" style="border: 1px solid #e8eaed;">
                      <div>
                        <div class="d-flex align-center justify-space-between mb-1">
                          <div class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                            <v-icon size="15" color="#188038" class="mr-1">mdi-chart-donut</v-icon> Motivos Principales de Abandono
                          </div>
                          <v-chip size="x-small" color="#188038" variant="tonal" class="font-weight-bold">$38.4M en Riesgo</v-chip>
                        </div>
                        <span class="text-caption text-grey-darken-1 mb-2 d-block" style="font-size: 10px;">
                          Causas raíz ponderadas por volumen de cartera y facturación en riesgo
                        </span>
                        
                        <div style="position: relative; height: 180px; width: 100%;">
                          <canvas id="fintechCausesPieChart"></canvas>
                        </div>
                      </div>

                      <div class="pa-2 rounded mt-2" style="background-color: #f6fbf7; border-left: 3px solid #188038; font-size: 10px; line-height: 1.35; color: #137333;">
                        <strong>Foco Estratégico:</strong> El 70% del abandono se mitiga con <em>Terminal Smart Cero Renta</em> y <em>Crédito PyME Capital de Trabajo Express</em>.
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Columna 2: Dos Tarjetas de Reto y Oportunidad (2/3 de ancho) -->
                  <v-col cols="12" md="8" class="d-flex flex-column justify-space-between" style="gap: 8px;">
                    <!-- Tarjeta Fila 1: Comercios con TPV Inactiva -->
                    <v-card class="rounded-xl pa-3 bg-white cursor-pointer transition-swing d-flex flex-column justify-space-between flex-grow-1" elevation="1" style="border: 1px solid #ceead6; border-left: 4px solid #188038; background-color: #f6fbf7 !important;" @click="setFintechTab('deepdive')">
                      <div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #137333; font-size: 11px;">
                            <v-icon size="15" color="#188038" class="mr-1">mdi-alert-circle-outline</v-icon> Alerta: Terminales Inactivas y Fuga a Competidores
                          </span>
                          <v-chip size="x-small" color="#188038" variant="flat" class="font-weight-bold text-white" style="height: 18px; font-size: 9.5px;">
                            8.9% Abandono
                          </v-chip>
                        </div>
                        <div class="text-caption font-weight-bold mt-1" style="color: #202124; font-size: 11.5px;">
                          Top Offender: 1,840 Comercios ($18.5M en Facturación)
                        </div>
                        <p class="text-caption text-grey-darken-2 mb-0 mt-1" style="font-size: 10.5px; line-height: 1.35;">
                          Comercios que guardaron la maquinita o migraron cobros a agregadores externos por quejas de comisión o renta mensual fija.
                        </p>
                      </div>
                      <div class="d-flex align-center justify-end mt-2">
                        <span class="text-caption font-weight-bold" style="color: #188038; font-size: 10px;">
                          Explorar Deep Dive Comercios &rarr;
                        </span>
                      </div>
                    </v-card>

                    <!-- Tarjeta Fila 2: Sinergia de Crédito PyME con Terminales de Cobro -->
                    <v-card class="rounded-xl pa-3 bg-white cursor-pointer transition-swing d-flex flex-column justify-space-between flex-grow-1" elevation="1" style="border: 1px solid #e8eaed; border-left: 4px solid #188038;" @click="askFintechPrompt('¿Cómo usar el historial de cobros con tarjeta de nuestras terminales para ofrecer créditos pre-aprobados a las PyMEs?')">
                      <div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #188038; font-size: 11px;">
                            <v-icon size="15" color="#188038" class="mr-1">mdi-lightbulb-outline</v-icon> Sinergia: Crédito Pre-Aprobado por Cobros TPV
                          </span>
                          <v-chip size="x-small" color="#188038" variant="tonal" class="font-weight-bold" style="height: 18px; font-size: 9.5px;">
                            8,150 Comercios
                          </v-chip>
                        </div>
                        <div class="text-caption font-weight-bold mt-1" style="color: #202124; font-size: 11.5px;">
                          Colocación Potencial de $120M MXN en Capital de Trabajo
                        </div>
                        <p class="text-caption text-grey-darken-2 mb-0 mt-1" style="font-size: 10.5px; line-height: 1.35;">
                          Ofrecer créditos automáticos para resurtir inventario sin pedir estados de cuenta ni avales, usando sus ventas diarias con la terminal como garantía.
                        </p>
                      </div>
                      <div class="d-flex align-center justify-end mt-2">
                        <span class="text-caption font-weight-bold" style="color: #188038; font-size: 10px;">
                          Consultar Estrategia con el Agente &rarr;
                        </span>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- ============================================================ -->
              <!-- TAB 2: DEEP DIVE: COMERCIOS & CLIENTES EN RIESGO (SINTÉTICOS) -->
              <!-- ============================================================ -->
              <div v-show="fintechTab === 'deepdive'">
                
                <!-- 1. Executive Diagnostic Banner -->
                <v-card class="pa-3 pa-md-4 mb-2 rounded-xl bg-white" elevation="1" style="border: 1px solid #ceead6; border-left: 4px solid #188038; background-color: #f6fbf7 !important;">
                  <div class="d-flex align-center justify-space-between flex-wrap" style="gap: 8px;">
                    <div>
                      <div class="d-flex align-center">
                        <v-icon color="#188038" size="20" class="mr-2">mdi-store-alert-outline</v-icon>
                        <span class="font-weight-bold text-subtitle-2" style="color: #202124;">
                          Diagnóstico del Segmento Crítico: Comercios con TPV Inactiva & Fuga de Clientes
                        </span>
                      </div>
                      <span class="text-caption text-grey-darken-2" style="font-size: 11px;">
                        Comercios y clientes con caídas drásticas en cobros o pagos, en riesgo de migrar a terminales o créditos de la competencia.
                      </span>
                    </div>

                    <v-chip size="small" color="#188038" variant="flat" class="font-weight-bold text-white">
                      8.9% Tasa de Abandono (Top Offender)
                    </v-chip>
                  </div>

                  <!-- Cinta Ejecutiva de 3 Métricas Críticas -->
                  <v-row dense class="mt-2 pt-2" style="border-top: 1px solid #e8eaed;">
                    <v-col cols="12" sm="4">
                      <div class="pa-2 rounded-lg" style="background-color: #ffffff; border: 1px solid #ceead6;">
                        <span class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 9.5px;">Facturación / Cartera en Riesgo</span>
                        <div class="text-subtitle-2 font-weight-bold" style="color: #188038;">$38.4M MXN</div>
                        <span class="text-caption text-grey-darken-2" style="font-size: 10px;">En terminales y créditos activos</span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="pa-2 rounded-lg" style="background-color: #ffffff; border: 1px solid #e8eaed;">
                        <span class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 9.5px;">Comercios & Clientes en Peligro</span>
                        <div class="text-subtitle-2 font-weight-bold" style="color: #202124;">1,840 Negocios</div>
                        <span class="text-caption text-grey-darken-2" style="font-size: 10px;">Terminales guardadas o sin uso</span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="pa-2 rounded-lg" style="background-color: #ffffff; border: 1px solid #ceead6;">
                        <span class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 9.5px;">Ventana de Rescate Crítica</span>
                        <div class="text-subtitle-2 font-weight-bold" style="color: #137333;">10 Días Promedio</div>
                        <span class="text-caption text-grey-darken-2" style="font-size: 10px;">Antes de cancelar la terminal o crédito</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- 2. Two-Column Analytics: Matriz de Dispersión y Desglose de Capital -->
                <v-row dense class="mb-2">
                  <!-- Columna Izquierda: Gráfica de Burbujas de Riesgo vs Saldo/Cobros -->
                  <v-col cols="12" md="7">
                    <v-card class="pa-3 pa-md-4 rounded-xl h-100 bg-white d-flex flex-column" elevation="1" style="border: 1px solid #e8eaed;">
                      <div class="d-flex align-center justify-space-between mb-1">
                        <div>
                          <span class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                            <v-icon size="14" color="#188038" class="mr-1">mdi-chart-bubble</v-icon> Matriz de Riesgo de Abandono vs Cobros/Saldo ($ MXN)
                          </span>
                          <div class="text-caption text-grey-darken-1" style="font-size: 10px;">Burbuja ponderada por valor del cliente. Clic para consultar al Agente</div>
                        </div>
                      </div>
                      <div style="position: relative; height: 180px; width: 100%;">
                        <canvas id="fintechChart"></canvas>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Columna Derecha: Motivos de Fuga con Escala Monocromática Verde -->
                  <v-col cols="12" md="5">
                    <v-card class="pa-3 pa-md-4 rounded-xl h-100 bg-white d-flex flex-column" elevation="1" style="border: 1px solid #e8eaed;">
                      <div class="font-weight-bold text-caption text-uppercase mb-1" style="color: #202124; font-size: 11.5px;">
                        Distribución de los $38.4M en Riesgo
                      </div>
                      <span class="text-caption text-grey-darken-1 mb-2" style="font-size: 10px;">Desglose por queja o causa raíz principal</span>

                      <div class="flex-grow-1 d-flex flex-column justify-space-around" style="gap: 6px;">
                        <div>
                          <div class="d-flex justify-space-between text-caption font-weight-bold" style="font-size: 10.5px;">
                            <span>Comisión TPV / Agregadores Externos</span>
                            <span style="color: #0d652d;">$14.6M (38.0%)</span>
                          </div>
                          <v-progress-linear model-value="38" color="#0d652d" height="5" rounded class="mt-1"></v-progress-linear>
                        </div>

                        <div>
                          <div class="d-flex justify-space-between text-caption font-weight-bold" style="font-size: 10.5px;">
                            <span>Ofertas de Tasas y Plazos de Bancos</span>
                            <span style="color: #188038;">$12.3M (32.0%)</span>
                          </div>
                          <v-progress-linear model-value="32" color="#188038" height="5" rounded class="mt-1"></v-progress-linear>
                        </div>

                        <div>
                          <div class="d-flex justify-space-between text-caption font-weight-bold" style="font-size: 10.5px;">
                            <span>Terminal Guardada / Falta de Uso</span>
                            <span style="color: #34a853;">$6.9M (18.0%)</span>
                          </div>
                          <v-progress-linear model-value="18" color="#34a853" height="5" rounded class="mt-1"></v-progress-linear>
                        </div>

                        <div>
                          <div class="d-flex justify-space-between text-caption font-weight-bold" style="font-size: 10.5px;">
                            <span>Límites de Crédito Insuficientes</span>
                            <span style="color: #81c995;">$4.6M (12.0%)</span>
                          </div>
                          <v-progress-linear model-value="12" color="#81c995" height="5" rounded class="mt-1"></v-progress-linear>
                        </div>
                      </div>

                      <div class="pa-2 rounded mt-2" style="background-color: #f6fbf7; border-left: 3px solid #188038; font-size: 10px; line-height: 1.35; color: #137333;">
                        <strong>Directiva Comercial:</strong> Ofrecer <em>Terminal Smart Cero Renta</em> y crédito express pre-aprobado para retener el 89% de los negocios.
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- 3. Cartera de Clientes y Comercios Sintéticos con Comportamiento Real (CDP 360°) -->
                <v-card class="mb-2 rounded-xl overflow-hidden bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="pa-2 px-3 d-flex align-center justify-space-between flex-wrap" style="background-color: #f8f9fa; border-bottom: 1px solid #e8eaed; gap: 8px;">
                    <div>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                        <v-icon size="16" color="#188038" class="mr-1">mdi-account-details</v-icon> Cartera Sintética de Comercios & Clientes en Riesgo (CDP 360°)
                      </span>
                      <span class="d-none d-md-inline text-caption text-grey-darken-1 ml-2" style="font-size: 11px;">
                        Comportamiento de cobros con terminal, créditos vigentes y oferta Next-Best-Action
                      </span>
                    </div>
                    <v-chip size="x-small" color="#188038" variant="tonal" class="font-weight-bold">
                      Predicción de Abandono
                    </v-chip>
                  </div>
                  
                  <div class="fintech-matrix-container custom-scrollbar" style="overflow-x: auto; width: 100%;">
                    <table style="width: 100%; min-width: 840px; border-collapse: collapse; font-size: 11.5px; table-layout: fixed;">
                      <colgroup>
                        <col style="width: 22%;"> <!-- Cliente / Negocio -->
                        <col style="width: 13%;"> <!-- Cartera / Facturación -->
                        <col style="width: 34%;"> <!-- Comportamiento Reciente (Espacio amplio para lectura completa) -->
                        <col style="width: 9%;">  <!-- Riesgo Churn -->
                        <col style="width: 12%;"> <!-- Oferta NBA Sugerida -->
                        <col style="width: 10%;"> <!-- Acción -->
                      </colgroup>
                      <thead>
                        <tr style="background-color: #f1f3f4; border-bottom: 2px solid #dadce0; color: #3c4043; font-weight: 700; font-size: 11px; text-transform: uppercase;">
                          <th style="text-align: left; padding: 8px 10px;">Cliente & Negocio</th>
                          <th style="text-align: right; padding: 8px 10px;">Cobros / Saldo</th>
                          <th style="text-align: left; padding: 8px 10px;">Comportamiento Reciente (CDP 360°)</th>
                          <th style="text-align: center; padding: 8px 4px;">Riesgo Churn</th>
                          <th style="text-align: left; padding: 8px 10px;">Oferta NBA</th>
                          <th style="text-align: center; padding: 8px 6px;">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="(client, idx) in syntheticClients" 
                          :key="client.id" 
                          :style="client.churnRisk >= 75 ? 'background-color: #f6fbf7; border-left: 4px solid #188038;' : 'border-bottom: 1px solid #f0f0f0;'"
                        >
                          <!-- Cliente & Negocio -->
                          <td style="text-align: left; padding: 8px 10px; vertical-align: middle;">
                            <div class="d-flex align-center">
                              <v-avatar size="24" :color="client.avatarColor" class="mr-2 text-white font-weight-bold" style="font-size: 10px;">
                                {{ client.initials }}
                              </v-avatar>
                              <div class="d-flex flex-column" style="min-width: 0;">
                                <span class="font-weight-bold text-truncate" style="color: #202124; font-size: 11px;">{{ client.name }}</span>
                                <span class="text-caption text-grey-darken-1" style="font-size: 9.5px; line-height: 1;">
                                  {{ client.negocio }} | {{ client.antiguedad }} años
                                </span>
                              </div>
                            </div>
                          </td>

                          <!-- Cobros / Saldo -->
                          <td style="text-align: right; padding: 8px 10px; vertical-align: middle;">
                            <div class="d-flex flex-column">
                              <span class="font-weight-bold" style="color: #202124; font-size: 11.5px;">{{ client.balance }}</span>
                              <span class="text-caption" style="color: #137333; font-size: 9.5px; line-height: 1;">
                                {{ client.segmento }}
                              </span>
                            </div>
                          </td>

                          <!-- Comportamiento Reciente (Visible completo sin cortes) -->
                          <td style="text-align: left; padding: 8px 10px; vertical-align: middle;">
                            <div style="display: flex; flex-direction: column; gap: 3px; white-space: normal; line-height: 1.35;">
                              <div style="display: flex; align-items: center; color: #188038; font-size: 10.5px; font-weight: 600;">
                                <v-icon size="13" color="#188038" class="mr-1 flex-shrink-0">mdi-alert-circle-outline</v-icon>
                                <span>{{ client.lastMovement }}</span>
                              </div>
                              <div style="display: flex; align-items: center; color: #5f6368; font-size: 10px;">
                                <v-icon size="12" color="#5f6368" class="mr-1 flex-shrink-0">mdi-clock-outline</v-icon>
                                <span>{{ client.lastLogin }} &bull; NPS: {{ client.nps }}</span>
                              </div>
                            </div>
                          </td>

                          <!-- Riesgo Churn -->
                          <td style="text-align: center; padding: 8px 4px; vertical-align: middle;">
                            <v-chip 
                              size="x-small" 
                              :color="client.churnRisk >= 75 ? 'error' : 'success'" 
                              variant="tonal" 
                              class="font-weight-bold justify-center" 
                              style="height: 18px; font-size: 10px; min-width: 46px;"
                            >
                              {{ client.churnRisk }}%
                            </v-chip>
                          </td>

                          <!-- Oferta NBA Sugerida -->
                          <td style="text-align: left; padding: 8px 10px; vertical-align: middle;">
                            <div class="d-flex align-center" style="color: #137333; font-weight: 600; font-size: 10.5px; white-space: normal; line-height: 1.25;">
                              <v-icon size="13" color="#188038" class="mr-1 flex-shrink-0">mdi-lightning-bolt</v-icon>
                              <span>{{ client.nbaOffer }}</span>
                            </div>
                          </td>

                          <!-- Acción -->
                          <td style="text-align: center; padding: 8px 6px; vertical-align: middle;">
                            <v-btn 
                              size="x-small" 
                              variant="flat" 
                              rounded="pill" 
                              class="font-weight-bold text-capitalize text-white fintech-action-btn-alert"
                              style="height: 22px; font-size: 10px; padding: 0 8px;"
                              @click="triggerClientNBO(client)"
                            >
                              <v-icon start size="11">mdi-lightning-bolt</v-icon> Detonar NBO
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </v-card>

                <!-- 4. Plan de Retención Comercial (3 Pilares Sencillos) -->
                <v-card class="pa-3 pa-md-4 rounded-xl bg-white" elevation="1" style="border: 1px solid #ceead6; border-left: 4px solid #188038;">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="d-flex align-center">
                      <v-icon color="#188038" size="18" class="mr-2">mdi-shield-check</v-icon>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                        Plan de Retención Comercial & Reactivación de Cobros
                      </span>
                    </div>
                    <v-chip size="x-small" color="#188038" variant="tonal" class="font-weight-bold">
                      Horizonte: 14 Días de Acción
                    </v-chip>
                  </div>

                  <!-- Cinta Ejecutiva de 3 Métricas del Plan -->
                  <div class="d-flex flex-wrap align-center justify-space-between pa-2 rounded-lg mb-2" style="background-color: #f8f9fa; border: 1px solid #eee; gap: 8px;">
                    <div class="d-flex align-center">
                      <v-badge color="#188038" dot inline class="mr-2"></v-badge>
                      <div>
                        <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Inversión en Incentivos:</span>
                        <div class="font-weight-bold text-caption" style="color: #188038; font-size: 11.5px;">$280,000 MXN</div>
                        <span class="text-caption text-grey-darken-1" style="font-size: 9px;">Bonos de tasa y terminales</span>
                      </div>
                    </div>

                    <div class="d-flex align-center">
                      <v-badge color="#202124" dot inline class="mr-2"></v-badge>
                      <div>
                        <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Cartera & Facturación a Retener:</span>
                        <div class="font-weight-bold text-caption" style="color: #202124; font-size: 11.5px;">$34.2M MXN</div>
                        <span class="text-caption text-grey-darken-1" style="font-size: 9px;">89.0% del total en riesgo</span>
                      </div>
                    </div>

                    <div class="d-flex align-center">
                      <v-badge color="#137333" dot inline class="mr-2"></v-badge>
                      <div>
                        <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Impacto / ROI Estimado:</span>
                        <div class="font-weight-bold text-caption" style="color: #137333; font-size: 11.5px;">122.1x Retorno</div>
                        <span class="text-caption text-grey-darken-1" style="font-size: 9px;">$34.2M retenidos vs $280k</span>
                      </div>
                    </div>
                  </div>

                  <!-- 3 Pilares Tácticos con Estilo Limpio (Títulos en Negrita) -->
                  <v-row dense class="mb-2">
                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f6fbf7; border: 1px solid #ceead6;">
                        <div class="font-weight-bold text-caption" style="color: #137333; font-size: 11px;">
                          1. Terminal Smart Cero Renta
                        </div>
                        <div class="text-caption text-grey-darken-3 mt-1" style="font-size: 10.5px; line-height: 1.4;">
                          Eliminar el cobro de renta mensual fija al comercio si factura al menos $20,000 MXN al mes con tarjeta.
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f6fbf7; border: 1px solid #ceead6;">
                        <div class="font-weight-bold text-caption" style="color: #137333; font-size: 11px;">
                          2. Crédito PyME Express por Cobros TPV
                        </div>
                        <div class="text-caption text-grey-darken-3 mt-1" style="font-size: 10.5px; line-height: 1.4;">
                          Pre-aprobar préstamos de capital de trabajo a los comercios usando sus ventas diarias de la terminal como garantía.
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f6fbf7; border: 1px solid #ceead6;">
                        <div class="font-weight-bold text-caption" style="color: #137333; font-size: 11px;">
                          3. Tarjeta con 2% Cashback y Cero Anualidad
                        </div>
                        <div class="text-caption text-grey-darken-3 mt-1" style="font-size: 10.5px; line-height: 1.4;">
                          Reactivar tarjetas de crédito personales inactivas eliminando la anualidad y premiando sus compras cotidianas.
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Botones de Acción Directos -->
                  <div class="d-flex flex-wrap align-center justify-end mt-2 pt-2" style="border-top: 1px solid #f0f0f0; gap: 8px;">
                    <v-btn 
                      size="small" 
                      variant="outlined" 
                      color="#202124" 
                      class="text-capitalize font-weight-bold" 
                      style="font-size: 11px;"
                      @click="askFintechPrompt('Explica el Plan de Retención Comercial y cómo recuperar los comercios que migraron a agregadores externos')"
                    >
                      <v-icon start size="14">mdi-file-document-outline</v-icon> Consultar Plan
                    </v-btn>
                    
                    <v-btn 
                      size="small" 
                      variant="flat" 
                      color="#188038" 
                      class="text-capitalize font-weight-bold text-white" 
                      style="font-size: 11px;"
                      @click="launchPlanCampaign"
                    >
                      <v-icon start size="14">mdi-rocket-launch</v-icon> Desplegar Campaña en App y Terminales
                    </v-btn>
                  </div>
                </v-card>

              </div>

              <!-- ============================================================ -->
              <!-- TAB 3: CATÁLOGO DE PRODUCTOS & SIMULADOR NEXT-BEST-ACTION   -->
              <!-- ============================================================ -->
              <div v-show="fintechTab === 'nba'">
                
                <!-- Header del Catálogo Oficial -->
                <div class="mb-2 pa-3 pa-md-4 rounded-xl bg-white" style="border: 1px solid #ceead6; border-left: 4px solid #188038; background-color: #f6fbf7 !important;">
                  <div class="d-flex align-center justify-space-between flex-wrap" style="gap: 8px;">
                    <div>
                      <div class="d-flex align-center">
                        <v-icon color="#188038" size="20" class="mr-2">mdi-format-list-bulleted-square</v-icon>
                        <span class="font-weight-bold text-subtitle-2" style="color: #202124;">
                          Catálogo de Soluciones: Crédito a Personas, PyMEs y Terminales de Pago
                        </span>
                      </div>
                      <span class="text-caption text-grey-darken-2" style="font-size: 11px;">
                        Productos tradicionales diseñados para resolver necesidades de crédito y cobro con tarjeta para comercios y personas.
                      </span>
                    </div>
                    <v-chip size="small" color="#188038" variant="flat" class="font-weight-bold text-white">
                      {{ productCatalog.length }} Soluciones Disponibles
                    </v-chip>
                  </div>
                </div>

                <!-- Grid de Soluciones Estructuradas del Catálogo -->
                <v-row dense class="mb-2">
                  <v-col cols="12" md="6" v-for="(prod, idx) in productCatalog" :key="prod.id">
                    <v-card class="pa-3 pa-md-4 rounded-xl h-100 bg-white d-flex flex-column justify-space-between" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #188038;">
                      <div>
                        <div class="d-flex align-center justify-space-between mb-1">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #188038; font-size: 10px;">
                            {{ prod.category }}
                          </span>
                          <v-chip size="x-small" color="#188038" variant="tonal" class="font-weight-bold" style="font-size: 9px; height: 16px;">
                            {{ prod.retentionPower }}% Efectividad
                          </v-chip>
                        </div>

                        <div class="font-weight-bold text-caption text-truncate" style="color: #202124; font-size: 12px;">
                          {{ prod.name }}
                        </div>

                        <p class="text-caption text-grey-darken-3 my-1" style="font-size: 11px; line-height: 1.35;">
                          {{ prod.keyBenefit }}
                        </p>

                        <div class="pa-2 rounded my-1" style="background-color: #f8f9fa; border: 1px solid #eee; font-size: 10px;">
                          <div class="d-flex justify-space-between mb-1">
                            <span class="text-grey-darken-1 font-weight-medium">Margen del Negocio:</span>
                            <span class="font-weight-bold" style="color: #202124;">{{ prod.bankMargin }}</span>
                          </div>
                          <div class="d-flex justify-space-between">
                            <span class="text-grey-darken-1 font-weight-medium">Elegibilidad:</span>
                            <span class="font-weight-bold text-truncate" style="color: #202124; max-width: 60%;">{{ prod.eligibility }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex align-center justify-space-between mt-2 pt-2" style="border-top: 1px solid #f0f0f0;">
                        <span class="text-caption text-grey-darken-2" style="font-size: 9.5px;">{{ prod.impact }}</span>
                        <v-btn 
                          size="x-small" 
                          variant="tonal" 
                          color="#188038" 
                          rounded="pill"
                          class="text-capitalize font-weight-bold" 
                          style="font-size: 10px; height: 22px;"
                          @click="recommendProduct(prod)"
                        >
                          Recomendar
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Simulador Interactivo de Asignación Next-Best-Action -->
                <v-card class="pa-3 pa-md-4 rounded-xl bg-white" elevation="1" style="border: 1px solid #ceead6; border-left: 4px solid #188038;">
                  <div class="d-flex align-center justify-space-between mb-2 flex-wrap" style="gap: 8px;">
                    <div>
                      <div class="font-weight-bold text-caption text-uppercase" style="color: #188038; font-size: 11.5px;">
                        <v-icon size="16" color="#188038" class="mr-1">mdi-tune</v-icon> Simulador Next-Best-Action (NBA) para Comercios y Clientes
                      </div>
                      <span class="text-caption text-grey-darken-1" style="font-size: 10.5px;">
                        Selecciona un cliente o comercio para evaluar la oferta recomendada por IA y la reducción de abandono proyectada
                      </span>
                    </div>

                    <!-- Selector de Cliente con Chips -->
                    <div class="d-flex align-center flex-wrap" style="gap: 5px;">
                      <v-chip 
                        v-for="(sim, idx) in simulatorClients" 
                        :key="sim.id"
                        size="x-small"
                        :variant="selectedSimClient.id === sim.id ? 'flat' : 'outlined'"
                        :color="selectedSimClient.id === sim.id ? '#188038' : '#5f6368'"
                        class="cursor-pointer font-weight-bold"
                        @click="selectedSimClient = sim"
                      >
                        {{ sim.name.split(' ')[0] }} ({{ sim.churnRisk }}%)
                      </v-chip>
                    </div>
                  </div>

                  <!-- Comparativa del Simulador (Cliente vs Oferta vs Proyección) -->
                  <v-row dense class="mt-1">
                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f6fbf7; border: 1px solid #ceead6;">
                        <div class="text-caption font-weight-bold" style="color: #137333; font-size: 11px;">
                          1. Situación Actual del Cliente / Comercio
                        </div>
                        <div class="font-weight-bold text-caption mt-1" style="color: #202124;">
                          {{ selectedSimClient.name }}
                        </div>
                        <div class="text-caption text-grey-darken-3 mt-1" style="font-size: 10px; line-height: 1.35;">
                          <div><strong>Negocio:</strong> {{ selectedSimClient.negocio }}</div>
                          <div><strong>Facturación / Saldo:</strong> {{ selectedSimClient.balance }}</div>
                          <div><strong>Riesgo Abandono:</strong> <span style="color: #EA4335; font-weight: bold;">{{ selectedSimClient.churnRisk }}%</span></div>
                          <div><strong>Motivo:</strong> {{ selectedSimClient.cause }}</div>
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f6fbf7; border: 1px solid #ceead6;">
                        <div class="text-caption font-weight-bold" style="color: #137333; font-size: 11px;">
                          2. Oferta NBA Emparejada por IA
                        </div>
                        <div class="font-weight-bold text-caption mt-1" style="color: #202124;">
                          {{ selectedSimClient.matchedProduct }}
                        </div>
                        <div class="text-caption text-grey-darken-3 mt-1" style="font-size: 10px; line-height: 1.35;">
                          <div><strong>Beneficio:</strong> {{ selectedSimClient.incentive }}</div>
                          <div><strong>Inversión:</strong> {{ selectedSimClient.bankCost }}</div>
                          <div><strong>Canal:</strong> Notificación App + Visita de Asesor</div>
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f8f9fa; border: 1px solid #eee;">
                        <div class="text-caption font-weight-bold" style="color: #202124; font-size: 11px;">
                          3. Impacto de Negocio Proyectado
                        </div>
                        <div class="d-flex align-center justify-space-between mt-1">
                          <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Reducción Abandono:</span>
                          <span class="font-weight-bold" style="color: #137333; font-size: 11px;">{{ selectedSimClient.churnReduction }}</span>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Cobros / Saldo Retenido:</span>
                          <span class="font-weight-bold" style="color: #202124; font-size: 11px;">{{ selectedSimClient.retainedCapital }}</span>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Retorno Estimado:</span>
                          <span class="font-weight-bold" style="color: #188038; font-size: 11px;">{{ selectedSimClient.roi }}</span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Botón de Despliegue desde Simulador -->
                  <div class="d-flex align-center justify-end mt-2 pt-2" style="border-top: 1px solid #f0f0f0;">
                    <v-btn 
                      size="small" 
                      color="#188038" 
                      rounded="pill"
                      class="text-capitalize font-weight-bold text-white" 
                      style="font-size: 11px;"
                      @click="deploySimOffer"
                    >
                      <v-icon start size="14">mdi-send-check</v-icon> Activar Oferta en Terminal / App Móvil y Enviar Asesor
                    </v-btn>
                  </div>
                </v-card>

              </div>

            </v-card-text>
          </v-card>
        </v-col>

        <!-- Lado Derecho: Chatbot de Inteligencia Financiera & Retención -->
        <v-col cols="12" sm="5" md="5" lg="5" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column bg-grey-lighten-4 overflow-hidden" style="height: 100%; max-height: 100%; min-height: 0;">
            <v-card-title class="bg-white pa-3 font-weight-bold d-flex align-center justify-space-between flex-shrink-0" style="color: #202124; border-bottom: 1px solid #eee;">
              <div class="d-flex align-center">
                <v-icon color="#188038" class="mr-2">mdi-robot-outline</v-icon>
                Agente de Inteligencia Financiera
              </div>
              <v-chip size="x-small" color="#188038" variant="tonal" class="font-weight-bold">Crédito & TPVs</v-chip>
            </v-card-title>

            <!-- Sugerencias / Chips de Preguntas Rápidas (Estilo Retail: Sin emojis, tonal en color primario) -->
            <div class="px-3 py-2 bg-white d-flex flex-wrap flex-shrink-0" style="gap: 5px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" variant="tonal" color="#188038" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('¿Por qué 1,840 comercios guardaron sus terminales de cobro (8.9% de abandono) y cómo los recuperamos?')">
                <v-icon start size="12">mdi-credit-card-off</v-icon> Terminales Inactivas ($185M)
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#188038" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('Revisa el caso de Bernardo Salcedo (Restaurante Los Candiles, $450k facturación mensual) en riesgo de abandono')">
                <v-icon start size="12">mdi-silverware-fork-knife</v-icon> Restaurante Los Candiles
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#188038" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('¿Cómo usar las ventas que cobran los comercios en nuestras terminales para ofrecerles crédito de capital de trabajo?')">
                <v-icon start size="12">mdi-point-of-sale</v-icon> Sinergia TPV + Crédito
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#188038" class="cursor-pointer font-weight-bold" @click="askFintechPrompt('¿Cuáles son las soluciones del catálogo y cómo evitan la fuga de clientes de crédito personal y PyME?')">
                <v-icon start size="12">mdi-briefcase-outline</v-icon> Catálogo de Soluciones
              </v-chip>
            </div>

            <!-- Área de mensajes -->
            <v-card-text class="chat-container flex-grow-1 pa-3 overflow-y-auto custom-scrollbar" id="chat-box-fintech" style="min-height: 0; flex: 1 1 0; background-color: #f8f9fa;">
              <div v-for="(msg, index) in messagesFintech" :key="index" style="clear: both; width: 100%;">
                <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" :style="msg.role === 'ai' ? 'border-left: 4px solid #188038;' : ''">
                  <div v-if="msg.role === 'ai'" v-html="formatResponse(msg.content)"></div>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>
              
              <div v-if="loadingFintech" class="chat-bubble-ai" style="border-left: 4px solid #188038; clear: both;">
                <v-progress-circular indeterminate color="#188038" size="18" class="mr-2"></v-progress-circular>
                Analizando historial del comercio y formulando oferta de retención...
              </div>

              <!-- Tarjeta de Acción / Activación de Oferta NBA Dinámica -->
              <div v-if="showOfferAction" class="my-3" style="clear: both; width: 100%;">
                <v-card class="pa-3 rounded-xl bg-white elevation-1" style="border: 1px solid #ceead6; border-left: 4px solid #188038;">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #137333;">
                      <v-icon size="16" color="#188038" class="mr-1">mdi-lightning-bolt</v-icon> Oferta de Retención Lista
                    </span>
                    <v-chip size="x-small" color="#188038" variant="flat" class="font-weight-bold text-white">Aprobación Inmediata</v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-2 my-2" style="line-height: 1.4;">
                    {{ pendingOfferText || 'Terminal Smart 4G Cero Renta + Reducción de comisión al 1.75% por volumen facturado.' }}
                  </div>
                  <v-btn color="#188038" size="small" block rounded="pill" elevation="1" @click="launchOffer" class="font-weight-bold text-white text-capitalize">
                    <v-icon start size="16">mdi-send-check</v-icon> Activar Oferta en Terminal / App y Asignar Visita
                  </v-btn>
                </v-card>
              </div>

              <div v-if="offerLaunched" class="my-3 pa-3 rounded-xl bg-green-lighten-5 text-center text-success font-weight-bold text-caption" style="clear: both; border: 1px solid #ceead6; width: 100%;">
                <v-icon left color="success" size="18">mdi-check-circle</v-icon> ¡Oferta activada con éxito en la app/terminal del cliente y tarea enviada al asesor comercial!
              </div>

            </v-card-text>

            <!-- Input -->
            <v-card-actions class="pa-3 bg-white flex-shrink-0" style="border-top: 1px solid #eee;">
              <v-text-field
                v-model="userInputFintech"
                variant="outlined"
                density="compact"
                placeholder="Pregúntale al agente sobre créditos, terminales o clientes..."
                hide-details
                rounded="pill"
                @keyup.enter="sendMessageFintech"
                color="#188038"
              >
                <template v-slot:append-inner>
                  <v-btn icon color="#188038" @click="sendMessageFintech" :disabled="loadingFintech || !userInputFintech.trim()" variant="text">
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
        { role: 'ai', content: '¡Hola! Soy tu Agente de Inteligencia Financiera & Retención. Gestiono la cartera de Crédito a Personas, Crédito a PyMEs y Terminales de Pago (TPV). Te ayudo a entender los 10 micro-segmentos del CDP, identificar comercios en riesgo de irse con la competencia y desplegar ofertas pre-aprobadas con alto impacto. ¿Por dónde empezamos?' }
      ],
      fintechChartInstance: null,
      fintechCdpChartInstance: null,
      fintechCausesPieChartInstance: null,
      showOfferAction: false,
      offerLaunched: false,
      pendingOfferText: '',

      // 10 Micro-Segmentos Tradicionales del CDP (Crédito Personas, PyMEs y Terminales de Pago)
      cdpSegments: [
        {
          name: "Comercios con TPV Inactiva (Riesgo Fuga)",
          shortName: "TPV: Inactivas",
          icon: "mdi-credit-card-off-outline",
          barColor: "#0d652d",
          badge: "Riesgo Alto",
          badgeColor: "#188038",
          badgeVariant: "tonal",
          campaign: "Campaña Rescate TPV: 0% comisión los primeros $50k procesados + terminal Smart 4G gratis",
          clientsFormatted: "1,840",
          aum: "$185M",
          aumNum: 185,
          avgBalance: "$100.5k",
          churnRate: 8.9,
          isTopOffender: true,
          prompt: "Analiza el micro-segmento de Comercios con TPV Inactiva: ¿Por qué 1,840 comercios guardaron la maquinita (8.9% abandono) y cómo reactivarlos con la Terminal Smart Cero Renta?"
        },
        {
          name: "Tiendas y Abarrotes con TPV Activa",
          shortName: "TPV: Abarrotes",
          icon: "mdi-store-outline",
          barColor: "#137333",
          badge: "Alta Frecuencia",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          campaign: "Campaña Tasa por Volumen: Reducción al 1.8% al superar $40,000/mes en ventas con tarjeta",
          clientsFormatted: "6,420",
          aum: "$290.4M",
          aumNum: 290.4,
          avgBalance: "$45.2k",
          churnRate: 4.1,
          isTopOffender: false,
          prompt: "Evalúa el segmento Tiendas y Abarrotes con TPV Activa: ¿Cómo premiar su alta transaccionalidad para blindar su fidelidad frente a otros agregadores?"
        },
        {
          name: "Restaurantes y Bares con TPV",
          shortName: "TPV: Restaurantes",
          icon: "mdi-silverware-fork-knife",
          barColor: "#188038",
          badge: "Consumo Alto",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          campaign: "Campaña Gastro-Pro: Terminal inalámbrica 4G sin renta mensual con propina electrónica directa",
          clientsFormatted: "3,850",
          aum: "$245.8M",
          aumNum: 245.8,
          avgBalance: "$63.8k",
          churnRate: 5.3,
          isTopOffender: false,
          prompt: "Revisa el segmento Restaurantes y Bares con TPV: ¿Qué valor aporta la terminal portátil 4G con propina en mesa y depósito de ventas en 24h?"
        },
        {
          name: "Profesionales y Consultorios con TPV",
          shortName: "TPV: Consultorios",
          icon: "mdi-doctor",
          barColor: "#1e8e3e",
          badge: "Servicios",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          campaign: "Campaña Salud & Servicios: Terminal portátil Bluetooth sin cobro de renta mensual fija",
          clientsFormatted: "4,680",
          aum: "$142.5M",
          aumNum: 142.5,
          avgBalance: "$30.4k",
          churnRate: 4.8,
          isTopOffender: false,
          prompt: "Analiza el segmento Profesionales y Consultorios Médicos: ¿Cómo evitar que dejen de cobrar con tarjeta eliminando la renta mensual fija?"
        },
        {
          name: "PyMEs: Crédito para Inventario",
          shortName: "PyMEs: Inventario",
          icon: "mdi-warehouse",
          barColor: "#2da94f",
          badge: "Excelente Pago",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          campaign: "Campaña Temporada Alta: Préstamo express pre-aprobado para resurtido con abono semanal cómodo",
          clientsFormatted: "3,920",
          aum: "$310.2M",
          aumNum: 310.2,
          avgBalance: "$79.1k",
          churnRate: 3.9,
          isTopOffender: false,
          prompt: "Presenta la estrategia para PyMEs que solicitan Crédito para Inventario: ¿Cómo renovar sus préstamos de forma automática antes de que busquen otra opción?"
        },
        {
          name: "PyMEs en Riesgo por Ofertas de Bancos",
          shortName: "PyMEs: Fuga Bancos",
          icon: "mdi-bank-transfer",
          barColor: "#34a853",
          badge: "Riesgo Alto",
          badgeColor: "#188038",
          badgeVariant: "tonal",
          campaign: "Campaña Blindaje PyME: Renovación anticipada a tasa preferencial sin comisión por apertura",
          clientsFormatted: "1,480",
          aum: "$225.6M",
          aumNum: 225.6,
          avgBalance: "$152.4k",
          churnRate: 8.3,
          isTopOffender: true,
          prompt: "Evalúa las PyMEs en Riesgo por Ofertas de Bancos Tradicionales: ¿Cómo retener a 1,480 empresas medianas con una línea de crédito revolvente más ágil?"
        },
        {
          name: "Talleres y Pequeñas Fábricas (Expansión)",
          shortName: "PyMEs: Expansión",
          icon: "mdi-factory",
          barColor: "#46b765",
          badge: "Equipamiento",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          campaign: "Campaña Equipamiento: Financiamiento a 36 meses con 2 meses de gracia para maquinaria",
          clientsFormatted: "2,750",
          aum: "$188.4M",
          aumNum: 188.4,
          avgBalance: "$68.5k",
          churnRate: 4.4,
          isTopOffender: false,
          prompt: "Explica la propuesta para Talleres y Pequeñas Fábricas: ¿Cómo financiar su maquinaria productiva para afianzar su lealtad crediticia?"
        },
        {
          name: "Personas: Préstamos con Pago Puntual",
          shortName: "Personas: Buen Pago",
          icon: "mdi-account-check-outline",
          barColor: "#5bb974",
          badge: "Bajo Riesgo",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          campaign: "Campaña Recompensa Puntual: Ampliación de préstamo pre-aprobado con menor tasa de interés",
          clientsFormatted: "14,200",
          aum: "$165M",
          aumNum: 165,
          avgBalance: "$11.6k",
          churnRate: 3.5,
          isTopOffender: false,
          prompt: "Revisa el segmento Personas con Pago Puntual: ¿Cómo ofrecerles un segundo préstamo o ampliación de línea con abonos fijos?"
        },
        {
          name: "Personas: Tarjetas de Crédito Inactivas",
          shortName: "Tarjetas Inactivas",
          icon: "mdi-credit-card-clock-outline",
          barColor: "#81c995",
          badge: "Inactividad",
          badgeColor: "#5f6368",
          badgeVariant: "tonal",
          campaign: "Campaña Reactivación: 10% de cashback en compras del súper + 3 meses sin intereses",
          clientsFormatted: "11,800",
          aum: "$118.2M",
          aumNum: 118.2,
          avgBalance: "$10k",
          churnRate: 7.6,
          isTopOffender: false,
          prompt: "Evalúa las Tarjetas de Crédito Inactivas: ¿Qué incentivo de cashback o meses sin intereses se requiere para que saquen la tarjeta del cajón?"
        },
        {
          name: "Personas: En Riesgo por Compra de Deuda",
          shortName: "Personas: Fuga Deuda",
          icon: "mdi-account-alert-outline",
          barColor: "#a8dab5",
          badge: "Riesgo Alto",
          badgeColor: "#188038",
          badgeVariant: "tonal",
          campaign: "Campaña Consolidación: Ajuste de cuota mensual y bonificación de la última mensualidad",
          clientsFormatted: "5,600",
          aum: "$86.5M",
          aumNum: 86.5,
          avgBalance: "$15.4k",
          churnRate: 8.1,
          isTopOffender: true,
          prompt: "Analiza a las Personas en Riesgo por Compra de Deuda: 5,600 clientes con ofertas de otros bancos. ¿Cómo consolidar su crédito para no perderlos?"
        }
      ],

      // Cartera de Clientes y Comercios Sintéticos
      syntheticClients: [
        {
          id: "CLI-8821",
          name: "Bernardo Salcedo Valdés",
          negocio: "Restaurante Los Candiles",
          segmento: "Terminales de Pago",
          initials: "BS",
          avatarColor: "#0d652d",
          antiguedad: 5,
          balance: "$450,000/mes",
          balanceNum: 450000,
          cltv: "$380k",
          churnRisk: 74,
          lastLogin: "Hace 15 días (Terminal guardada)",
          lastMovement: "Bajó cobros 60% por probar terminal portátil externa con menor tasa inicial",
          nps: "4/10 (Detractor)",
          cause: "Cobro de renta mensual fija de la terminal y comisión no competitiva",
          nbaOffer: "Terminal Smart 4G Cero Renta + Comisión 1.75% por volumen",
          prompt: "Analiza a Bernardo Salcedo (Restaurante Los Candiles, $450k facturación mensual, 74% riesgo). Bajó 60% sus cobros con nosotros por probar terminales externas. ¿Cómo recuperarlo con la Terminal Smart Cero Renta?"
        },
        {
          id: "CLI-9042",
          name: "Familia Navarro Benítez",
          negocio: "Mini-Súper El Progreso",
          segmento: "Crédito a PyMEs & TPV",
          initials: "FN",
          avatarColor: "#188038",
          antiguedad: 8,
          balance: "$850,000",
          balanceNum: 850000,
          cltv: "$520k",
          churnRisk: 81,
          lastLogin: "Ayer (Consulta de crédito en app)",
          lastMovement: "Solicitó crédito de $400k para inventario; banco comercial tarda 3 semanas",
          nps: "6/10 (Pasivo)",
          cause: "Urgencia de capital de trabajo rápido para surtir abarrotes antes de temporada",
          nbaOffer: "Crédito PyME Express Capital de Trabajo ($400k en 24h)",
          prompt: "Analiza el caso de Familia Navarro Benítez (Mini-Súper El Progreso, 81% riesgo). Necesitan crédito express de $400k para inventario. ¿Cómo autorizarlo en 24h basado en sus cobros de terminal?"
        },
        {
          id: "CLI-6619",
          name: "Fernando Zepeda Olvera",
          negocio: "Consultorio Dental Zepeda",
          segmento: "Terminales de Pago",
          initials: "FZ",
          avatarColor: "#2da94f",
          antiguedad: 3,
          balance: "$180,000/mes",
          balanceNum: 180000,
          cltv: "$140k",
          churnRisk: 79,
          lastLogin: "Hace 25 días (Sin cobros)",
          lastMovement: "Pide a sus pacientes pagar por SPEI para evitar renta mensual de la terminal",
          nps: "3/10 (Detractor)",
          cause: "Cobro de renta mensual fija de la terminal cuando tiene pocos cobros al mes",
          nbaOffer: "Migración a Terminal Portátil Bluetooth 0% renta fija",
          prompt: "Recomienda estrategia para Fernando Zepeda Olvera (Consultorio Dental Zepeda, 79% riesgo). Cambiar su terminal a modelo Bluetooth sin renta mensual fija."
        },
        {
          id: "CLI-5120",
          name: "Mariana Treviño Cárdenas",
          negocio: "Boutique & Calzado La Moda",
          segmento: "Terminales de Pago & Crédito PyME",
          initials: "MT",
          avatarColor: "#188038",
          antiguedad: 4,
          balance: "$320,000/mes",
          balanceNum: 320000,
          cltv: "$260k",
          churnRisk: 76,
          lastLogin: "Hace 18 días (Cobros cayeron 45%)",
          lastMovement: "Empezó a cobrar con terminales portátiles y links de WhatsApp por falta de link digital integrado",
          nps: "4/10 (Detractor)",
          cause: "Falta de link de pago por WhatsApp y comisiones altas en ventas por redes sociales",
          nbaOffer: "Cobro Digital & Link de Pago QR sin comisión adicional + Terminal Smart 4G",
          prompt: "Analiza el caso de Mariana Treviño (Boutique La Moda, 76% riesgo). Requiere link de pago por WhatsApp y terminal 4G. ¿Cómo reactivar sus cobros?"
        },
        {
          id: "CLI-4409",
          name: "Roberto Alcocer Mendoza",
          negocio: "Farmacia & Droguería El Carmen",
          segmento: "Terminales de Pago & PyMEs",
          initials: "RA",
          avatarColor: "#137333",
          antiguedad: 6,
          balance: "$680,000/mes",
          balanceNum: 680000,
          cltv: "$490k",
          churnRisk: 68,
          lastLogin: "Ayer (Transaccional regular)",
          lastMovement: "Banco competidor le ofreció tasa de adquirencia del 1.65% y crédito de $500,000",
          nps: "6/10 (Pasivo)",
          cause: "Competencia agresiva de bancos en comisión adquirente y crédito comercial",
          nbaOffer: "Tasa Preferencial por Volumen (1.60%) + Crédito PyME Express",
          prompt: "Evalúa a Roberto Alcocer (Farmacia El Carmen, $680k facturación mensual, 68% riesgo). ¿Cómo blindar su cuenta adquirente con tasa preferencial del 1.60%?"
        },
        {
          id: "CLI-7215",
          name: "Sofía Paredes Rangel",
          negocio: "Pastelería & Cafetería Dulce Miga",
          segmento: "Terminales de Pago",
          initials: "SP",
          avatarColor: "#0d652d",
          antiguedad: 3,
          balance: "$210,000/mes",
          balanceNum: 210000,
          cltv: "$175k",
          churnRisk: 82,
          lastLogin: "Hace 22 días (Terminales desconectadas)",
          lastMovement: "Guardó 2 terminales nuestras tras fallas de Wi-Fi en horas pico y probó terminales de un agregador externo",
          nps: "3/10 (Detractor)",
          cause: "Fallas de señal en terminales viejas y cobro de renta mensual fija de $450 por equipo",
          nbaOffer: "Reemplazo express por 2 Terminales Smart con SIM 4G y Cero Renta Fija",
          prompt: "Diseña estrategia de rescate para Sofía Paredes (Pastelería Dulce Miga, 82% riesgo). Reemplazar sus 2 terminales antiguas por Smart 4G multicarrier sin renta fija."
        },
        {
          id: "CLI-3904",
          name: "Héctor Morales Galindo",
          negocio: "Ferretería & Materiales San Marcos",
          segmento: "Crédito a PyMEs",
          initials: "HM",
          avatarColor: "#2da94f",
          antiguedad: 7,
          balance: "$1,650,000",
          balanceNum: 1650000,
          cltv: "$820k",
          churnRisk: 72,
          lastLogin: "Hace 5 días",
          lastMovement: "Cotizó crédito automotriz con financiera externa para camioneta de reparto",
          nps: "5/10 (Detractor)",
          cause: "Necesidad de financiamiento para vehículo de carga ligera sin descapitalizar su inventario",
          nbaOffer: "Crédito Equipamiento & Transporte PyME a 48 meses con tasa fija preferencial",
          prompt: "Analiza a Héctor Morales (Ferretería San Marcos, $1.65M saldo/ventas, 72% riesgo). Necesita crédito para vehículo de reparto. ¿Cómo ofrecer financiamiento de equipamiento comercial?"
        },
        {
          id: "CLI-7703",
          name: "Guillermo Montemayor Lozano",
          negocio: "Taller & Refacciones San Juan",
          segmento: "Crédito a PyMEs",
          initials: "GM",
          avatarColor: "#34a853",
          antiguedad: 10,
          balance: "$1,200,000",
          balanceNum: 1200000,
          cltv: "$650k",
          churnRisk: 24,
          lastLogin: "Hace 2 días",
          lastMovement: "Crédito actual al corriente con solo 3 mensualidades restantes",
          nps: "8/10 (Promotor)",
          cause: "Riesgo de que un banco comercial le ofrezca un crédito nuevo antes que nosotros",
          nbaOffer: "Línea de Crédito Revolvente PyME pre-autorizada",
          prompt: "Evalúa la renovación para Guillermo Montemayor Lozano (Taller & Refacciones San Juan, $1.2M crédito). Ofrecerle línea de crédito revolvente antes de que termine de pagar su crédito actual."
        },
        {
          id: "CLI-8310",
          name: "Valeria Santillán Vega",
          negocio: "Cliente Individual",
          segmento: "Crédito a Personas",
          initials: "VS",
          avatarColor: "#137333",
          antiguedad: 4,
          balance: "$120,000",
          balanceNum: 120000,
          cltv: "$85k",
          churnRisk: 59,
          lastLogin: "Hace 3 días",
          lastMovement: "Consultó trámite de cancelación de tarjeta tras ver cargo de anualidad",
          nps: "5/10 (Detractor)",
          cause: "Cobro de anualidad y falta de recompensas comparado con nuevas tarjetas de crédito digitales",
          nbaOffer: "Condonación de anualidad de por vida + Tarjeta con 2% Cashback",
          prompt: "Diseña oferta de retención para Valeria Santillán Vega (Crédito a Personas, 59% riesgo). Condonar anualidad y activar 2% de cashback en compras."
        }
      ],

      // Catálogo de Productos Comerciales y Financieros
      productCatalog: [
        {
          id: "PROD-TPV-SMART",
          name: "Terminal Smart 4G Cero Renta",
          category: "Terminales de Pago (TPV)",
          keyBenefit: "0% costo de renta mensual al facturar más de $20,000 MXN al mes + chip 4G ilimitado y depósito en 24h.",
          bankMargin: "1.60% comisión neta por transacción",
          eligibility: "Comercios, tiendas, restaurantes y consultorios con cobro con tarjeta",
          retentionPower: 92,
          impact: "Evita que el comercio guarde la terminal o migre cobros hacia agregadores externos",
          prompt: "¿Cómo funciona la oferta de Terminal Smart 4G Cero Renta para recuperar comercios que dejaron de facturar con nosotros?"
        },
        {
          id: "PROD-TPV-TASA",
          name: "Tasa Preferencial por Volumen TPV",
          category: "Terminales de Pago (TPV)",
          keyBenefit: "Reducción de comisión del 2.5% al 1.75% por facturación mensual mayor a $80,000 MXN.",
          bankMargin: "1.10% margen adquirente",
          eligibility: "Comercios de alta transaccionalidad (abarrotes, farmacias, restaurantes)",
          retentionPower: 89,
          impact: "Blinda la facturación de comercios medianos frente a ofertas de otros agregadores",
          prompt: "Explica el beneficio de la Tasa Preferencial por Volumen para comercios con facturación superior a $80k mensuales."
        },
        {
          id: "PROD-CRED-PYME",
          name: "Crédito PyME Capital de Trabajo",
          category: "Crédito a PyMEs",
          keyBenefit: "Préstamo express de hasta $1.5M MXN pre-aprobado automáticamente con base en las ventas de la terminal.",
          bankMargin: "3.50% spread neto anual",
          eligibility: "PyMEs y comercios con al menos 6 meses facturando con nuestras terminales",
          retentionPower: 86,
          impact: "Fideliza al comercio conectando sus cobros diarios con financiamiento ágil para inventario",
          prompt: "¿Cómo calculamos el Crédito PyME Capital de Trabajo usando los cobros mensuales de la terminal como garantía?"
        },
        {
          id: "PROD-PYME-LINEA",
          name: "Línea de Crédito Revolvente PyME",
          category: "Crédito a PyMEs",
          keyBenefit: "Línea siempre disponible para emergencias o proveedores; solo pagas intereses por el dinero que utilizas.",
          bankMargin: "2.90% margen financiero",
          eligibility: "Negocios formales con facturación anual superior a $1.0M MXN",
          retentionPower: 81,
          impact: "Previene que las PyMEs busquen créditos más caros y lentos en bancos tradicionales",
          prompt: "¿Qué ventajas ofrece la Línea de Crédito Revolvente PyME frente a un préstamo bancario tradicional?"
        },
        {
          id: "PROD-PREST-PERS",
          name: "Préstamo Personal Express a Tasa Fija",
          category: "Crédito a Personas",
          keyBenefit: "Préstamo en 15 minutos de hasta $250,000 MXN con abonos fijos mensuales y depósito directo en cuenta.",
          bankMargin: "4.20% spread neto",
          eligibility: "Personas físicas con historial crediticio positivo y comprobante de ingresos",
          retentionPower: 84,
          impact: "Otorga liquidez inmediata sin burocracia bancaria y frena la salida hacia otras financieras",
          prompt: "¿Cómo el Préstamo Personal Express ayuda a retener a clientes con buen récord de pago?"
        },
        {
          id: "PROD-CARD-CASHBACK",
          name: "Tarjeta de Crédito con 2% Cashback",
          category: "Crédito a Personas",
          keyBenefit: "Sin anualidad de por vida gastando $2,000/mes + 2% de cashback directo en todas las compras.",
          bankMargin: "1.80% tasa de intercambio (Interchange Fee)",
          eligibility: "Personas físicas con ingresos mensuales superiores a $15,000 MXN",
          retentionPower: 88,
          impact: "Reactiva el uso diario de tarjetas inactivas en cajón y previene cancelaciones",
          prompt: "¿Cómo la Tarjeta con 2% Cashback y sin anualidad compite exitosamente contra nuevas tarjetas digitales del mercado?"
        },
        {
          id: "PROD-TPV-DIGITAL",
          name: "Cobro Digital & Link de Pago QR",
          category: "Terminales de Pago (TPV)",
          keyBenefit: "Cobra a distancia por WhatsApp, redes sociales y código QR sin mensualidad ni costos fijos, unificado a tu cuenta de terminal.",
          bankMargin: "1.95% comisión fija por cobro digital",
          eligibility: "Comercios, boutiques, restaurantes y profesionistas con venta a distancia o delivery",
          retentionPower: 91,
          impact: "Evita que los comercios usen links de pago de agregadores externos para sus ventas por internet",
          prompt: "¿Cómo el Cobro Digital y Link de Pago QR ayuda a retener comercios con venta por internet o WhatsApp?"
        },
        {
          id: "PROD-PYME-EQUIPO",
          name: "Crédito Equipamiento & Transporte PyME",
          category: "Crédito a PyMEs",
          keyBenefit: "Financiamiento de hasta $2.5M MXN a 36-48 meses con cuota fija para vehículos de reparto, maquinaria comercial y equipamiento.",
          bankMargin: "3.80% spread neto anual",
          eligibility: "Negocios y PyMEs con más de 12 meses de operación formal y facturación demostrable",
          retentionPower: 87,
          impact: "Frena la migración de PyMEs consolidadas hacia arrendadoras externas o financieras automotrices",
          prompt: "¿Cómo opera el Crédito Equipamiento y Transporte PyME para financiar maquinaria o vehículos comerciales sin descapitalizar al negocio?"
        }
      ],

      // Clientes para el Simulador NBA
      simulatorClients: [
        {
          id: "CLI-8821",
          name: "Bernardo Salcedo Valdés",
          negocio: "Restaurante Los Candiles (3 Terminales)",
          balance: "$450,000/mes",
          cltv: "$380,000",
          churnRisk: 74,
          cause: "Guardó la terminal por cobro de renta mensual fija y tasa del 2.5%",
          matchedProduct: "Terminal Smart 4G Cero Renta + Comisión 1.75%",
          incentive: "0% renta mensual garantizada + chip 4G sin costo",
          bankCost: "$1,800 MXN (Costo de terminal y activación)",
          churnReduction: "74% → 16% (-58 pts)",
          retainedCapital: "$450,000 MXN/mes",
          roi: "95.0x",
          prompt: "Simular y activar oferta para Bernardo Salcedo (Restaurante Los Candiles): Terminal Smart Cero Renta y tasa del 1.75%."
        },
        {
          id: "CLI-9042",
          name: "Familia Navarro Benítez",
          negocio: "Mini-Súper El Progreso (Crédito & 2 TPVs)",
          balance: "$850,000",
          cltv: "$520,000",
          churnRisk: 81,
          cause: "Necesitan crédito de $400k urgente para inventario de abarrotes",
          matchedProduct: "Crédito PyME Express Capital de Trabajo",
          incentive: "Aprobación express de $400k en 24h con cobro automático semanal",
          bankCost: "$8,000 MXN (Subsidio de apertura)",
          churnReduction: "81% → 18% (-63 pts)",
          retainedCapital: "$850,000 MXN",
          roi: "106.2x",
          prompt: "Simular y activar oferta para Familia Navarro Benítez: Crédito PyME de $400k para inventario en 24h sin aval."
        },
        {
          id: "CLI-6619",
          name: "Fernando Zepeda Olvera",
          negocio: "Consultorio Dental Zepeda",
          balance: "$180,000/mes",
          cltv: "$140,000",
          churnRisk: 79,
          cause: "Pide pagos por SPEI para no pagar la renta mensual de la terminal",
          matchedProduct: "Terminal Portátil Bluetooth 0% Renta Fija",
          incentive: "Cero renta mensual fija; solo paga comisión por cobro realizado",
          bankCost: "$950 MXN (Terminal portátil)",
          churnReduction: "79% → 20% (-59 pts)",
          retainedCapital: "$180,000 MXN/mes",
          roi: "72.4x",
          prompt: "Simular y activar oferta para Fernando Zepeda Olvera: Terminal Portátil Bluetooth sin renta mensual fija."
        },
        {
          id: "CLI-5120",
          name: "Mariana Treviño Cárdenas",
          negocio: "Boutique La Moda (Cobros Redes Sociales)",
          balance: "$320,000/mes",
          cltv: "$260,000",
          churnRisk: 76,
          cause: "Cobra con agregadores externos por carecer de link de pago por WhatsApp integrado",
          matchedProduct: "Cobro Digital & Link de Pago QR (Cero Comisión Extra)",
          incentive: "Habilitación inmediata de links de pago sin renta y terminal Smart 4G",
          bankCost: "$1,500 MXN (Activación digital y terminal)",
          churnReduction: "76% → 19% (-57 pts)",
          retainedCapital: "$320,000 MXN/mes",
          roi: "85.3x",
          prompt: "Simular y activar oferta para Mariana Treviño (Boutique La Moda): Link de cobro digital por WhatsApp y terminal Smart 4G."
        },
        {
          id: "CLI-3904",
          name: "Héctor Morales Galindo",
          negocio: "Ferretería San Marcos (Flotilla Reparto)",
          balance: "$1,650,000",
          cltv: "$820,000",
          churnRisk: 72,
          cause: "Busca crédito automotriz con financiera externa para camioneta de reparto",
          matchedProduct: "Crédito Equipamiento & Transporte PyME",
          incentive: "Tasa fija preferencial del 13.9% anual y plazo a 48 meses sin aval hipotecario",
          bankCost: "$12,000 MXN (Gastos de estructuración crediticia)",
          churnReduction: "72% → 18% (-54 pts)",
          retainedCapital: "$1,650,000 MXN",
          roi: "137.5x",
          prompt: "Simular y activar oferta para Héctor Morales (Ferretería San Marcos): Crédito Equipamiento y Transporte PyME para vehículo de reparto."
        },
        {
          id: "CLI-8310",
          name: "Valeria Santillán Vega",
          negocio: "Tarjeta Personal Inactiva",
          balance: "$120,000",
          cltv: "$85,000",
          churnRisk: 59,
          cause: "Iba a cancelar por cobro de anualidad y falta de cashback",
          matchedProduct: "Tarjeta con 2% Cashback y Cero Anualidad",
          incentive: "Exención definitiva de anualidad + 2% de cashback directo",
          bankCost: "$1,200 MXN (Bono de bienvenida)",
          churnReduction: "59% → 12% (-47 pts)",
          retainedCapital: "$120,000 MXN",
          roi: "100.0x",
          prompt: "Simular y activar oferta para Valeria Santillán Vega: Condonación de anualidad de por vida y 2% cashback."
        }
      ],
      selectedSimClient: null
    };
  },
  created() {
    this.selectedSimClient = this.simulatorClients[0];
  },
  mounted() {
    this.$nextTick(() => {
      this.initFintechCdpChart();
      this.initFintechCausesPieChart();
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
    if (this.fintechCausesPieChartInstance) {
      this.fintechCausesPieChartInstance.destroy();
      this.fintechCausesPieChartInstance = null;
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
          this.initFintechCausesPieChart();
        } else if (tab === 'deepdive') {
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

      const fintechGreenShades = ['#0d652d', '#137333', '#188038', '#1e8e3e', '#2da94f', '#34a853', '#46b765', '#5bb974', '#81c995', '#a8dab5'];
      const ctx = canvas.getContext('2d');
      this.fintechCdpChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.cdpSegments.map(s => s.shortName),
          datasets: [
            {
              type: 'line',
              order: 1,
              label: 'Tasa Abandono (%)',
              data: this.cdpSegments.map(s => s.churnRate),
              borderColor: '#202124',
              backgroundColor: '#202124',
              pointBackgroundColor: this.cdpSegments.map(s => s.churnRate >= 7.5 ? '#EA4335' : '#202124'),
              pointBorderColor: this.cdpSegments.map(s => s.churnRate >= 7.5 ? '#EA4335' : '#202124'),
              pointBorderWidth: 0,
              pointRadius: 4.5,
              pointHoverRadius: 6.5,
              borderWidth: 2.2,
              tension: 0.25,
              yAxisID: 'y1'
            },
            {
              type: 'bar',
              order: 2,
              label: 'Cartera / Facturación ($M MXN)',
              data: this.cdpSegments.map(s => s.aumNum),
              backgroundColor: this.cdpSegments.map((s, idx) => fintechGreenShades[idx % fintechGreenShades.length]),
              borderRadius: 6,
              barThickness: 22,
              yAxisID: 'y'
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
                  if (context.dataset.type === 'line') {
                    return `Tasa de Abandono: ${seg.churnRate}% ${seg.isTopOffender ? '(Riesgo Alto)' : ''}`;
                  }
                  return `${seg.name}: ${seg.aum} (${seg.clientsFormatted} cuentas) | ${seg.campaign}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cartera / Facturación ($M MXN)', font: { size: 9.5 } },
              ticks: { font: { size: 9 } }
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              max: 12,
              title: { display: true, text: 'Abandono (%)', font: { size: 9.5 } },
              grid: { drawOnChartArea: false },
              ticks: { 
                font: { size: 9 },
                callback: (val) => val + '%'
              }
            },
            x: {
              ticks: { 
                font: { size: 9.5, weight: 'bold' },
                maxRotation: 0,
                autoSkip: false
              }
            }
          }
        }
      });
    },
    initFintechCausesPieChart() {
      const canvas = document.getElementById('fintechCausesPieChart');
      if (!canvas) return;

      if (this.fintechCausesPieChartInstance) {
        this.fintechCausesPieChartInstance.destroy();
        this.fintechCausesPieChartInstance = null;
      }

      const ctx = canvas.getContext('2d');
      this.fintechCausesPieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            'Comisión TPV / Agregadores Externos',
            'Tasas y Plazos de Bancos',
            'Terminales Inactivas / Sin Uso',
            'Límites de Crédito Insuficientes'
          ],
          datasets: [{
            data: [38, 32, 18, 12],
            backgroundColor: ['#0d652d', '#188038', '#34a853', '#81c995'],
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 8,
                font: { size: 8.5, family: "'Google Sans', Roboto, sans-serif" },
                padding: 4
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const val = (38.4 * context.raw / 100);
                  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);
                  return ` ${context.label}: ${context.raw}% ($${formatted}M MXN)`;
                }
              }
            }
          },
          cutout: '52%'
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
        { nombre: "Bernardo Salcedo Valdés", negocio: "Restaurante Los Candiles", riesgo_abandono_pct: 74, saldo_mxn: 450000, cltv_mxn: 380000 },
        { nombre: "Familia Navarro Benítez", negocio: "Mini-Súper El Progreso", riesgo_abandono_pct: 81, saldo_mxn: 850000, cltv_mxn: 520000 },
        { nombre: "Fernando Zepeda Olvera", negocio: "Consultorio Dental Zepeda", riesgo_abandono_pct: 79, saldo_mxn: 180000, cltv_mxn: 140000 },
        { nombre: "Mariana Treviño Cárdenas", negocio: "Boutique La Moda", riesgo_abandono_pct: 76, saldo_mxn: 320000, cltv_mxn: 260000 },
        { nombre: "Roberto Alcocer Mendoza", negocio: "Farmacia El Carmen", riesgo_abandono_pct: 68, saldo_mxn: 680000, cltv_mxn: 490000 },
        { nombre: "Sofía Paredes Rangel", negocio: "Pastelería Dulce Miga", riesgo_abandono_pct: 82, saldo_mxn: 210000, cltv_mxn: 175000 },
        { nombre: "Héctor Morales Galindo", negocio: "Ferretería San Marcos", riesgo_abandono_pct: 72, saldo_mxn: 1650000, cltv_mxn: 820000 },
        { nombre: "Guillermo Montemayor Lozano", negocio: "Taller & Refacciones San Juan", riesgo_abandono_pct: 24, saldo_mxn: 1200000, cltv_mxn: 650000 },
        { nombre: "Valeria Santillán Vega", negocio: "Cliente Individual", riesgo_abandono_pct: 59, saldo_mxn: 120000, cltv_mxn: 85000 }
      ];

      try {
        const response = await axios.get('/api/fintech/chart');
        if (Array.isArray(response.data) && response.data.length > 0) {
          data = response.data;
        }
      } catch(e) {
        console.warn('Usando dataset comercial local para Fintech Bubble Chart');
      }

      const ctx = canvas.getContext('2d');
      const self = this;
      this.fintechChartInstance = new Chart(ctx, {
        type: 'bubble',
        data: {
          datasets: [
            {
              label: 'Comercios y Clientes en Riesgo',
              backgroundColor: data.map(d => d.riesgo_abandono_pct >= 75 ? 'rgba(19, 115, 51, 0.85)' : 'rgba(52, 168, 83, 0.75)'),
              borderColor: data.map(d => d.riesgo_abandono_pct >= 75 ? '#0d652d' : '#188038'),
              borderWidth: 1.5,
              data: data.map(d => ({
                x: d.riesgo_abandono_pct,
                y: d.saldo_mxn,
                r: Math.max(9, Math.min(22, (d.cltv_mxn || d.saldo_mxn * 0.5) / 35000)),
                nombre: d.nombre,
                negocio: d.negocio || 'Comercio',
                cltv: d.cltv_mxn ? '$' + (d.cltv_mxn / 1000).toFixed(0) + 'k' : '$200k'
              }))
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (event, elements) => {
            if (elements && elements.length > 0) {
              const el = elements[0];
              const item = self.fintechChartInstance.data.datasets[0].data[el.index];
              if (item && item.nombre) {
                self.userInputFintech = `Revisa el caso de ${item.nombre} (${item.negocio}) con riesgo de abandono del ${item.x}% y cartera/cobros de $${item.y.toLocaleString()} MXN. ¿Qué oferta recomendamos para retenerlo?`;
                self.$nextTick(() => {
                  const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
                  if (inputEl) inputEl.focus();
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const item = context.raw;
                  return `${item.nombre} (${item.negocio}): Riesgo ${item.x}%, $${item.y.toLocaleString()} MXN (CLTV: ${item.cltv})`;
                }
              }
            }
          },
          scales: {
            x: { 
              title: { display: true, text: 'Riesgo de Abandono Predictivo (%)', font: { size: 9.5 } },
              min: 15, 
              max: 95,
              ticks: { font: { size: 9.5 } }
            },
            y: { 
              title: { display: true, text: 'Cartera / Cobros Mensuales ($ MXN)', font: { size: 9.5 } },
              beginAtZero: true,
              ticks: { 
                font: { size: 9.5 },
                callback: function(val) {
                  return '$' + (val / 1000).toFixed(0) + 'k';
                }
              }
            }
          }
        }
      });
    },
    formatAmount(val) {
      if (val === null || val === undefined) return '';
      return String(val).replace(/\.0([Mmk%])/g, '$1');
    },
    analyzeSegment(seg) {
      if (seg.isTopOffender) {
        this.setFintechTab('deepdive');
      }
      this.userInputFintech = seg.prompt;
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
        if (inputEl) inputEl.focus();
      });
      this.sendMessageFintech();
    },
    drillDownSegment(seg) {
      this.analyzeSegment(seg);
    },
    triggerClientNBO(client) {
      this.pendingOfferText = `${client.nbaOffer} diseñada para resolver: "${client.cause}".`;
      this.userInputFintech = client.prompt;
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
        if (inputEl) inputEl.focus();
      });
    },
    recommendProduct(prod) {
      this.pendingOfferText = `${prod.name}: ${prod.keyBenefit} Margen: ${prod.bankMargin}.`;
      this.userInputFintech = prod.prompt;
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
        if (inputEl) inputEl.focus();
      });
    },
    deploySimOffer() {
      if (!this.selectedSimClient) return;
      this.pendingOfferText = `Oferta para ${this.selectedSimClient.name} (${this.selectedSimClient.negocio}): ${this.selectedSimClient.matchedProduct} con ${this.selectedSimClient.incentive}. Reducción proyectada: ${this.selectedSimClient.churnReduction}.`;
      this.userInputFintech = this.selectedSimClient.prompt;
      this.showOfferAction = true;
      this.sendMessageFintech();
    },
    askFintechPrompt(promptText) {
      this.userInputFintech = promptText;
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-fintech input, .v-text-field input');
        if (inputEl) inputEl.focus();
      });
    },
    launchPlanCampaign() {
      this.pendingOfferText = 'Plan de Retención Comercial: Terminal Smart 4G Cero Renta + Créditos PyME pre-aprobados para 1,840 comercios ($34.2M en cobros a retener).';
      this.userInputFintech = 'Desplegar el Plan de Retención Comercial para reactivar comercios con TPV inactiva y retener las carteras en riesgo.';
      this.showOfferAction = true;
      this.sendMessageFintech();
    },
    launchOffer() {
      this.showOfferAction = false;
      this.offerLaunched = true;
      this.scrollToBottomFintech();
    },
    scrollToBottomFintech() {
      setTimeout(() => {
        const chatBox = document.getElementById('chat-box-fintech');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 100);
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
        if (lowerReply.includes('deseas que') || lowerReply.includes('activar') || lowerReply.includes('oferta') || lowerReply.includes('next-best-action') || lowerReply.includes('plan de retención')) {
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
      if (!text) return '';
      let cleaned = String(text)
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '');
      let html = marked.parse(cleaned);
      return html
        .replace(/<table>/g, '<div class="table-container-responsive"><table>')
        .replace(/<\/table>/g, '</table></div>');
    }
  }
};
