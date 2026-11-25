<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  resolveEventImageUrl,
  parseEventLocalDate,
  getTomorrowStart,
  isPublishedEvent
} from '../../utils/image'

const props = defineProps<{
  selectedYear: number | null
  selectedMonth: number | null
}>()

interface EventType {
  id: number
  name: string
}

interface EventItem {
  id: number
  title: string
  slug: string
  dateLabel: string
  datePill: string
  desc: string
  time: string
  endTime: string
  location: string
  address: string
  modality: 'in_person' | 'virtual'
  imageUrl: string
  category: string
  eventTypeId: number | null
  day: string
  monthShort: string
  dateObj: Date | null
}

const events = ref<EventItem[]>([])
const upcomingEvents = ref<EventItem[]>([])
const isLoadingUpcoming = ref(true)
const eventTypes = ref<EventType[]>([])
const selectedEventTypeId = ref<number | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const brokenImageIds = ref<Record<number, boolean>>({})

const monthShortNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const mapRawEvent = (item: any, fallbackYear?: number | null): EventItem => {
  let day = '01'
  let monthNum = 1
  let yearStr = String(fallbackYear || new Date().getFullYear())
  let timeLabel = item.start_time || 'Por confirmar'

  if (item.start_date && item.start_date.includes('/')) {
    const dateParts = item.start_date.split('/')
    day = (dateParts[0] || '01').padStart(2, '0')
    monthNum = parseInt(dateParts[1], 10) || 1
    yearStr = dateParts[2] || yearStr
  } else if (item.start_datetime) {
    const [datePart, timePart] = item.start_datetime.split(' ')
    if (datePart) {
      const dateParts = datePart.split('-')
      if (dateParts.length === 3) {
        yearStr = dateParts[0] || yearStr
        monthNum = parseInt(dateParts[1], 10) || 1
        day = (dateParts[2] || '01').padStart(2, '0')
      }
    }
    if (timePart && !item.start_time) {
      const timeParts = timePart.split(':')
      if (timeParts.length >= 2) {
        timeLabel = `${timeParts[0]}:${timeParts[1]} hrs`
      }
    }
  }

  const monthShort = monthShortNames[monthNum - 1] || 'Ene'
  const monthFull = monthNames[monthNum - 1] || 'Enero'
  const datePill = `${day} de ${monthFull}, ${yearStr}`
  const dateLabel = `${datePill} • ${timeLabel}`

  return {
    id: item.id,
    title: item.name || item.title || 'Sin título',
    slug: item.slug || '',
    dateLabel,
    datePill,
    desc: item.description || item.short_description || 'Sin descripción disponible.',
    time: timeLabel,
    endTime: item.end_time || '',
    location:
      item.modality === 'virtual'
        ? 'Transmisión Virtual'
        : item.venue_name || 'Casa Palotinos',
    address: item.address || '',
    modality: item.modality === 'virtual' ? 'virtual' : 'in_person',
    imageUrl: resolveEventImageUrl(item.image || item.banner_image_url),
    category: item.event_type?.name || (item.modality === 'virtual' ? 'Virtual' : 'Encuentro'),
    eventTypeId: item.event_type?.id ?? null,
    day,
    monthShort,
    dateObj: parseEventLocalDate(item.start_date, item.start_datetime)
  }
}

