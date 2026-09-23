// RetailView.js - Vista de Retail Intelligence & Agente de Marketing Retail

const RetailView = {
  template: `
    <v-container class="pa-2 px-3 flex-grow-1 d-flex flex-column fill-height" style="max-width: 100%; box-sizing: border-box; overflow: hidden;">
      <v-row class="flex-grow-1 my-0" style="height: 100%; max-height: 100%; min-height: 0;">
        <!-- Lado Izquierdo: Dashboard Ejecutivo (Overview o Deep Dive) -->
        <v-col cols="12" sm="7" md="7" lg="7" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column overflow-hidden bg-white" style="height: 100%; max-height: 100%; min-height: 0;">
            
            <!-- Header con Switcher de Tabs & Contexto -->
            <v-card-title class="bg-white pa-3 border-b d-flex align-center justify-space-between flex-shrink-0" style="border-bottom: 1px solid #e8eaed;">
              <div class="d-flex align-center">
                <v-avatar color="#fce8e6" size="36" class="mr-3">
                  <v-icon color="#EA4335">mdi-shopping</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold" style="color: #EA4335; line-height: 1.2;">
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
                  color="#1a73e8"
                  variant="outlined"
                  class="mr-2"
                  style="border-color: #dadce0;"
                  @update:model-value="onRetailTabChange"
                >
                  <v-btn value="overview" size="small" class="text-capitalize font-weight-bold" style="font-size: 11.5px;">
                    <v-icon start size="15">mdi-view-dashboard-outline</v-icon> Panorama General
                  </v-btn>
                  <v-btn value="deepdive" size="small" class="text-capitalize font-weight-bold" style="font-size: 11.5px;">
                    <v-icon start size="15" color="#EA4335">mdi-bullseye-arrow</v-icon> Deep Dive: Deportes
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-card-title>
            
            <v-card-text class="flex-grow-1 pa-3 overflow-y-auto custom-scrollbar" style="background-color: #f8f9fa; min-height: 0;">
              
              <!-- ========================================== -->
              <!-- TAB 1: PANORAMA GENERAL (MACRO-CATEGORÍAS) -->
              <!-- ========================================== -->
              <div v-show="retailTab === 'overview'">
                <!-- 4 Macro KPI Cards -->
                <v-row class="mb-2" dense>
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-lg pa-2 text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #5f6368;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px;">Ventas QTD</div>
                      <div class="text-subtitle-1 font-weight-bold mt-1" style="color: #202124;">$240.9M</div>
                      <v-chip size="x-small" color="success" class="font-weight-bold mt-1" variant="flat">
                        <v-icon start size="10">mdi-arrow-up</v-icon> +7.2% YoY
                      </v-chip>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-lg pa-2 text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #5f6368;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px;">Ticket Prom.</div>
                      <div class="text-subtitle-1 font-weight-bold mt-1" style="color: #202124;">$1,740</div>
                      <v-chip size="x-small" color="success" class="font-weight-bold mt-1" variant="flat">
                        <v-icon start size="10">mdi-arrow-up</v-icon> +5.1% YoY
                      </v-chip>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="6" sm="3">
                    <v-card class="rounded-lg pa-2 text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #5f6368;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px;">Transacciones</div>
                      <div class="text-subtitle-1 font-weight-bold mt-1" style="color: #202124;">138,450</div>
                      <span class="text-caption font-weight-bold" style="color: #5f6368; font-size: 10px;">Conv. 3.5%</span>
                    </v-card>
                  </v-col>

                  <v-col cols="6" sm="3">
                    <v-card class="rounded-lg pa-2 text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #EA4335;">
                      <div class="text-caption text-grey-darken-1 text-uppercase font-weight-bold" style="font-size: 10px;">Stock en Riesgo</div>
                      <div class="text-subtitle-1 font-weight-bold mt-1" style="color: #EA4335;">$44.2M</div>
                      <v-chip size="x-small" color="error" class="font-weight-bold mt-1" variant="flat">
                        4 Categorías
                      </v-chip>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Gráfica de Ventas por Macro-Categoría -->
                <v-card class="mb-2 rounded-lg pa-3 bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <div>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                        <v-icon size="14" color="#202124" class="mr-1">mdi-chart-bar</v-icon> Ventas Netas por Categoría ($M MXN)
                      </span>
                    </div>
                    <div class="d-flex align-center" style="gap: 8px;">
                      <span class="text-caption" style="font-size: 10px; color: #137333;"><v-icon size="9" color="#34A853">mdi-circle</v-icon> Crecimiento</span>
                      <span class="text-caption" style="font-size: 10px; color: #b06000;"><v-icon size="9" color="#FBBC05">mdi-circle</v-icon> Alerta Stock</span>
                      <span class="text-caption" style="font-size: 10px; color: #c5221f;"><v-icon size="9" color="#EA4335">mdi-circle</v-icon> Riesgo Crítico</span>
                      <span class="text-caption" style="font-size: 10px; color: #5f6368;"><v-icon size="9" color="#64748B">mdi-circle</v-icon> Estable</span>
                    </div>
                  </div>
                  <div style="position: relative; height: 160px; width: 100%;">
                    <canvas id="retailCategoryChart"></canvas>
                  </div>
                </v-card>

                <!-- Matriz Ejecutiva con Señales de Google Trends -->
                <v-card class="mb-2 rounded-lg overflow-hidden bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="pa-2 px-3 d-flex align-center justify-space-between" style="background-color: #f8f9fa; border-bottom: 1px solid #e8eaed;">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                      <v-icon size="16" color="#202124" class="mr-1">mdi-table</v-icon> Matriz de Categorías & Señal de Demanda Externa (Google Trends)
                    </span>
                    <span class="text-caption text-grey-darken-1" style="font-size: 11px;">12 Categorías Activas | Clic en <strong>Analizar</strong></span>
                  </div>
                  
                  <div class="retail-matrix-container custom-scrollbar">
                    <table class="retail-matrix-table">
                      <colgroup>
                        <col style="width: 28%;">
                        <col style="width: 13%;">
                        <col style="width: 13%;">
                        <col style="width: 11%;">
                        <col style="width: 23%;">
                        <col style="width: 12%;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th style="text-align: left; padding: 8px 12px;">Categoría</th>
                          <th style="text-align: right; padding: 8px 12px;">Ventas QTD</th>
                          <th style="text-align: right; padding: 8px 12px;">Ticket Prom.</th>
                          <th style="text-align: center; padding: 8px 4px;">YoY (%)</th>
                          <th style="text-align: left; padding: 8px 12px;">Demanda (Google Trends)</th>
                          <th style="text-align: center; padding: 8px 6px;">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="(cat, idx) in retailCategories" 
                          :key="cat.name" 
                          :style="cat.highlight ? 'background-color: #fff8f7; border-left: 4px solid #EA4335;' : ''"
                        >
                          <td style="text-align: left; padding: 6px 12px;">
                            <div class="d-flex align-center" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                              <v-icon color="#5f6368" size="16" class="mr-2 flex-shrink-0">{{ cat.icon }}</v-icon>
                              <span class="font-weight-bold text-truncate" style="color: #202124; font-size: 11.5px;">{{ cat.name }}</span>
                              <v-chip 
                                v-if="cat.badge" 
                                size="x-small" 
                                :color="cat.badgeColor" 
                                class="ml-1 font-weight-bold flex-shrink-0" 
                                :variant="cat.badgeVariant || 'flat'" 
                                style="height: 16px; font-size: 8.5px; padding: 0 5px;"
                              >
                                {{ cat.badge }}
                              </v-chip>
                            </div>
                          </td>
                          <td style="text-align: right; padding: 6px 12px; font-weight: 700; color: #202124; font-size: 11.5px;">
                            {{ cat.sales }}
                          </td>
                          <td style="text-align: right; padding: 6px 12px; color: #3c4043; font-weight: 600; font-size: 11.5px;">
                            {{ cat.ticket }}
                          </td>
                          <td style="text-align: center; padding: 6px 4px;">
                            <v-chip 
                              size="x-small" 
                              :color="cat.growth > 0 ? 'success' : 'error'" 
                              variant="flat" 
                              class="font-weight-bold justify-center" 
                              style="height: 18px; font-size: 10px; min-width: 48px;"
                            >
                              {{ cat.growth > 0 ? '+' : '' }}{{ cat.growth }}%
                            </v-chip>
                          </td>
                          <td style="text-align: left; padding: 6px 12px;">
                            <div class="d-flex align-center" :style="{ color: cat.trendColor || '#5f6368', fontWeight: 600, fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
                              <v-icon size="13" :color="cat.trendColor || '#5f6368'" class="mr-1 flex-shrink-0">{{ cat.trendIcon || 'mdi-trending-neutral' }}</v-icon>
                              <span class="text-truncate">{{ cat.trendText }}</span>
                            </div>
                          </td>
                          <td style="text-align: center; padding: 6px 6px;">
                            <v-btn 
                              size="x-small" 
                              variant="flat" 
                              rounded="pill" 
                              class="font-weight-bold text-capitalize"
                              :class="cat.highlight ? 'retail-action-btn-alert' : 'retail-action-btn-neutral'"
                              style="height: 22px; font-size: 10px; padding: 0 8px;"
                              @click="drillDownCategory(cat)"
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
                    <v-card class="h-100 w-100 rounded-lg pa-2 px-3 bg-white cursor-pointer transition-swing d-flex flex-column justify-space-between" elevation="1" style="border: 1px solid #e8eaed; border-left: 4px solid #EA4335; min-height: 82px;" @click="setRetailTab('deepdive')">
                      <div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #EA4335; font-size: 11px;">🚨 Desfase Crítico de Demanda</span>
                          <v-icon color="#EA4335" size="16">mdi-arrow-right-circle</v-icon>
                        </div>
                        <div class="text-caption font-weight-bold mt-1" style="color: #202124;">Deportes & Outdoor (-18.4%)</div>
                        <p class="text-caption text-grey-darken-2 mb-0" style="font-size: 11px; line-height: 1.35;">
                          Caída en ventas vs <strong>"Maratón CDMX" subió +92% en Google Trends</strong>. Capital inmovilizado: <strong>$12.5M MXN</strong>.
                        </p>
                      </div>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" class="d-flex">
                    <v-card class="h-100 w-100 rounded-lg pa-2 px-3 bg-white cursor-pointer transition-swing d-flex flex-column justify-space-between" elevation="1" style="border: 1px solid #e8eaed; border-left: 4px solid #5f6368; min-height: 82px;" @click="askRetailPrompt('Analiza la oportunidad de margen en Electrónica & Gaming con ticket promedio de $4,800 MXN')">
                      <div>
                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption font-weight-bold text-uppercase" style="color: #3c4043; font-size: 11px;">💡 Oportunidad de Margen</span>
                          <v-icon color="#5f6368" size="16">mdi-trending-up</v-icon>
                        </div>
                        <div class="text-caption font-weight-bold mt-1" style="color: #202124;">Electrónica & Gaming (+14.2%)</div>
                        <p class="text-caption text-grey-darken-2 mb-0" style="font-size: 11px; line-height: 1.35;">
                          Ticket promedio en <strong>$4,800 MXN</strong> impulsado por lanzamientos y alta demanda previa a Buen Fin.
                        </p>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- ========================================== -->
              <!-- TAB 2: DEEP DIVE (DEPORTES & MARATÓN CDMX) -->
              <!-- ========================================== -->
              <div v-show="retailTab === 'deepdive'">
                
                <!-- Alert Header Context -->
                <v-alert
                  type="error"
                  variant="tonal"
                  density="compact"
                  rounded="lg"
                  class="mb-3 text-caption font-weight-medium"
                  icon="mdi-alert-octagon-outline"
                >
                  <strong>Foco Estratégico:</strong> Desfase entre la demanda de búsqueda externa (Google Trends: +92%) y el inventario en tiendas (-18.4% YoY). Capital en riesgo: <strong>$12.5M MXN</strong>.
                </v-alert>

                <!-- Mini KPI Cards Deportes -->
                <v-row class="mb-2" dense>
                  <v-col cols="4">
                    <v-card class="pa-2 rounded-lg text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #EA4335;">
                      <div class="text-caption text-grey-darken-1" style="font-size: 10px;">Ventas Deportes</div>
                      <div class="text-subtitle-2 font-weight-bold text-red-darken-2">-18.4% YoY</div>
                      <span class="text-caption" style="font-size: 9.5px; color: #5f6368;">$28.4M vs $34.8M LY</span>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card class="pa-2 rounded-lg text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #34A853;">
                      <div class="text-caption text-grey-darken-1" style="font-size: 10px;">Google Trends CDMX</div>
                      <div class="text-subtitle-2 font-weight-bold text-green-darken-2">92 / 100</div>
                      <span class="text-caption" style="font-size: 9.5px; color: #34A853; font-weight: bold;">+92% en 4 semanas</span>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card class="pa-2 rounded-lg text-center bg-white" elevation="1" style="border: 1px solid #e8eaed; border-top: 3px solid #FBBC05;">
                      <div class="text-caption text-grey-darken-1" style="font-size: 10px;">Stock Inmovilizado</div>
                      <div class="text-subtitle-2 font-weight-bold text-amber-darken-4">$12.5M</div>
                      <span class="text-caption" style="font-size: 9.5px; color: #5f6368;">6,750 unidades</span>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Gráfica Combinada: Ventas vs Google Trends -->
                <v-card class="pa-3 rounded-lg mb-3 bg-white" elevation="1" style="border: 1px solid #e8eaed;">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <div>
                      <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">Desfase: Ventas Semanales vs Índice de Búsqueda</span>
                    </div>
                    <v-chip size="x-small" color="error" variant="outlined" class="font-weight-bold">Maratón CDMX en 25 días</v-chip>
                  </div>
                  <div style="position: relative; height: 160px; width: 100%;">
                    <canvas id="retailMixedChart"></canvas>
                  </div>
                </v-card>

                <!-- Catálogo de SKUs Críticos con Inventario Inmovilizado -->
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-weight-bold text-caption text-uppercase" style="color: #202124;">
                    <v-icon size="15" color="#EA4335">mdi-tag-multiple-outline</v-icon> SKUs Críticos para Activar en Campaña
                  </span>
                  <span class="text-caption text-grey-darken-1" style="font-size: 11px;">Stock en CDMX y MTY</span>
                </div>

                <v-row dense class="mb-2">
                  <v-col cols="12" sm="4">
                    <v-card class="pa-2 rounded-lg sku-card bg-white" elevation="1" style="border: 1px solid #e0e0e0;">
                      <div class="d-flex align-center justify-space-between">
                        <v-chip size="x-small" color="error" variant="flat" class="font-weight-bold">Stock: 2,400 pares</v-chip>
                        <span class="text-caption font-weight-bold text-green-darken-2">Margen: 54%</span>
                      </div>
                      <div class="text-caption font-weight-bold mt-2" style="color: #202124;">Tenis Carbon Pro CDMX</div>
                      <div class="text-caption text-grey-darken-2">$2,899 MXN</div>
                      <div class="text-caption text-red-darken-1 mt-1 font-weight-medium" style="font-size: 10.5px;">Rotación: 82 días (Lenta)</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-card class="pa-2 rounded-lg sku-card bg-white" elevation="1" style="border: 1px solid #e0e0e0;">
                      <div class="d-flex align-center justify-space-between">
                        <v-chip size="x-small" color="warning" variant="flat" class="font-weight-bold">Stock: 1,150 pzas</v-chip>
                        <span class="text-caption font-weight-bold text-green-darken-2">Margen: 42%</span>
                      </div>
                      <div class="text-caption font-weight-bold mt-2" style="color: #202124;">Smartwatch Marathon GPS</div>
                      <div class="text-caption text-grey-darken-2">$4,499 MXN</div>
                      <div class="text-caption text-amber-darken-3 mt-1 font-weight-medium" style="font-size: 10.5px;">Rotación: 65 días</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-card class="pa-2 rounded-lg sku-card bg-white" elevation="1" style="border: 1px solid #e0e0e0;">
                      <div class="d-flex align-center justify-space-between">
                        <v-chip size="x-small" color="error" variant="flat" class="font-weight-bold">Stock: 3,200 pzas</v-chip>
                        <span class="text-caption font-weight-bold text-green-darken-2">Margen: 61%</span>
                      </div>
                      <div class="text-caption font-weight-bold mt-2" style="color: #202124;">Chaleco Hidratación 5L</div>
                      <div class="text-caption text-grey-darken-2">$1,299 MXN</div>
                      <div class="text-caption text-red-darken-1 mt-1 font-weight-medium" style="font-size: 10.5px;">Rotación: 95 días (Lenta)</div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Resumen de Impacto de Negocio -->
                <v-card class="pa-3 rounded-lg bg-grey-lighten-4" elevation="0" style="border: 1px solid #e8eaed; border-left: 4px solid #5f6368;">
                  <div class="font-weight-bold text-caption" style="color: #202124;">🎯 Oportunidad de Negocio Identificada por el Agente:</div>
                  <div class="text-caption text-grey-darken-3 mt-1" style="line-height: 1.4;">
                    Lanzar campaña omnicanal (Google Ads PMax + Meta Reels + Push App) dirigida a corredores en CDMX/MTY con bundle de calzado + reloj con <strong>15% de descuento</strong>. Recuperación estimada: <strong>$4.5M MXN en 21 días</strong>.
                  </div>
                </v-card>

              </div>

            </v-card-text>
          </v-card>
        </v-col>

        <!-- Lado Derecho: Agente de Marketing Retail -->
        <v-col cols="12" sm="5" md="5" lg="5" class="d-flex flex-column pa-2" style="height: 100%; max-height: 100%; min-height: 0;">
          <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column bg-grey-lighten-4 overflow-hidden" style="height: 100%; max-height: 100%; min-height: 0;">
            <v-card-title class="bg-white pa-3 font-weight-bold d-flex align-center justify-space-between flex-shrink-0" style="color: #202124; border-bottom: 1px solid #eee;">
              <div class="d-flex align-center">
                <v-icon color="#EA4335" class="mr-2">mdi-robot-outline</v-icon>
                Agente de Marketing Retail
              </div>
              <v-chip size="x-small" color="error" variant="outlined">Trends & BQ Active</v-chip>
            </v-card-title>

            <!-- Sugerencias / Chips de Preguntas Rápidas -->
            <div class="px-3 py-2 bg-white d-flex flex-wrap flex-shrink-0" style="gap: 5px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askRetailPrompt('¿Qué categorías presentan el peor rendimiento y cuánto capital tienen inmovilizado?')">
                🚨 Categorías en riesgo
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#4285F4" class="cursor-pointer font-weight-bold" @click="askRetailPrompt('¿Cómo podemos aprovechar la tendencia del Maratón en Deportes para recuperar ventas?')">
                🏃 Oportunidad Maratón CDMX
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#34A853" class="cursor-pointer font-weight-bold" @click="askRetailPrompt('Compara el ticket promedio de Electrónica vs Moda y su volumen de ventas')">
                🧾 Comparativa Tickets
              </v-chip>
            </div>

            <!-- Área de mensajes -->
            <v-card-text class="chat-container flex-grow-1 pa-3 overflow-y-auto custom-scrollbar" id="chat-box-retail" style="min-height: 0; flex: 1 1 0; background-color: #f8f9fa;">
              <div v-for="(msg, index) in messagesRetail" :key="index" style="clear: both; width: 100%;">
                <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'" :style="msg.role === 'ai' ? 'border-left: 4px solid #EA4335;' : ''">
                  <div v-if="msg.role === 'ai'" v-html="formatResponse(msg.content)"></div>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>
              
              <div v-if="loadingRetail" class="chat-bubble-ai" style="border-left: 4px solid #EA4335; clear: both;">
                <v-progress-circular indeterminate color="#EA4335" size="18" class="mr-2"></v-progress-circular>
                Cruzando datos en BigQuery & Google Trends...
              </div>
              
              <!-- Tarjeta de Acción / Lanzamiento de Campaña -->
              <div v-if="showCampaignAction" class="my-3" style="clear: both; width: 100%;">
                <v-card class="pa-3 rounded-lg bg-white elevation-1" style="border: 1px solid #fad2cf; border-left: 4px solid #EA4335;">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="font-weight-bold text-caption text-uppercase" style="color: #EA4335;">
                      <v-icon size="16" color="#EA4335" class="mr-1">mdi-rocket-launch</v-icon> Propuesta de Campaña Lista
                    </span>
                    <v-chip size="x-small" color="error" variant="flat" class="font-weight-bold">Presupuesto: $150,000 MXN</v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-2 my-2" style="line-height: 1.4;">
                    PMax Google Ads + Meta Reels + Push App para corredores en CDMX y MTY (audiencia estimada: 48,000 runners).
                  </div>
                  <v-btn color="#EA4335" size="small" block rounded="pill" elevation="1" @click="launchCampaign" class="font-weight-bold text-white text-capitalize">
                    <v-icon start size="16">mdi-rocket-launch</v-icon> Activar Campaña Hiper-Personalizada
                  </v-btn>
                </v-card>
              </div>

              <div v-if="campaignLaunched" class="my-3 pa-3 rounded-lg bg-green-lighten-5 text-center text-success font-weight-bold text-caption" style="clear: both; border: 1px solid #ceead6; width: 100%;">
                <v-icon left color="success" size="18">mdi-check-circle</v-icon> ¡Campaña activada exitosamente en Google Ads (PMax) y Meta! Notificaciones push programadas para 48,000 corredores.
              </div>

            </v-card-text>

            <!-- Input -->
            <v-card-actions class="pa-3 bg-white flex-shrink-0" style="border-top: 1px solid #eee;">
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
          iconColor: "#4B5563", 
          barColor: "#34A853",
          badge: "Top Ventas", 
          badgeColor: "success", 
          badgeVariant: "flat",
          sales: "$62.5M", 
          salesNum: 62.5,
          ticket: "$4,800", 
          growth: 14.2, 
          trendText: "Alza Sostenida (+15%)", 
          trendIcon: "mdi-trending-up", 
          trendColor: "#137333",
          highlight: false,
          prompt: "Analiza el rendimiento de Electrónica & Gaming: ¿Qué subcategorías impulsan el ticket de $4,800 MXN y cómo capitalizar el Buen Fin?"
        },
        { 
          name: "Moda, Ropa & Calzado", 
          icon: "mdi-tshirt-crew", 
          iconColor: "#4B5563", 
          barColor: "#475569",
          badge: "Gran Volumen", 
          badgeColor: "#5F6368", 
          badgeVariant: "tonal",
          sales: "$41.8M", 
          salesNum: 41.8,
          ticket: "$1,250", 
          growth: 3.5, 
          trendText: "Estable (+2%)", 
          trendIcon: "mdi-minus", 
          trendColor: "#5F6368",
          highlight: false,
          prompt: "Evalúa la categoría Moda & Calzado: ¿Cómo podemos elevar el ticket promedio de $1,250 mediante cross-selling con accesorios?"
        },
        { 
          name: "Deportes & Outdoor (Running)", 
          icon: "mdi-run-fast", 
          iconColor: "#4B5563", 
          barColor: "#EA4335",
          badge: "🚨 Desfase Crítico", 
          badgeColor: "error", 
          badgeVariant: "flat",
          sales: "$28.4M", 
          salesNum: 28.4,
          ticket: "$1,850", 
          growth: -18.4, 
          trendText: "🔥 Alza Viral Maratón (+92%)", 
          trendIcon: "mdi-fire", 
          trendColor: "#EA4335",
          highlight: true,
          prompt: "🚨 Explícame el desfase crítico en Deportes & Outdoor: ¿Por qué cayeron las ventas -18.4% si las búsquedas del Maratón CDMX crecieron +92% y cómo mitigarlo?"
        },
        { 
          name: "Hogar, Muebles & Decoración", 
          icon: "mdi-sofa", 
          iconColor: "#4B5563", 
          barColor: "#EA4335",
          badge: "Inventario Lento", 
          badgeColor: "warning", 
          badgeVariant: "flat",
          sales: "$24.6M", 
          salesNum: 24.6,
          ticket: "$3,100", 
          growth: -11.2, 
          trendText: "Baja Estacional (-8%)", 
          trendIcon: "mdi-trending-down", 
          trendColor: "#EA4335",
          highlight: false,
          prompt: "Analiza Hogar & Muebles: ¿Qué estrategia de financiamiento o meses sin intereses sugerimos para rotar el stock inmovilizado?"
        },
        { 
          name: "Belleza & Cuidado Personal", 
          icon: "mdi-spa", 
          iconColor: "#4B5563", 
          barColor: "#34A853",
          badge: "Top Crecimiento", 
          badgeColor: "success", 
          badgeVariant: "flat",
          sales: "$16.9M", 
          salesNum: 16.9,
          ticket: "$780", 
          growth: 12.4, 
          trendText: "Alza Viral TikTok (+28%)", 
          trendIcon: "mdi-trending-up", 
          trendColor: "#137333",
          highlight: false,
          prompt: "Revisa Belleza & Cuidado Personal (+12.4%): ¿Cómo capitalizamos las tendencias de Skincare viral en TikTok con influencers?"
        },
        { 
          name: "Línea Blanca & Climatización", 
          icon: "mdi-fridge-outline", 
          iconColor: "#4B5563", 
          barColor: "#FBBC05",
          badge: "Baja Demanda", 
          badgeColor: "warning", 
          badgeVariant: "tonal",
          sales: "$15.2M", 
          salesNum: 15.2,
          ticket: "$6,400", 
          growth: -5.1, 
          trendText: "Baja Post Ola Calor (-12%)", 
          trendIcon: "mdi-trending-down", 
          trendColor: "#B06000",
          highlight: false,
          prompt: "Diagnóstico de Línea Blanca & Climatización: Tras la ola de calor, ¿qué paquetes de renovación de cocina podemos activar?"
        },
        { 
          name: "Juguetería, Bebés & Niños", 
          icon: "mdi-baby-carriage", 
          iconColor: "#4B5563", 
          barColor: "#64748B",
          badge: "Preventa Activa", 
          badgeColor: "warning", 
          badgeVariant: "tonal",
          sales: "$12.8M", 
          salesNum: 12.8,
          ticket: "$920", 
          growth: 8.6, 
          trendText: "Preventa Fin de Año (+18%)", 
          trendIcon: "mdi-trending-up", 
          trendColor: "#137333",
          highlight: false,
          prompt: "¿Cómo viene la tracción de Juguetería y Bebés (+8.6%) y cómo anticipar inventario para la temporada navideña?"
        },
        { 
          name: "Alimentos Gourmet & Vinos", 
          icon: "mdi-bottle-wine", 
          iconColor: "#4B5563", 
          barColor: "#64748B",
          badge: "Estacional", 
          badgeColor: "#5F6368", 
          badgeVariant: "tonal",
          sales: "$11.4M", 
          salesNum: 11.4,
          ticket: "$1,450", 
          growth: 6.1, 
          trendText: "Fiestas Patrias (+34%)", 
          trendIcon: "mdi-trending-up", 
          trendColor: "#137333",
          highlight: false,
          prompt: "Analiza Alimentos Gourmet y Vinos: ¿Qué impacto tienen las Fiestas Patrias (+34% en Trends) en el ticket promedio?"
        },
        { 
          name: "Farmacia & Nutrición Wellness", 
          icon: "mdi-medical-bag", 
          iconColor: "#4B5563", 
          barColor: "#64748B",
          badge: "Frecuencia Alta", 
          badgeColor: "#5F6368", 
          badgeVariant: "tonal",
          sales: "$9.7M", 
          salesNum: 9.7,
          ticket: "$630", 
          growth: 9.8, 
          trendText: "Suplementos & Colágeno (+22%)", 
          trendIcon: "mdi-trending-up", 
          trendColor: "#137333",
          highlight: false,
          prompt: "Evalúa Farmacia & Wellness (+9.8%): ¿Cómo implementar un modelo de suscripción recurrente en vitaminas y suplementos?"
        },
        { 
          name: "Automotriz & Herramientas", 
          icon: "mdi-car-wrench", 
          iconColor: "#4B5563", 
          barColor: "#FBBC05",
          badge: "Stock Estable", 
          badgeColor: "#5F6368", 
          badgeVariant: "tonal",
          sales: "$8.3M", 
          salesNum: 8.3,
          ticket: "$2,100", 
          growth: -3.8, 
          trendText: "Demanda Estable (-1%)", 
          trendIcon: "mdi-minus", 
          trendColor: "#5F6368",
          highlight: false,
          prompt: "Analiza el desempeño de Automotriz y Ferretería: ¿Qué promociones en baterías y llantas podemos desplegar?"
        },
        { 
          name: "Mascotas & Pet Care", 
          icon: "mdi-paw", 
          iconColor: "#4B5563", 
          barColor: "#34A853",
          badge: "Alta Tracción", 
          badgeColor: "success", 
          badgeVariant: "flat",
          sales: "$7.5M", 
          salesNum: 7.5,
          ticket: "$510", 
          growth: 16.5, 
          trendText: "🔥 Alimentos Premium (+41%)", 
          trendIcon: "mdi-fire", 
          trendColor: "#137333",
          highlight: false,
          prompt: "Revisa Mascotas & Pet Care (+16.5% YoY, +41% en Trends): ¿Cómo crear campañas hiper-personalizadas para dueños de mascotas?"
        },
        { 
          name: "Cómputo & Oficina", 
          icon: "mdi-monitor", 
          iconColor: "#4B5563", 
          barColor: "#FBBC05",
          badge: "Corporativo", 
          badgeColor: "#5F6368", 
          badgeVariant: "tonal",
          sales: "$6.8M", 
          salesNum: 6.8,
          ticket: "$3,900", 
          growth: -2.4, 
          trendText: "Back-to-Office (+5%)", 
          trendIcon: "mdi-trending-up", 
          trendColor: "#137333",
          highlight: false,
          prompt: "Analiza Cómputo & Oficina: ¿Qué oportunidades existen para ventas B2B a PyMEs con paquetes de equipamiento?"
        }
      ],
      userInputRetail: '',
      loadingRetail: false,
      messagesRetail: [
        { 
          role: 'ai', 
          content: `¡Hola! Soy tu Agente de Marketing Retail. Tengo la visión consolidada 360° de las 12 macro-categorías de tu negocio.\n\n📊 **Diagnóstico Ejecutivo:**\n- **Electrónica** ($62.5M, +14.2%) y **Belleza** (+12.4%) lideran las ventas con fuerte tracción y ticket saludable.\n- 🚨 **Alerta en Deportes & Outdoor**: Registra una caída del **-18.4%** en ventas internas con **$12.5M MXN inmovilizados en stock**, a pesar de que el interés en Google Trends por el **Maratón CDMX y carreras** creció un **+92%**.\n\n¿Deseas profundizar en las categorías en riesgo o diseñar una estrategia hiper-personalizada para capturar la demanda del Maratón?` 
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
        this.userInputRetail = `Analiza detalladamente la categoría "${cat.name}" cruzándola con tendencias en Google Trends, ticket promedio y capital inmovilizado.`;
      }
      if (cat.name && (cat.name.includes('Deporte') || cat.name.includes('Running'))) {
        this.setRetailTab('deepdive');
      }
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-retail ~ * input') || document.querySelector('input[placeholder*="agente de marketing"]');
        if (inputEl) inputEl.focus();
      });
    },
    askRetailPrompt(promptText) {
      this.userInputRetail = promptText;
      if (promptText.toLowerCase().includes('maratón') || promptText.toLowerCase().includes('running')) {
        this.setRetailTab('deepdive');
      }
      this.$nextTick(() => {
        const inputEl = document.querySelector('#chat-box-retail ~ * input') || document.querySelector('input[placeholder*="agente de marketing"]');
        if (inputEl) inputEl.focus();
      });
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
        const colors = categories.map(c => (c && c.barColor) ? c.barColor : '#64748B');

        try {
          this.retailCategoryChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Ventas Netas ($M MXN)',
                data: salesData,
                backgroundColor: colors,
                borderRadius: 6,
                borderWidth: 0,
                barThickness: 22
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const cat = categories[context.dataIndex];
                      if (!cat) return '';
                      return ` Ventas: ${cat.sales || ''} | Ticket: ${cat.ticket || ''} | YoY: ${(cat.growth || 0) > 0 ? '+' : ''}${cat.growth || 0}%`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: '$M MXN', font: { size: 10 } },
                  grid: { color: '#f0f0f0' },
                  ticks: { font: { size: 10 } }
                },
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 10 } }
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
        this.retailChartInstance.destroy();
      }

      const ctx = canvas.getContext('2d');
      this.retailChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Semana -3', 'Semana -2', 'Semana Pasada', 'Semana Actual'],
          datasets: [
            {
              label: 'Ventas Cat. Deportes (unds)',
              data: [350, 280, 180, 120],
              borderColor: '#EA4335',
              backgroundColor: 'rgba(234, 67, 53, 0.08)',
              borderWidth: 3,
              yAxisID: 'y',
              fill: true,
              tension: 0.35,
              pointRadius: 4
            },
            {
              label: 'Google Trends "Maratón CDMX"',
              data: [20, 35, 60, 92],
              borderColor: '#202124',
              backgroundColor: 'rgba(32, 33, 36, 0.0)',
              borderWidth: 2.5,
              borderDash: [5, 5],
              yAxisID: 'y1',
              fill: false,
              tension: 0.35,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: { display: true, text: 'Ventas (unidades)', font: { size: 10 } },
              ticks: { font: { size: 10 } }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: { display: true, text: 'Índice Trends (0-100)', font: { size: 10 } },
              grid: { drawOnChartArea: false },
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
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
        if (lowerReply.includes('deseas que') || lowerReply.includes('campaña') || lowerReply.includes('activar') || lowerReply.includes('ads')) {
          this.showCampaignAction = true;
        }
        if (text.toLowerCase().includes('maratón') || text.toLowerCase().includes('deporte') || lowerReply.includes('maratón')) {
          this.setRetailTab('deepdive');
        }
      } catch (error) {
        console.error('Error en Agente de Marketing Retail:', error);
        const errDetail = error.response?.data?.detail || error.message || 'Error de conexión con Gemini.';
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
      return marked.parse(text);
    }
  }
};
