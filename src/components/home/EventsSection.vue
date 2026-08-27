<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
}

const events = ref<RCCEvent[]>([])
const isLoading = ref(true)
const hasError = ref(false)

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const fetchEvents = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/events-home`
    const key = import.meta.env.VITE_API_KEY

    if (!url || !key) {
      throw new Error('API URL or Key is not defined in env variables')
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': key
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const resJson = await response.json()
    const rawEvents = resJson.data || []

    // Map raw API events to RCCEvent format
    events.value = rawEvents.map((item: any) => {
      let day = '01'
      let monthAbbr = 'Ene'
      let timeLabel = 'Por confirmar'

      // Parse start_datetime (e.g. "2026-09-15 19:30:00")
      if (item.start_datetime) {
        const parts = item.start_datetime.split(' ')
        if (parts.length >= 2) {
          const dateParts = parts[0].split('-')
          const timeParts = parts[1].split(':')

          if (dateParts.length === 3) {
            day = dateParts[2]
            const monthNum = parseInt(dateParts[1])
            monthAbbr = monthNames[monthNum - 1] || 'Ene'
          }

          if (timeParts.length >= 2) {
            timeLabel = `${timeParts[0]}:${timeParts[1]} hrs`
          }
        }
      } else if (item.start_date) {
        // Fallback to "d/m/Y" format if returned by alternate resource
        const dateParts = item.start_date.split('/')
        day = dateParts[0] || '01'
        const monthNum = parseInt(dateParts[1]) || 1
        monthAbbr = monthNames[monthNum - 1] || 'Ene'
        timeLabel = item.start_time || 'Por confirmar'
      }

      return {
        id: item.id,
        title: item.title || item.name || 'Sin título',
        slug: item.slug || '',
        dateDay: day,
        dateMonth: monthAbbr,
        time: timeLabel,
        location: item.venue_name || (item.modality === 'virtual' ? 'Virtual' : 'Medellín'),
        imageUrl: item.banner_image_url || item.image || '',
        alt: item.title || item.name || 'Evento'
      }
    })

    isLoading.value = false
  } catch (error) {
    console.error('Error fetching events from API:', error)
    hasError.value = true
    events.value = [] // Clear events so empty state or error displays, no mock fallback
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <section id="events" class="py-margin-desktop bg-surface-container-low">
    <div class="max-w-max-width mx-auto px-margin-desktop">
      <div class="flex flex-col md:flex-row justify-between items-end mb-gutter gap-base">
        <div>
          <span class="text-secondary font-label-sm tracking-widest uppercase">Eventos</span>
          <h2 class="font-headline-lg text-headline-lg text-primary">Próximos Encuentros</h2>
        </div>
        <a class="text-primary font-body-md flex items-center gap-1 hover:text-secondary transition-colors"
          href="#events">
          Ver todo los eventos <span class="material-symbols-outlined">chevron_right</span>
        </a>
      </div>

      <!-- Loading State (Pulse Skeletons) -->
      <div v-if="isLoading" class="grid md:grid-cols-3 gap-gutter">
        <div v-for="n in 3" :key="n"
          class="bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(141,75,0,0.03)] border border-outline-variant/30 animate-pulse">
          <div class="h-48 bg-surface-container-highest"></div>
          <div class="p-gutter space-y-4">
            <div class="h-6 bg-surface-container-highest rounded w-3/4"></div>
            <div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
            <div class="h-10 bg-surface-container-highest rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Loaded State -->
      <div v-else class="grid md:grid-cols-3 gap-gutter">
        <div v-for="event in events" :key="event.id"
          class="group bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(141,75,0,0.03)] border border-outline-variant/30 hover:border-secondary/30 transition-all duration-500">
          <!-- Card Image & Date Badge -->
          <div class="h-48 overflow-hidden relative">
            <img :alt="event.alt"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              :src="event.imageUrl" />
            <div
              class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-center min-w-[60px]">
              <p class="text-xs font-bold text-secondary uppercase">{{ event.dateMonth }}</p>
              <p class="text-xl font-bold text-primary">{{ event.dateDay }}</p>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-gutter">
            <h3 class="font-headline-lg text-title-md text-primary mb-2 leading-tight">{{ event.title }}</h3>
            <div class="flex items-center gap-2 text-on-surface-variant font-label-sm mb-gutter">
              <span class="material-symbols-outlined text-base">schedule</span> {{ event.time }}
              <span class="material-symbols-outlined text-base">location_on</span> {{ event.location }}
            </div>
            <a :href="'#events/' + event.slug"
              class="w-full text-center border border-primary/20 text-primary py-2 rounded-lg font-body-md hover:bg-primary hover:text-white transition-all active:opacity-80 block cursor-pointer">
              Ver más
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