const fetchEventTypes = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/event-types`
    const key = import.meta.env.VITE_API_KEY
    if (!url || !key) return

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': key
      }
    })

    if (!response.ok) return

    const resJson = await response.json()
    const rawTypes = Array.isArray(resJson) ? resJson : resJson.data || []
    eventTypes.value = rawTypes.map((t: any) => ({
      id: t.id,
      name: t.name
    }))
  } catch (error) {
    console.error('Error fetching event types:', error)
  }
}

const fetchUpcomingEvents = async () => {
  isLoadingUpcoming.value = true
  try {
    const apiBase = import.meta.env.VITE_API_URL
    const key = import.meta.env.VITE_API_KEY
    if (!apiBase || !key) {
      isLoadingUpcoming.value = false
      return
    }

    const headers = {
      'Accept': 'application/json',
      'X-API-KEY': key
    }

    const tomorrow = getTomorrowStart()
    const tomorrowYearMonthKey = tomorrow.getFullYear() * 100 + (tomorrow.getMonth() + 1)

    // 1. Get all active year-months from backend to query every future month with events
    const activeMonthsRes = await fetch(`${apiBase}configuration/events/active-months`, {
      method: 'GET',
      headers
    })

    const targetPeriods: { year: number; month: number }[] = []

    if (activeMonthsRes.ok) {
      const activeJson = await activeMonthsRes.json()
      const payload = activeJson?.data ?? activeJson

      const collectPeriod = (yearVal: any, rawMonths: any) => {
        const y = parseInt(String(yearVal ?? ''), 10)
        if (!Number.isInteger(y) || !Array.isArray(rawMonths)) return
        for (const m of rawMonths) {
          const mNum =
            typeof m === 'object' && m !== null
              ? parseInt(String(m.month ?? m.number ?? m.id ?? ''), 10)
              : parseInt(String(m), 10)
          if (Number.isInteger(mNum) && mNum >= 1 && mNum <= 12) {
            if (y * 100 + mNum >= tomorrowYearMonthKey) {
              targetPeriods.push({ year: y, month: mNum })
            }
          }
        }
      }

      if (Array.isArray(payload)) {
        for (const item of payload) {
          collectPeriod(item?.year, item?.months)
        }
      } else if (payload && typeof payload === 'object') {
        for (const [yearKey, monthsVal] of Object.entries(payload)) {
          collectPeriod(yearKey, monthsVal)
        }
      }
    }

    // Sort chronologically and check up to the next 6 active months
    targetPeriods.sort((a, b) => a.year * 100 + a.month - (b.year * 100 + b.month))
    const periodsToFetch = targetPeriods.slice(0, 6)

    // Fallback: always include tomorrow's month if active-months didn't return any future period
    if (periodsToFetch.length === 0) {
      periodsToFetch.push({ year: tomorrow.getFullYear(), month: tomorrow.getMonth() + 1 })
    }

    // 2. Fetch events for those future months in parallel
    const responses = await Promise.all(
      periodsToFetch.map((p) =>
        fetch(`${apiBase}configuration/events/filter?year=${p.year}&month=${p.month}`, {
          method: 'GET',
          headers
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    )

    // Deduplicate by event ID, keep strictly >= tomorrow (day after today), sort ascending
    const seenIds = new Set<number>()
    const collected: EventItem[] = []

    for (let i = 0; i < responses.length; i++) {
      const resJson = responses[i]
      if (!resJson) continue
      const rawEvents = Array.isArray(resJson) ? resJson : resJson.data || []
      const period = periodsToFetch[i]
      for (const item of rawEvents) {
        if (!isPublishedEvent(item)) continue
        if (item?.id && seenIds.has(item.id)) continue
        const mapped = mapRawEvent(item, period?.year)
        if (mapped.dateObj && mapped.dateObj.getTime() >= tomorrow.getTime()) {
          if (mapped.id) seenIds.add(mapped.id)
          collected.push(mapped)
        }
      }
    }

    upcomingEvents.value = collected
      .sort((a, b) => (a.dateObj?.getTime() || 0) - (b.dateObj?.getTime() || 0))
      .slice(0, 6)
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    upcomingEvents.value = []
  } finally {
    isLoadingUpcoming.value = false
  }
}

const fetchEvents = async () => {
  if (props.selectedYear === null || props.selectedMonth === null) {
    isLoading.value = false
    return
  }

  isLoading.value = true
  hasError.value = false
  brokenImageIds.value = {}

  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/events/filter?year=${props.selectedYear}&month=${props.selectedMonth}`
    const key = import.meta.env.VITE_API_KEY

    if (!url || !key) {
      throw new Error('API config missing')
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': key
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch filtered events')
    }

    const resJson = await response.json()
    const rawEvents = Array.isArray(resJson) ? resJson : resJson.data || []

    events.value = rawEvents
      .filter(isPublishedEvent)
      .map((item: any) => mapRawEvent(item, props.selectedYear))
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching filtered events:', error)
    hasError.value = true
    events.value = []
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEventTypes()
  fetchUpcomingEvents()
  fetchEvents()
})

watch(
  () => [props.selectedYear, props.selectedMonth],
  () => {
    selectedEventTypeId.value = null
    fetchEvents()
  }
)

const availableEventTypes = computed(() => {
  const presentIds = new Set(
    events.value
      .map((ev) => ev.eventTypeId)
      .filter((id): id is number => id !== null)
  )
  return eventTypes.value.filter((type) => presentIds.has(type.id))
})

const filteredEvents = computed(() => {
  if (selectedEventTypeId.value === null) return events.value
  return events.value.filter((ev) => ev.eventTypeId === selectedEventTypeId.value)
})

const hasVisibleEvents = computed(() => filteredEvents.value.length > 0)

const handleImageError = (eventId: number) => {
  brokenImageIds.value = { ...brokenImageIds.value, [eventId]: true }
}

