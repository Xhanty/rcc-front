<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  slug: string
}>()

interface EventDetail {
  id: number
  title?: string
  name?: string
  slug: string
  short_description?: string
  description?: string
  content: string
  start_date: string
  start_time: string
  end_date: string
  end_time: string
  modality: 'in_person' | 'virtual'
  venue_name?: string | null
  address?: string | null
  live_url?: string | null
  banner_image_url?: string
  image?: string
  event_type?: {
    id: number
    name: string
  } | null
}

const event = ref<EventDetail | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

const fetchEventDetail = async (targetSlug: string) => {
  if (!targetSlug) return

  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''

  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/events/${targetSlug}`
    const key = import.meta.env.VITE_API_KEY

    if (!url || !key) {
      throw new Error('API config is missing')
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': key
      }
    })

    const resJson = await response.json()

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Evento no encontrado.')
      }
      throw new Error(resJson.message || 'Error al obtener los detalles del evento.')
    }

    event.value = resJson.data || null
    isLoading.value = false
  } catch (error: any) {
    console.error('Error fetching event details:', error)
    hasError.value = true
    errorMessage.value = error.message || 'Error de conexión.'
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEventDetail(props.slug)
})

// Watch for slug changes (for example, clicking another event from footer/sidebar)
watch(() => props.slug, (newSlug) => {
  fetchEventDetail(newSlug)
})

const shareFeedback = ref('')

const handleShare = async () => {
  if (!event.value) return
  
  const shareData = {
    title: event.value.title || event.value.name || 'Encuentro RCC',
    text: event.value.short_description || event.value.description || '',
    url: window.location.href
  }
  
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err)
      }
    }
  } else {
    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
      shareFeedback.value = '¡Enlace copiado!'
      setTimeout(() => {
        shareFeedback.value = ''
      }, 3000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      shareFeedback.value = 'No se pudo copiar el enlace.'
      setTimeout(() => {
        shareFeedback.value = ''
      }, 3000)
    }
  }
}
</script>

<template>
  <div class="min-h-screen py-8 pb-20">
    <div class="max-w-max-width mx-auto px-6 md:px-margin-desktop">

      <!-- Back Navigation Header -->
      <div class="mb-8 flex items-center justify-between">
        <a href="#events"
          class="flex items-center gap-2 text-primary font-body-md hover:text-secondary transition-colors cursor-pointer group">
          <span class="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
          Volver a Eventos
        </a>
        <a href="#" class="text-on-surface-variant hover:text-primary transition-colors font-body-md">
          Ir al Inicio
        </a>
      </div>

      <!-- Loading State (Pulse Skeleton) -->
      <div v-if="isLoading" class="space-y-8 animate-pulse">
        <div class="h-64 md:h-[400px] bg-surface-container-highest rounded-xl"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div class="lg:col-span-8 space-y-6">
            <div class="h-10 bg-surface-container-highest rounded w-3/4"></div>
            <div class="h-4 bg-surface-container-highest rounded w-1/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-surface-container-highest rounded w-full"></div>
              <div class="h-4 bg-surface-container-highest rounded w-full"></div>
              <div class="h-4 bg-surface-container-highest rounded w-5/6"></div>
            </div>
          </div>
          <div class="lg:col-span-4">
            <div class="h-64 bg-surface-container-highest rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- Error State (404 / Missing) -->
      <div v-else-if="hasError || !event"
        class="text-center py-20 glass-card rounded-xl max-w-xl mx-auto p-8 md:p-12 space-y-6">
        <span class="material-symbols-outlined text-secondary text-7xl animate-pulse">event_busy</span>
        <h2 class="font-headline-lg text-headline-lg text-primary">Evento no encontrado</h2>
        <p class="font-body-md text-body-md text-on-surface-variant">
          {{ errorMessage
            ||
            'Lo sentimos, el evento que estás buscando no existe, ha vencido o ha sido eliminado por los administradores.'
          }}
        </p>
        <div class="pt-4 flex gap-4 justify-center">
          <a href="#events"
            class="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary-container transition-all active:scale-95">
            Ver Eventos
          </a>
          <button @click="fetchEventDetail(slug)"
            class="border border-secondary text-secondary px-8 py-3 rounded-full font-bold hover:bg-secondary/5 transition-all">
            Reintentar
          </button>
        </div>
      </div>

      <!-- Loaded Details Page -->
      <div v-else class="space-y-8">

        <!-- Header Banner Section -->
        <div class="relative h-64 md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-outline-variant/30">
          <img :src="event.banner_image_url || event.image" :alt="event.title || event.name"
            class="w-full h-full object-cover" />
          <!-- Glowing dark gradient overlay for text readability -->
          <div class="absolute inset-0 z-10"
            style="background: linear-gradient(to top, rgba(29, 15, 0, 0.9) 0%, rgba(29, 15, 0, 0.4) 60%, rgba(0, 0, 0, 0.2) 100%);">
          </div>

          <!-- Banner Text Overlay -->
          <div class="absolute bottom-0 left-0 p-6 md:p-10 text-white z-20 w-full flex flex-col justify-end">
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-secondary text-on-secondary-fixed text-white text-xs font-bold rounded-full">
                {{ event.event_type?.name || 'Encuentro' }}
              </span>
              <span
                class="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-bold rounded-full uppercase">
                {{ event.modality === 'in_person' ? 'Presencial' : 'Virtual' }}
              </span>
            </div>

            <h1 class="font-headline-lg text-headline-lg-mobile md:text-display-lg leading-tight mb-2">
              {{ event.title || event.name }}
            </h1>

            <p class="font-body-md text-body-md flex items-center gap-2 opacity-90">
              <span class="material-symbols-outlined text-[18px]">calendar_today</span>
              {{ event.start_date }} • {{ event.start_time }}
            </p>
          </div>
        </div>

        <!-- Main Details Layout Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

          <!-- Content Left Column (Col span 8) -->
          <div class="lg:col-span-8 space-y-6">
            <div class="glass-card rounded-xl p-6 md:p-8 space-y-6">
              <!-- Short Description -->
              <p
                class="font-body-lg text-body-lg text-primary font-semibold leading-relaxed border-l-4 border-secondary pl-4">
                {{ event.short_description || event.description }}
              </p>

              <hr class="border-outline-variant/30" />

              <!-- Rich Content HTML -->
              <div class="rich-text font-body-md text-body-md text-on-surface-variant leading-relaxed space-y-4"
                v-html="event.content"></div>
            </div>
          </div>

          <!-- Metadata Right Column (Col span 4) -->
          <div class="lg:col-span-4 space-y-6">

            <!-- Quick Info Card -->
            <div class="glass-card rounded-xl p-6 border border-outline-variant/40 space-y-6">
              <h3
                class="font-body-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <span class="material-symbols-outlined">info</span>
                Detalles del Encuentro
              </h3>

              <div class="space-y-4">
                <!-- Date details -->
                <div class="flex gap-3">
                  <span class="material-symbols-outlined text-secondary mt-0.5">event</span>
                  <div>
                    <p class="font-bold text-on-surface text-sm">Fecha</p>
                    <p class="text-body-md text-on-surface-variant mt-0.5" v-if="event.start_date === event.end_date">
                      {{ event.start_date }}
                    </p>
                    <p class="text-body-md text-on-surface-variant mt-0.5" v-else>
                      Del {{ event.start_date }}<br />al {{ event.end_date }}
                    </p>
                  </div>
                </div>

                <!-- Time details -->
                <div class="flex gap-3">
                  <span class="material-symbols-outlined text-secondary mt-0.5">schedule</span>
                  <div>
                    <p class="font-bold text-on-surface text-sm">Hora</p>
                    <p class="text-body-md text-on-surface-variant mt-0.5">
                      {{ event.start_time }}
                    </p>
                  </div>
                </div>

                <!-- Modality details -->
                <div class="flex gap-3">
                  <span class="material-symbols-outlined text-secondary mt-0.5">
                    {{ event.modality === 'in_person' ? 'location_on' : 'laptop_mac' }}
                  </span>
                  <div>
                    <p class="font-bold text-on-surface text-sm">Lugar</p>

                    <!-- In person template -->
                    <template v-if="event.modality === 'in_person'">
                      <p class="text-body-md text-on-surface font-semibold mt-0.5">{{ event.venue_name }}</p>
                      <p class="text-xs text-on-surface-variant mt-0.5">{{ event.address }}</p>
                    </template>

                    <!-- Virtual template -->
                    <template v-else>
                      <p class="text-body-md text-on-surface font-semibold mt-0.5">Transmisión Virtual</p>
                      <a v-if="event.live_url" :href="event.live_url" target="_blank"
                        class="text-xs text-primary hover:underline font-semibold flex items-center gap-1 mt-1">
                        Unirme a la transmisión
                        <span class="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                      <p v-else class="text-xs text-on-surface-variant mt-0.5">Enlace por definir</p>
                    </template>
                  </div>
                </div>
              </div>

            </div>

            <!-- Share Card -->
            <div class="glass-card rounded-xl p-6 text-center space-y-4">
              <p class="font-body-md font-semibold text-on-surface-variant">¿Deseas invitar a alguien?</p>
              <div class="flex flex-col items-center gap-2">
                <button
                  @click="handleShare"
                  class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer active:scale-90"
                  aria-label="Compartir encuentro"
                >
                  <span class="material-symbols-outlined text-lg">share</span>
                </button>
                <transition name="fade">
                  <span v-if="shareFeedback" class="text-xs font-semibold text-secondary animate-pulse mt-1">
                    {{ shareFeedback }}
                  </span>
                </transition>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
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

/* Premium Styling for dynamic HTML injected content */
.rich-text :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.rich-text :deep(h2),
.rich-text :deep(h3) {
  font-family: 'EB Garamond', serif;
  color: var(--color-primary);
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.rich-text :deep(h2) {
  font-size: 1.75rem;
}

.rich-text :deep(h3) {
  font-size: 1.5rem;
}

.rich-text :deep(ul) {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
  padding-left: 0.5rem;
}

.rich-text :deep(ol) {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
  padding-left: 0.5rem;
}

.rich-text :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.rich-text :deep(strong) {
  color: var(--color-primary-container);
  font-weight: 700;
}

.rich-text :deep(blockquote) {
  border-left: 4px solid var(--color-secondary);
  padding-left: 1rem;
  font-style: italic;
  margin: 1.5rem 0;
  color: var(--color-on-surface-variant);
}
</style>
