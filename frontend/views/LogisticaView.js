// LogisticaView.js - Vista de Logística Terrestre Nacional (Torre de Control & Copiloto Inteligente)

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
                  <div class="text-subtitle-2 font-weight-bold" style="color: #202124;">Torre de Control: 3 Corredores Nacionales</div>
                  <div class="text-caption text-grey-darken-1" style="font-size: 11px;">Monitoreo Dinámico de Flota, Detección de Proximidad y CEDIS</div>
                </div>
              </div>
              <div class="d-flex align-center flex-wrap" style="gap: 6px;">
                <v-chip color="#4285F4" size="small" variant="flat" class="font-weight-bold text-white">
                  <v-icon start size="14">mdi-truck-fast</v-icon> {{ fleetCount }} Unidades en Flota
                </v-chip>
                <v-chip :color="affectedVehiclesCount > 0 ? 'error' : 'success'" size="small" variant="flat" class="font-weight-bold">
                  <v-icon start size="14">{{ affectedVehiclesCount > 0 ? 'mdi-truck-alert' : 'mdi-shield-check' }}</v-icon>
                  <span v-if="roadblockCleared">0 en Riesgo • Vía 57D Normalizada</span>
                  <span v-else-if="rerouteApproved">0 en Riesgo • Desvío 45D Activo</span>
                  <span v-else>{{ affectedVehiclesCount }} en Riesgo</span>
                </v-chip>
                <v-chip color="#34A853" size="small" variant="flat" class="font-weight-bold text-white">
                  <v-icon start size="14">mdi-warehouse</v-icon> 4 CEDIS Activos
                </v-chip>
              </div>
            </v-card-title>

            <!-- Barra de Filtros y Acciones Rápidas del Mapa -->
            <div class="px-3 py-1 bg-grey-lighten-4 border-b d-flex align-center justify-space-between flex-wrap flex-shrink-0" style="border-bottom: 1px solid #f0f0f0; gap: 6px; font-size: 11.5px;">
              <div class="d-flex align-center flex-wrap" style="gap: 4px;">
                <span class="text-caption font-weight-bold text-grey-darken-2 mr-1">Filtrar Mapa:</span>
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
                  :color="activeFilter === 'disrupted' ? '#EA4335' : (affectedVehiclesCount > 0 ? '#EA4335' : '#5f6368')"
                  class="text-capitalize"
                  :class="activeFilter === 'disrupted' ? 'text-white' : ''"
                  @click="setFilter('disrupted')"
                >
                  <v-icon start size="12">{{ affectedVehiclesCount > 0 ? 'mdi-alert-circle' : 'mdi-shield-check' }}</v-icon>
                  {{ affectedVehiclesCount > 0 ? ('En Riesgo (' + affectedVehiclesCount + ')') : (roadblockCleared ? 'Vía Normalizada (0)' : (rerouteApproved ? 'Flota Reenrutada (0)' : 'En Riesgo (0)')) }}
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
                  🚚 Flota
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
                  📦 CEDIS
                </v-btn>
              </div>

              <div class="d-flex align-center" style="gap: 6px;">
                <span class="text-caption text-grey-darken-1 mr-1" style="font-size: 10.5px;">
                  <v-icon size="12" color="#34A853">mdi-circle</v-icon> En Vivo ({{ fleetCount }} Uds en Ruta<span v-if="completedDeliveriesCount > 0"> • {{ completedDeliveriesCount }} Concluidas</span>)
                </span>
                <v-btn size="x-small" variant="text" color="#5f6368" @click="resetMapView">
                  <v-icon start size="14">mdi-crosshairs-gps</v-icon> Vista General
                </v-btn>
              </div>
            </div>

            <!-- Contenedor del Mapa con posición absoluta protegida -->
            <v-card-text class="flex-grow-1 pa-0 position-relative" style="min-height: 0; height: 100%; overflow: hidden;">
              
              <!-- Badge Flotante Superior de Ruta Seleccionada -->
              <div v-if="selectedRoute" class="position-absolute" style="top: 12px; left: 12px; z-index: 999; max-width: 90%;">
                <v-chip color="white" elevation="3" size="small" closable @click:close="clearActiveSelection" class="font-weight-bold" style="color: #202124; border: 1px solid #dadce0;">
                  <v-icon start size="14" :color="rerouteApproved && selectedRoute.id === 'RUTA-CDMX-MTY' ? '#34A853' : selectedRoute.color">
                    {{ rerouteApproved && selectedRoute.id === 'RUTA-CDMX-MTY' ? 'mdi-check-decagram' : 'mdi-road-variant' }}
                  </v-icon>
                  {{ selectedRoute.nombre }} {{ rerouteApproved && selectedRoute.id === 'RUTA-CDMX-MTY' ? '• Desvío 45D Aprobado' : '(Enfoque Exclusivo)' }}
                </v-chip>
              </div>

              <!-- Banner / Notificación de Re-enrutamiento Aplicado -->
              <v-fade-transition>
                <div v-if="rerouteSuccessMessage" class="position-absolute" style="top: 12px; right: 12px; z-index: 1000; max-width: 80%;">
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

              <!-- ======================================================== -->
              <!-- CASO A: CONTENEDOR INFERIOR PARA TRANSPORTE SELECCIONADO  -->
              <!-- ======================================================== -->
              <v-slide-y-reverse-transition>
                <div
                  v-if="selectedEntity === 'vehicle' && selectedVehicle"
                  class="position-absolute px-3 pb-3"
                  style="bottom: 0px; left: 0px; right: 0px; z-index: 999; pointer-events: none;"
                >
                  <v-card
                    elevation="8"
                    class="rounded-xl pa-3 bg-white"
                    :style="'border: 2px solid ' + (selectedVehicle.estado_operativo === 'Afectado' ? '#EA4335' : (selectedVehicle.estado_operativo === 'Entregado' ? '#0F9D58' : (selectedVehicle.estado_operativo === 'Reenrutado' ? '#34A853' : '#4285F4'))) + '; pointer-events: auto; box-shadow: 0 8px 28px rgba(0,0,0,0.2) !important; max-height: 310px; overflow-y: auto;'"
                  >
                    <!-- Header de la Unidad -->
                    <div class="d-flex align-center justify-space-between mb-2 pb-1 border-b">
                      <div class="d-flex align-center">
                        <v-avatar :color="selectedVehicle.estado_operativo === 'Afectado' ? '#fce8e6' : (selectedVehicle.estado_operativo === 'Entregado' ? '#e6f4ea' : (selectedVehicle.estado_operativo === 'Reenrutado' ? '#e6f4ea' : '#e8f0fe'))" size="34" class="mr-2">
                          <v-icon :color="selectedVehicle.estado_operativo === 'Afectado' ? '#EA4335' : (selectedVehicle.estado_operativo === 'Entregado' ? '#0F9D58' : (selectedVehicle.estado_operativo === 'Reenrutado' ? '#34A853' : '#4285F4'))" size="20">
                            {{ selectedVehicle.icono || (selectedVehicle.estado_operativo === 'Afectado' ? 'mdi-truck-alert' : (selectedVehicle.estado_operativo === 'Entregado' ? 'mdi-check-circle' : (selectedVehicle.estado_operativo === 'Reenrutado' ? 'mdi-truck-check' : 'mdi-truck-fast'))) }}
                          </v-icon>
                        </v-avatar>
                        <div>
                          <div class="d-flex align-center flex-wrap" style="gap: 6px;">
                            <span class="text-subtitle-2 font-weight-bold" style="color: #202124;">
                              {{ selectedVehicle.nombre }}
                            </span>
                            <v-chip
                              size="x-small"
                              :color="selectedVehicle.estado_operativo === 'Afectado' ? 'error' : (selectedVehicle.estado_operativo === 'Descargando' ? 'primary' : (selectedVehicle.estado_operativo === 'Completado' ? 'teal' : (selectedVehicle.estado_operativo === 'Reenrutado' ? 'success' : 'primary')))"
                              variant="flat"
                              class="font-weight-bold text-uppercase"
                            >
                              {{ selectedVehicle.estado_operativo === 'Afectado' ? '🚨 En Riesgo / Bloqueo' : (selectedVehicle.estado_operativo === 'Descargando' ? '🚛 En Andén de Descarga' : (selectedVehicle.estado_operativo === 'Completado' ? '✅ Viaje Concluido' : (selectedVehicle.estado_operativo === 'Reenrutado' ? '✅ Re-enrutado' : 'En Tránsito OK'))) }}
                            </v-chip>
                          </div>
                          <div class="text-caption text-grey-darken-1" style="font-size: 11px;">
                            <b>ID:</b> {{ selectedVehicle.id }} &nbsp;|&nbsp; <b>Conductor:</b> {{ selectedVehicle.conductor }}
                          </div>
                        </div>
                      </div>
                      <v-btn icon size="x-small" variant="text" @click="clearActiveSelection">
                        <v-icon size="16">mdi-close</v-icon>
                      </v-btn>
                    </div>

                    <!-- Ficha Resumen: Origen (A) / Destino (B), Tiempos y Carga -->
                    <v-row dense class="my-1">
                      <!-- Bloque Origen / Destino / Tiempos -->
                      <v-col cols="12" sm="6">
                        <div class="pa-2 rounded-lg bg-grey-lighten-4 fill-height" style="font-size: 11.5px; line-height: 1.5;">
                          <div class="d-flex align-center mb-1">
                            <span class="d-inline-flex align-center justify-center mr-1 text-white font-weight-bold" style="background: #1a73e8; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; line-height: 1;">A</span>
                            <b>Origen:</b>&nbsp;<span class="text-truncate">{{ selectedVehicle.origen }}</span>
                          </div>
                          <div class="d-flex align-center mb-1">
                            <span class="d-inline-flex align-center justify-center mr-1 text-white font-weight-bold" style="background: #d93025; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; line-height: 1;">B</span>
                            <b>Destino:</b>&nbsp;<span class="text-truncate">{{ selectedVehicle.destino }}</span>
                          </div>
                          <div class="text-caption text-grey-darken-2 mt-1" style="font-size: 10.5px;">
                            <b>Salida:</b> {{ selectedVehicle.fecha_hora_salida }}<br>
                            <b>ETA Estimado:</b> {{ selectedVehicle.eta_llegada }}
                          </div>
                        </div>
                      </v-col>

                      <!-- Bloque Carga / Cliente / Telemetría -->
                      <v-col cols="12" sm="6">
                        <div class="pa-2 rounded-lg bg-grey-lighten-4 fill-height" style="font-size: 11.5px; line-height: 1.5;">
                          <div><b>Carga:</b> {{ selectedVehicle.carga }} ({{ selectedVehicle.peso_ton }} Tons)</div>
                          <div><b>Cliente:</b> {{ selectedVehicle.cliente }}</div>
                          <div class="text-caption text-grey-darken-2 mt-1" style="font-size: 10.5px;">
                            <b>Estatus:</b> {{ selectedVehicle.estado_transito }}<br>
                            <b>Velocidad:</b> {{ selectedVehicle.velocidad_kmh }} km/h &nbsp;|&nbsp; <b>Progreso:</b> {{ selectedVehicle.progreso_pct }}%
                          </div>
                        </div>
                      </v-col>
                    </v-row>

                    <!-- SECCIÓN SI LA UNIDAD ESTÁ EN ANDÉN O CONCLUIDA -->
                    <div v-if="selectedVehicle.estado_operativo === 'Descargando' || selectedVehicle.estado_operativo === 'Entregado'" class="mt-2 pt-2 border-t">
                      <div class="pa-2 rounded-lg bg-blue-lighten-5 text-blue-darken-4 font-weight-bold text-caption d-flex align-center justify-space-between flex-wrap" style="gap: 8px;">
                        <div class="d-flex align-center">
                          <v-icon start size="18" color="#1a73e8">mdi-dolly</v-icon>
                          <span>En andén de descarga de {{ selectedVehicle.destino }}. Desconsolidando {{ selectedVehicle.carga }}...</span>
                        </div>
                        <div class="d-flex align-center" style="gap: 6px;">
                          <v-progress-linear :model-value="((selectedVehicle.dockTicks || 1) / 4) * 100" color="#1a73e8" height="8" rounded style="width: 80px;"></v-progress-linear>
                          <span style="font-size: 11px;">{{ Math.min(100, Math.round(((selectedVehicle.dockTicks || 1) / 4) * 100)) }}%</span>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="selectedVehicle.estado_operativo === 'Completado'" class="mt-2 pt-2 border-t">
                      <div class="pa-2 rounded-lg bg-teal-lighten-5 text-teal-darken-4 font-weight-bold text-caption text-center">
                        <v-icon start size="18" color="#0F9D58">mdi-check-all</v-icon>
                        Viaje concluido y descarga finalizada exitosamente sin penalizaciones. Unidad liberada para el próximo ciclo.
                      </div>
                    </div>

                    <!-- SECCIÓN DE ACCIONES DE RE-ENRUTAMIENTO (Si está afectado o se seleccionó ruta alterna) -->
                    <div v-else-if="selectedVehicle.estado_operativo === 'Afectado' || activeConsideration || (selectedVehicle.ruta_id === 'RUTA-CDMX-MTY' && !rerouteApproved)" class="mt-2 pt-2 border-t">
                      <div class="d-flex align-center justify-space-between mb-1">
                        <div class="text-caption font-weight-bold" style="color: #137333;">
                          <v-icon size="14" color="#34A853" class="mr-1">mdi-routes</v-icon>
                          PLAN DE RE-ENRUTAMIENTO VIAL ALTERNATIVO (AUTOPISTA 45D)
                        </div>
                        <span v-if="selectedVehicle.penalizacion_usd > 0" class="text-caption font-weight-bold" style="color: #c5221f;">
                          Penalización en Riesgo: \${{ selectedVehicle.penalizacion_usd.toLocaleString() }} USD
                        </span>
                      </div>

                      <v-row dense class="my-1">
                        <v-col cols="6" sm="3">
                          <div class="pa-1 rounded-lg bg-grey-lighten-4 text-center">
                            <div class="text-caption text-grey-darken-1" style="font-size: 10px;">Delta Tiempo</div>
                            <div class="font-weight-bold text-caption" style="color: #1967d2;">+1.5 hrs tránsito</div>
                          </div>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="pa-1 rounded-lg bg-grey-lighten-4 text-center">
                            <div class="text-caption text-grey-darken-1" style="font-size: 10px;">Costo Extra</div>
                            <div class="font-weight-bold text-caption" style="color: #c5221f;">+$120 USD (Diésel/Peaje)</div>
                          </div>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="pa-1 rounded-lg bg-green-lighten-5 text-center">
                            <div class="text-caption text-green-darken-3" style="font-size: 10px;">Ahorro Penalización</div>
                            <div class="font-weight-bold text-caption text-green-darken-3">$42,000 USD</div>
                          </div>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <div class="pa-1 rounded-lg bg-blue-lighten-5 text-center">
                            <div class="text-caption text-blue-darken-3" style="font-size: 10px;">Ahorro Neto</div>
                            <div class="font-weight-bold text-caption text-blue-darken-3">$41,880 USD</div>
                          </div>
                        </v-col>
                      </v-row>

                      <div class="d-flex align-center justify-space-between mt-2 pt-1 border-t" style="gap: 8px;">
                        <div class="text-caption text-grey-darken-2" style="font-size: 11px;">
                          <v-icon size="14" :color="roadblockCleared ? '#34A853' : (rerouteApproved ? '#137333' : '#34A853')" class="mr-1">
                            {{ roadblockCleared ? 'mdi-check-all' : (rerouteApproved ? 'mdi-lock-open-variant' : 'mdi-shield-check') }}
                          </v-icon>
                          <span v-if="roadblockCleared">
                            <b>Vía 57D Restablecida:</b> Nuevos transportes fluyen con normalidad por la ruta original.
                          </span>
                          <span v-else-if="rerouteApproved">
                            <b>Paso 2 (Desbloqueado):</b> Flota en desvío seguro. Puedes dar por finalizada la alerta al reabrir la vía 57D.
                          </span>
                          <span v-else>
                            <b>Estrategia de Desvío:</b> Desvío anticipado para unidades en Querétaro y enlace San Felipe para unidades en bloqueo.
                          </span>
                        </div>
                        <div class="d-flex align-center" style="gap: 6px;">
                          <v-btn
                            v-if="!rerouteApproved"
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
                          <template v-else>
                            <v-btn
                              v-if="!roadblockCleared"
                              size="small"
                              color="#137333"
                              variant="flat"
                              class="text-white text-capitalize font-weight-bold"
                              @click="markAlertFinished()"
                            >
                              <v-icon start size="16">mdi-road-variant</v-icon>
                              Marcar Alerta como Finalizada (Reabrir Ruta 57D)
                            </v-btn>
                            <template v-else>
                              <v-chip color="success" size="small" variant="flat" class="font-weight-bold">
                                <v-icon start size="14">mdi-check-circle</v-icon> Vía Despejada • Ruta 57D Activa
                              </v-chip>
                              <v-btn
                                size="small"
                                color="#EA4335"
                                variant="flat"
                                class="text-white text-capitalize font-weight-bold"
                                @click="reactivateAlert()"
                              >
                                <v-icon start size="16">mdi-alert-octagon</v-icon>
                                Reactivar Alerta
                              </v-btn>
                            </template>
                          </template>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </div>
              </v-slide-y-reverse-transition>

              <!-- ======================================================== -->
              <!-- CASO B: CONTENEDOR INFERIOR PARA CEDIS SELECCIONADO      -->
              <!-- ======================================================== -->
              <v-slide-y-reverse-transition>
                <div
                  v-if="selectedEntity === 'warehouse' && selectedWarehouse"
                  class="position-absolute px-3 pb-3"
                  style="bottom: 0px; left: 0px; right: 0px; z-index: 999; pointer-events: none;"
                >
                  <v-card
                    elevation="8"
                    class="rounded-xl pa-3 bg-white"
                    style="border: 2px solid #1a73e8; pointer-events: auto; box-shadow: 0 8px 28px rgba(0,0,0,0.2) !important; max-height: 310px; overflow-y: auto;"
                  >
                    <!-- Header CEDIS -->
                    <div class="d-flex align-center justify-space-between mb-2 pb-1 border-b">
                      <div class="d-flex align-center">
                        <v-avatar color="#e8f0fe" size="34" class="mr-2">
                          <v-icon color="#1a73e8" size="20">mdi-warehouse</v-icon>
                        </v-avatar>
                        <div>
                          <div class="d-flex align-center flex-wrap" style="gap: 6px;">
                            <span class="text-subtitle-2 font-weight-bold" style="color: #202124;">
                              {{ selectedWarehouse.nombre }}
                            </span>
                            <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
                              CEDIS ESTRATÉGICO
                            </v-chip>
                            <v-chip v-if="selectedWarehouse.inventario_plan_b" size="x-small" color="success" variant="flat" class="font-weight-bold">
                              Plan B: {{ selectedWarehouse.unidades_disponibles_plan_b }} Uds Disponibles
                            </v-chip>
                          </div>
                          <div class="text-caption text-grey-darken-1" style="font-size: 11px;">
                            <b>ID:</b> {{ selectedWarehouse.id }} &nbsp;|&nbsp; <b>Ubicación:</b> {{ selectedWarehouse.ubicacion }} &nbsp;|&nbsp; <b>Superficie:</b> {{ selectedWarehouse.capacidad_m2.toLocaleString() }} m²
                          </div>
                        </div>
                      </div>
                      <v-btn icon size="x-small" variant="text" @click="clearActiveSelection">
                        <v-icon size="16">mdi-close</v-icon>
                      </v-btn>
                    </div>

                    <!-- Ficha de Corredor Conectado y Alertas -->
                    <v-row dense class="my-1">
                      <!-- Corredor Conectado -->
                      <v-col cols="12" sm="6">
                        <div class="pa-2 rounded-lg bg-grey-lighten-4 fill-height" style="font-size: 11.5px; line-height: 1.5;">
                          <div class="d-flex align-center justify-space-between mb-1">
                            <b>Corredor Conectado:</b>
                            <v-chip size="x-small" :color="connectedRoute?.estado === 'Disrumpida' ? 'error' : 'success'" variant="flat" class="font-weight-bold">
                              {{ connectedRoute?.estado === 'Disrumpida' ? '🚨 Disrumpida' : '✅ Operativa' }}
                            </v-chip>
                          </div>
                          <div class="font-weight-bold" style="color: #1a73e8;">{{ connectedRoute?.nombre || 'Ruta Troncal Nacional' }}</div>
                          <div class="text-caption text-grey-darken-2 mt-1" style="font-size: 10.5px;">
                            <b>Distancia:</b> {{ connectedRoute?.distancia_km }} km &nbsp;|&nbsp; <b>Tiempo Base:</b> {{ connectedRoute?.tiempo_base_hrs }} hrs<br>
                            <b>Origen ➔ Destino:</b> {{ connectedRoute?.origen_nombre }} ➔ {{ connectedRoute?.destino_nombre }}
                          </div>
                        </div>
                      </v-col>

                      <!-- Alertas y Estado de Inventario -->
                      <v-col cols="12" sm="6">
                        <div v-if="connectedRouteAlert" class="pa-2 rounded-lg bg-red-lighten-5 fill-height" style="font-size: 11.5px; line-height: 1.5; border: 1px solid #f28b82;">
                          <div class="d-flex align-center text-red-darken-4 font-weight-bold mb-1">
                            <v-icon size="16" color="#EA4335" class="mr-1">mdi-alert-octagon</v-icon>
                            Alerta Activa en el Corredor
                          </div>
                          <div class="text-caption text-grey-darken-3" style="font-size: 11px;">
                            <b>{{ connectedRouteAlert.tipo_incidencia }}:</b> {{ connectedRouteAlert.segmento }}<br>
                            <b>Retraso:</b> +{{ connectedRouteAlert.retraso_estimado_hrs }} hrs &nbsp;|&nbsp; <b>Riesgo Contractual:</b> \${{ connectedRouteAlert.impacto_financiero_usd.toLocaleString() }} USD
                          </div>
                        </div>
                        <div v-else class="pa-2 rounded-lg bg-green-lighten-5 fill-height" style="font-size: 11.5px; line-height: 1.5; border: 1px solid #ceead6;">
                          <div class="d-flex align-center text-green-darken-4 font-weight-bold mb-1">
                            <v-icon size="16" color="#34A853" class="mr-1">mdi-shield-check</v-icon>
                            Corredor en Condiciones Normales
                          </div>
                          <div class="text-caption text-grey-darken-3" style="font-size: 11px;">
                            <b>Inventario en Almacén:</b> {{ selectedWarehouse.stock_descripcion }}<br>
                            Tránsito fluido sin incidencias viales reportadas.
                          </div>
                        </div>
                      </v-col>
                    </v-row>

                    <!-- Unidades en Andén de Descarga -->
                    <div v-if="offloadingVehicles.length > 0" class="mt-2 pa-2 rounded-lg bg-blue-lighten-5" style="border: 1px solid #c2e7ff;">
                      <div class="d-flex align-center justify-space-between mb-1">
                        <span class="text-caption font-weight-bold text-blue-darken-4">
                          <v-icon size="15" color="#1a73e8" class="mr-1">mdi-dolly</v-icon>
                          Unidades en Andén de Descarga ({{ offloadingVehicles.length }}):
                        </span>
                        <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
                          Descargando Carga
                        </v-chip>
                      </div>
                      <div class="d-flex flex-column" style="gap: 5px;">
                        <div
                          v-for="uv in offloadingVehicles"
                          :key="uv.id"
                          class="d-flex align-center justify-space-between bg-white px-2 py-1 rounded border cursor-pointer"
                          @click="selectVehicle(uv)"
                        >
                          <div class="d-flex align-center" style="gap: 6px;">
                            <v-icon size="15" color="#1a73e8">mdi-truck-check</v-icon>
                            <span class="font-weight-bold text-caption text-blue-darken-3">{{ uv.id }}</span>
                            <span class="text-caption text-grey-darken-2" style="font-size: 11px;">{{ uv.carga }} ({{ uv.peso_ton }} T)</span>
                          </div>
                          <div class="d-flex align-center" style="gap: 6px;">
                            <v-progress-linear
                              :model-value="((uv.dockTicks || 1) / 4) * 100"
                              color="#1a73e8"
                              height="7"
                              rounded
                              style="width: 70px;"
                            ></v-progress-linear>
                            <span class="text-caption text-grey-darken-2" style="font-size: 10px; font-weight: bold;">
                              {{ Math.min(100, Math.round(((uv.dockTicks || 1) / 4) * 100)) }}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Flota Activa en este Corredor -->
                    <div class="mt-2 pt-2 border-t d-flex align-center justify-space-between flex-wrap" style="gap: 8px;">
                      <div class="d-flex align-center flex-wrap" style="gap: 6px;">
                        <span class="text-caption font-weight-bold text-grey-darken-2 mr-1">
                          Flota en este Corredor ({{ corridorVehicles.length }} / {{ connectedRoute?.max_unidades || 18 }} máx):
                        </span>
                        <v-chip
                          v-for="v in corridorVehicles"
                          :key="v.id + '-' + simulationTick"
                          size="x-small"
                          :color="v.estado_operativo === 'Afectado' ? 'error' : (v.estado_operativo === 'Descargando' ? 'primary' : (v.estado_operativo === 'Reenrutado' ? 'success' : 'primary'))"
                          variant="tonal"
                          class="font-weight-bold cursor-pointer"
                          @click="selectVehicle(v)"
                        >
                          <v-icon start size="12">
                            {{ v.estado_operativo === 'Descargando' ? 'mdi-dolly' : (v.estado_operativo === 'Afectado' ? 'mdi-alert' : (v.estado_operativo === 'Reenrutado' ? 'mdi-check-decagram' : 'mdi-truck-fast')) }}
                          </v-icon>
                          {{ v.id }}: {{ v.estado_operativo === 'Descargando' ? 'En Descarga' : v.progreso_pct + '%' }} ({{ v.velocidad_kmh }} km/h)
                        </v-chip>
                      </div>
                      <v-btn size="small" variant="text" color="primary" class="text-capitalize font-weight-bold" @click="askLogisticaPrompt('Analiza el estatus de despacho e inventario Plan B en ' + selectedWarehouse.nombre)">
                        <v-icon start size="16">mdi-chat-processing-outline</v-icon>
                        Consultar Agente de Logistica
                      </v-btn>
                    </div>
                  </v-card>
                </div>
              </v-slide-y-reverse-transition>

              <!-- ======================================================== -->
              <!-- CASO C: CONTENEDOR INFERIOR PARA ALERTA / INCIDENCIA     -->
              <!-- ======================================================== -->
              <v-slide-y-reverse-transition>
                <div
                  v-if="selectedEntity === 'alert' && selectedAlert"
                  class="position-absolute px-3 pb-3"
                  style="bottom: 0px; left: 0px; right: 0px; z-index: 999; pointer-events: none;"
                >
                  <v-card
                    elevation="8"
                    class="rounded-xl pa-3 bg-white"
                    :style="{ border: (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? '2px solid #34A853' : '2px solid #EA4335', pointerEvents: 'auto', boxShadow: '0 8px 28px rgba(0,0,0,0.2) !important', maxHeight: '310px', overflowY: 'auto' }"
                  >
                    <!-- Header Alerta -->
                    <div class="d-flex align-center justify-space-between mb-2 pb-1 border-b">
                      <div class="d-flex align-center">
                        <v-avatar :color="(selectedAlert.estado === 'Resuelta' || roadblockCleared) ? '#e6f4ea' : (rerouteApproved ? '#e8f0fe' : '#fce8e6')" size="34" class="mr-2">
                          <v-icon :color="(selectedAlert.estado === 'Resuelta' || roadblockCleared) ? '#137333' : (rerouteApproved ? '#1967d2' : '#d93025')" size="20">
                            {{ (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? 'mdi-check-circle' : (rerouteApproved ? 'mdi-shield-check' : 'mdi-alert-octagon') }}
                          </v-icon>
                        </v-avatar>
                        <div>
                          <div class="d-flex align-center flex-wrap" style="gap: 6px;">
                            <span class="text-subtitle-2 font-weight-bold" style="color: #202124;">
                              {{ (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? 'Incidencia Resuelta - Vía Despejada' : (rerouteApproved ? 'Desvío Operativo por Autopista 45D' : selectedAlert.tipo_incidencia) }}
                            </span>
                            <v-chip
                              size="x-small"
                              :color="(selectedAlert.estado === 'Resuelta' || roadblockCleared) ? 'success' : (rerouteApproved ? 'primary' : 'error')"
                              variant="flat"
                              class="font-weight-bold"
                            >
                              {{ (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? '✅ VÍA DESPEJADA' : (rerouteApproved ? '🛡️ DESVÍO 45D OPERATIVO' : '🚨 BLOQUEO ACTIVO') }}
                            </v-chip>
                          </div>
                          <div class="text-caption text-grey-darken-1" style="font-size: 11px;">
                            <b>ID:</b> {{ selectedAlert.id }} &nbsp;|&nbsp; <b>Ruta:</b> {{ selectedAlert.ruta_nombre }} &nbsp;|&nbsp; <b>Tramo:</b> {{ selectedAlert.segmento }}
                          </div>
                        </div>
                      </div>
                      <v-btn icon size="x-small" variant="text" @click="clearActiveSelection">
                        <v-icon size="16">mdi-close</v-icon>
                      </v-btn>
                    </div>

                    <!-- Ficha Resumen de Incidencia / Estado de Vía -->
                    <v-row dense class="my-1">
                      <v-col cols="12" sm="6">
                        <div class="pa-2 rounded-lg bg-grey-lighten-4 fill-height" style="font-size: 11.5px; line-height: 1.5;">
                          <div class="d-flex align-center mb-1">
                            <v-icon size="16" color="#1a73e8" class="mr-1">mdi-map-marker-path</v-icon>
                            <b>Segmento Carretero:</b>&nbsp;<span>{{ selectedAlert.segmento }}</span>
                          </div>
                          <div class="text-caption text-grey-darken-2" style="font-size: 11px;">
                            {{ (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? 'Vía completamente liberada por Guardia Nacional y SICT. Tránsito regular restablecido en ambos sentidos en el Km 182.' : (rerouteApproved ? 'Congestión en Km 182 siendo evitada. Las unidades fluyen con seguridad por el corredor alterno Autopista 45D.' : selectedAlert.descripcion) }}
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <div class="pa-2 rounded-lg fill-height" :class="(selectedAlert.estado === 'Resuelta' || roadblockCleared) ? 'bg-green-lighten-5' : (rerouteApproved ? 'bg-blue-lighten-5' : 'bg-red-lighten-5')" style="font-size: 11.5px; line-height: 1.5;">
                          <div class="d-flex align-center justify-space-between mb-1">
                            <span class="font-weight-bold" :style="{ color: (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? '#137333' : (rerouteApproved ? '#1967d2' : '#c5221f') }">
                              {{ (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? 'Condiciones Viales Normalizadas' : (rerouteApproved ? 'Desvío 45D Activo y Seguro' : 'Impacto Operativo en Riesgo') }}
                            </span>
                            <span v-if="!rerouteApproved && !roadblockCleared && selectedAlert.estado !== 'Resuelta'" class="font-weight-bold" style="color: #c5221f;">
                              $ {{ selectedAlert.impacto_financiero_usd ? selectedAlert.impacto_financiero_usd.toLocaleString() : '54,000' }} USD
                            </span>
                            <span v-else-if="rerouteApproved && !roadblockCleared" class="font-weight-bold text-primary">
                              $0 USD (Penalizaciones Evitadas)
                            </span>
                            <span v-else class="font-weight-bold text-success">
                              $0 USD (Sin Demoras)
                            </span>
                          </div>
                          <div class="text-caption text-grey-darken-2" style="font-size: 11px;">
                            <b>Retraso Estimado:</b> {{ (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? '0 hrs (Tránsito libre)' : (rerouteApproved ? '+1.8 hrs (Desvío seguro)' : '+' + selectedAlert.retraso_estimado_hrs + ' hrs') }}<br>
                            <b>Estatus de Tránsito:</b> {{ (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? 'Nuevos transportes fluyen directamente por Carretera 57D' : (rerouteApproved ? 'Flota circulando por Autopista 45D; Km 182 aún restringido' : 'Paso bloqueado en Km 182; aprueba la ruta alterna 45D para desahogar') }}
                          </div>
                        </div>
                      </v-col>
                    </v-row>

                    <!-- Barra de Acciones: Control de Demo en 2 Fases (Paso 1: Aprobar Desvío -> Paso 2: Marcar como Finalizada) -->
                    <div class="d-flex align-center justify-space-between mt-2 pt-2 border-t flex-wrap" style="gap: 8px;">
                      <div class="text-caption text-grey-darken-2" style="font-size: 11px;">
                        <v-icon size="14" :color="(selectedAlert.estado === 'Resuelta' || roadblockCleared) ? '#34A853' : (rerouteApproved ? '#137333' : '#d93025')" class="mr-1">
                          {{ (selectedAlert.estado === 'Resuelta' || roadblockCleared) ? 'mdi-check-all' : (rerouteApproved ? 'mdi-lock-open-variant' : 'mdi-alert-circle-outline') }}
                        </v-icon>
                        <span v-if="selectedAlert.estado === 'Resuelta' || roadblockCleared">
                          <b>Paso 3 (Ciclo Demo):</b> Vía liberada y flujo regular restaurado. Puedes reactivar la alerta en cualquier momento para reiniciar la simulación del bloqueo sin recargar la página.
                        </span>
                        <span v-else-if="rerouteApproved">
                          <b>Paso 2 (Desbloqueado para Demo):</b> Con la ruta despejada y la flota en desvío por 45D, puedes marcar la alerta como finalizada cuando la Guardia Nacional libere la vía.
                        </span>
                        <span v-else>
                          <b>Paso 1 (Requerido):</b> La vía 57D está bloqueada. Aprueba primero la ruta alterna por Autopista 45D para desahogar las unidades y desbloquear la reapertura.
                        </span>
                      </div>

                      <div class="d-flex align-center" style="gap: 8px;">
                        <!-- FASE 1: Antes de aceptar la nueva ruta, mostrar botón para Aprobar Desvío -->
                        <v-btn
                          v-if="!rerouteApproved"
                          size="small"
                          color="#34A853"
                          variant="flat"
                          class="text-white text-capitalize font-weight-bold"
                          @click="applyReroute(activeConsideration)"
                          :loading="reroutingAnimation"
                        >
                          <v-icon start size="16">mdi-check-decagram</v-icon>
                          Aprobar Desvío por Autopista 45D
                        </v-btn>

                        <!-- FASE 2: Una vez aceptada la ruta y despejado el camino, se DESBLOQUEA la finalización de la alerta -->
                        <template v-else>
                          <v-btn
                            v-if="!roadblockCleared && selectedAlert.estado !== 'Resuelta'"
                            size="small"
                            color="#137333"
                            variant="flat"
                            class="text-white text-capitalize font-weight-bold"
                            @click="markAlertFinished(selectedAlert)"
                          >
                            <v-icon start size="16">mdi-road-variant</v-icon>
                            Marcar Alerta como Finalizada (Reabrir Ruta 57D)
                          </v-btn>
                          <template v-else>
                            <v-chip color="success" size="small" variant="flat" class="font-weight-bold">
                              <v-icon start size="14">mdi-check-circle</v-icon> Alerta Finalizada • Ruta 57D Reabierta
                            </v-chip>
                            <v-btn
                              size="small"
                              color="#EA4335"
                              variant="flat"
                              class="text-white text-capitalize font-weight-bold"
                              @click="reactivateAlert(selectedAlert)"
                            >
                              <v-icon start size="16">mdi-alert-octagon</v-icon>
                              Reactivar Alerta (Reiniciar Bloqueo)
                            </v-btn>
                          </template>
                        </template>

                        <v-btn
                          size="small"
                          variant="text"
                          color="primary"
                          class="text-capitalize font-weight-bold"
                          @click="askLogisticaPrompt('Explica el estado de la Carretera 57D y cómo se gestionan los nuevos transportes tras el levantamiento del bloqueo.')"
                        >
                          <v-icon start size="16">mdi-chat-processing-outline</v-icon>
                          Consultar Agente de Logistica
                        </v-btn>
                      </div>
                    </div>
                  </v-card>
                </div>
              </v-slide-y-reverse-transition>

              <!-- Canvas del Mapa Leaflet -->
              <div id="mapContainer"></div>
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
                  <div class="text-caption text-grey" style="font-size: 10.5px;">Torre de Control • 3 Corredores & Flota en Tiempo Real</div>
                </div>
              </div>
              <v-chip size="x-small" color="primary" variant="outlined" class="font-weight-bold">
                Google Maps Tooling
              </v-chip>
            </v-card-title>

            <!-- Quick Prompts / Sugerencias de Consultas -->
            <div class="px-3 py-2 bg-white d-flex flex-wrap flex-shrink-0" style="gap: 6px; border-bottom: 1px solid #f0f0f0;">
              <v-chip size="x-small" variant="tonal" color="#EA4335" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('🚨 ¿Cuáles son los transportes afectados por el bloqueo en Km 182 Carretera 57D y cuál es el plan de desvío anticipado?')">
                🚨 Bloqueo Km 182
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#4285F4" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('¿Cuál es el estatus y progreso de la flota de 13 unidades en los 3 corredores nacionales?')">
                🚚 Flota en Tránsito
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#34A853" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('¿Qué capacidad de inventario Plan B tenemos disponible en los CEDIS de Cuautitlán, Apodaca, Hermosillo y Mérida?')">
                📦 Stock en CEDIS
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="#FBBC05" style="color: #9A6700 !important;" class="cursor-pointer font-weight-bold" @click="askLogisticaPrompt('Evalúa el impacto operativo y financiero de desviar anticipadamente la unidad TRK-301 en Querétaro por la Autopista 45D.')">
                🛣️ Desvío Anticipado 45D
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
                Analizando red de logistica nacional...
              </div>
            </v-card-text>

            <!-- Input de Preguntas -->
            <v-card-actions class="pa-3 bg-white flex-shrink-0" style="border-top: 1px solid #eee;">
              <v-text-field
                v-model="userInput"
                variant="outlined"
                density="compact"
                placeholder="Pregunta a la Torre de Control sobre rutas, camiones, bloqueos o CEDIS..."
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
          content: '¡Hola! Soy tu **Agente Inteligente de Logística y Control de Rutas Terrestres**.\\n\\nEstoy monitoreando en tiempo real los 3 corredores estratégicos nacionales (Pacífico 15D, Sureste 180D y Central 57D), 4 CEDIS y la flota activa de transporte.\\n\\nActualmente se detecta un **bloqueo crítico en el Km 182 de la Carretera 57D** (Querétaro - SLP) afectando a las unidades **TRK-302**, **TRK-303** y **TRK-304**, con **TRK-301** en aproximación desde Querétaro. ¿Deseas evaluar el plan de desvío anticipado por la Autopista 45D?'
        }
      ],
      map: null,
      resizeObserver: null,
      masterData: (typeof LOGISTICA_MASTER_DATA !== 'undefined') ? JSON.parse(JSON.stringify(LOGISTICA_MASTER_DATA)) : {
        warehouses: [],
        routes: [],
        vehicles: [],
        alerts: []
      },
      activeFilter: 'all',
      selectedEntity: null, // 'vehicle' | 'warehouse' | 'alert' | null
      selectedRoute: null,
      selectedVehicle: null,
      selectedWarehouse: null,
      selectedAlert: null,
      activeConsideration: null,
      rerouteSuccessMessage: '',
      reroutingAnimation: false,
      rerouteApproved: false,
      roadblockCleared: false,
      completedDeliveriesCount: 0,
      unitCounter: 309,
      
      // Filtro de ruta activa para aislamiento visual
      activeRouteId: null,
      
      // Grupos de capas dedicados
      routesLayerGroup: null,
      altRoutesLayerGroup: null,
      originDestLayerGroup: null,
      markersLayerGroup: null,
      vehiclesLayerGroup: null,
      alertsLayerGroup: null,
      vehicleMarkers: {},
      
      // Motor de simulación de movimiento en tiempo real
      simulationTimer: null,
      simulationTick: 0
    };
  },
  computed: {
    fleetCount() {
      const _tick = this.simulationTick;
      return (this.masterData.vehicles || []).filter(v => v.estado_operativo !== 'Completado').length;
    },
    affectedVehiclesCount() {
      const _tick = this.simulationTick;
      if (this.rerouteApproved || this.roadblockCleared) {
        return 0; // Desvío aprobado o bloqueo retirado: toda la flota navega sin riesgos
      }
      return (this.masterData.vehicles || []).filter(v => v.estado_operativo === 'Afectado').length;
    },
    connectedRoute() {
      if (!this.selectedWarehouse) return null;
      if (this.activeRouteId) {
        const active = (this.masterData.routes || []).find(r => r.id === this.activeRouteId);
        if (active) return active;
      }
      return (this.masterData.routes || []).find(r => r.origen_id === this.selectedWarehouse.id || r.destino_id === this.selectedWarehouse.id) || null;
    },
    connectedRouteAlert() {
      if (!this.connectedRoute) return null;
      if ((this.rerouteApproved || this.roadblockCleared) && this.connectedRoute.id === 'RUTA-CDMX-MTY') return null;
      return (this.masterData.alerts || []).find(a => a.ruta_id === this.connectedRoute.id && a.estado !== 'Resuelta') || null;
    },
    corridorVehicles() {
      const _tick = this.simulationTick;
      if (!this.selectedWarehouse) return [];
      const wh = this.selectedWarehouse;
      const connectedRouteIds = (this.masterData.routes || [])
        .filter(r => r.origen_id === wh.id || r.destino_id === wh.id)
        .map(r => r.id);
      
      const targetRouteIds = this.activeRouteId ? [this.activeRouteId] : connectedRouteIds;
      return (this.masterData.vehicles || []).filter(v => 
        targetRouteIds.includes(v.ruta_id) && v.estado_operativo !== 'Completado'
      );
    },
    offloadingVehicles() {
      const _tick = this.simulationTick;
      if (!this.selectedWarehouse) return [];
      const wh = this.selectedWarehouse;
      return (this.masterData.vehicles || []).filter(v => {
        const matchesDest = (v.destino && (v.destino.toLowerCase().includes(wh.ubicacion.toLowerCase()) || v.destino.toLowerCase().includes(wh.nombre.toLowerCase()))) ||
          (this.connectedRoute && this.connectedRoute.destino_id === wh.id && v.ruta_id === this.connectedRoute.id);
        return matchesDest && (v.estado_operativo === 'Descargando' || v.estado_operativo === 'Entregado');
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 200);
      
      // Iniciar el motor de movimiento en tiempo real pausado cada 5.0 segundos
      this.startRealtimeSimulation();

      if (this.$route.query.prompt) {
        this.userInput = this.$route.query.prompt;
        setTimeout(() => this.sendMessage(), 300);
      }
    });
  },
  unmounted() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },
  methods: {
    safeClearLayerGroup(lg) {
      if (!lg) return;
      try {
        lg.eachLayer(layer => {
          try {
            if (layer.closeTooltip) layer.closeTooltip();
            if (layer.unbindTooltip) layer.unbindTooltip();
            if (layer.closePopup) layer.closePopup();
            if (layer.unbindPopup) layer.unbindPopup();
          } catch (e) {}
        });
        lg.clearLayers();
      } catch (e) {}
    },

    safeClearLayer(marker) {
      if (!marker) return;
      try {
        if (marker.closeTooltip) marker.closeTooltip();
        if (marker.unbindTooltip) marker.unbindTooltip();
        if (marker.closePopup) marker.closePopup();
        if (marker.unbindPopup) marker.unbindPopup();
        if (this.vehiclesLayerGroup && this.vehiclesLayerGroup.hasLayer(marker)) {
          this.vehiclesLayerGroup.removeLayer(marker);
        }
      } catch (e) {}
    },

    initMap() {
      const mapEl = document.getElementById('mapContainer');
      if (!mapEl) return;
      if (this.map) {
        this.map.invalidateSize();
        return;
      }

      // Límites geográficos de la República Mexicana para restringir el zoom hacia afuera y el paneo
      const mexicoBounds = L.latLngBounds(
        [14.0, -118.0], // Suroeste (Pacífico / Chiapas)
        [33.0, -86.0]   // Noreste (Frontera Norte / Península de Yucatán)
      );

      // Inicializar mapa centrado en la Ciudad de México enfocado exclusivamente en México
      const mapInstance = L.map('mapContainer', {
        attributionControl: false,
        zoomControl: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        minZoom: 6, // Limita el zoom-out al territorio de México (impide alejar hasta EE.UU./Canadá)
        maxZoom: 19, // Permite acercamiento a nivel carretera y andenes según permita el mapa
        maxBounds: mexicoBounds,
        maxBoundsViscosity: 0.85
      }).setView([19.4326, -99.1332], 6);

      // Usar markRaw para evitar que el sistema reactivo de Vue 3 envuelva Leaflet en Proxies
      this.map = (typeof Vue !== 'undefined' && Vue.markRaw) ? Vue.markRaw(mapInstance) : mapInstance;

      // Capa vehicular satelital oficial
      L.tileLayer('https://mt0.google.com/vt/lyrs=m&hl=es&x={x}&y={y}&z={z}', {
        maxZoom: 20
      }).addTo(this.map);

      // Crear grupos de capas dedicados y aislados de proxies
      const createGroup = () => {
        const group = L.featureGroup().addTo(this.map);
        return (typeof Vue !== 'undefined' && Vue.markRaw) ? Vue.markRaw(group) : group;
      };

      this.routesLayerGroup = createGroup();
      this.altRoutesLayerGroup = createGroup();
      this.originDestLayerGroup = createGroup();
      this.markersLayerGroup = createGroup();
      this.vehiclesLayerGroup = createGroup();
      this.alertsLayerGroup = createGroup();

      // Clic en fondo libre del mapa deselecciona todo y restaura la vista global con todos los pines
      this.map.on('click', (e) => {
        if (e.originalEvent && !e.originalEvent.target.closest('.custom-map-marker') && !e.originalEvent.target.closest('.custom-pin-ab')) {
          this.clearActiveSelection();
        }
      });

      // Observer de redimensionamiento automático para garantizar precisión milimétrica del zoom
      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          if (this.map) {
            this.map.invalidateSize({ debounceMoveend: true });
          }
        });
        this.resizeObserver.observe(mapEl);
      }

      this.renderMasterTopology();
      this.drawAllRoutes();
    },

    setFilter(filterType) {
      this.activeFilter = filterType;
      this.renderMasterTopology();
      if (!this.activeRouteId) {
        this.drawAllRoutes();
      }
    },

    resetMapView() {
      this.clearActiveSelection();
    },

    clearActiveSelection() {
      this.selectedEntity = null;
      this.selectedRoute = null;
      this.selectedVehicle = null;
      this.selectedWarehouse = null;
      this.selectedAlert = null;
      this.activeConsideration = null;
      this.activeRouteId = null; // Quita el aislamiento por ruta
      this.safeClearLayerGroup(this.originDestLayerGroup);
      
      // Restablecer la totalidad de los pines y los 3 corredores principales en el mapa
      this.renderMasterTopology();
      this.drawAllRoutes();

      this.$nextTick(() => {
        if (this.map) {
          this.map.invalidateSize();
          this.map.flyTo([19.4326, -99.1332], 6, { duration: 0.6 });
        }
      });
    },

    // RENDERIZADO DE LA TOPOLOGÍA CON ANCLAJE EXACTO Y SIN DUPLICADOS
    renderMasterTopology() {
      if (!this.map) return;

      this.safeClearLayerGroup(this.markersLayerGroup);
      this.safeClearLayerGroup(this.vehiclesLayerGroup);
      this.safeClearLayerGroup(this.alertsLayerGroup);
      this.vehicleMarkers = {};

      const showWarehouses = this.activeFilter === 'all' || this.activeFilter === 'warehouses';
      const showVehicles = this.activeFilter === 'all' || this.activeFilter === 'vehicles';
      const showDisruptedOnly = this.activeFilter === 'disrupted';
      const targetRoute = this.activeRouteId ? (this.masterData.routes || []).find(r => r.id === this.activeRouteId) : null;

      // 1. RENDERIZAR BODEGAS / CEDIS
      // Si hay una ruta seleccionada, el origen se convierte en Pin (A) y el destino en Pin (B) sin duplicar capas
      if (showWarehouses && !showDisruptedOnly) {
        (this.masterData.warehouses || []).forEach(wh => {
          if (targetRoute && wh.id !== targetRoute.origen_id && wh.id !== targetRoute.destino_id) {
            return;
          }

          const isOrigin = targetRoute && wh.id === targetRoute.origen_id;
          const isDest = targetRoute && wh.id === targetRoute.destino_id;

          let markerHtml = '';
          let iconSize = [38, 38];
          let iconAnchor = [19, 19];
          let tooltipHtml = '';

          if (isOrigin) {
            // PIN (A) ORIGEN
            iconSize = [40, 40];
            iconAnchor = [20, 20];
            markerHtml = `
              <div class="custom-map-marker" style="box-sizing: border-box; background: #1a73e8; width: 40px; height: 40px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px rgba(0,0,0,0.45); border: 3px solid white; cursor: pointer; user-select: none;">
                <span style="font-weight: 900; font-size: 17px; line-height: 1;">A</span>
              </div>
            `;
            tooltipHtml = `
              <div style="font-family: Roboto, sans-serif; min-width: 190px;">
                <div style="font-weight: bold; font-size: 12px; color: #1a73e8; margin-bottom: 2px;">📍 ORIGEN (A)</div>
                <div style="font-weight: bold; font-size: 13px; color: #202124;">${wh.nombre}</div>
                <div style="font-size: 11px; color: #3c4043; margin-top: 2px;">${wh.ubicacion}</div>
              </div>
            `;
          } else if (isDest) {
            // PIN (B) DESTINO
            iconSize = [40, 40];
            iconAnchor = [20, 20];
            markerHtml = `
              <div class="custom-map-marker" style="box-sizing: border-box; background: #d93025; width: 40px; height: 40px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px rgba(0,0,0,0.45); border: 3px solid white; cursor: pointer; user-select: none;">
                <span style="font-weight: 900; font-size: 17px; line-height: 1;">B</span>
              </div>
            `;
            tooltipHtml = `
              <div style="font-family: Roboto, sans-serif; min-width: 190px;">
                <div style="font-weight: bold; font-size: 12px; color: #d93025; margin-bottom: 2px;">🎯 DESTINO (B)</div>
                <div style="font-weight: bold; font-size: 13px; color: #202124;">${wh.nombre}</div>
                <div style="font-size: 11px; color: #3c4043; margin-top: 2px;">${wh.ubicacion}</div>
              </div>
            `;
          } else {
            // CEDIS GENERAL
            markerHtml = `
              <div class="custom-map-marker" style="box-sizing: border-box; background: linear-gradient(135deg, #1a73e8, #4285F4); width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px rgba(0,0,0,0.35); border: 2.5px solid white; cursor: pointer; user-select: none;">
                <i class="mdi mdi-warehouse" style="font-size: 21px; line-height: 1; color: white;"></i>
              </div>
            `;
            tooltipHtml = `
              <div style="font-family: Roboto, sans-serif; min-width: 200px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="background: #e6f4ea; color: #137333; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                    CEDIS Estratégico
                  </span>
                  <span style="color: #5f6368; font-size: 10.5px; font-weight: 600;">${wh.id}</span>
                </div>
                <div style="font-weight: bold; font-size: 13px; color: #202124; margin-bottom: 3px;">${wh.nombre}</div>
                <div style="font-size: 11px; color: #3c4043; line-height: 1.45;">
                  <b>Ubicación:</b> ${wh.ubicacion}<br>
                  <b>Capacidad:</b> ${wh.capacidad_m2.toLocaleString()} m²<br>
                  <b>Stock:</b> ${wh.stock_descripcion}<br>
                  <b style="color: #137333;">Disponibilidad Plan B:</b> ${wh.unidades_disponibles_plan_b} unidades
                </div>
              </div>
            `;
          }

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-icon',
            iconSize: iconSize,
            iconAnchor: iconAnchor
          });

          const marker = L.marker([wh.lat, wh.lon], { 
            icon: customIcon,
            zIndexOffset: 1000 // Asegura que el pin del CEDIS quede siempre en el tope superior
          })
            .addTo(this.markersLayerGroup)
            .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -iconAnchor[1]], opacity: 0.98 });

          marker.on('click', () => {
            this.selectWarehouse(wh);
          });
        });
      }

      // 2. RENDERIZAR ALERTAS VIALES
      (this.masterData.alerts || []).forEach(alert => {
        if (targetRoute && alert.ruta_id !== targetRoute.id) {
          return;
        }

        const isResolved = alert.estado === 'Resuelta' || this.roadblockCleared;

        let markerHtml = '';
        let tooltipHtml = '';

        if (isResolved) {
          // ESTADO RESUELTO / VÍA LIBERADA (VERDE GOOGLE #34A853)
          markerHtml = `
            <div class="custom-map-marker alert-marker-${alert.id}" style="box-sizing: border-box; background: #34A853; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 0 0 5px rgba(52,168,83,0.35), 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid white; cursor: pointer; user-select: none;">
              <i class="mdi mdi-check-circle" style="font-size: 22px; line-height: 1; color: white;"></i>
            </div>
          `;

          tooltipHtml = `
            <div style="font-family: Roboto, sans-serif; min-width: 220px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="background: #e6f4ea; color: #137333; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  ✅ INCIDENCIA RESUELTA
                </span>
                <span style="color: #5f6368; font-size: 10.5px; font-weight: 600;">${alert.id}</span>
              </div>
              <div style="font-weight: bold; font-size: 13px; color: #202124; margin-bottom: 3px;">Vía Despejada - Bloqueo Retirado</div>
              <div style="font-size: 11px; color: #3c4043; line-height: 1.45;">
                <b>Ruta:</b> ${alert.ruta_nombre}<br>
                <b>Segmento:</b> ${alert.segmento}<br>
                <b>Estatus:</b> Tránsito regular restablecido por Guardia Nacional.<br>
                <b style="color: #137333;">Nuevos transportes:</b> Circulando por ruta original 57D.<br>
                <span style="color: #c5221f; font-weight: 600; font-size: 10.5px;">Clic para abrir panel o reactivar alerta para demo</span>
              </div>
            </div>
          `;
        } else {
          // ESTADO ACTIVO / CRÍTICO (ROJO GOOGLE #EA4335)
          markerHtml = `
            <div class="custom-map-marker alert-marker-${alert.id}" style="box-sizing: border-box; background: #EA4335; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 0 0 5px rgba(234,67,53,0.35), 0 4px 12px rgba(0,0,0,0.4); border: 2.5px solid white; cursor: pointer; user-select: none;">
              <i class="mdi mdi-alert-octagon" style="font-size: 22px; line-height: 1; color: white;"></i>
            </div>
          `;

          tooltipHtml = `
            <div style="font-family: Roboto, sans-serif; min-width: 220px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="background: #fce8e6; color: #c5221f; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  INCIDENCIA CRÍTICA
                </span>
                <span style="color: #5f6368; font-size: 10.5px; font-weight: 600;">${alert.id}</span>
              </div>
              <div style="font-weight: bold; font-size: 13px; color: #202124; margin-bottom: 3px;">${alert.tipo_incidencia}</div>
              <div style="font-size: 11px; color: #3c4043; line-height: 1.45;">
                <b>Ruta:</b> ${alert.ruta_nombre}<br>
                <b>Segmento:</b> ${alert.segmento}<br>
                <b>Retraso Proyectado:</b> +${alert.retraso_estimado_hrs} hrs<br>
                <b style="color: #EA4335;">Impacto Financiero:</b> \${alert.impacto_financiero_usd ? alert.impacto_financiero_usd.toLocaleString() : '54,000'} USD
              </div>
            </div>
          `;
        }

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-icon',
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const marker = L.marker([alert.lat, alert.lon], { 
          icon: customIcon,
          zIndexOffset: 900
        })
          .addTo(this.alertsLayerGroup)
          .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -19], opacity: 0.98 });

        marker.on('click', () => {
          this.selectAlert(alert);
        });
      });

      // 3. RENDERIZAR VEHÍCULOS / FLOTA ACTIVA
      if (showVehicles || showDisruptedOnly) {
        (this.masterData.vehicles || []).forEach(v => {
          if (v.estado_operativo === 'Completado') return; // Ya no se rastrea en el mapa
          if (showDisruptedOnly && v.estado_operativo !== 'Afectado') return;
          if (targetRoute && v.ruta_id !== targetRoute.id) return;

          this.createVehicleMarker(v);
        });
      }
    },

    // CREACIÓN DE MARCADOR VEHICULAR CON COLOR CONSISTENTE (#1a73e8) Y CAPA DE PRIORIDAD
    createVehicleMarker(v) {
      if (!this.map || !this.vehiclesLayerGroup) return;
      if (this.vehicleMarkers[v.id]) {
        this.safeClearLayer(this.vehicleMarkers[v.id]);
        delete this.vehicleMarkers[v.id];
      }

      const isAfectado = v.estado_operativo === 'Afectado';
      const isReenrutado = v.estado_operativo === 'Reenrutado';
      const isDescargando = v.estado_operativo === 'Descargando' || v.estado_operativo === 'Entregado';

      let badgeText = 'En Tránsito OK';
      let badgeBg = '#e8f0fe';
      let badgeColor = '#1967d2';

      if (isDescargando) {
        badgeText = 'En Andén de Descarga';
        badgeBg = '#e6f4ea';
        badgeColor = '#0F9D58';
      } else if (isReenrutado) {
        badgeText = 'Re-enrutado (Autopista 45D)';
        badgeBg = '#e6f4ea';
        badgeColor = '#137333';
      } else if (isAfectado) {
        badgeText = 'En Riesgo de Bloqueo';
        badgeBg = '#fce8e6';
        badgeColor = '#c5221f';
      }

      // Estilo de pin consistente solicitado por el usuario: SIEMPRE Azul Google (#1a73e8) con camión blanco
      const markerHtml = `
        <div class="custom-map-marker vehicle-marker-${v.id}" style="box-sizing: border-box; background: #1a73e8; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(26, 115, 232, 0.45); border: 2.5px solid white; cursor: pointer; user-select: none;">
          <i class="mdi mdi-truck-fast" style="font-size: 18px; line-height: 1; color: white;"></i>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-icon',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const tooltipHtml = `
        <div style="font-family: Roboto, sans-serif; min-width: 210px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="background: ${badgeBg}; color: ${badgeColor}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
              ${badgeText}
            </span>
            <span style="color: #5f6368; font-size: 10.5px; font-weight: 600;">${v.id}</span>
          </div>
          <div style="font-weight: bold; font-size: 13px; color: #202124; margin-bottom: 3px;">${v.nombre}</div>
          <div style="font-size: 11px; color: #3c4043; line-height: 1.45;">
            <b>Carga:</b> ${v.carga} (${v.peso_ton} T)<br>
            <b>Cliente:</b> ${v.cliente}<br>
            <b>Origen ➔ Destino:</b> ${v.origen} ➔ ${v.destino}<br>
            <b>Progreso:</b> ${v.progreso_pct}% | <b>Velocidad:</b> ${v.velocidad_kmh} km/h<br>
            <b>Estatus:</b> ${v.estado_transito}<br>
            ${v.penalizacion_usd > 0 ? `<b style="color: #EA4335;">Penalización en Riesgo:</b> $${v.penalizacion_usd.toLocaleString()} USD` : ''}
          </div>
        </div>
      `;

      const marker = L.marker([v.posicion_actual.lat, v.posicion_actual.lon], { 
        icon: customIcon,
        zIndexOffset: 500
      })
        .addTo(this.vehiclesLayerGroup)
        .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -17], opacity: 0.98 });

      this.vehicleMarkers[v.id] = marker;

      marker.on('click', () => {
        this.selectVehicle(v);
      });
    },

    // DIBUJAR LOS 3 CORREDORES PRINCIPALES AL CARGAR EL MAPA O AL RESTABLECER VISTA
    drawAllRoutes() {
      if (!this.map) return;
      this.safeClearLayerGroup(this.routesLayerGroup);
      this.safeClearLayerGroup(this.altRoutesLayerGroup);
      this.safeClearLayerGroup(this.originDestLayerGroup);

      (this.masterData.routes || []).forEach(route => {
        if (!route.coordenadas || route.coordenadas.length === 0) return;
        if (this.activeFilter === 'disrupted' && route.estado !== 'Disrumpida') return;

        const isDisrupted = route.estado === 'Disrumpida' && !this.roadblockCleared;
        const color = isDisrupted ? '#EA4335' : (route.color || '#4285F4');
        const weight = isDisrupted ? 4.5 : 3.5;
        const opacity = isDisrupted ? 0.95 : 0.85;
        const dashArray = isDisrupted ? '6, 6' : null;

        const polyline = L.polyline(route.coordenadas, {
          color: color,
          weight: weight,
          opacity: opacity,
          dashArray: dashArray,
          smoothFactor: 1.0
        }).addTo(this.routesLayerGroup);

        const statusLabel = isDisrupted 
          ? '<b style="color: #EA4335;">🚨 CORREDOR DISRUMPIDO (Bloqueo Carretero Km 182)</b>' 
          : '<b style="color: #1967d2;">✅ CORREDOR OPERATIVO</b>';

        polyline.bindTooltip(`
          <div style="font-family: Roboto, sans-serif; font-size: 11.5px; padding: 2px;">
            ${statusLabel}<br>
            <b>${route.nombre}</b><br>
            <span>Distancia: ${route.distancia_km} km | Tiempo base: ${route.tiempo_base_hrs} hrs | Capacidad máx: ${route.max_unidades || 18} unidades</span><br>
            <span style="color: #5f6368; font-size: 10px;">Clic para inspeccionar este corredor</span>
          </div>
        `, { opacity: 0.95 });

        polyline.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          this.selectRoute(route);
        });

        polyline.on('mouseover', () => {
          polyline.setStyle({ weight: weight + 2, opacity: 1.0 });
        });
        polyline.on('mouseout', () => {
          polyline.setStyle({ weight: weight, opacity: opacity });
        });

        // Si es la ruta 57D y el desvío ya fue aprobado o la vía liberada, mostrar también las rutas alternas en verde
        if (route.id === 'RUTA-CDMX-MTY' && (this.rerouteApproved || this.roadblockCleared) && route.alternativa) {
          const alt = route.alternativa;
          const coordsBloqueo = alt.coordenadas_bloqueo || alt.coordenadas;
          if (coordsBloqueo && coordsBloqueo.length > 0) {
            L.polyline(coordsBloqueo, {
              color: '#34A853',
              weight: 4,
              opacity: 0.9,
              dashArray: '6, 6'
            }).addTo(this.altRoutesLayerGroup).bindTooltip(`
              <div style="font-family: Roboto, sans-serif; font-size: 11px; padding: 2px;">
                <b style="color: #137333;">🛣️ DESVÍO EN BLOQUEO (Km 182 ➔ Autopista 45D)</b>
              </div>
            `, { opacity: 0.95 });
          }
          const coordsAnticipado = alt.coordenadas_anticipado;
          if (coordsAnticipado && coordsAnticipado.length > 0) {
            L.polyline(coordsAnticipado, {
              color: '#0F9D58',
              weight: 4.5,
              opacity: 0.9,
              dashArray: '4, 6'
            }).addTo(this.altRoutesLayerGroup).bindTooltip(`
              <div style="font-family: Roboto, sans-serif; font-size: 11px; padding: 2px;">
                <b style="color: #0d652d;">🛣️ DESVÍO ANTICIPADO 45D (CDMX ➔ Monterrey)</b>
              </div>
            `, { opacity: 0.95 });
          }
        }
      });
    },

    selectRoute(route) {
      if (!route) return;
      this.selectedRoute = route;
      this.activeRouteId = route.id;

      // Si la ruta tiene una alerta de bloqueo activa, enfocar la alerta para dar control inmediato
      const matchingAlert = (this.masterData.alerts || []).find(a => a.ruta_id === route.id && a.estado !== 'Resuelta');
      if (matchingAlert && !this.roadblockCleared) {
        this.selectAlert(matchingAlert);
        return;
      }

      // Si hay un vehículo en tránsito en esta ruta, seleccionarlo para mostrar su ficha
      const matchingVehicle = (this.masterData.vehicles || []).find(v => v.ruta_id === route.id && v.estado_operativo !== 'Completado');
      if (matchingVehicle) {
        this.selectVehicle(matchingVehicle);
        return;
      }

      // O el CEDIS de origen
      const originWh = (this.masterData.warehouses || []).find(w => w.id === route.origen_id);
      if (originWh) {
        this.selectWarehouse(originWh);
        return;
      }

      this.drawRouteWithPins(route);
      this.renderMasterTopology();
    },

    // DIBUJAR RUTA BAJO DEMANDA (LÍNEAS LIMPIAS SIN PINES DUPLICADOS)
    drawRouteWithPins(route) {
      if (!this.map || !route || !route.coordenadas || route.coordenadas.length === 0) return;

      this.safeClearLayerGroup(this.routesLayerGroup);
      this.safeClearLayerGroup(this.originDestLayerGroup);
      this.safeClearLayerGroup(this.altRoutesLayerGroup);

      const isDisrupted = route.estado === 'Disrumpida';

      // Dibujar la polilínea troncal
      const polyline = L.polyline(route.coordenadas, {
        color: route.color || (isDisrupted ? '#EA4335' : '#4285F4'),
        weight: isDisrupted ? 5 : 4,
        opacity: 0.9,
        dashArray: route.dashArray || null
      }).addTo(this.routesLayerGroup);

      polyline.bindTooltip(`
        <div style="font-family: Roboto, sans-serif; font-size: 11.5px; padding: 2px;">
          <b style="color: ${isDisrupted ? '#EA4335' : '#1967d2'};">${isDisrupted ? '🚨 RUTA DISRUMPIDA' : '✅ CORREDOR OPERATIVO'}</b><br>
          <b>${route.nombre}</b><br>
          <span>Distancia: ${route.distancia_km} km | Tiempo base: ${route.tiempo_base_hrs} hrs | Capacidad máx: ${route.max_unidades || 18} unidades</span>
        </div>
      `, { opacity: 0.95 });

      // Mantener rutas alternas visibles en el mapa para seguimiento del operador incluso si la vía fue liberada
      if (route.alternativa) {
        const alt = route.alternativa;

        // 1. Desvío en Bloqueo (para unidades retenidas en Km 182 que conectan vía San Felipe)
        const coordsBloqueo = alt.coordenadas_bloqueo || alt.coordenadas;
        if (coordsBloqueo && coordsBloqueo.length > 0) {
          const polyBloqueo = L.polyline(coordsBloqueo, {
            color: '#34A853',
            weight: 4.5,
            opacity: 0.95,
            dashArray: '6, 6'
          }).addTo(this.altRoutesLayerGroup);

          const descBloqueo = this.roadblockCleared 
            ? 'Ruta alterna activa: Seguimiento continuo de unidades re-enrutadas (TRK-302, TRK-303, TRK-304) que completan su tránsito a destino'
            : 'Ruta de desahogo para unidades retenidas en la zona de afectación (TRK-302, TRK-303, TRK-304)';

          polyBloqueo.bindTooltip(`
            <div style="font-family: Roboto, sans-serif; font-size: 11.5px; padding: 2px;">
              <b style="color: #137333;">🛣️ DESVÍO EN BLOQUEO (Km 182 ➔ San Felipe ➔ Autopista 45D)</b><br>
              <span>${descBloqueo}</span>
            </div>
          `, { opacity: 0.95 });
        }

        // 2. Desvío Anticipado Completo (para despachos y tráfico previo por Querétaro-Celaya)
        const coordsAnticipado = alt.coordenadas_anticipado;
        if (coordsAnticipado && coordsAnticipado.length > 0) {
          const polyAnticipado = L.polyline(coordsAnticipado, {
            color: '#0F9D58',
            weight: 5,
            opacity: 0.95,
            dashArray: '4, 6'
          }).addTo(this.altRoutesLayerGroup);

          const descAnticipado = this.roadblockCleared
            ? 'Ruta alterna 45D activa: Seguimiento continuo de unidades que tomaron el desvío antes de la reapertura vial'
            : 'Ruta continua para unidades que evitan completamente el bloqueo carretero';

          polyAnticipado.bindTooltip(`
            <div style="font-family: Roboto, sans-serif; font-size: 11.5px; padding: 2px;">
              <b style="color: #0d652d;">🛣️ DESVÍO ANTICIPADO COMPLETO (CDMX ➔ Celaya ➔ 45D ➔ MTY)</b><br>
              <span>${descAnticipado}</span>
            </div>
          `, { opacity: 0.95 });
        }

        this.activeConsideration = {
          ...alt,
          ruta_origen_id: route.id,
          ruta_origen_nombre: route.nombre
        };
      } else {
        this.activeConsideration = null;
      }
    },

    selectVehicle(v) {
      this.selectedEntity = 'vehicle';
      this.selectedVehicle = v;
      this.selectedWarehouse = null;
      this.selectedAlert = null;
      
      const matchingRoute = (this.masterData.routes || []).find(r => r.id === v.ruta_id);
      if (matchingRoute) {
        this.selectedRoute = matchingRoute;
        this.activeRouteId = matchingRoute.id; // Activa aislamiento visual para este corredor
        this.drawRouteWithPins(matchingRoute);
        this.renderMasterTopology(); // Oculta pines ajenos y renderiza pines A y B

        // Centrar con margen inferior para no quedar tapado por la tarjeta flotante
        this.$nextTick(() => {
          if (!this.map) return;
          this.map.invalidateSize();
          try {
            const bounds = L.latLngBounds(matchingRoute.coordenadas);
            if (bounds.isValid()) {
              this.map.fitBounds(bounds, {
                paddingTopLeft: [40, 40],
                paddingBottomRight: [40, 280], // Deja libre el espacio de la ficha inferior
                maxZoom: 9,
                animate: true,
                duration: 0.5
              });
            }
          } catch (e) {
            console.warn('Error al ajustar límites:', e);
          }
        });
      }
    },

    selectWarehouse(wh) {
      this.selectedEntity = 'warehouse';
      this.selectedWarehouse = wh;
      this.selectedVehicle = null;
      this.selectedAlert = null;

      // Buscar rutas conectadas a este CEDIS
      const connected = (this.masterData.routes || []).find(r => r.origen_id === wh.id || r.destino_id === wh.id);
      if (connected) {
        this.selectedRoute = connected;
        this.activeRouteId = connected.id; // Activa aislamiento visual para este corredor
        this.drawRouteWithPins(connected);
        this.renderMasterTopology();

        this.$nextTick(() => {
          if (!this.map) return;
          this.map.invalidateSize();
          try {
            const bounds = L.latLngBounds(connected.coordenadas);
            if (bounds.isValid()) {
              this.map.fitBounds(bounds, {
                paddingTopLeft: [40, 40],
                paddingBottomRight: [40, 280],
                maxZoom: 9,
                animate: true,
                duration: 0.5
              });
            }
          } catch (e) {
            console.warn('Error al ajustar límites:', e);
          }
        });
      }
    },

    selectAlert(alert) {
      this.selectedEntity = 'alert';
      this.selectedAlert = alert;
      this.selectedVehicle = null;
      this.selectedWarehouse = null;

      const matchingRoute = (this.masterData.routes || []).find(r => r.id === alert.ruta_id);
      if (matchingRoute) {
        this.selectedRoute = matchingRoute;
        this.activeRouteId = matchingRoute.id;
        this.drawRouteWithPins(matchingRoute);
        this.renderMasterTopology();

        this.$nextTick(() => {
          if (!this.map) return;
          this.map.invalidateSize();
          try {
            const bounds = L.latLngBounds(matchingRoute.coordenadas);
            if (bounds.isValid()) {
              this.map.fitBounds(bounds, {
                paddingTopLeft: [40, 40],
                paddingBottomRight: [40, 280],
                maxZoom: 9,
                animate: true,
                duration: 0.5
              });
            }
          } catch (e) {
            console.warn('Error al ajustar límites:', e);
          }
        });
      }
      if (!this.roadblockCleared && alert.estado !== 'Resuelta') {
        this.askLogisticaPrompt(`🚨 Analiza el impacto del bloqueo en ${alert.ruta_nombre} (${alert.segmento}). ¿Qué plan de desvío anticipado se recomienda?`);
      }
    },

    // CÁLCULO DE DISTANCIA HAVERSINE EN KM
    getDistanceKm(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radio de la Tierra en km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    },

    // MOTOR DE MOVIMIENTO EN TIEMPO REAL CALIBRADO A RITMO FLUIDO (3.5s)
    startRealtimeSimulation() {
      if (this.simulationTimer) clearInterval(this.simulationTimer);

      this.simulationTimer = setInterval(() => {
        this.tickVehicleMovement();
      }, 3500);
    },

    tickVehicleMovement() {
      // Incrementar contador de simulación para forzar reactividad en componentes computados
      this.simulationTick = (this.simulationTick || 0) + 1;

      // Despacho regular programado en el corredor CDMX-MTY respetando el cupo máximo (máx 18 unidades)
      // En rutas impactadas sin desvío ni reapertura, el origen retiene salidas para evitar saturar el bloqueo
      this.mtyDispatchTicks = (this.mtyDispatchTicks || 0) + 1;
      if (this.mtyDispatchTicks >= 7) { // Cada ~25 segundos
        this.mtyDispatchTicks = 0;
        const routeMty = (this.masterData.routes || []).find(r => r.id === 'RUTA-CDMX-MTY');
        const maxMty = routeMty?.max_unidades || 18;
        const activeMtyCount = (this.masterData.vehicles || []).filter(v => 
          v.ruta_id === 'RUTA-CDMX-MTY' && v.estado_operativo !== 'Completado'
        ).length;
        
        // Solo despachar si hay cupo bajo el límite Y la ruta no está bloqueada sin alternativa
        if (activeMtyCount < maxMty && (this.rerouteApproved || this.roadblockCleared)) {
          this.spawnContinuousUnit('RUTA-CDMX-MTY');
        }
      }

      // Si el mapa está en plena animación de zoom o arrastre activo, no mover marcadores para evitar interferencias
      if (this.map && (this.map._animatingZoom || (this.map.dragging && this.map.dragging._draggable && this.map.dragging._draggable._moving))) return;

      const alert57D = (this.masterData.alerts || []).find(a => a.id === 'ALT-57D-BLOQUEO');

      (this.masterData.vehicles || []).forEach(v => {
        // Ignorar vehículos ya concluidos
        if (v.estado_operativo === 'Completado') return;

        // 1. MANEJO DE UNIDAD EN ANDÉN DE DESCARGA
        if (v.estado_operativo === 'Descargando') {
          v.dockTicks = (v.dockTicks || 0) + 1;
          v.velocidad_kmh = 0;
          v.progreso_pct = 100;
          
          if (v.dockTicks >= 4) { // Tras ~14 segundos de descarga completa
            v.estado_operativo = 'Completado';
            v.estado_transito = 'Viaje concluido y descarga finalizada en andén';
            
            // Dejar de rastrear en el mapa
            const marker = this.vehicleMarkers[v.id];
            if (marker) {
              this.safeClearLayer(marker);
              delete this.vehicleMarkers[v.id];
            }
            
            this.completedDeliveriesCount = (this.completedDeliveriesCount || 0) + 1;
            
            // Despachar una nueva unidad en este corredor para flujo continuo
            this.spawnContinuousUnit(v.ruta_id);
          }
          return;
        }

        // 1.5. MANEJO DE FILA DE ESPERA SECUENCIAL (DESAHOGO 1 POR 1 EN DESVÍO DE BLOQUEO)
        if (v.queue_delay_ticks && v.queue_delay_ticks > 0) {
          v.queue_delay_ticks--;
          
          if (v.queue_delay_ticks > 0) {
            // Permanece en su posición de espera en la fila sin avanzar aún en el trazado alterno
            v.velocidad_kmh = v.queue_delay_ticks <= 1 ? 8 : 0;
            const turnoNum = v.id === 'TRK-303' ? 2 : (v.id === 'TRK-304' ? 3 : 1);
            v.estado_transito = `Turno ${turnoNum}: En fila de espera (${Math.round(v.queue_delay_ticks * 3.5)}s para incorporación al entronque)`;
            return;
          } else {
            // ¡Su turno ha llegado! Inicia su avance por el entronque local despacio
            v.velocidad_kmh = 32;
            v.estado_transito = 'Incorporándose a velocidad reducida (32 km/h) al entronque San Felipe';
          }
        }

        // 2. DETECCIÓN DINÁMICA DE PROXIMIDAD A LA ALERTA (RUTA 57D)
        // Solo aplica si el desvío aún no ha sido aprobado y el bloqueo continúa activo
        if (!this.rerouteApproved && !this.roadblockCleared && alert57D && alert57D.estado !== 'Resuelta' && v.ruta_id === 'RUTA-CDMX-MTY' && v.estado_operativo !== 'Reenrutado') {
          const distToAlert = this.getDistanceKm(v.posicion_actual.lat, v.posicion_actual.lon, alert57D.lat, alert57D.lon);
          
          if ((v.segment_index || 0) <= 4) {
            if (distToAlert < 15) {
              v.estado_operativo = 'Afectado';
              v.velocidad_kmh = 0;
              v.penalizacion_usd = v.penalizacion_usd || 18000;
              v.estado_transito = 'Detenido por bloqueo carretero en Km 182';
              return;
            } else if (distToAlert < 85) {
              v.estado_operativo = 'Afectado';
              v.velocidad_kmh = Math.max(20, Math.round(distToAlert * 0.45));
              v.penalizacion_usd = v.penalizacion_usd || 12000;
              v.estado_transito = `En aproximación a zona de bloqueo (${Math.round(distToAlert)} km restantes) - Riesgo inminente`;
            }
          }
        }

        // Si está afectado y completamente detenido en el bloqueo, no avanza hasta que se apruebe el desvío
        if (v.estado_operativo === 'Afectado' && v.velocidad_kmh === 0) {
          return;
        }

        // 3. COORDENADAS SEGÚN SU RUTA O DESVÍO APROBADO
        let coords = null;
        if (v.estado_operativo === 'Reenrutado') {
          if (v.desvio_tipo === 'anticipado') {
            coords = [
              [19.6711, -99.1783], // CEDIS Central Cuautitlán (CDMX) - Pin A de Origen
              [19.9500, -99.5300], // Tepeji del Río
              [20.3500, -99.9800], // San Juan del Río
              [20.5888, -100.3899], // Querétaro (Bifurcación hacia 45D)
              [20.5287, -100.8142], // Celaya 45D
              [20.7214, -101.3468], // Salamanca
              [20.9167, -101.4000], // Silao
              [21.8853, -102.2916], // Aguascalientes
              [22.7709, -102.5832], // Zacatecas
              [23.9000, -102.0000], // Concepción del Oro
              [25.4232, -100.9922], // Saltillo
              [25.6866, -100.3161], // Monterrey Centro
              [25.7785, -100.1876]  // Apodaca CEDIS MTY - Pin B de Destino
            ];
          } else {
            coords = [
              [21.1619, -100.9300], // Km 182 Carretera 57D (zona de bloqueo)
              [21.2980, -100.5160], // San Luis de la Paz
              [21.4780, -101.2160], // San Felipe
              [21.8670, -101.5900], // Ojuelos
              [21.8853, -102.2916], // Aguascalientes
              [22.7709, -102.5832], // Zacatecas
              [23.9000, -102.0000], // Concepción del Oro
              [25.4232, -100.9922], // Saltillo
              [25.6866, -100.3161], // Monterrey Centro
              [25.7785, -100.1876]  // Apodaca CEDIS MTY - Pin B de Destino
            ];
          }
        } else {
          const mainRoute = (this.masterData.routes || []).find(r => r.id === v.ruta_id);
          coords = mainRoute?.coordenadas;
        }

        if (!coords || coords.length < 2) return;

        v.subStep = (v.subStep || 0) + 1;
        const totalSubSteps = 4;

        if (v.subStep >= totalSubSteps) {
          v.subStep = 0;
          v.segment_index = (v.segment_index || 0) + 1;
          
          if (v.segment_index >= coords.length - 1) {
            v.segment_index = coords.length - 1;
            v.estado_operativo = 'Descargando';
            v.progreso_pct = 100;
            v.velocidad_kmh = 0;
            v.dockTicks = 1;
            v.estado_transito = 'Arribo a CEDIS Destino - En Andén de Descarga';
            v.penalizacion_usd = 0;
            
            const destCoord = coords[coords.length - 1];
            v.posicion_actual = { lat: destCoord[0], lon: destCoord[1] };
            
            const marker = this.vehicleMarkers[v.id];
            if (marker) {
              marker.setLatLng([destCoord[0], destCoord[1]]);
            }
            return;
          }
        }

        const idx = v.segment_index || 0;
        const p1 = coords[idx];
        const p2 = coords[Math.min(idx + 1, coords.length - 1)];

        const ratio = v.subStep / totalSubSteps;
        const curLat = p1[0] + (p2[0] - p1[0]) * ratio;
        const curLon = p1[1] + (p2[1] - p1[1]) * ratio;

        v.posicion_actual = { lat: curLat, lon: curLon };

        if (v.estado_operativo === 'Reenrutado' && v.desvio_tipo === 'enlace_local') {
          if ((v.segment_index || 0) < 2) {
            // Desahogo lento en el entronque local San Felipe (30-40 km/h)
            v.velocidad_kmh = 32 + ((v.subStep || 0) * 3);
            v.estado_transito = `Avanzando a velocidad moderada (${v.velocidad_kmh} km/h) por entronque local San Felipe`;
          } else {
            // Ya incorporado en la autopista 45D a velocidad de crucero
            v.velocidad_kmh = 78 + Math.floor(Math.sin(Date.now() / 5000 + (v.segment_index || 0)) * 4);
            v.estado_transito = `Tránsito fluido por Autopista 45D hacia Monterrey (${v.velocidad_kmh} km/h)`;
          }
        } else if (v.estado_operativo !== 'Afectado') {
          v.velocidad_kmh = 82 + Math.floor(Math.sin(Date.now() / 5000 + idx) * 4);
        }

        const totalSegments = coords.length - 1;
        v.progreso_pct = Math.min(99, Math.max(5, Math.round(((idx + ratio) / totalSegments) * 100)));

        const marker = this.vehicleMarkers[v.id];
        if (marker) {
          marker.setLatLng([curLat, curLon]);
        }
      });
    },

    // RE-ENRUTAMIENTO GRADUAL Y DESVÍO ANTICIPADO
    applyReroute(consideration) {
      if (this.reroutingAnimation) return;

      this.reroutingAnimation = true;
      this.rerouteApproved = true;

      try {
        // 1. Unidades en la zona de bloqueo (TRK-302, TRK-303, TRK-304):
        // Desalojo secuencial 1 por 1 con demora escalonada para evitar apilamiento de pines y simular tráfico real
        const stuckVehicles = (this.masterData.vehicles || []).filter(v => 
          ['TRK-302', 'TRK-303', 'TRK-304'].includes(v.id) || (v.ruta_id === 'RUTA-CDMX-MTY' && v.estado_operativo === 'Afectado')
        );

        const queueOrder = { 'TRK-302': 0, 'TRK-303': 1, 'TRK-304': 2 };
        stuckVehicles.sort((a, b) => (queueOrder[a.id] ?? 9) - (queueOrder[b.id] ?? 9));

        stuckVehicles.forEach((veh, idx) => {
          veh.estado_operativo = 'Reenrutado';
          veh.desvio_tipo = 'enlace_local';
          veh.penalizacion_usd = 0;
          veh.segment_index = 0;
          veh.subStep = 0;

          if (idx === 0) {
            // Turno 1 (TRK-302): Sale de inmediato despacio hacia el entronque local San Felipe
            veh.queue_delay_ticks = 0;
            veh.velocidad_kmh = 32;
            veh.estado_transito = 'Turno 1: Despejando retén a 32 km/h hacia entronque San Felipe';
          } else if (idx === 1) {
            // Turno 2 (TRK-303): Espera 3 ciclos (~10s) en su posición de fila mientras TRK-302 despeja el acceso
            veh.queue_delay_ticks = 3;
            veh.velocidad_kmh = 0;
            veh.estado_transito = 'Turno 2: En fila de espera (incorporación secuencial tras TRK-302)';
          } else {
            // Turno 3 (TRK-304): Espera 6 ciclos (~21s) en su posición de fila
            veh.queue_delay_ticks = 6;
            veh.velocidad_kmh = 0;
            veh.estado_transito = 'Turno 3: En fila de espera (incorporación secuencial tras TRK-303)';
          }
        });

        // 2. Unidades aguas arriba y despachos previos que toman el desvío preventivo anticipado vía Querétaro-Celaya-45D
        const incomingVehs = (this.masterData.vehicles || []).filter(v => 
          v.ruta_id === 'RUTA-CDMX-MTY' && 
          !['TRK-302', 'TRK-303', 'TRK-304'].includes(v.id) &&
          (v.segment_index || 0) <= 3 && 
          v.estado_operativo !== 'Descargando' && v.estado_operativo !== 'Completado'
        );

        incomingVehs.forEach(veh => {
          veh.estado_operativo = 'Reenrutado';
          veh.desvio_tipo = 'anticipado';
          veh.penalizacion_usd = 0;
          veh.velocidad_kmh = 80;
          // Respetar su progreso actual a lo largo del corredor antes del entronque de Querétaro
          veh.segment_index = Math.min(veh.segment_index || 0, 3);
          veh.subStep = 0;
          veh.estado_transito = 'Desvío preventivo anticipado vía Autopista 45D Querétaro-Celaya-Aguascalientes';
        });

        // 3. Actualizar estado de la ruta y mitigar la alerta
        const route57 = (this.masterData.routes || []).find(r => r.id === 'RUTA-CDMX-MTY');
        if (route57) {
          route57.estado = 'Reenrutada';
          route57.estado_motivo = 'Desvío vial aprobado por Autopista 45D operando con normalidad';
        }

        const alert57 = (this.masterData.alerts || []).find(a => a.id === 'ALT-57D-BLOQUEO');
        if (alert57) {
          alert57.estado = 'Mitigada';
          alert57.vehiculos_afectados_ids = [];
        }

        // Refrescar mapa y topología
        this.renderMasterTopology();
        if (route57) {
          this.drawRouteWithPins(route57);
        }

        this.rerouteSuccessMessage = '✅ ¡Desvío aprobado! Flota en congestión desalojándose 1 por 1 y tráfico entrante canalizado por 45D.';

        this.messages.push({
          role: 'ai',
          content: `### 🛣️ Estrategia de Re-enrutamiento Vial Aprobada y en Ejecución\n\n- **Desahogo Escalonado en Bloqueo (TRK-302, TRK-303, TRK-304):** Evacuación 1 por 1 con demora secuencial hacia el entronque local San Felipe a velocidad moderada (32 km/h) para evitar embudos viales y mantener espaciamiento entre pines.\n- **Desvío Preventivo Anticipado (TRK-301, TRK-305, TRK-306, TRK-307 y nuevos despachos):** Bifurcación en Querétaro hacia Celaya-Aguascalientes 45D, evitando el tramo bloqueado desde el origen.\n- **Velocidad Realista:** Aceleración gradual desde 32 km/h en desvíos locales hasta 80-84 km/h en autopista 45D.\n- **Impacto Económico:** Penalizaciones contractuales evitadas ($54,000 USD), ahorro neto $53,880 USD.\n\n*Las unidades avanzan ahora de forma escalonada por el corredor alterno hacia Monterrey.*`
        });
        this.scrollToBottom();

        setTimeout(() => {
          this.rerouteSuccessMessage = '';
        }, 7000);
      } catch (err) {
        console.error('Error al aplicar re-enrutamiento:', err);
      } finally {
        this.reroutingAnimation = false;
      }
    },

    // RESOLUCIÓN DE ALERTA: FINALIZACIÓN DE BLOQUEO Y REAPERTURA DE RUTA 57D ORIGINAL
    markAlertFinished(targetAlert) {
      this.roadblockCleared = true;

      // 1. Encontrar y actualizar la alerta
      const alert = targetAlert || this.selectedAlert || (this.masterData.alerts || []).find(a => a.id === 'ALT-57D-BLOQUEO');
      if (alert) {
        alert.estado = 'Resuelta';
        alert.tipo_incidencia = 'Bloqueo Retirado - Vía Despejada';
        alert.descripcion = 'Vía completamente liberada por Guardia Nacional y SICT. Tránsito regular restablecido en ambos sentidos en el Km 182 de la Carretera 57D.';
        alert.icono = 'mdi-check-decagram';
        alert.color = '#34A853';
        alert.severidad = 'Resuelta';
        alert.retraso_estimado_hrs = 0;
        alert.impacto_financiero_usd = 0;
        alert.vehiculos_afectados_ids = [];
      }

      // 2. Normalizar la ruta 57D original
      const route57 = (this.masterData.routes || []).find(r => r.id === 'RUTA-CDMX-MTY');
      if (route57) {
        route57.estado = 'Operativa';
        route57.estado_motivo = 'Carretera 57D reabierta en Km 182. Despachos y tránsito normalizados.';
        route57.color = '#4285F4';
        route57.dashArray = null;
      }

      // 3. Unidades en la ruta 57D que no han tomado desvíos o que aún están en tramos iniciales
      (this.masterData.vehicles || []).forEach(v => {
        if (v.ruta_id === 'RUTA-CDMX-MTY') {
          // Si estaba programado con desvío anticipado pero aún no rebasa Querétaro (segment_index <= 3)
          if (v.desvio_tipo === 'anticipado' && (v.segment_index || 0) <= 3) {
            v.desvio_tipo = null;
            v.estado_operativo = 'Normal';
            v.velocidad_kmh = 80;
            v.estado_transito = 'Continuando directamente por Carretera 57D (bloqueo retirado)';
          } else if (v.estado_operativo === 'Afectado') {
            v.estado_operativo = 'Normal';
            v.velocidad_kmh = 76;
            v.penalizacion_usd = 0;
            v.estado_transito = 'Reanudando marcha normal por Carretera 57D (vía liberada)';
          }
        }
      });

      // 4. Refrescar visualización del mapa conservando el pin de la alerta en su nuevo estado verde resuelto
      this.renderMasterTopology();
      if (route57) {
        this.drawRouteWithPins(route57);
      }

      // 5. Notificación y mensaje de análisis al panel del Agente Copiloto IA
      this.rerouteSuccessMessage = '🛣️ ¡Vía Liberada! Guardia Nacional retira el bloqueo en Km 182 de Carretera 57D. Los nuevos transportes fluyen por la ruta original.';

      this.messages.push({
        role: 'ai',
        content: `### 🟢 Actualización Vial en Vivo: Bloqueo Retirado en Km 182 (Carretera 57D)\n\n- **Estatus de la Vía:** La Guardia Nacional y la SICT han concluido las labores y despejado la circulación en ambos sentidos del Km 182.\n- **Ruta Troncal Original:** Restablecida como corredor principal. Todos los **nuevos transportes despachados** desde CEDIS Cuautitlán circularán directamente por la **Carretera 57D**.\n- **Unidades en Tránsito Previo:** Los transportes que no alcanzaron a desviarse continúan por la 57D sin demoras adicionales.\n- **Unidades en Desvío 45D:** Aquellas que ya habían ingresado a la Autopista 45D (\`TRK-302\`, \`TRK-303\`, \`TRK-304\`) completan su recorrido con seguridad hacia Apodaca.\n- **Registro Informativo:** El pin en el Km 182 se mantiene en verde en el mapa para fines de trazabilidad e información.`
      });
      this.scrollToBottom();

      setTimeout(() => {
        this.rerouteSuccessMessage = '';
      }, 7000);
    },

    // REACTIVACIÓN DE ALERTA: RESTABLECER ESTADO ORIGINAL DE BLOQUEO PARA REPETIR DEMO
    reactivateAlert(targetAlert) {
      this.roadblockCleared = false;
      this.rerouteApproved = false;
      this.reroutingAnimation = false;

      // 1. Restaurar alerta ALT-57D-BLOQUEO a su estado crítico original
      const alert = targetAlert || this.selectedAlert || (this.masterData.alerts || []).find(a => a.id === 'ALT-57D-BLOQUEO');
      if (alert) {
        alert.estado = 'Activa';
        alert.tipo_incidencia = 'Bloqueo Carretero por Manifestación y Obras';
        alert.descripcion = 'Cierre total en ambos sentidos en el Km 182 del tramo Querétaro - San Luis Potosí. Tiempo estimado de resolución indefinido.';
        alert.icono = 'mdi-alert-octagon';
        alert.color = '#EA4335';
        alert.severidad = 'Crítica';
        alert.retraso_estimado_hrs = 8.0;
        alert.impacto_financiero_usd = 54000;
        alert.vehiculos_afectados_ids = ['TRK-302', 'TRK-303', 'TRK-304'];
      }

      // 2. Restaurar corredor troncal 57D a estado Disrumpido
      const route57 = (this.masterData.routes || []).find(r => r.id === 'RUTA-CDMX-MTY');
      if (route57) {
        route57.estado = 'Disrumpida';
        route57.estado_motivo = 'Bloqueo carretero y obras en Km 182 Querétaro - SLP';
        route57.color = '#EA4335';
        route57.dashArray = '6, 6';
        if (route57.alternativa) {
          this.activeConsideration = {
            ...route57.alternativa,
            ruta_origen_id: route57.id,
            ruta_origen_nombre: route57.nombre
          };
        }
      }

      // 3. Restaurar las 3 unidades retenidas en Km 182 (TRK-302, TRK-303, TRK-304)
      const stuckConfigs = {
        'TRK-302': {
          posicion_actual: { lat: 21.1619, lon: -100.9300 },
          progreso_pct: 48,
          velocidad_kmh: 0,
          penalizacion_usd: 24000,
          estado_transito: 'Detenido al frente del bloqueo carretero en Km 182',
          estado_operativo: 'Afectado',
          desvio_tipo: null,
          segment_index: 4,
          subStep: 0,
          queue_delay_ticks: 0,
          dockTicks: 0
        },
        'TRK-303': {
          posicion_actual: { lat: 21.1350, lon: -100.9150 },
          progreso_pct: 46,
          velocidad_kmh: 0,
          penalizacion_usd: 18000,
          estado_transito: 'Detenido en fila de espera (Posición 2 detrás de TRK-302)',
          estado_operativo: 'Afectado',
          desvio_tipo: null,
          segment_index: 4,
          subStep: 0,
          queue_delay_ticks: 0,
          dockTicks: 0
        },
        'TRK-304': {
          posicion_actual: { lat: 21.1080, lon: -100.9000 },
          progreso_pct: 44,
          velocidad_kmh: 0,
          penalizacion_usd: 12000,
          estado_transito: 'Detenido en fila de espera (Posición 3 detrás de TRK-303)',
          estado_operativo: 'Afectado',
          desvio_tipo: null,
          segment_index: 4,
          subStep: 0,
          queue_delay_ticks: 0,
          dockTicks: 0
        }
      };

      Object.keys(stuckConfigs).forEach(unitId => {
        let veh = (this.masterData.vehicles || []).find(v => v.id === unitId);
        if (veh) {
          Object.assign(veh, stuckConfigs[unitId]);
        } else {
          veh = {
            id: unitId,
            nombre: `Transporte ${unitId}`,
            conductor: unitId === 'TRK-302' ? 'Enrique Salgado' : (unitId === 'TRK-303' ? 'Daniel Treviño' : 'Salvador Garza'),
            ruta_id: 'RUTA-CDMX-MTY',
            origen: 'CEDIS Central Cuautitlán (CDMX)',
            destino: 'CEDIS Macro Norte Apodaca (MTY)',
            fecha_hora_salida: '27 Sep 2026, 06:00 hrs',
            eta_llegada: '27 Sep 2026, 16:30 hrs',
            carga: unitId === 'TRK-302' ? 'Bobinas de Acero Automotriz (34 Tons)' : (unitId === 'TRK-303' ? 'Placas de Acero Rolado' : 'Perfiles Estructurales'),
            peso_ton: 32,
            especificaciones: 'Carga pesada industrial con amarre tensor certificado',
            cliente: unitId === 'TRK-302' ? 'Industrias Metálicas del Norte' : (unitId === 'TRK-303' ? 'Fábricas de Acero Monterrey' : 'Ternium México'),
            ...stuckConfigs[unitId]
          };
          this.masterData.vehicles.push(veh);
        }
      });

      // Restaurar demás vehículos en RUTA-CDMX-MTY a tránsito normal sin desvío
      (this.masterData.vehicles || []).forEach(v => {
        if (v.ruta_id === 'RUTA-CDMX-MTY' && !['TRK-302', 'TRK-303', 'TRK-304'].includes(v.id)) {
          if (v.desvio_tipo) {
            v.desvio_tipo = null;
          }
          if (v.estado_operativo === 'Reenrutado') {
            v.estado_operativo = 'Normal';
            v.velocidad_kmh = 80;
            v.estado_transito = 'En tránsito regular hacia Monterrey';
          }
        }
      });

      // 4. Seleccionar la alerta y enfocar corredor
      this.selectedEntity = 'alert';
      this.selectedAlert = alert;
      this.selectedVehicle = null;
      this.selectedWarehouse = null;
      this.selectedRoute = route57;
      this.activeRouteId = route57 ? route57.id : 'RUTA-CDMX-MTY';

      // 5. Refrescar mapa y topología
      this.renderMasterTopology();
      if (route57) {
        this.drawRouteWithPins(route57);
      }

      // 6. Centrar la cámara en la zona del bloqueo con margen inferior para la tarjeta
      this.$nextTick(() => {
        if (this.map && alert) {
          this.map.invalidateSize();
          this.map.flyTo([alert.lat, alert.lon], 8, { duration: 0.6 });
        }
      });

      // 7. Notificación y mensaje de análisis al panel del Agente Copiloto IA
      this.rerouteSuccessMessage = '🚨 Alerta reactivada: Bloqueo en Km 182 restablecido y 3 unidades en riesgo.';

      this.messages.push({
        role: 'ai',
        content: `### 🚨 Alerta Vial Reactivada: Bloqueo Carretero en Km 182 (Carretera 57D)\n\n- **Situación:** Se ha reactivado la simulación de bloqueo vial en el Km 182 del tramo Querétaro - San Luis Potosí.\n- **Flota en Riesgo:** 3 tractocamiones detenidos (\`TRK-302\`, \`TRK-303\`, \`TRK-304\`).\n- **Impacto Económico:** Penalizaciones contractuales por SLA acumulando **$54,000 USD**.\n- **Acción Disponible:** Proceder con el **Paso 1: Aprobar Desvío por Autopista 45D** para repetir la demostración.`
      });
      this.scrollToBottom();

      setTimeout(() => {
        this.rerouteSuccessMessage = '';
      }, 7000);
    },

    // GENERADOR DE FLUJO CONTROLADO: DESPACHO CONTINUO RESPETANDO CUPO MÁXIMO POR CORREDOR
    spawnContinuousUnit(routeId) {
      const route = (this.masterData.routes || []).find(r => r.id === routeId);
      if (!route || !route.coordenadas || route.coordenadas.length === 0) return;

      // 1. Validar límite máximo de unidades por ruta (entre 15 y 18 unidades)
      const maxUnits = route.max_unidades || 18;
      const activeUnitsOnRoute = (this.masterData.vehicles || []).filter(v => 
        v.ruta_id === route.id && v.estado_operativo !== 'Completado'
      ).length;

      if (activeUnitsOnRoute >= maxUnits) {
        return; // Límite máximo alcanzado; no despachar más unidades
      }

      // 2. Control en rutas impactadas: si la ruta sufre un bloqueo activo sin desvío aprobado ni reapertura,
      // el CEDIS origen retiene despachos y no crea unidades de forma infinita hacia el retén
      const isBlockedCorridor = !this.rerouteApproved && !this.roadblockCleared && 
        (route.id === 'RUTA-CDMX-MTY' || route.estado === 'Disrumpida');
      if (isBlockedCorridor) {
        return;
      }

      this.unitCounter = (this.unitCounter || 310) + 1;
      const newId = `TRK-${this.unitCounter}`;
      
      const cargoCatalog = [
        { carga: "Semiconductores y Módulos ECU", peso_ton: 18, especificaciones: "Control térmico 18-22°C y suspensión neumática", cliente: "Continental Automotive México" },
        { carga: "Insumos Médicos y Cadena Fría Farma", peso_ton: 14, especificaciones: "Termógrafo certificado NOM-059 JIT", cliente: "Farmacias del Ahorro / Genomma Lab" },
        { carga: "Paquetería Express E-commerce Fulfillment", peso_ton: 22, especificaciones: "Consolidación LTL para entrega última milla", cliente: "Amazon Logistics MX" },
        { carga: "Arneses Automotrices para Armadoras", peso_ton: 24, especificaciones: "Contenedores colapsables con etiqueta RFID", cliente: "Kia Motors México" },
        { carga: "Electrónica de Consumo y Pantallas", peso_ton: 20, especificaciones: "Carga de alto valor con custodia satelital Dual-SIM", cliente: "Samsung Electronics" },
        { carga: "Alimentos Refrigerados Perecederos", peso_ton: 26, especificaciones: "Caja refrigerada -18°C con telemetría IoT", cliente: "Sigma Alimentos" }
      ];
      const cargoItem = cargoCatalog[Math.floor(Math.random() * cargoCatalog.length)];
      
      const isReroutedCorridor = this.rerouteApproved && !this.roadblockCleared && route.id === 'RUTA-CDMX-MTY';
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} hrs`;

      const newUnit = {
        id: newId,
        nombre: `Tractocamión ${newId} (Freightliner Cascadia 2026)`,
        ruta_id: route.id,
        origen: route.origen_nombre,
        destino: route.destino_nombre,
        fecha_hora_salida: `Hoy, ${timeStr}`,
        eta_llegada: `Hoy +${Math.round(route.tiempo_base_hrs)}h`,
        posicion_actual: { lat: route.coordenadas[0][0], lon: route.coordenadas[0][1] },
        progreso_pct: 0,
        velocidad_kmh: 82,
        estado_operativo: isReroutedCorridor ? 'Reenrutado' : 'Normal',
        desvio_tipo: isReroutedCorridor ? 'anticipado' : null,
        estado_transito: isReroutedCorridor 
          ? 'Despachado con desvío anticipado programado vía Autopista 45D' 
          : (this.roadblockCleared && route.id === 'RUTA-CDMX-MTY'
              ? 'Despachado por Carretera 57D original (vía liberada)'
              : 'Despacho reciente desde andén de salida del CEDIS'),
        carga: cargoItem.carga,
        peso_ton: cargoItem.peso_ton,
        cliente: cargoItem.cliente,
        conductor: "Operador de Línea Federal Certificado",
        especificaciones: cargoItem.especificaciones,
        segment_index: 0,
        subStep: 0,
        dockTicks: 0,
        penalizacion_usd: 0
      };

      this.masterData.vehicles.push(newUnit);
      this.simulationTick = (this.simulationTick || 0) + 1;

      // Si la ruta no está filtrada o coincide con la activa, crear marcador en el mapa
      if (!this.activeRouteId || this.activeRouteId === route.id) {
        this.createVehicleMarker(newUnit);
      }
    },

    askLogisticaPrompt(promptText) {
      this.userInput = promptText;
      this.$nextTick(() => {
        const inputEl = document.querySelector('input[placeholder*="Pregunta a la Torre de Control"]');
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

        if (data.action_payload && data.action_payload.action === 'suggest_reroute') {
          const act = data.action_payload;
          const matchingRoute = (this.masterData.routes || []).find(r => r.id === act.route_id);
          if (matchingRoute) {
            this.selectedRoute = matchingRoute;
            this.activeRouteId = matchingRoute.id;
            this.drawRouteWithPins(matchingRoute);
            this.renderMasterTopology();
            const veh = (this.masterData.vehicles || []).find(v => v.id === (act.vehicle_ids ? act.vehicle_ids[0] : null));
            if (veh) {
              this.selectedEntity = 'vehicle';
              this.selectedVehicle = veh;
            }
          }
        }
      } catch (error) {
        console.error('Error en Agente de Logística:', error);
        const errDetail = error.response?.data?.detail || error.message || 'Error de conexión con la Torre de Control.';
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
      if (!text) return '';
      // Normalizar secuencias literales de escape como '\n\n', '\n' o '\r'
      let cleaned = String(text)
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '');
      let html = marked.parse(cleaned);
      // Envolver tablas en contenedor responsivo con scroll y bordes estilizados
      return html
        .replace(/<table>/g, '<div class="table-container-responsive"><table>')
        .replace(/<\/table>/g, '</table></div>');
    }
  }
};