const openEventDetail = (slug: string) => {
  if (!slug) return
  window.location.hash = `#events/${slug}`
}
</script>

<template>
  <div class="font-jakarta">
    <!-- Main Soft Mint Content Card (Continues seamlessly from EventsHeroSection) -->
    <section class="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-20 z-10">
      <div
        class="bg-[#F2F7F6] rounded-b-[2.5rem] px-6 sm:px-8 md:px-14 pt-2 pb-10 sm:pb-12 md:pb-14 border-x border-b border-[#1b4d4f]/10 shadow-xl shadow-[#1b4d4f]/5"
      >
        <!-- Event Types / Categories Filter Pills (only categories that have events in this period) -->
        <div
          v-if="!isLoading && availableEventTypes.length > 0"
          class="flex flex-wrap items-center gap-2 pb-6"
        >
          <button
            type="button"
            @click="selectedEventTypeId = null"
            :class="[
              'px-4 py-1.5 rounded-[9999px] font-headline text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap smooth-transition cursor-pointer active:scale-95',
              selectedEventTypeId === null
                ? 'bg-[#007681] text-white shadow-sm'
                : 'bg-white text-[#1b4d4f]/75 border border-[#1b4d4f]/15 hover:border-[#007681] hover:text-[#007681]'
            ]"
          >
            Todos los tipos
          </button>
          <button
            v-for="type in availableEventTypes"
            :key="type.id"
            type="button"
            @click="selectedEventTypeId = type.id"
            :class="[
              'px-4 py-1.5 rounded-[9999px] font-headline text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap smooth-transition cursor-pointer active:scale-95',
              selectedEventTypeId === type.id
                ? 'bg-[#007681] text-white shadow-sm'
                : 'bg-white text-[#1b4d4f]/75 border border-[#1b4d4f]/15 hover:border-[#007681] hover:text-[#007681]'
            ]"
          >
            {{ type.name }}
          </button>
        </div>

        <transition name="fade" mode="out-in">
          <!-- Loading State (3 Portrait Skeleton Cards) -->
          <div v-if="isLoading" key="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="n in 3"
              :key="n"
              class="bg-white rounded-3xl p-4 sm:p-5 border border-[#1b4d4f]/10 animate-pulse flex flex-col"
            >
              <div class="w-full aspect-[4/5] rounded-2xl bg-[#1b4d4f]/10 mb-5"></div>
              <div class="space-y-3 px-1">
                <div class="h-6 bg-[#1b4d4f]/10 rounded-lg w-3/4"></div>
                <div class="h-4 bg-[#1b4d4f]/10 rounded w-full"></div>
                <div class="h-4 bg-[#1b4d4f]/10 rounded w-5/6"></div>
              </div>
              <div class="mt-6 h-11 bg-[#1b4d4f]/10 rounded-[9999px] w-full"></div>
            </div>
          </div>

          <!-- Loaded 3-Column Portrait Event Cards (Full-card clickable -> #events/{slug}) -->
          <div
            v-else-if="hasVisibleEvents"
            key="loaded"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <article
              v-for="(event, idx) in filteredEvents"
              :key="event.id"
              v-reveal="{ direction: 'up', delay: idx * 70 }"
              v-tilt="{ max: 4, lift: 6 }"
              @click="openEventDetail(event.slug)"
              class="group flex flex-col bg-white rounded-3xl p-4 sm:p-5 border border-[#1b4d4f]/10 shadow-sm hover:shadow-xl smooth-transition cursor-pointer"
            >
              <!-- Portrait Visual Header -->
              <div class="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-[#12383A]">
                <img
                  v-if="event.imageUrl && !brokenImageIds[event.id]"
                  v-parallax="{ range: 24, scale: 1.12 }"
                  :alt="event.title"
                  :src="event.imageUrl"
                  @error="handleImageError(event.id)"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1b4d4f] via-[#12383A] to-[#007681] p-6 text-center"
                >
                  <div
                    class="w-16 h-16 rounded-[9999px] bg-white/10 border border-white/15 flex items-center justify-center mb-3"
                  >
                    <span class="material-symbols-outlined text-4xl text-[#d49e35]">event</span>
                  </div>
                  <span class="font-headline text-[11px] uppercase tracking-widest text-white/60 font-bold">
                    Resucitados RCC
                  </span>
                </div>

                <!-- Gradient Scrim -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-[#1b4d4f]/95 via-black/30 to-transparent pointer-events-none"
                ></div>

                <!-- Category & Modality Pill Badges -->
                <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span
                    class="inline-flex items-center px-3.5 py-1.5 rounded-[9999px] font-headline text-[11px] font-extrabold uppercase tracking-wider bg-white text-[#1b4d4f] shadow-md truncate max-w-[65%]"
                  >
                    {{ event.category }}
                  </span>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-[9999px] font-headline text-[10px] font-bold uppercase tracking-wider bg-[#1b4d4f]/80 backdrop-blur-md text-white border border-white/20 shrink-0"
                  >
                    {{ event.modality === 'virtual' ? 'Virtual' : 'Presencial' }}
                  </span>
                </div>

                <!-- Date & Location Overlay -->
                <div class="absolute bottom-4 left-4 right-4 text-white">
                  <span
                    class="inline-block font-headline text-[11px] font-extrabold tracking-widest uppercase bg-[#d49e35] text-[#1b4d4f] px-3 py-0.5 rounded-[9999px] mb-1.5"
                  >
                    {{ event.datePill }}
                  </span>
                  <p class="text-sm font-medium text-white/95 flex items-center gap-1.5 truncate">
                    <span class="material-symbols-outlined text-sm text-[#d49e35] shrink-0">
                      {{ event.modality === 'virtual' ? 'laptop_mac' : 'schedule' }}
                    </span>
                    <span class="truncate">{{ event.time }} • {{ event.location }}</span>
                  </p>
                </div>
              </div>

              <!-- Card Content -->
              <div class="flex flex-col flex-grow px-1">
                <h2
                  class="font-headline font-bold text-xl sm:text-2xl text-[#1c2424] group-hover:text-[#1b4d4f] smooth-transition leading-tight mb-2.5"
                >
                  {{ event.title }}
                </h2>
                <p class="text-[#1c2424]/70 text-sm leading-relaxed font-normal line-clamp-3 mb-6">
                  {{ event.desc }}
                </p>

                <div class="mt-auto pt-2">
                  <a
                    :href="'#events/' + event.slug"
                    @click.stop
                    class="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-[9999px] font-headline text-xs font-extrabold uppercase tracking-wider bg-[#1b4d4f] text-white group-hover:bg-[#007681] smooth-transition shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>Ver detalles</span>
                    <span
                      class="material-symbols-outlined text-sm group-hover:translate-x-1 smooth-transition"
                    >
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
            </article>
          </div>

          <!-- Empty / Error State -->
          <div
            v-else
            key="empty"
            class="text-center py-16 bg-white rounded-3xl border border-[#1b4d4f]/10 max-w-xl mx-auto p-10 shadow-sm"
          >
            <div
              class="w-16 h-16 rounded-[9999px] bg-[#eaf2f1] text-[#1b4d4f] flex items-center justify-center mx-auto mb-4"
            >
              <span class="material-symbols-outlined text-4xl">event_busy</span>
            </div>
            <h3 class="font-headline text-2xl font-extrabold text-[#1b4d4f]">
              {{
                hasError
                  ? 'No pudimos cargar los eventos'
                  : selectedEventTypeId !== null
                    ? 'Sin eventos en esta categoría'
                    : 'Sin Eventos en este Mes'
              }}
            </h3>
            <p class="text-[#404848] text-sm sm:text-base mt-2 leading-relaxed">
              {{
                hasError
                  ? 'Ocurrió un problema al consultar el calendario. Intenta nuevamente en unos momentos.'
                  : selectedEventTypeId !== null
                    ? 'No hay eventos de este tipo en el mes seleccionado. Prueba viendo todos los tipos o cambiando de mes.'
                    : `No hay eventos programados para ${selectedMonth ? monthNames[selectedMonth - 1] : 'este mes'}. Te invitamos a explorar otros meses del calendario.`
              }}
            </p>
            <button
              v-if="selectedEventTypeId !== null"
              type="button"
              @click="selectedEventTypeId = null"
              class="mt-5 px-6 py-2.5 rounded-[9999px] bg-[#1b4d4f] text-white font-headline text-xs font-extrabold uppercase tracking-wider hover:bg-[#007681] smooth-transition cursor-pointer"
            >
              Ver todos los tipos
            </button>
          </div>
        </transition>

        <!-- Outlined Editorial Typography Transition Strip -->
        <div class="py-8 my-10 border-y border-[#1b4d4f]/10 overflow-hidden select-none">
          <div class="animate-marquee-slow">
            <span
              class="text-2xl sm:text-3xl md:text-4xl font-headline font-black uppercase tracking-tight outline-teal whitespace-nowrap pr-10"
            >
              ORACIÓN • COMUNIDAD • MISIÓN • ENCUENTRO • ESPÍRITU •
            </span>
            <span
              class="text-2xl sm:text-3xl md:text-4xl font-headline font-black uppercase tracking-tight outline-teal whitespace-nowrap pr-10"
              aria-hidden="true"
            >
              ORACIÓN • COMUNIDAD • MISIÓN • ENCUENTRO • ESPÍRITU •
            </span>
          </div>
        </div>

        <!-- Próximas Fechas / Otros Encuentros (Real upcoming events from tomorrow onward) -->
        <div>
          <div
            v-reveal="{ direction: 'up', delay: 60 }"
            class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8"
          >
            <div>
              <p class="font-headline text-xs uppercase tracking-[0.2em] text-[#d49e35] font-extrabold mb-1">
                Próximas Fechas
              </p>
              <h3 class="font-headline text-3xl md:text-4xl text-[#1b4d4f] font-extrabold tracking-tight">
                Otros Encuentros
              </h3>
            </div>
            <a
              href="#contact"
              class="inline-flex items-center gap-2 font-headline text-xs md:text-sm font-bold uppercase tracking-wider text-[#1b4d4f] hover:text-[#007681] smooth-transition"
            >
              <span>Consultar horarios</span>
              <span class="material-symbols-outlined text-base">arrow_outward</span>
            </a>
          </div>

          <!-- Loading Skeletons -->
          <div v-if="isLoadingUpcoming" class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div
              v-for="n in 3"
              :key="n"
              class="bg-white p-7 rounded-3xl border border-[#1b4d4f]/10 space-y-4"
            >
              <div class="flex justify-between items-center">
                <div class="h-6 w-24 bg-[#1b4d4f]/10 rounded-[9999px]"></div>
                <div class="h-8 w-10 bg-[#1b4d4f]/10 rounded"></div>
              </div>
              <div class="h-6 w-3/4 bg-[#1b4d4f]/10 rounded"></div>
              <div class="h-4 w-1/2 bg-[#1b4d4f]/10 rounded"></div>
            </div>
          </div>

          <!-- Upcoming Events Grid (strictly >= tomorrow) -->
          <div v-else-if="upcomingEvents.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="(item, idx) in upcomingEvents"
              :key="item.id"
              v-reveal="{ direction: 'up', delay: idx * 80 }"
              @click="openEventDetail(item.slug)"
              class="bg-white p-7 rounded-3xl border border-[#1b4d4f]/10 hover:border-[#1b4d4f]/40 shadow-sm hover:shadow-lg smooth-transition hover:-translate-y-1 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center justify-between gap-3 mb-5">
                  <span
                    class="font-headline text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-[9999px] bg-[#eaf2f1] text-[#1b4d4f] border border-[#1b4d4f]/10 truncate max-w-[70%]"
                  >
                    {{ item.category }}
                  </span>
                  <div class="text-right shrink-0">
                    <span class="text-3xl font-headline font-black text-[#1b4d4f] block leading-none">
                      {{ item.day }}
                    </span>
                    <span
                      class="font-headline text-[10px] uppercase text-[#d49e35] font-extrabold tracking-widest block mt-0.5"
                    >
                      {{ item.monthShort }}
                    </span>
                  </div>
                </div>

                <h4
                  class="font-headline font-bold text-xl text-[#1c2424] group-hover:text-[#1b4d4f] smooth-transition mb-2 leading-snug"
                >
                  {{ item.title }}
                </h4>
                <p class="text-xs sm:text-sm text-[#1c2424]/70 mb-5 font-normal flex items-center gap-1.5 truncate">
                  <span class="material-symbols-outlined text-sm text-[#1b4d4f] shrink-0">
                    {{ item.modality === 'virtual' ? 'laptop_mac' : 'location_on' }}
                  </span>
                  <span class="truncate">{{ item.location }} • {{ item.time }}</span>
                </p>
              </div>

              <a
                :href="'#events/' + item.slug"
                @click.stop
                class="inline-flex items-center gap-1.5 font-headline text-xs font-bold uppercase tracking-wider text-[#1b4d4f] group-hover:text-[#007681] smooth-transition"
              >
                <span>Más información</span>
                <span
                  class="material-symbols-outlined text-sm group-hover:translate-x-1 smooth-transition"
                >
                  arrow_forward
                </span>
              </a>
            </div>
          </div>

          <!-- Empty Upcoming State -->
          <div
            v-else
            class="bg-white rounded-3xl p-8 border border-[#1b4d4f]/10 text-center text-sm text-[#404848]"
          >
            No hay próximos encuentros programados a partir de mañana por el momento.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
