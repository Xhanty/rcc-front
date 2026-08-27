<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps<{
  selectedYear: number | null
  selectedMonth: number | null
}>()

interface EventItem {
  id: number
  title: string
  slug: string
  dateLabel: string
  desc: string
  time: string
  location: string
  imageUrl: string
  day?: string
  monthShort?: string
}

const events = ref<EventItem[]>([])
const isLoading = ref(true)
const hasError = ref(false)

const monthShortNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const fetchEvents = async () => {
  if (props.selectedYear === null || props.selectedMonth === null) return

  isLoading.value = true
  hasError.value = false

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
    const rawEvents = resJson.data || []

    events.value = rawEvents.map((item: any) => {
      // Expected format: start_date is "15/09/2026"
      const dateParts = item.start_date ? item.start_date.split('/') : []
      const day = dateParts[0] || '01'
      const monthNum = parseInt(dateParts[1]) || 1
      const monthShort = monthShortNames[monthNum - 1] || 'Ene'

      const dateLabel = `${day} de ${monthNames[monthNum - 1] || 'Enero'}, ${dateParts[2] || '2026'} • ${item.start_time || 'Por confirmar'}`

      return {
        id: item.id,
        title: item.name || item.title || 'Sin título',
        slug: item.slug || '',
        dateLabel,
        desc: item.description || item.short_description || 'Sin descripción',
        time: item.start_time || 'Por confirmar',
        location: item.venue_name || (item.modality === 'virtual' ? 'Virtual' : 'Medellín'),
        imageUrl: item.image || item.banner_image_url || '',
        day,
        monthShort
      }
    })
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching filtered events:', error)
    hasError.value = true
    events.value = []
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})

watch(() => [props.selectedYear, props.selectedMonth], () => {
  fetchEvents()
})

const hasVisibleEvents = computed(() => {
  return events.value.length > 0
})
</script>

<template>
  <section class="px-6 max-w-max-width mx-auto pb-20 z-10 relative">
    <transition name="fade" mode="out-in">

      <!-- Loading State (2 Skeletons per row) -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="n in 2" :key="n"
          class="bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(141,75,0,0.03)] border border-outline-variant/30 animate-pulse h-[400px] flex flex-col justify-between">
          <div class="h-48 bg-surface-container-highest"></div>
          <div class="p-6 space-y-4 flex-grow">
            <div class="h-6 bg-surface-container-highest rounded w-3/4"></div>
            <div class="h-4 bg-surface-container-highest rounded w-1/2 mt-3"></div>
            <div class="h-4 bg-surface-container-highest rounded w-full mt-4"></div>
          </div>
          <div class="px-6 pb-6">
            <div class="h-10 bg-surface-container-highest rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Loaded Events Grid (2 columns) -->
      <div v-else-if="hasVisibleEvents" class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
        <div v-for="event in events" :key="event.id"
          class="group bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(141,75,0,0.03)] border border-outline-variant/30 hover:border-secondary/30 transition-all duration-500 flex flex-col justify-between">

          <div>
            <!-- Card Image & Date Badge -->
            <div class="h-48 overflow-hidden relative">
              <img :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                :src="event.imageUrl" />
              <div
                class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-center min-w-[60px]">
                <p class="text-xs font-bold text-secondary uppercase leading-none">{{ event.monthShort }}</p>
                <p class="text-xl font-bold text-primary mt-1">{{ event.day }}</p>
              </div>
            </div>

            <!-- Card Content -->
            <div class="p-6 md:p-8">
              <h3 class="font-headline-lg text-title-md md:text-headline-lg text-primary mb-2 leading-tight">
                {{ event.title }}
              </h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                {{ event.desc }}
              </p>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-on-surface-variant font-label-sm">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-base">schedule</span> {{ event.time }}
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-base">location_on</span> {{ event.location }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Action Button -->
          <div class="px-6 md:px-8 pb-6 md:pb-8">
            <a :href="'#events/' + event.slug"
              class="w-full text-center border border-primary/20 text-primary py-2.5 rounded-lg font-body-md hover:bg-primary hover:text-white transition-all active:opacity-80 block cursor-pointer">
              Ver Detalles
            </a>
          </div>

        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 glass-card rounded-xl max-w-xl mx-auto p-10">
        <span class="material-symbols-outlined text-secondary text-5xl animate-pulse">event_busy</span>
        <h3 class="font-headline-lg text-headline-lg text-primary mt-4">Sin Eventos</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mt-2">
          No hay eventos programados para el mes de {{ selectedMonth ? monthNames[selectedMonth - 1] : 'este mes' }}. Te
          invitamos a revisar los otros meses del calendario.
        </p>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
