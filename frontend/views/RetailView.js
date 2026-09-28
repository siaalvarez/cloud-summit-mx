// RetailView.js - Vista de Retail Intelligence & Agente de Marketing Retail

const RetailView = {
  template: `
    <v-container class="pa-2 pa-md-3 px-3 px-md-4 flex-grow-1 d-flex flex-column fill-height" style="max-width: 100%; box-sizing: border-box; overflow: hidden;">
      <v-row class="flex-grow-1 my-0" style="height: 100%; max-height: 100%; min-height: 0;">
        <!-- Lado Izquierdo: Dashboard Ejecutivo (Overview o Deep Dive) -->
        <v-col cols="12" sm="7" md="7" lg="7" class="d-flex flex-column pa-2 pa-md-3" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column overflow-hidden bg-white" style="height: 100%; max-height: 100%; min-height: 0;">
            
            <!-- Header con Switcher de Tabs & Contexto -->
            <v-card-title class="bg-white pa-3 pa-md-4 border-b d-flex align-center justify-space-between flex-shrink-0" style="border-bottom: 1px solid #e8eaed;">
              <div class="d-flex align-center">
                <v-avatar color="#fce8e6" size="38" class="mr-3">
                  <v-icon color="#EA4335">mdi-shopping</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold" style="color: #EA4335; line-height: 1.2;">
                    Retail Intelligence & Marketing
                  </div>
                  <span class="text-caption text-grey-darken-1">Omnicanal Nacional (124 Tiendas + Digital) | QTD</span>
                </div>
              </div>
              
              <div class="d-flex align-center">
                <v-btn-toggle
                  v-model="retailTab"
                  mandatory
                  rounded="pill"
                  density="compact"
                  color="#EA4335"
                  variant="outlined"
                  class="mr-2"
                  style="border-color: #dadce0;"
                  @update:model-value="onRetailTabChange"
                >
                  <v-btn value="overview" size="small" class="text-capitalize font-weight-bold" style="font-size: 11.5px; padding: 0 12px;">
                    <v-icon start size="15">mdi-view-dashboard-outline</v-icon> Panorama General
                  </v-btn>
                  <v-btn value="deepdive" size="small" class="text-capitalize font-weight-bold" style="font-size: 11.5px; padding: 0 12px;">
                    <v-icon start size="15" color="#EA4335">mdi-bullseye-arrow</v-icon> Deep Dive: Deportes
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-card-title>
            
            <v-card-text class="flex-grow-1 pa-3 pa-md-4 overflow-y-auto custom-scrollbar d-flex flex-column" style="background-color: #f8f9fa; min-height: 0;">
              
              <!-- ========================================== -->
              <!-- TAB 1: PANORAMA GENERAL (MACRO-CATEGORÍAS) -->
              <!-- ========================================== -->
              <div v-show="retailTab === 'overview'" style="width: 100%; flex: 1 1 auto;">
                <div class="d-flex flex-column" style="min-height: 100%;">
                <!-- 4 Macro KPI Cards -->
                <v-row class="mb-2" dense>
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-xl pa-3 pa-md-4 text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #EA4335; min-height: 116px;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 11px; letter-spacing: 0.4px;">Ventas QTD</div>
                      <div class="font-weight-bold mt-1" style="color: #202124; font-size: 26px; line-height: 1.15;">$240.9M</div>
                      <v-chip size="x-small" variant="tonal" color="#5f6368" class="font-weight-bold mt-1" style="height: 20px; font-size: 10.5px;">
                        <v-icon start size="11" color="#188038">mdi-arrow-up</v-icon> +7.2% YoY
                      </v-chip>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-xl pa-3 pa-md-4 text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #EA4335; min-height: 116px;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 11px; letter-spacing: 0.4px;">Ticket Prom.</div>
                      <div class="font-weight-bold mt-1" style="color: #202124; font-size: 26px; line-height: 1.15;">$1,740</div>
                      <v-chip size="x-small" variant="tonal" color="#5f6368" class="font-weight-bold mt-1" style="height: 20px; font-size: 10.5px;">
                        <v-icon start size="11" color="#188038">mdi-arrow-up</v-icon> +5.1% YoY
                      </v-chip>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-xl pa-3 pa-md-4 text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #EA4335; min-height: 116px;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 11px; letter-spacing: 0.4px;">Transacciones</div>
                      <div class="font-weight-bold mt-1" style="color: #202124; font-size: 26px; line-height: 1.15;">138,450</div>
                      <v-chip size="x-small" variant="tonal" color="#5f6368" class="font-weight-bold mt-1" style="height: 20px; font-size: 10.5px;">
                        Conv. 3.5%
                      </v-chip>
                    </v-card>
                  </v-col>

                  <v-col cols="6" sm="3">
                    <v-card 
                      class="rounded-xl pa-3 pa-md-4 text-center bg-white d-flex flex-column justify-center align-center h-100 cursor-pointer transition-swing" 
                      elevation="1" 
                      style="border: 1px solid #fad2cf; border-top: 3px solid #C5221F; background-color: #fff8f7 !important; min-height: 116px;"
                      @click="askRiskBreakdownPrompt"
                    >
                      <div class="d-flex align-center justify-center">
                        <span class="text-caption font-weight-bold text-uppercase" style="font-size: 11px; letter-spacing: 0.4px; color: #C5221F;">Stock en Riesgo</span>
                        <v-icon size="13" color="#EA4335" class="ml-1">mdi-sparkles</v-icon>
                      </div>
                      <div class="font-weight-bold mt-1" style="color: #C5221F; font-size: 26px; line-height: 1.15;">$44.2M</div>
                      <v-chip size="x-small" color="#EA4335" class="font-weight-bold mt-1 text-white cursor-pointer" variant="flat" style="height: 20px; font-size: 10px;">
                        <v-icon start size="11">mdi-chat-question</v-icon> 4 Categorías (Ver Plan)
                      </v-chip>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Gráfica Combo: Ventas por Macro-Categoría ($M MXN) + Crecimiento YoY (%) -->
                <v-card class="mb-2 rounded-xl pa-3 pa-md-4 bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                        <v-icon size="15" color="#EA4335" class="mr-1">mdi-chart-line</v-icon> Ventas Netas ($M MXN) vs Crecimiento YoY (%)
                      </span>
                    </div>
                    <div class="d-flex align-center" style="gap: 10px;">
                      <span class="text-caption text-grey-darken-2" style="font-size: 10.5px;">
                        <span style="display: inline-block; width: 10px; height: 8px; background-color: #B31412; border-radius: 2px; vertical-align: middle;" class="mr-1"></span>
                        Ventas ($M)
                      </span>
                      <span class="text-caption text-grey-darken-2" style="font-size: 10.5px;">
                        <v-icon size="11" color="#202124" class="mr-1">mdi-chart-line-variant</v-icon>
                        YoY (%)
                      </span>
                      <span class="text-caption" style="font-size: 10.5px; color: #EA4335;">
                        <v-icon size="9" color="#EA4335" class="mr-1">mdi-circle</v-icon>
                        Alerta &lt; 0%
                      </span>
                      <v-chip size="x-small" variant="tonal" color="#EA4335" class="font-weight-bold ml-1" style="height: 18px; font-size: 9.5px;">
                        Eje Dual
                      </v-chip>
                    </div>
                  </div>
                  <div style="position: relative; height: 225px; width: 100%;">
                    <canvas id="retailCategoryChart"></canvas>
                  </div>
                </v-card>

                <!-- Matriz Ejecutiva con Señales de Google Trends -->
                <v-card class="mb-2 rounded-xl overflow-hidden bg-white flex-grow-1 d-flex flex-column" elevation="1" style="border: 1px solid #e8eaed; min-height: 0;">
                  <div class="pa-3 px-4 d-flex align-center justify-space-between flex-shrink-0" style="background-color: #f8f9fa; border-bottom: 1px solid #e8eaed;">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                      <v-icon size="16" color="#EA4335" class="mr-1">mdi-table</v-icon> Matriz de Categorías & Señal de Demanda Externa (Google Trends)
                    </span>
                    <span class="text-caption text-grey-darken-1" style="font-size: 11.5px;">12 Categorías Activas | Clic en <strong>Analizar</strong></span>
                  </div>
                  
                  <div class="retail-matrix-container custom-scrollbar flex-grow-1">
                    <table class="retail-matrix-table">
                      <colgroup>
                        <col style="width: 27%;">
                        <col style="width: 13%;">
                        <col style="width: 13%;">
                        <col style="width: 11%;">
                        <col style="width: 24%;">
                        <col style="width: 12%;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th style="text-align: left; padding: 10px 14px;">Categoría</th>
                          <th style="text-align: right; padding: 10px 14px;">Ventas QTD</th>
                          <th style="text-align: right; padding: 10px 14px;">Ticket Prom.</th>
                          <th style="text-align: center; padding: 10px 6px;">YoY (%)</th>
                          <th style="text-align: left; padding: 10px 14px;">Demanda (Google Trends)</th>
                          <th style="text-align: center; padding: 10px 8px;">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="(cat, idx) in retailCategories" 
                          :key="cat.name" 
                          :style="cat.highlight ? 'background-color: #fff8f7; border-left: 4px solid #EA4335;' : ''"
                        >
                          <td style="text-align: left; padding: 8px 14px;">
                            <div class="d-flex align-center" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                              <v-icon :color="cat.highlight ? '#EA4335' : '#5f6368'" size="17" class="mr-2 flex-shrink-0">{{ cat.icon }}</v-icon>
                              <span class="font-weight-bold text-truncate" :style="{ color: cat.highlight ? '#C5221F' : '#202124', fontSize: '12px' }">{{ cat.name }}</span>
                              <v-chip 
                                v-if="cat.badge" 
                                size="x-small" 
                                :color="(cat.highlight || cat.stockRisk) ? '#EA4335' : '#5F6368'" 
                                class="ml-1 font-weight-bold flex-shrink-0" 
                                variant="tonal" 
                                style="height: 18px; font-size: 9px; padding: 0 6px;"
                              >
                                {{ cat.badge }}
                              </v-chip>
                            </div>
                          </td>
                          <td style="text-align: right; padding: 8px 14px; font-weight: 700; color: #202124; font-size: 12px;">
                            {{ cat.sales }}
                          </td>
                          <td style="text-align: right; padding: 8px 14px; color: #3c4043; font-weight: 600; font-size: 12px;">
                            {{ cat.ticket }}
                          </td>
                          <td style="text-align: center; padding: 8px 6px;">
                            <span class="font-weight-bold" :style="{ color: cat.growth >= 0 ? '#188038' : '#C5221F', fontSize: '11.5px' }">
                              <v-icon size="11" :color="cat.growth >= 0 ? '#188038' : '#C5221F'">{{ cat.growth >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                              {{ cat.growth > 0 ? '+' : '' }}{{ cat.growth }}%
                            </span>
                          </td>
                          <td style="text-align: left; padding: 8px 14px;">
                            <div class="d-flex align-center" :style="{ color: cat.highlight ? '#C5221F' : '#3c4043', fontWeight: cat.highlight ? 700 : 500, fontSize: '11.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
                              <v-icon size="14" :color="cat.highlight ? '#EA4335' : '#5f6368'" class="mr-1 flex-shrink-0">{{ cat.trendIcon || 'mdi-trending-neutral' }}</v-icon>
                              <span class="text-truncate">{{ formatTrendLabel(cat.trendText) }}</span>
                            </div>
                          </td>
                          <td style="text-align: center; padding: 8px 8px;">
                            <v-btn 
                              size="x-small" 
                              variant="flat" 
                              rounded="pill" 
                              class="font-weight-bold text-capitalize"
                              :class="cat.highlight ? 'retail-action-btn-alert' : 'retail-action-btn-neutral'"
                              style="height: 24px; font-size: 10.5px; padding: 0 10px;"
                              @click="drillDownCategory(cat)"
                            >
                              <v-icon start size="12">mdi-robot-outline</v-icon> Analizar
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </v-card>

                <!-- Tarjetas de Retos Estratégicos -->
                <v-row dense class="mt-1 mb-1">
                  <v-col cols="12" sm="6" class="d-flex">
                    <v-card class="h-100 w-100 rounded-xl pa-3 pa-md-4 px-4 bg-white cursor-pointer transition-swing d-flex flex-column justify-space-between" elevation="1" style="border: 1px solid #fad2cf; border-left: 4px solid #EA4335; min-height: 96px; background-color: #fff8f7 !important;" @click="setRetailTab('deepdive')">
                      <div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #C5221F; font-size: 11.5px;">🚨 Desfase Crítico de Demanda</span>
                          <v-icon color="#EA4335" size="18">mdi-arrow-right-circle</v-icon>
                        </div>
                        <div class="text-subtitle-2 font-weight-bold mt-1" style="color: #202124;">Deportes & Outdoor (-18.4%)</div>
                        <p class="text-caption text-grey-darken-2 mb-0 mt-1" style="font-size: 11.5px; line-height: 1.45;">
                          Caída en ventas vs <strong>"Maratón CDMX" subió +92% en Google Trends</strong>. Capital inmovilizado: <strong>$12.5M MXN</strong>.
                        </p>
                      </div>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" class="d-flex">
                    <v-card class="h-100 w-100 rounded-xl pa-3 pa-md-4 px-4 bg-white cursor-pointer transition-swing d-flex flex-column justify-space-between" elevation="1" style="border: 1px solid #e8eaed; border-left: 4px solid #EA4335; min-height: 96px;" @click="askRetailPrompt('Analiza la oportunidad de margen en Electrónica & Gaming con ticket promedio de $4,800 MXN')">
                      <div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #EA4335; font-size: 11.5px;">💡 Oportunidad de Margen</span>
                          <v-icon color="#EA4335" size="18">mdi-trending-up</v-icon>
                        </div>
                        <div class="text-subtitle-2 font-weight-bold mt-1" style="color: #202124;">Electrónica & Gaming (+14.2%)</div>
                        <p class="text-caption text-grey-darken-2 mb-0 mt-1" style="font-size: 11.5px; line-height: 1.45;">
                          Ticket promedio en <strong>$4,800 MXN</strong> impulsado por lanzamientos y alta demanda previa a Buen Fin.
                        </p>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- TAB 2: DEEP DIVE (DEPORTES & MARATÓN CDMX) -->
              <!-- ========================================== -->
              <div v-show="retailTab === 'deepdive'" style="width: 100%; flex: 1 1 auto;">
                <div class="d-flex flex-column" style="min-height: 100%;">
                
                <!-- 1. Header Context Alert -->
                <v-card class="pa-3 pa-md-4 rounded-xl mb-2 bg-white elevation-1" style="border: 1px solid #fad2cf; border-left: 4px solid #EA4335; background-color: #fff9f8 !important;">
                  <div class="d-flex flex-wrap align-center justify-space-between mb-1" style="gap: 8px;">
                    <div class="d-flex align-center">
                      <v-icon color="#EA4335" size="20" class="mr-2">mdi-alert-decagram</v-icon>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #EA4335; font-size: 12px; letter-spacing: 0.5px;">
                        Diagnóstico de Desfase Crítico: Deportes & Outdoor
                      </span>
                    </div>
                    <v-chip size="small" color="#EA4335" variant="flat" class="font-weight-bold text-white">
                      <v-icon start size="14">mdi-timer-sand</v-icon> Maratón CDMX en ~1 Mes
                    </v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-3 mt-1" style="line-height: 1.5; font-size: 12px;">
                    <strong>Foco Ejecutivo:</strong> La demanda del consumidor por calzado con placa de carbono y equipamiento de running se disparó <strong>+92% en búsquedas</strong> a un mes del Maratón CDMX, pero las ventas en piso y digital cayeron <strong>-18.4% YoY</strong> por falta de visibilidad en pauta y bundles no competitivos. Esto mantiene inmovilizados <strong>$12.5M MXN</strong> en capital de trabajo.
                  </div>
                </v-card>

                <!-- 2. Mini KPI Cards Deportes (4 Cards) -->
                <v-row class="mb-2" dense>
                  <v-col cols="6" sm="3">
                    <v-card class="pa-3 pa-md-4 rounded-xl text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #fad2cf; border-top: 3px solid #EA4335; background-color: #fff8f7 !important; min-height: 110px;">
                      <div class="text-caption font-weight-bold text-uppercase" style="font-size: 11px; color: #C5221F;">Ventas Deportes</div>
                      <div class="font-weight-bold mt-1" style="color: #C5221F; font-size: 24px; line-height: 1.15;">-18.4% YoY</div>
                      <span class="text-caption d-block mt-1 text-grey-darken-1 font-weight-medium" style="font-size: 10.5px;">$28.4M (Gap: -$6.4M)</span>
                    </v-card>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-card class="pa-3 pa-md-4 rounded-xl text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #EA4335; min-height: 110px;">
                      <div class="text-caption text-grey-darken-1 font-weight-bold text-uppercase" style="font-size: 11px;">Demanda Externa</div>
                      <div class="font-weight-bold mt-1" style="color: #202124; font-size: 24px; line-height: 1.15;">92%</div>
                      <span class="text-caption d-block mt-1 font-weight-bold" style="font-size: 10.5px; color: #EA4335;">+92% en 4 semanas</span>
                    </v-card>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-card class="pa-3 pa-md-4 rounded-xl text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #EA4335; min-height: 110px;">
                      <div class="text-caption text-grey-darken-1 font-weight-bold text-uppercase" style="font-size: 11px;">Stock Inmovilizado</div>
                      <div class="font-weight-bold mt-1" style="color: #202124; font-size: 24px; line-height: 1.15;">$12.5M</div>
                      <span class="text-caption d-block mt-1 text-grey-darken-1 font-weight-medium" style="font-size: 10.5px;">6,750 unds | Rotación: 84 días</span>
                    </v-card>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-card class="pa-3 pa-md-4 rounded-xl text-center bg-white d-flex flex-column justify-center align-center h-100" elevation="1" style="border: 1px solid #ceead6; border-top: 3px solid #34A853; background-color: #f6fbf7 !important; min-height: 110px;">
                      <div class="text-caption font-weight-bold text-uppercase" style="font-size: 11px; color: #188038;">Recuperación Est.</div>
                      <div class="font-weight-bold mt-1" style="color: #188038; font-size: 24px; line-height: 1.15;">$4.8M</div>
                      <span class="text-caption d-block mt-1 font-weight-bold" style="font-size: 10.5px; color: #188038;">ROI 37.5x ($120k pauta)</span>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- 3. Two-Column Analytics: Chart & Subcategory Breakdown -->
                <v-row dense class="mb-2">
                  <!-- Columna Izquierda: Gráfica Dual de Desfase y Proyección -->
                  <v-col cols="12" md="7">
                    <v-card class="pa-3 pa-md-4 rounded-xl h-100 bg-white d-flex flex-column" elevation="1" style="border: 1px solid #e8eaed;">
                      <div class="d-flex align-center justify-space-between mb-1">
                        <div>
                          <div class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                            Efecto Tijera: Ventas Semanales vs Demanda Externa
                          </div>
                          <span class="text-caption text-grey-darken-1" style="font-size: 10.5px;">Unidades vendidas vs Índice de búsqueda y recuperación estimada</span>
                        </div>
                        <v-chip size="x-small" color="#EA4335" variant="tonal" class="font-weight-bold">CDMX & MTY</v-chip>
                      </div>
                      
                      <!-- Leyenda Visual Rápida -->
                      <div class="d-flex align-center flex-wrap my-1" style="gap: 12px; font-size: 10.5px;">
                        <span class="d-flex align-center font-weight-medium" style="color: #EA4335;">
                          <span style="display:inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #EA4335; margin-right: 5px;"></span> Ventas Reales (Unds)
                        </span>
                        <span class="d-flex align-center font-weight-medium" style="color: #202124;">
                          <span style="display:inline-block; width: 14px; height: 2px; border-top: 2px dashed #202124; margin-right: 5px;"></span> Demanda Externa (%)
                        </span>
                        <span class="d-flex align-center font-weight-medium" style="color: #188038;">
                          <span style="display:inline-block; width: 14px; height: 2px; border-top: 2px dashed #188038; margin-right: 5px;"></span> Proyección con Campaña
                        </span>
                      </div>

                      <div style="position: relative; height: 210px; width: 100%;" class="my-auto">
                        <canvas id="retailMixedChart"></canvas>
                      </div>

                      <div class="mt-2 pt-2 text-caption text-grey-darken-2" style="font-size: 11px; border-top: 1px dashed #eee; line-height: 1.4;">
                        💡 <strong>Insight:</strong> La brecha se amplió en las últimas 3 semanas. Sin activación comercial inmediata, el sell-through proyectado antes del Maratón caerá un <strong>42% adicional</strong>.
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Columna Derecha: Composición de los $12.5M y Distribución Geográfica -->
                  <v-col cols="12" md="5">
                    <v-card class="pa-3 pa-md-4 rounded-xl h-100 bg-white d-flex flex-column" elevation="1" style="border: 1px solid #e8eaed;">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                          Distribución de los $12.5M en Riesgo
                        </span>
                        <v-chip size="x-small" color="error" variant="flat" class="font-weight-bold">4 Sub-familias</v-chip>
                      </div>

                      <!-- Barra 1: Calzado Carbon Pro -->
                      <div class="mb-2">
                        <div class="d-flex justify-space-between text-caption font-weight-medium" style="font-size: 11px;">
                          <span>👟 Calzado Placa de Carbono</span>
                          <span class="font-weight-bold" style="color: #EA4335;">$6.8M (54%)</span>
                        </div>
                        <div class="d-flex justify-space-between text-caption text-grey-darken-1 mb-1" style="font-size: 10px;">
                          <span>2,400 pares</span>
                          <span>Rotación: 82 días (Meta: 35d)</span>
                        </div>
                        <div style="background-color: #f1f3f4; height: 7px; border-radius: 4px; overflow: hidden;">
                          <div style="background-color: #9B0000; width: 54%; height: 100%;"></div>
                        </div>
                      </div>

                      <!-- Barra 2: Wearables GPS -->
                      <div class="mb-2">
                        <div class="d-flex justify-space-between text-caption font-weight-medium" style="font-size: 11px;">
                          <span>⌚ Wearables & Monitoreo GPS</span>
                          <span class="font-weight-bold" style="color: #EA4335;">$3.2M (26%)</span>
                        </div>
                        <div class="d-flex justify-space-between text-caption text-grey-darken-1 mb-1" style="font-size: 10px;">
                          <span>1,150 piezas</span>
                          <span>Rotación: 65 días (Meta: 30d)</span>
                        </div>
                        <div style="background-color: #f1f3f4; height: 7px; border-radius: 4px; overflow: hidden;">
                          <div style="background-color: #C5221F; width: 26%; height: 100%;"></div>
                        </div>
                      </div>

                      <!-- Barra 3: Chalecos e Hidratación -->
                      <div class="mb-2">
                        <div class="d-flex justify-space-between text-caption font-weight-medium" style="font-size: 11px;">
                          <span>🎒 Chalecos & Hidratación 5L</span>
                          <span class="font-weight-bold" style="color: #EA4335;">$1.8M (14%)</span>
                        </div>
                        <div class="d-flex justify-space-between text-caption text-grey-darken-1 mb-1" style="font-size: 10px;">
                          <span>3,200 piezas</span>
                          <span>Rotación: 95 días (Meta: 35d)</span>
                        </div>
                        <div style="background-color: #f1f3f4; height: 7px; border-radius: 4px; overflow: hidden;">
                          <div style="background-color: #EA4335; width: 14%; height: 100%;"></div>
                        </div>
                      </div>

                      <!-- Barra 4: Nutrición y Geles -->
                      <div class="mb-2">
                        <div class="d-flex justify-space-between text-caption font-weight-medium" style="font-size: 11px;">
                          <span>🥤 Nutrición & Geles Isotónicos</span>
                          <span class="font-weight-bold text-grey-darken-3">$0.7M (6%)</span>
                        </div>
                        <div class="d-flex justify-space-between text-caption text-grey-darken-1 mb-1" style="font-size: 10px;">
                          <span>12,500 sobres</span>
                          <span>Rotación: 48 días (Meta: 25d)</span>
                        </div>
                        <div style="background-color: #f1f3f4; height: 7px; border-radius: 4px; overflow: hidden;">
                          <div style="background-color: #F49E9A; width: 6%; height: 100%;"></div>
                        </div>
                      </div>

                      <!-- Alerta Geográfica y Rebalanceo -->
                      <div class="pa-2 px-3 rounded-lg mt-2" style="background-color: #f8f9fa; border: 1px solid #eee; font-size: 10.5px; line-height: 1.45;">
                        <div class="d-flex align-center justify-space-between mb-1">
                          <span class="font-weight-bold text-grey-darken-3">📍 Concentración de Inventario Físico</span>
                          <span class="text-caption font-weight-bold text-grey-darken-2" style="font-size: 10px;">3 Nodos</span>
                        </div>
                        <div class="d-flex justify-space-between text-grey-darken-2 mb-1">
                          <span>• Hub CDMX: <strong style="color: #EA4335;">58%</strong></span>
                          <span>• MTY / GDL: <strong>32%</strong></span>
                          <span>• E-Commerce: <strong>10%</strong></span>
                        </div>
                        <div class="text-grey-darken-2" style="font-size: 10px; border-top: 1px dashed #e0e0e0; padding-top: 4px;">
                          🚚 <strong>Acción logística:</strong> Surtido prioritario a tiendas Reforma, Polanco e Insurgentes para Click & Collect.
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- 4. Catálogo de SKUs Prioritarios con Acciones -->
                <div class="d-flex align-center justify-space-between mb-2 mt-1">
                  <div>
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                      <v-icon size="16" color="#EA4335" class="mr-1">mdi-tag-multiple-outline</v-icon> SKUs Críticos para Desbloqueo Comercial
                    </span>
                    <span class="text-caption text-grey-darken-1 d-none d-sm-inline ml-2" style="font-size: 11px;">
                      (Haz clic en cualquier SKU para ver el análisis estratégico)
                    </span>
                  </div>
                  <v-chip size="x-small" color="#EA4335" variant="tonal" class="font-weight-bold">3 SKUs = $11.8M del Riesgo</v-chip>
                </div>

                <v-row dense class="mb-2">
                  <!-- SKU 1 -->
                  <v-col cols="12" sm="4">
                    <v-card class="pa-3 pa-md-4 rounded-xl sku-card bg-white d-flex flex-column justify-space-between h-100" elevation="1" style="border: 1px solid #fad2cf; border-left: 4px solid #EA4335;">
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between">
                          <v-chip size="x-small" color="#EA4335" variant="flat" class="font-weight-bold text-white">Stock: 2,400 pares</v-chip>
                          <span class="text-caption font-weight-bold text-grey-darken-2" style="font-size: 11px;">Margen: 54%</span>
                        </div>
                        <div class="text-subtitle-2 font-weight-bold mt-2" style="color: #202124; line-height: 1.25;">
                          Tenis Carbon Pro CDMX
                        </div>
                        <div class="d-flex align-center justify-space-between mt-1">
                          <span class="text-caption font-weight-bold" style="color: #EA4335; font-size: 13px;">$2,899 MXN</span>
                          <span class="text-caption text-red-darken-1 font-weight-medium" style="font-size: 10.5px;">Rotación: 82 días</span>
                        </div>
                        <div class="text-caption text-grey-darken-2 mt-1" style="font-size: 10.5px; line-height: 1.35;">
                          Sin presencia en pauta de Google Ads. Recomendación: Bundle con calcetas de compresión.
                        </div>
                      </div>
                      <div class="mt-3 pt-1">
                        <v-btn 
                          block
                          height="38"
                          variant="tonal" 
                          color="#EA4335" 
                          class="text-capitalize font-weight-bold" 
                          style="letter-spacing: 0.2px; font-size: 12px;"
                          rounded="pill"
                          @click="askRetailPrompt('¿Qué estrategia de bundle y descuento podemos aplicar al Tenis Carbon Pro CDMX ($2,899 MXN) sin sacrificar el margen del 54%?')"
                        >
                          <v-icon start size="16">mdi-lightning-bolt</v-icon> Analizar SKU
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- SKU 2 -->
                  <v-col cols="12" sm="4">
                    <v-card class="pa-3 pa-md-4 rounded-xl sku-card bg-white d-flex flex-column justify-space-between h-100" elevation="1" style="border: 1px solid #e8eaed; border-left: 4px solid #5f6368;">
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between">
                          <v-chip size="x-small" variant="tonal" color="#5f6368" class="font-weight-bold">Stock: 1,150 pzas</v-chip>
                          <span class="text-caption font-weight-bold text-grey-darken-2" style="font-size: 11px;">Margen: 42%</span>
                        </div>
                        <div class="text-subtitle-2 font-weight-bold mt-2" style="color: #202124; line-height: 1.25;">
                          Smartwatch Marathon GPS
                        </div>
                        <div class="d-flex align-center justify-space-between mt-1">
                          <span class="text-caption font-weight-bold" style="color: #202124; font-size: 13px;">$4,499 MXN</span>
                          <span class="text-caption text-grey-darken-2 font-weight-medium" style="font-size: 10.5px;">Rotación: 65 días</span>
                        </div>
                        <div class="text-caption text-grey-darken-2 mt-1" style="font-size: 10.5px; line-height: 1.35;">
                          Ticket alto frena sell-through. Recomendación: 6-12 MSI con bancos aliados.
                        </div>
                      </div>
                      <div class="mt-3 pt-1">
                        <v-btn 
                          block
                          height="38"
                          variant="tonal" 
                          color="#5f6368" 
                          class="text-capitalize font-weight-bold" 
                          style="letter-spacing: 0.2px; font-size: 12px;"
                          rounded="pill"
                          @click="askRetailPrompt('¿Cómo estructurar una oferta de 6 Meses Sin Intereses con bancos aliados para el Smartwatch Marathon GPS ($4,499 MXN) y qué impacto tendrá en ventas?')"
                        >
                          <v-icon start size="16">mdi-lightning-bolt</v-icon> Analizar SKU
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- SKU 3 -->
                  <v-col cols="12" sm="4">
                    <v-card class="pa-3 pa-md-4 rounded-xl sku-card bg-white d-flex flex-column justify-space-between h-100" elevation="1" style="border: 1px solid #fad2cf; border-left: 4px solid #EA4335;">
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between">
                          <v-chip size="x-small" color="#EA4335" variant="flat" class="font-weight-bold text-white">Stock: 3,200 pzas</v-chip>
                          <span class="text-caption font-weight-bold text-grey-darken-2" style="font-size: 11px;">Margen: 61%</span>
                        </div>
                        <div class="text-subtitle-2 font-weight-bold mt-2" style="color: #202124; line-height: 1.25;">
                          Chaleco Hidratación 5L
                        </div>
                        <div class="d-flex align-center justify-space-between mt-1">
                          <span class="text-caption font-weight-bold" style="color: #EA4335; font-size: 13px;">$1,299 MXN</span>
                          <span class="text-caption text-red-darken-1 font-weight-medium" style="font-size: 10.5px;">Rotación: 95 días</span>
                        </div>
                        <div class="text-caption text-grey-darken-2 mt-1" style="font-size: 10.5px; line-height: 1.35;">
                          Margen muy saludable (61%). Recomendación: Gift with purchase o bundle calzado + chaleco a $3,499.
                        </div>
                      </div>
                      <div class="mt-3 pt-1">
                        <v-btn 
                          block
                          height="38"
                          variant="tonal" 
                          color="#EA4335" 
                          class="text-capitalize font-weight-bold" 
                          style="letter-spacing: 0.2px; font-size: 12px;"
                          rounded="pill"
                          @click="askRetailPrompt('¿Cómo podemos usar el Chaleco de Hidratación 5L (margen 61%) como Gift with Purchase para compras de calzado y acelerar la rotación?')"
                        >
                          <v-icon start size="16">mdi-lightning-bolt</v-icon> Analizar SKU
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- 5. Plan Estratégico Omnicanal & Centro de Activación -->
                <v-card class="pa-3 pa-md-4 rounded-xl bg-white mb-2" elevation="1" style="border: 1px solid #e8eaed; border-left: 4px solid #EA4335;">
                  <div class="d-flex flex-wrap align-center justify-space-between mb-3" style="gap: 8px;">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #202124; font-size: 11.5px;">
                      🎯 Plan Estratégico de Activación Omnicanal (21 Días)
                    </span>
                    <v-chip size="x-small" color="#202124" variant="tonal" class="font-weight-bold">
                      Horizonte: 21 Días de Ejecución
                    </v-chip>
                  </div>

                  <!-- Cinta de Métricas de Negocio de la Campaña -->
                  <v-row dense class="mb-3">
                    <v-col cols="12" sm="4">
                      <div class="pa-2 px-3 rounded-lg d-flex align-center h-100" style="background-color: #fdf2f2; border: 1px solid #fad2cf;">
                        <v-avatar size="32" color="#fff" class="mr-2 elevation-1">
                          <v-icon size="16" color="#EA4335">mdi-currency-usd</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-caption text-uppercase font-weight-bold" style="font-size: 9.5px; color: #C5221F;">Inversión Requerida</div>
                          <div class="font-weight-bold" style="font-size: 14px; color: #202124; line-height: 1.15;">$120,000 MXN</div>
                          <div class="text-caption text-grey-darken-2" style="font-size: 10px;">PMax (50%) + Meta Reels (35%)</div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="pa-2 px-3 rounded-lg d-flex align-center h-100" style="background-color: #f8f9fa; border: 1px solid #e8eaed;">
                        <v-avatar size="32" color="#fff" class="mr-2 elevation-1">
                          <v-icon size="16" color="#202124">mdi-account-group-outline</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-caption text-uppercase font-weight-bold" style="font-size: 9.5px; color: #5f6368;">Audiencia Objetivo</div>
                          <div class="font-weight-bold" style="font-size: 14px; color: #202124; line-height: 1.15;">52,000 Runners</div>
                          <div class="text-caption text-grey-darken-2" style="font-size: 10px;">CDMX, Polanco, Reforma & MTY</div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="pa-2 px-3 rounded-lg d-flex align-center h-100" style="background-color: #f6fbf7; border: 1px solid #ceead6;">
                        <v-avatar size="32" color="#fff" class="mr-2 elevation-1">
                          <v-icon size="16" color="#188038">mdi-chart-line</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-caption text-uppercase font-weight-bold" style="font-size: 9.5px; color: #188038;">Impacto de Negocio</div>
                          <div class="font-weight-bold" style="font-size: 14px; color: #188038; line-height: 1.15;">$4.8M MXN</div>
                          <div class="text-caption font-weight-medium" style="font-size: 10px; color: #188038;">Sell-through 38% | ROI 37.5x</div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row dense class="mb-2">
                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f8f9fa; border: 1px solid #eee;">
                        <div class="font-weight-bold text-caption" style="color: #202124; font-size: 11px;">
                          1. Pauta Digital Performance Max
                        </div>
                        <div class="text-caption text-grey-darken-3 mt-1" style="font-size: 10.5px; line-height: 1.4;">
                          Captura búsquedas transaccionales en Google ("tenis maratón cdmx", "geles running") + Meta Reels con geocercas en Reforma y Chapultepec.
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f8f9fa; border: 1px solid #eee;">
                        <div class="font-weight-bold text-caption" style="color: #202124; font-size: 11px;">
                          2. Bundle Comercial Inteligente
                        </div>
                        <div class="text-caption text-grey-darken-3 mt-1" style="font-size: 10.5px; line-height: 1.4;">
                          15% off en bundle Calzado + Hidratación. Absorbe sólo 3.2 pts del 54% de margen bruto e incrementa el ticket a $3,499 MXN.
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="pa-2 rounded-lg h-100" style="background-color: #f8f9fa; border: 1px solid #eee;">
                        <div class="font-weight-bold text-caption" style="color: #202124; font-size: 11px;">
                          3. Click & Collect Express en 4h
                        </div>
                        <div class="text-caption text-grey-darken-3 mt-1" style="font-size: 10.5px; line-height: 1.4;">
                          Retiro exprés en tiendas Reforma, Polanco, Insurgentes y Santa Fe para compras de última hora previas a la entrega de kits del Maratón.
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
                      rounded="pill"
                      @click="askRetailPrompt('Detállame el plan de medios recomendado para el Maratón CDMX: canales, segmentación por geocercas, presupuesto de $120k y copies para anuncios.')"
                    >
                      <v-icon start size="15">mdi-file-document-outline</v-icon> Ver Plan de Medios
                    </v-btn>
                    <v-btn 
                      size="small" 
                      color="#EA4335" 
                      class="text-capitalize font-weight-bold text-white" 
                      rounded="pill" 
                      elevation="1"
                      @click="askRetailPrompt('Quiero activar la campaña omnicanal para el Maratón CDMX con presupuesto de $120,000 MXN. ¿Qué pasos inmediatos debemos ejecutar?')">
                      <v-icon start size="15">mdi-rocket-launch</v-icon> Activar Campaña
                    </v-btn>
                  </div>
                </v-card>

                </div>
              </div>

            </v-card-text>
          </v-card>
        </v-col>

        <!-- Lado Derecho: Agente de Marketing Retail -->
        <v-col cols="12" sm="5" md="5" lg="5" class="d-flex flex-column pa-2 pa-md-3" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column bg-grey-lighten-4 overflow-hidden" style="height: 100%; max-height: 100%; min-height: 0;">
            <v-card-title class="bg-white pa-3 pa-md-4 font-weight-bold d-flex align-center justify-space-between flex-shrink-0" style="color: #202124; border-bottom: 1px solid #eee;">
              <div class="d-flex align-center">
                <v-icon color="#EA4335" class="mr-2">mdi-robot-outline</v-icon>
                Agente de Marketing Retail
              </div>
              <v-chip size="x-small" color="#EA4335" variant="tonal" class="font-weight-bold">Datos en Tiempo Real</v-chip>
            </v-card-title>

            <!-- Sugerencias / Chips de Preguntas Rápidas -->
            <div class="px-4 py-3 bg-white d-flex flex-wrap flex-shrink-0" style="gap: 8px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askRiskBreakdownPrompt">
                🚨 Desglose Stock en Riesgo ($44.2M)
              </v-chip>
              <v-chip size="small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askRetailPrompt('¿Cómo podemos aprovechar la tendencia del Maratón en Deportes para recuperar ventas?')">
                🏃 Oportunidad Maratón CDMX
              </v-chip>
              <v-chip size="small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askRetailPrompt('Compara el ticket promedio de Electrónica vs Moda y su volumen de ventas')">
                🧾 Comparativa Tickets
              </v-chip>
            </div>

            <!-- Área de mensajes -->
            <v-card-text class="chat-container flex-grow-1 pa-3 pa-md-4 overflow-y-auto custom-scrollbar" id="chat-box-retail" style="min-height: 0; flex: 1 1 0; background-color: #f8f9fa;">
              <div v-for="(msg, index) in messagesRetail" :key="index" style="clear: both; width: 100%;">
                <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" :style="msg.role === 'ai' ? 'border-left: 4px solid #EA4335;' : ''">
                  <div v-if="msg.role === 'ai'" v-html="formatResponse(msg.content)"></div>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>
              
              <div v-if="loadingRetail" class="chat-bubble-ai" style="border-left: 4px solid #EA4335; clear: both;">
                <v-progress-circular indeterminate color="#EA4335" size="18" class="mr-2"></v-progress-circular>
                Analizando ventas y tendencias del mercado...
              </div>
              
              <!-- Tarjeta de Acción / Lanzamiento de Campaña -->
              <div v-if="showCampaignAction" class="my-3" style="clear: both; width: 100%;">
                <v-card class="pa-3 pa-md-4 rounded-xl bg-white elevation-1" style="border: 1px solid #fad2cf; border-left: 4px solid #EA4335;">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #EA4335;">
                      <v-icon size="16" color="#EA4335" class="mr-1">mdi-rocket-launch</v-icon> Propuesta de Campaña Lista
                    </span>
                    <v-chip size="x-small" color="error" variant="flat" class="font-weight-bold">Presupuesto: $120,000 MXN</v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-2 my-2" style="line-height: 1.45; font-size: 11.5px;">
                    PMax Google Ads + Meta Reels + Push App para corredores en CDMX y MTY (audiencia estimada: 52,000 runners).
                  </div>
                  <v-btn color="#EA4335" size="small" block rounded="pill" elevation="1" @click="launchCampaign" class="font-weight-bold text-white text-capitalize">
                    <v-icon start size="16">mdi-rocket-launch</v-icon> Activar Campaña
                  </v-btn>
                </v-card>
              </div>

              <div v-if="campaignLaunched" class="my-3 pa-3 rounded-xl bg-green-lighten-5 text-center text-success font-weight-bold text-caption" style="clear: both; border: 1px solid #ceead6; width: 100%;">
                <v-icon left color="success" size="18">mdi-check-circle</v-icon> ¡Campaña activada exitosamente en Google Ads (PMax) y Meta! Notificaciones push programadas para 52,000 corredores.
              </div>

            </v-card-text>

            <!-- Input -->
            <v-card-actions class="pa-3 pa-md-4 bg-white flex-shrink-0" style="border-top: 1px solid #eee;">
              <v-text-field
                v-model="userInputRetail"
                variant="outlined"
                density="compact"
                placeholder="Pregúntale al agente de marketing retail..."
                hide-details
                rounded="pill"
                @keyup.enter="sendMessageRetail"
                color="#EA4335"
              >
                <template v-slot:append-inner>
                  <v-btn icon color="#EA4335" @click="sendMessageRetail" :disabled="loadingRetail || !userInputRetail.trim()" variant="text">
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
      sessionId: 'demo-retail-' + Math.random().toString(36).substr(2, 9),
      retailTab: 'overview',
      retailCategoryChartInstance: null,
      retailChartInstance: null,
      retailCategories: [
        { 
          name: "Electrónica & Gaming", 
          icon: "mdi-laptop", 
          badge: "Top Ventas", 
          sales: "$62.5M", 
          salesNum: 62.5,
          ticket: "$4,800", 
          growth: 14.2, 
          trendText: "Alza Sostenida (+15%)", 
          trendIcon: "mdi-trending-up", 
          highlight: false,
          prompt: "Analiza el rendimiento de Electrónica & Gaming: ¿Qué subcategorías impulsan el ticket de $4,800 MXN y cómo capitalizar el Buen Fin?"
        },
        { 
          name: "Moda, Ropa & Calzado", 
          icon: "mdi-tshirt-crew", 
          badge: "Gran Volumen", 
          sales: "$41.8M", 
          salesNum: 41.8,
          ticket: "$1,250", 
          growth: 3.5, 
          trendText: "Estable (+2%)", 
          trendIcon: "mdi-minus", 
          highlight: false,
          prompt: "Evalúa la categoría Moda & Calzado: ¿Cómo podemos elevar el ticket promedio de $1,250 mediante cross-selling con accesorios?"
        },
        { 
          name: "Deportes & Outdoor (Running)", 
          icon: "mdi-run-fast", 
          badge: "🚨 Desfase Crítico ($12.5M)", 
          stockRisk: "$12.5M",
          sales: "$28.4M", 
          salesNum: 28.4,
          ticket: "$1,850", 
          growth: -18.4, 
          trendText: "Alza Viral Maratón (+92%)", 
          trendIcon: "mdi-fire", 
          highlight: true,
          prompt: "Analiza Deportes & Outdoor (-18.4% YoY, $12.5M en riesgo): ¿Por qué cayeron las ventas si el Maratón CDMX creció +92% y qué acciones me sugieres para mitigarlo?"
        },
        { 
          name: "Hogar, Muebles & Decoración", 
          icon: "mdi-sofa", 
          badge: "⚠️ Stock Lento ($15.8M)", 
          stockRisk: "$15.8M",
          sales: "$24.6M", 
          salesNum: 24.6,
          ticket: "$3,100", 
          growth: -11.2, 
          trendText: "Baja Estacional (-8%)", 
          trendIcon: "mdi-trending-down", 
          highlight: false,
          prompt: "Analiza Hogar & Muebles (-11.2% YoY, $15.8M en riesgo): ¿Qué estrategia de financiamiento a meses sin intereses o bundles de liquidación me sugieres?"
        },
        { 
          name: "Belleza & Cuidado Personal", 
          icon: "mdi-spa", 
          badge: "Top Crecimiento", 
          sales: "$16.9M", 
          salesNum: 16.9,
          ticket: "$780", 
          growth: 12.4, 
          trendText: "Alza Viral TikTok (+28%)", 
          trendIcon: "mdi-trending-up", 
          highlight: false,
          prompt: "Revisa Belleza & Cuidado Personal (+12.4%): ¿Cómo capitalizamos las tendencias de Skincare viral en TikTok con influencers?"
        },
        { 
          name: "Línea Blanca & Climatización", 
          icon: "mdi-fridge-outline", 
          badge: "⚠️ Baja Rotación ($11.2M)", 
          stockRisk: "$11.2M",
          sales: "$15.2M", 
          salesNum: 15.2,
          ticket: "$6,400", 
          growth: -5.1, 
          trendText: "Baja Post Ola Calor (-12%)", 
          trendIcon: "mdi-trending-down", 
          highlight: false,
          prompt: "Analiza Línea Blanca & Climatización (-5.1% YoY, $11.2M en riesgo): ¿Qué venta flash de liquidación y ofertas de instalación bonificada me sugieres?"
        },
        { 
          name: "Juguetería, Bebés & Niños", 
          icon: "mdi-baby-carriage", 
          badge: "Preventa Activa", 
          sales: "$12.8M", 
          salesNum: 12.8,
          ticket: "$920", 
          growth: 8.6, 
          trendText: "Preventa Fin de Año (+18%)", 
          trendIcon: "mdi-trending-up", 
          highlight: false,
          prompt: "¿Cómo viene la tracción de Juguetería y Bebés (+8.6%) y cómo anticipar inventario para la temporada navideña?"
        },
        { 
          name: "Alimentos Gourmet & Vinos", 
          icon: "mdi-bottle-wine", 
          badge: "Estacional", 
          sales: "$11.4M", 
          salesNum: 11.4,
          ticket: "$1,450", 
          growth: 6.1, 
          trendText: "Fiestas Patrias (+34%)", 
          trendIcon: "mdi-trending-up", 
          highlight: false,
          prompt: "Analiza Alimentos Gourmet y Vinos: ¿Qué impacto tienen las Fiestas Patrias (+34% en Trends) en el ticket promedio?"
        },
        { 
          name: "Farmacia & Nutrición Wellness", 
          icon: "mdi-medical-bag", 
          badge: "Frecuencia Alta", 
          sales: "$9.7M", 
          salesNum: 9.7,
          ticket: "$630", 
          growth: 9.8, 
          trendText: "Suplementos & Colágeno (+22%)", 
          trendIcon: "mdi-trending-up", 
          highlight: false,
          prompt: "Evalúa Farmacia & Wellness (+9.8%): ¿Cómo implementar un modelo de suscripción recurrente en vitaminas y suplementos?"
        },
        { 
          name: "Automotriz & Herramientas", 
          icon: "mdi-car-wrench", 
          badge: "⚠️ Stock Estancado ($4.7M)", 
          stockRisk: "$4.7M",
          sales: "$8.3M", 
          salesNum: 8.3,
          ticket: "$2,100", 
          growth: -3.8, 
          trendText: "Demanda Estable (-1%)", 
          trendIcon: "mdi-minus", 
          highlight: false,
          prompt: "Analiza Automotriz & Herramientas (-3.8% YoY, $4.7M en riesgo): ¿Qué campañas preventivas de otoño y convenios con talleres mecánicos me sugieres?"
        },
        { 
          name: "Mascotas & Pet Care", 
          icon: "mdi-paw", 
          badge: "Alta Tracción", 
          sales: "$7.5M", 
          salesNum: 7.5,
          ticket: "$510", 
          growth: 16.5, 
          trendText: "Alimentos Premium (+41%)", 
          trendIcon: "mdi-fire", 
          highlight: false,
          prompt: "Revisa Mascotas & Pet Care (+16.5% YoY, +41% en Trends): ¿Cómo crear campañas hiper-personalizadas para dueños de mascotas?"
        },
        { 
          name: "Cómputo & Oficina", 
          icon: "mdi-monitor", 
          badge: "Corporativo", 
          sales: "$6.8M", 
          salesNum: 6.8,
          ticket: "$3,900", 
          growth: -2.4, 
          trendText: "Back-to-Office (+5%)", 
          trendIcon: "mdi-trending-up", 
          highlight: false,
          prompt: "Analiza Cómputo & Oficina: ¿Qué oportunidades existen para ventas B2B a PyMEs con paquetes de equipamiento?"
        }
      ],
      userInputRetail: '',
      loadingRetail: false,
      messagesRetail: [
        { 
          role: 'ai', 
          content: `¡Hola! Soy tu Agente de Marketing Retail. Tengo la visión consolidada 360° de las 12 macro-categorías de tu negocio.\n\n📊 **Diagnóstico Ejecutivo:**\n- **Electrónica** ($62.5M, +14.2%) y **Belleza** (+12.4%) lideran las ventas con fuerte tracción y ticket saludable.\n- ⚠️ **Stock en Riesgo Consolidado:** Identificamos **$44.2M MXN inmovilizados en 4 categorías**:\n  1. 🛋️ **Hogar:** $15.8M (-11.2% YoY)\n  2. 🏃 **Deportes:** $12.5M (-18.4% YoY)\n  3. ❄️ **Línea Blanca:** $11.2M (-5.1% YoY)\n  4. 🔧 **Automotriz:** $4.7M (-3.8% YoY)\n- 🚨 **Foco de Oportunidad en Deportes:** Desfase donde la demanda del **Maratón CDMX crece +92%** en Google Trends mientras las ventas cayeron -18.4%.\n\n¿Deseas que analicemos las acciones que te sugiero para rotar los $44.2M en riesgo o revisar alguna categoría en específico?` 
        }
      ],
      showCampaignAction: false,
      campaignLaunched: false
    };
  },
  computed: {
    safeRetailCategories() {
      if (Array.isArray(this.retailCategories) && this.retailCategories.length > 0) {
        return this.retailCategories;
      }
      return [];
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initRetailCategoryChart();
      if (this.$route.query.prompt) {
        this.userInputRetail = this.$route.query.prompt;
        setTimeout(() => this.sendMessageRetail(), 300);
      }
    });
  },
  unmounted() {
    if (this.retailCategoryChartInstance) {
      this.retailCategoryChartInstance.destroy();
      this.retailCategoryChartInstance = null;
    }
    if (this.retailChartInstance) {
      this.retailChartInstance.destroy();
      this.retailChartInstance = null;
    }
  },
  methods: {
    onRetailTabChange(tab) {
      this.retailTab = tab;
      setTimeout(() => {
        if (tab === 'overview') {
          this.initRetailCategoryChart();
        } else if (tab === 'deepdive') {
          this.initChart();
        }
      }, 80);
    },
    setRetailTab(tab) {
      this.retailTab = tab;
      this.onRetailTabChange(tab);
    },
    drillDownCategory(cat) {
      if (!cat) return;
      if (cat.prompt) {
        this.userInputRetail = cat.prompt;
      } else {
        this.userInputRetail = `Analiza detalladamente la categoría "${cat.name}" cruzándola con tendencias del mercado, ticket promedio y capital inmovilizado. ¿Qué acciones me sugieres?`;
      }
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-retail ~ * input') || document.querySelector('input[placeholder*="agente de marketing"]');
        if (inputEl) inputEl.focus();
      });
    },
    askRetailPrompt(promptText) {
      this.userInputRetail = promptText;
      this.sendMessageRetail();
    },
    askRiskBreakdownPrompt() {
      this.userInputRetail = "¿Cuáles son las 4 categorías que componen los $44.2M en stock en riesgo, cuánto capital inmovilizado tiene cada una y qué acciones me sugieres para rotarlas y desbloquear este capital?";
      this.sendMessageRetail();
    },
    initRetailCategoryChart() {
      this.$nextTick(() => {
        const canvas = document.getElementById('retailCategoryChart');
        if (!canvas) return;

        if (this.retailCategoryChartInstance) {
          try { this.retailCategoryChartInstance.destroy(); } catch(e){}
          this.retailCategoryChartInstance = null;
        }

        const ctx = canvas.getContext('2d');
        const categories = this.safeRetailCategories || [];
        const labels = categories.map(c => (c && c.name) ? c.name.split(',')[0].split(' &')[0].split(' (')[0] : '');
        const salesData = categories.map(c => (c && c.salesNum) ? c.salesNum : 0);
        const growthData = categories.map(c => (c && typeof c.growth === 'number') ? c.growth : 0);
        
        // Paleta unificada monocromática de Retail: tonos degradados de carmesí a coral suave
        const retailShades = [
          '#9B0000', // Electrónica ($62.5M)
          '#B31412', // Moda ($41.8M)
          '#C5221F', // Deportes ($28.4M)
          '#D93025', // Hogar ($24.6M)
          '#E53935', // Belleza ($16.9M)
          '#EA4335', // Línea Blanca ($15.2M)
          '#EE534F', // Juguetería ($12.8M)
          '#EF6C67', // Alimentos ($11.4M)
          '#F28580', // Farmacia ($9.7M)
          '#F49E9A', // Automotriz ($8.3M)
          '#F7B6B3', // Mascotas ($7.5M)
          '#F9CECB'  // Cómputo ($6.8M)
        ];
        const colors = categories.map((c, i) => retailShades[i % retailShades.length]);

        try {
          this.retailCategoryChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  type: 'line',
                  label: 'Crecimiento YoY (%)',
                  data: growthData,
                  yAxisID: 'yYoY',
                  borderColor: '#202124',
                  borderWidth: 2,
                  pointBackgroundColor: growthData.map(g => g < 0 ? '#EA4335' : '#202124'),
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 1.5,
                  pointRadius: 4.5,
                  pointHoverRadius: 7,
                  tension: 0.25,
                  order: 1
                },
                {
                  type: 'bar',
                  label: 'Ventas Netas ($M MXN)',
                  data: salesData,
                  yAxisID: 'ySales',
                  backgroundColor: colors,
                  hoverBackgroundColor: '#9B0000',
                  borderRadius: 6,
                  borderWidth: 0,
                  barThickness: 22,
                  order: 2
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#202124',
                  titleColor: '#ffffff',
                  bodyColor: '#ffffff',
                  padding: 10,
                  cornerRadius: 8,
                  callbacks: {
                    title: (items) => {
                      if (!items || !items[0]) return '';
                      const cat = categories[items[0].dataIndex];
                      return cat ? cat.name : '';
                    },
                    label: (context) => {
                      const cat = categories[context.dataIndex];
                      if (!cat) return '';
                      if (context.dataset.type === 'bar') {
                        return ` Ventas Netas: ${cat.sales} (Ticket: ${cat.ticket})`;
                      } else {
                        const sign = (cat.growth || 0) > 0 ? '+' : '';
                        return ` Crecimiento YoY: ${sign}${cat.growth}%`;
                      }
                    }
                  }
                }
              },
              scales: {
                ySales: {
                  type: 'linear',
                  position: 'left',
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Ventas ($M MXN)',
                    color: '#5f6368',
                    font: { size: 10, weight: 'bold' }
                  },
                  grid: { color: '#f0f0f0' },
                  ticks: {
                    color: '#5f6368',
                    font: { size: 10 }
                  }
                },
                yYoY: {
                  type: 'linear',
                  position: 'right',
                  title: {
                    display: true,
                    text: 'YoY (%)',
                    color: '#5f6368',
                    font: { size: 10, weight: 'bold' }
                  },
                  grid: {
                    color: (context) => (context.tick && context.tick.value === 0) ? 'rgba(234, 67, 53, 0.45)' : 'transparent',
                    lineWidth: (context) => (context.tick && context.tick.value === 0) ? 1.5 : 0,
                    borderDash: [4, 4],
                    drawOnChartArea: true
                  },
                  ticks: {
                    color: (context) => (context.tick && context.tick.value < 0) ? '#C5221F' : '#5f6368',
                    font: { size: 10 },
                    callback: (value) => `${value > 0 ? '+' : ''}${value}%`
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: {
                    color: '#3c4043',
                    font: { size: 10 }
                  }
                }
              }
            }
          });
        } catch(err) {
          console.warn('Error initializing retailCategoryChart:', err);
        }
      });
    },
    initChart() {
      const canvas = document.getElementById('retailMixedChart');
      if (!canvas) return;

      if (this.retailChartInstance) {
        try { this.retailChartInstance.destroy(); } catch(e){}
        this.retailChartInstance = null;
      }

      const ctx = canvas.getContext('2d');
      try {
        this.retailChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Sem -5', 'Sem -4', 'Sem -3', 'Sem -2', 'Sem Pasada', 'Sem Actual', 'Sem +1 (Proy)', 'Sem +2 (Maratón)'],
            datasets: [
              {
                label: 'Ventas Reales (Unidades)',
                data: [420, 360, 290, 220, 160, 115, null, null],
                borderColor: '#EA4335',
                backgroundColor: 'rgba(234, 67, 53, 0.08)',
                borderWidth: 2.5,
                yAxisID: 'yVentas',
                fill: true,
                tension: 0.35,
                pointRadius: 4.5,
                pointBackgroundColor: '#EA4335',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                order: 2
              },
              {
                label: 'Demanda Externa (%)',
                data: [16, 24, 38, 55, 74, 92, 98, 100],
                borderColor: '#202124',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 4],
                yAxisID: 'yDemanda',
                fill: false,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: '#202124',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                order: 3
              },
              {
                label: 'Proyección con Campaña',
                data: [null, null, null, null, null, 115, 520, 890],
                borderColor: '#188038',
                backgroundColor: 'rgba(24, 128, 56, 0.06)',
                borderWidth: 2.5,
                borderDash: [3, 3],
                yAxisID: 'yVentas',
                fill: true,
                tension: 0.35,
                pointRadius: 5,
                pointBackgroundColor: '#188038',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                order: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#202124',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: (context) => {
                    if (context.raw === null || context.raw === undefined) return null;
                    if (context.dataset.yAxisID === 'yDemanda') {
                      return ` Demanda de Búsqueda: ${context.raw}%`;
                    }
                    return ` ${context.dataset.label}: ${context.raw} unidades`;
                  }
                }
              }
            },
            scales: {
              yVentas: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: { 
                  display: true, 
                  text: 'Ventas (Unidades/Semana)', 
                  color: '#5f6368', 
                  font: { size: 10, weight: 'bold' } 
                },
                grid: { color: '#f0f0f0' },
                ticks: { font: { size: 10 }, color: '#5f6368' }
              },
              yDemanda: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 105,
                title: { 
                  display: true, 
                  text: 'Demanda Externa (%)', 
                  color: '#5f6368', 
                  font: { size: 10, weight: 'bold' } 
                },
                grid: { drawOnChartArea: false },
                ticks: { 
                  font: { size: 10 }, 
                  color: '#5f6368',
                  callback: (val) => `${val}%`
                }
              },
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: '#3c4043' }
              }
            }
          }
        });
      } catch(err) {
        console.warn('Error al inicializar retailMixedChart:', err);
      }
    },
    scrollToBottomRetail() {
      setTimeout(() => {
        const chatBox = document.getElementById('chat-box-retail');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 100);
    },
    launchCampaign() {
      this.showCampaignAction = false;
      this.campaignLaunched = true;
      this.scrollToBottomRetail();
    },
    async sendMessageRetail() {
      if (!this.userInputRetail.trim()) return;

      const text = this.userInputRetail;
      this.messagesRetail.push({ role: 'user', content: text });
      this.userInputRetail = '';
      this.loadingRetail = true;
      this.showCampaignAction = false;
      this.campaignLaunched = false;
      this.scrollToBottomRetail();

      try {
        const response = await axios.post('/api/chat/retail', {
          session_id: this.sessionId,
          message: text
        });
        
        const reply = response.data.response;
        this.messagesRetail.push({ role: 'ai', content: reply });
        
        const lowerReply = reply.toLowerCase();
        const lowerText = text.toLowerCase();
        
        // La tarjeta de activación de campaña solo se despliega si el usuario ya está en el Deep Dive (Deportes/Maratón)
        // y la interacción versa sobre activar o desplegar la campaña
        if (this.retailTab === 'deepdive' && 
            (lowerText.includes('campaña') || lowerText.includes('activar') || lowerText.includes('lanzar') || lowerText.includes('anuncio') || lowerText.includes('pmax')) &&
            (lowerReply.includes('campaña') || lowerReply.includes('activar') || lowerReply.includes('pmax') || lowerReply.includes('audiencia'))) {
          this.showCampaignAction = true;
        } else {
          this.showCampaignAction = false;
        }
      } catch (error) {
        console.error('Error en Agente de Marketing Retail:', error);
        const errDetail = error.response?.data?.detail || error.message || 'Error de conexión con el Agente de Retail.';
        this.messagesRetail.push({ 
          role: 'ai', 
          content: `⚠️ **Error en el Agente de Marketing Retail:**\n\n${errDetail}` 
        });
      } finally {
        this.loadingRetail = false;
        this.scrollToBottomRetail();
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
    },
    formatTrendLabel(text) {
      if (!text) return '';
      // Elimina cualquier emoji duplicado al inicio para no repetirse con trendIcon
      return String(text).replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]\s*/u, '').trim();
    }
  }
};
