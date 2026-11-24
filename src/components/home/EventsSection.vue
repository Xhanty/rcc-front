<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { resolveEventImageUrl, parseEventLocalDate, getTomorrowStart } from '../../utils/image'

interface RCCEvent {
  id: number
  title: string
  slug: string
  dateDay: string
  dateMonth: string
  time: string
  location: string
  imageUrl: string
  alt: string
  dateObj: Date | null
}

const events = ref<RCCEvent[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const brokenImageIds = ref<Record<number, boolean>>({})

const handleImageError = (eventId: number) => {
  brokenImageIds.value = { ...brokenImageIds.value, [eventId]: true }
}

const openEventDetail = (slug: string) => {
  if (!slug) return
  window.location.hash = `#events/${slug}`
}

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const mapRawHomeEvent = (item: any): RCCEvent => {
  let day = '01'
  let monthAbbr = 'Ene'
  let timeLabel = item.start_time || 'Por confirmar'

  if (item.start_date && item.start_date.includes('/')) {
    const dateParts = item.start_date.split('/')
    day = (dateParts[0] || '01').padStart(2, '0')
    const monthNum = parseInt(dateParts[1], 10) || 1
    monthAbbr = monthNames[monthNum - 1] || 'Ene'
  } else if (item.start_datetime) {
    const parts = item.start_datetime.split(' ')
    if (parts.length >= 1) {
      const dateParts = parts[0].split('-')
      if (dateParts.length === 3) {
        day = (dateParts[2] || '01').padStart(2, '0')
        const monthNum = parseInt(dateParts[1], 10) || 1
        monthAbbr = monthNames[monthNum - 1] || 'Ene'
      }
    }
    if (parts.length >= 2 && !item.start_time) {
      const timeParts = parts[1].split(':')
      if (timeParts.length >= 2) {
        timeLabel = `${timeParts[0]}:${timeParts[1]} hrs`
      }
    }
  }

  return {
    id: item.id,
    title: item.title || item.name || 'Sin título',
    slug: item.slug || '',
    dateDay: day,
    dateMonth: monthAbbr,
    time: timeLabel,
    location:
      item.modality === 'virtual'
        ? 'Transmisión Virtual'
        : item.venue_name || 'Medellín',
    imageUrl: resolveEventImageUrl(item.image || item.banner_image_url),
    alt: item.title || item.name || 'Evento',
    dateObj: parseEventLocalDate(item.start_date, item.start_datetime)
  }
}

const fetchEvents = async () => {
  try {
    const apiBase = import.meta.env.VITE_API_URL
    const key = import.meta.env.VITE_API_KEY

    if (!apiBase || !key) {
      throw new Error('API URL or Key is not defined in env variables')
    }

    const headers = {
      'Accept': 'application/json',
      'X-API-KEY': key
    }

    const tomorrow = getTomorrowStart()
    const tomorrowYearMonthKey = tomorrow.getFullYear() * 100 + (tomorrow.getMonth() + 1)

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

    targetPeriods.sort((a, b) => a.year * 100 + a.month - (b.year * 100 + b.month))
    const periodsToFetch = targetPeriods.slice(0, 6)

    if (periodsToFetch.length === 0) {
      periodsToFetch.push({ year: tomorrow.getFullYear(), month: tomorrow.getMonth() + 1 })
    }

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

    const seenIds = new Set<number>()
    const collected: RCCEvent[] = []

    for (const resJson of responses) {
      if (!resJson) continue
      const rawEvents = Array.isArray(resJson) ? resJson : resJson.data || []
      for (const item of rawEvents) {
        if (item?.id && seenIds.has(item.id)) continue
        const mapped = mapRawHomeEvent(item)
        if (mapped.dateObj && mapped.dateObj.getTime() >= tomorrow.getTime()) {
          if (mapped.id) seenIds.add(mapped.id)
          collected.push(mapped)
        }
      }
    }

    events.value = collected
      .sort((a, b) => (a.dateObj?.getTime() || 0) - (b.dateObj?.getTime() || 0))
      .slice(0, 3)

    isLoading.value = false
  } catch (error) {
    console.error('Error fetching events from API:', error)
    hasError.value = true
    events.value = []
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <section id="encuentros" class="bg-[#EAF2F1] py-24 sm:py-32 px-6 lg:px-12 font-jakarta">
    <div class="max-w-7xl mx-auto space-y-12">
      <!-- Section Header -->
      <div
        v-reveal="{ direction: 'up', delay: 60 }"
        class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-5 border-b border-[#1B4D4F]/15"
      >
        <div>
          <span
            class="font-headline text-xs font-black tracking-[0.2em] text-[#007681] uppercase block mb-2"
          >
            Calendario de Asambleas
          </span>
          <h2
            class="font-headline text-3xl sm:text-5xl font-black tracking-tight text-[#1B4D4F] uppercase"
          >
            Próximos Encuentros
          </h2>
        </div>

        <a
          href="#events"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-[9999px] bg-[#1B4D4F] hover:bg-[#007681] text-white font-headline text-xs font-extrabold uppercase tracking-wider shadow-sm smooth-transition active:scale-95 self-start md:self-auto group"
        >
          <span>Ver todos los eventos</span>
          <span
            class="material-symbols-outlined text-base group-hover:translate-x-0.5 smooth-transition"
          >
            arrow_forward
          </span>
        </a>
      </div>

      <!-- Loading State (Pulse Skeletons) -->
      <div v-if="isLoading" class="grid md:grid-cols-3 gap-8">
        <div
          v-for="n in 3"
          :key="n"
          class="bg-white rounded-3xl p-5 border border-[#1B4D4F]/10 shadow-sm animate-pulse"
        >
          <div class="aspect-[4/3] rounded-2xl bg-[#1B4D4F]/10 mb-5"></div>
          <div class="space-y-3">
            <div class="h-6 bg-[#1B4D4F]/10 rounded-lg w-3/4"></div>
            <div class="h-4 bg-[#1B4D4F]/10 rounded w-1/2"></div>
            <div class="h-10 bg-[#1B4D4F]/10 rounded-[9999px] w-full mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Loaded Events Grid -->
      <div v-else-if="events.length > 0" class="grid md:grid-cols-3 gap-8">
        <article
          v-for="(event, idx) in events"
          :key="event.id"
          v-reveal="{ direction: 'up', delay: idx * 85 }"
          v-tilt="{ max: 4, lift: 6 }"
          @click="openEventDetail(event.slug)"
          class="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm hover:shadow-xl smooth-transition flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <!-- Image & Date Pill -->
            <div class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#1B4D4F]/10 mb-5">
              <img
                v-if="event.imageUrl && !brokenImageIds[event.id]"
                v-parallax="{ range: 22, scale: 1.12 }"
                :alt="event.alt"
                :src="event.imageUrl"
                @error="handleImageError(event.id)"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1B4D4F] via-[#12383A] to-[#007681]"
              >
                <span class="material-symbols-outlined text-5xl text-[#d49e35]">event</span>
              </div>

              <span
                class="absolute top-3 left-3 bg-[#1B4D4F] text-white font-headline text-xs font-extrabold uppercase px-3.5 py-1 rounded-[9999px] shadow-md"
              >
                {{ event.dateMonth }} {{ event.dateDay }}
              </span>
            </div>

            <!-- Event Info -->
            <h3
              class="font-headline font-extrabold text-xl text-[#1B4D4F] group-hover:text-[#007681] smooth-transition leading-tight mb-3"
            >
              {{ event.title }}
            </h3>
            <div class="space-y-1.5 text-xs font-semibold text-zinc-500 mb-6">
              <p class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-[#007681]">schedule</span>
                <span>{{ event.time }}</span>
              </p>
              <p class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-[#007681]">location_on</span>
                <span>{{ event.location }}</span>
              </p>
            </div>
          </div>

          <a
            :href="'#events/' + event.slug"
            class="w-full text-center py-2.5 rounded-[9999px] border-2 border-[#1B4D4F] text-[#1B4D4F] font-headline text-xs font-extrabold uppercase tracking-wider hover:bg-[#1B4D4F] hover:text-white smooth-transition active:scale-95 block cursor-pointer"
          >
            Me Interesa
          </a>
        </article>
      </div>

      <!-- Empty / Error State -->
      <div
        v-else
        class="bg-white rounded-3xl p-10 text-center border border-[#1B4D4F]/10 max-w-xl mx-auto shadow-sm"
      >
        <span class="material-symbols-outlined text-4xl text-[#007681] mb-3 block">event_available</span>
        <h3 class="font-headline font-extrabold text-xl text-[#1B4D4F] mb-2">
          {{ hasError ? 'Próximamente más encuentros' : 'Sin eventos próximos publicados' }}
        </h3>
        <p class="text-sm text-[#404848] mb-5">
          Revisa nuestro calendario completo para conocer las fechas de asambleas, retiros y grupos.
        </p>
        <a
          href="#events"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-[9999px] bg-[#1B4D4F] text-white font-headline text-xs font-extrabold uppercase tracking-wider hover:bg-[#007681] smooth-transition"
        >
          Ir al Calendario
        </a>
      </div>
    </div>
  </section>
</template>
