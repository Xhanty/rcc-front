<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { resolveEventImageUrl } from '../../utils/image'

const props = defineProps<{
  slug: string
}>()

interface EventPrayer {
  id: number
  title: string
  type?: string | null
  content: string
  image?: string | null
}

interface EventSong {
  id: number
  title: string
  author?: string | null
  lyrics?: string | null
  youtube_url?: string | null
  spotify_url?: string | null
  instagram_url?: string | null
}

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
  guest_name?: string | null
  guest_instagram?: string | null
  guest_instagram_url?: string | null
  guest_instagram_handle?: string | null
  event_type?: {
    id: number
    name: string
  } | null
  prayers?: EventPrayer[]
  songs?: EventSong[]
}

const event = ref<EventDetail | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const bannerImageError = ref(false)
const brokenPrayerImageIds = ref<Record<number, boolean>>({})
const openSongLyrics = ref<Record<number, boolean>>({})

const bannerImageUrl = computed(() => {
  if (!event.value || bannerImageError.value) return ''
  return resolveEventImageUrl(event.value.image || event.value.banner_image_url)
})

const eventPrayers = computed<EventPrayer[]>(() => {
  return Array.isArray(event.value?.prayers) ? event.value!.prayers! : []
})

const eventSongs = computed<EventSong[]>(() => {
  return Array.isArray(event.value?.songs) ? event.value!.songs! : []
})

const getPrayerImageUrl = (prayer: EventPrayer) => {
  if (brokenPrayerImageIds.value[prayer.id]) return ''
  return resolveEventImageUrl(prayer.image)
}

const handlePrayerImageError = (prayerId: number) => {
  brokenPrayerImageIds.value = { ...brokenPrayerImageIds.value, [prayerId]: true }
}

const toggleSongLyrics = (songId: number) => {
  openSongLyrics.value = {
    ...openSongLyrics.value,
    [songId]: !openSongLyrics.value[songId]
  }
}

const formatPrayerType = (type?: string | null) => {
  if (!type) return 'Oración'
  const map: Record<string, string> = {
    oracion: 'Oración',
    salmo: 'Salmo',
    evangelio: 'Evangelio',
    lectura: 'Lectura',
    reflexion: 'Reflexión'
  }
  return map[type.toLowerCase()] || type
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const fetchEventDetail = async (targetSlug: string) => {
  if (!targetSlug) return

  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''
  bannerImageError.value = false
  brokenPrayerImageIds.value = {}
  openSongLyrics.value = {}

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

    event.value = resJson.data || resJson || null
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

watch(
  () => props.slug,
  (newSlug) => {
    fetchEventDetail(newSlug)
  }
)

const shareFeedback = ref('')

const handleShare = async () => {
  if (!event.value) return

  const shareData = {
    title: event.value.name || event.value.title || 'Encuentro RCC',
    text: event.value.description || event.value.short_description || '',
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
    try {
      await navigator.clipboard.writeText(window.location.href)
      shareFeedback.value = '¡Enlace copiado al portapapeles!'
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
  <div class="min-h-screen bg-[#F6F9F8] pt-32 pb-20 font-jakarta">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <!-- Back Navigation Bar -->
      <div class="mb-8 flex items-center justify-between gap-4">
        <a
          href="#events"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[9999px] bg-white border border-[#1b4d4f]/15 text-[#1b4d4f] font-headline text-xs font-extrabold uppercase tracking-wider hover:bg-[#1b4d4f] hover:text-white smooth-transition shadow-sm cursor-pointer group"
        >
          <span
            class="material-symbols-outlined text-base transition-transform group-hover:-translate-x-1"
          >
            arrow_back
          </span>
          <span>Volver a Eventos</span>
        </a>

        <a
          href="#"
          class="font-headline text-xs font-bold uppercase tracking-wider text-[#404848] hover:text-[#1b4d4f] smooth-transition"
        >
          Ir al Inicio
        </a>
      </div>

      <!-- Loading State (Pulse Skeleton) -->
      <div v-if="isLoading" class="space-y-8 animate-pulse">
        <div class="h-72 md:h-[420px] bg-[#1b4d4f]/10 rounded-[2.5rem]"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 bg-white rounded-3xl p-8 space-y-5 border border-[#1b4d4f]/10">
            <div class="h-8 bg-[#1b4d4f]/10 rounded-lg w-3/4"></div>
            <div class="h-4 bg-[#1b4d4f]/10 rounded w-1/3"></div>
            <div class="space-y-2.5 pt-4">
              <div class="h-4 bg-[#1b4d4f]/10 rounded w-full"></div>
              <div class="h-4 bg-[#1b4d4f]/10 rounded w-full"></div>
              <div class="h-4 bg-[#1b4d4f]/10 rounded w-5/6"></div>
            </div>
          </div>
          <div class="lg:col-span-4 space-y-6">
            <div class="h-72 bg-white rounded-3xl border border-[#1b4d4f]/10"></div>
          </div>
        </div>
      </div>

      <!-- Error State (404 / Missing) -->
      <div
        v-else-if="hasError || !event"
        class="text-center py-16 bg-white rounded-[2.5rem] max-w-xl mx-auto p-8 md:p-12 space-y-6 border border-[#1b4d4f]/10 shadow-lg"
      >
        <div
          class="w-20 h-20 rounded-[9999px] bg-[#eaf2f1] text-[#1b4d4f] flex items-center justify-center mx-auto"
        >
          <span class="material-symbols-outlined text-5xl">event_busy</span>
        </div>
        <h2 class="font-headline text-2xl sm:text-3xl font-extrabold text-[#1b4d4f] uppercase">
          Evento no encontrado
        </h2>
        <p class="text-[#404848] text-sm sm:text-base leading-relaxed">
          {{
            errorMessage ||
            'Lo sentimos, el evento que estás buscando no existe, ha vencido o fue retirado del calendario.'
          }}
        </p>
        <div class="pt-4 flex flex-wrap gap-3 justify-center">
          <a
            href="#events"
            class="bg-[#1b4d4f] text-white px-7 py-3 rounded-[9999px] font-headline text-xs font-extrabold uppercase tracking-wider shadow-md hover:bg-[#007681] smooth-transition active:scale-95"
          >
            Ver Eventos
          </a>
          <button
            type="button"
            @click="fetchEventDetail(slug)"
            class="border-2 border-[#1b4d4f] text-[#1b4d4f] px-7 py-3 rounded-[9999px] font-headline text-xs font-extrabold uppercase tracking-wider hover:bg-[#eaf2f1] smooth-transition cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </div>

      <!-- Loaded Event Details Page -->
      <div v-else class="space-y-8">
        <!-- Hero Banner Card -->
        <div
          v-reveal="{ direction: 'up', delay: 40 }"
          class="relative h-72 sm:h-96 md:h-[440px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#1b4d4f]/15 bg-[#12383A] border border-[#1b4d4f]/15"
        >
          <img
            v-if="bannerImageUrl"
            v-parallax="{ range: 32, scale: 1.12 }"
            :src="bannerImageUrl"
            :alt="event.name || event.title"
            @error="bannerImageError = true"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-[#1b4d4f] via-[#12383A] to-[#007681]"
          ></div>

          <!-- Deep Forest Teal Gradient Overlay -->
          <div
            class="absolute inset-0 z-10 bg-gradient-to-t from-[#0f2f31]/95 via-[#1b4d4f]/45 to-black/15"
          ></div>

          <!-- Banner Text Overlay -->
          <div class="absolute bottom-0 left-0 p-7 sm:p-10 md:p-12 text-white z-20 w-full">
            <div class="flex flex-wrap items-center gap-2.5 mb-4">
              <span
                class="px-4 py-1.5 bg-[#d49e35] text-[#1b4d4f] font-headline text-xs font-extrabold uppercase tracking-wider rounded-[9999px] shadow-sm"
              >
                {{ event.event_type?.name || 'Encuentro' }}
              </span>
              <span
                class="px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/25 text-white font-headline text-xs font-bold rounded-[9999px] uppercase tracking-wider"
              >
                {{ event.modality === 'in_person' ? 'Presencial' : 'Virtual' }}
              </span>
              <span
                v-if="event.guest_name"
                class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1b4d4f]/80 backdrop-blur-md border border-[#d49e35]/50 text-[#f3d078] font-headline text-xs font-bold rounded-[9999px] tracking-wide"
              >
                <span class="material-symbols-outlined text-sm">record_voice_over</span>
                <span>{{ event.guest_name }}</span>
              </span>
            </div>

            <h1
              class="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase mb-3"
            >
              {{ event.name || event.title }}
            </h1>

            <p class="text-sm sm:text-base text-[#eaf2f1]/90 flex flex-wrap items-center gap-2 font-medium">
              <span class="material-symbols-outlined text-[#d49e35] text-lg">calendar_today</span>
              <span>{{ event.start_date }}</span>
              <span class="text-[#d49e35]">•</span>
              <span>
                {{ event.start_time }}<template v-if="event.end_time"> – {{ event.end_time }}</template>
              </span>
            </p>
          </div>
        </div>

        <!-- Main Details Layout Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Description, Prayers & Songs (Col span 8) -->
          <div class="lg:col-span-8 space-y-8">
            <!-- Main Event Content Card -->
            <div
              v-reveal="{ direction: 'up', delay: 80 }"
              class="bg-white rounded-3xl p-7 sm:p-10 border border-[#1b4d4f]/10 shadow-sm space-y-6"
            >
              <p
                v-if="event.description || event.short_description"
                class="text-lg sm:text-xl text-[#1b4d4f] font-semibold leading-relaxed border-l-4 border-[#d49e35] pl-5"
              >
                {{ event.description || event.short_description }}
              </p>

              <hr v-if="event.content" class="border-[#eaf2f1]" />

              <!-- Rich Content HTML -->
              <div
                v-if="event.content"
                class="rich-text text-[#404848] text-base leading-relaxed space-y-4"
                v-html="event.content"
              ></div>
            </div>

            <!-- ORACIONES DEL EVENTO (event.prayers) -->
            <section
              v-if="eventPrayers.length > 0"
              id="event-prayers"
              v-reveal="{ direction: 'up', delay: 100 }"
              class="bg-white rounded-3xl p-7 sm:p-10 border border-[#1b4d4f]/10 shadow-sm space-y-6 scroll-mt-28"
            >
              <div class="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#eaf2f1]">
                <div>
                  <span
                    class="font-headline text-[11px] font-extrabold uppercase tracking-widest text-[#d49e35] block mb-1"
                  >
                    Espiritualidad del Encuentro
                  </span>
                  <h2 class="font-headline text-2xl sm:text-3xl font-extrabold text-[#1b4d4f] uppercase tracking-tight">
                    Oraciones
                  </h2>
                </div>
                <span
                  class="px-4 py-1.5 rounded-[9999px] bg-[#eaf2f1] text-[#007681] font-headline text-xs font-extrabold uppercase tracking-wider"
                >
                  {{ eventPrayers.length }} {{ eventPrayers.length === 1 ? 'Oración' : 'Oraciones' }}
                </span>
              </div>

              <div class="space-y-6">
                <article
                  v-for="prayer in eventPrayers"
                  :key="prayer.id"
                  class="rounded-2xl bg-[#f6f9f8] border border-[#eaf2f1] p-6 sm:p-7 space-y-4"
                >
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-3">
                      <span
                        class="w-10 h-10 rounded-2xl bg-[#1b4d4f] text-[#d49e35] flex items-center justify-center shrink-0"
                      >
                        <span class="material-symbols-outlined text-xl">volunteer_activism</span>
                      </span>
                      <h3 class="font-headline text-xl font-bold text-[#1b4d4f] leading-snug">
                        {{ prayer.title }}
                      </h3>
                    </div>
                    <span
                      class="px-3.5 py-1 rounded-[9999px] bg-white border border-[#1b4d4f]/15 text-[#007681] font-headline text-[10px] font-extrabold uppercase tracking-wider"
                    >
                      {{ formatPrayerType(prayer.type) }}
                    </span>
                  </div>

                  <!-- Optional Prayer Image -->
                  <div
                    v-if="getPrayerImageUrl(prayer)"
                    class="rounded-2xl overflow-hidden max-h-72 border border-[#1b4d4f]/10 shadow-sm"
                  >
                    <img
                      :src="getPrayerImageUrl(prayer)"
                      :alt="prayer.title"
                      @error="handlePrayerImageError(prayer.id)"
                      class="w-full h-full max-h-72 object-cover"
                    />
                  </div>

                  <!-- Prayer HTML Content -->
                  <div
                    v-if="prayer.content"
                    class="rich-text text-[#404848] text-base leading-relaxed"
                    v-html="prayer.content"
                  ></div>
                </article>
              </div>
            </section>

            <!-- CANCIONES DEL EVENTO (event.songs) -->
            <section
              v-if="eventSongs.length > 0"
              id="event-songs"
              v-reveal="{ direction: 'up', delay: 120 }"
              class="bg-white rounded-3xl p-7 sm:p-10 border border-[#1b4d4f]/10 shadow-sm space-y-6 scroll-mt-28"
            >
              <div class="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#eaf2f1]">
                <div>
                  <span
                    class="font-headline text-[11px] font-extrabold uppercase tracking-widest text-[#d49e35] block mb-1"
                  >
                    Alabanza &amp; Adoración
                  </span>
                  <h2 class="font-headline text-2xl sm:text-3xl font-extrabold text-[#1b4d4f] uppercase tracking-tight">
                    Canciones del Encuentro
                  </h2>
                </div>
                <span
                  class="px-4 py-1.5 rounded-[9999px] bg-[#eaf2f1] text-[#007681] font-headline text-xs font-extrabold uppercase tracking-wider"
                >
                  {{ eventSongs.length }} {{ eventSongs.length === 1 ? 'Canción' : 'Canciones' }}
                </span>
              </div>

              <div class="space-y-4">
                <article
                  v-for="(song, idx) in eventSongs"
                  :key="song.id"
                  class="rounded-2xl bg-[#f6f9f8] border border-[#eaf2f1] p-5 sm:p-6 space-y-4 smooth-transition hover:border-[#1b4d4f]/25"
                >
                  <!-- Song Header & Links -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5 min-w-0">
                      <span
                        class="w-11 h-11 rounded-[9999px] bg-[#1b4d4f] text-white font-headline text-xs font-extrabold flex items-center justify-center shrink-0 shadow-sm"
                      >
                        {{ String(idx + 1).padStart(2, '0') }}
                      </span>
                      <div class="min-w-0">
                        <h3 class="font-headline text-lg sm:text-xl font-bold text-[#1b4d4f] leading-snug">
                          {{ song.title }}
                        </h3>
                        <p v-if="song.author" class="text-xs sm:text-sm text-[#404848] font-medium">
                          {{ song.author }}
                        </p>
                      </div>
                    </div>

                    <!-- External Platform Pills -->
                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                      <a
                        v-if="song.spotify_url"
                        :href="song.spotify_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9999px] bg-[#1DB954] hover:bg-[#19a54a] text-white font-headline text-[11px] font-extrabold uppercase tracking-wider shadow-sm smooth-transition active:scale-95"
                      >
                        <span class="material-symbols-outlined text-sm">music_note</span>
                        <span>Spotify</span>
                      </a>
                      <a
                        v-if="song.youtube_url"
                        :href="song.youtube_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9999px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-headline text-[11px] font-extrabold uppercase tracking-wider shadow-sm smooth-transition active:scale-95"
                      >
                        <span class="material-symbols-outlined text-sm">smart_display</span>
                        <span>YouTube</span>
                      </a>
                      <a
                        v-if="song.instagram_url"
                        :href="song.instagram_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9999px] bg-gradient-to-r from-[#f59e0b] via-[#ec4899] to-[#7c3aed] text-white font-headline text-[11px] font-extrabold uppercase tracking-wider shadow-sm smooth-transition hover:opacity-90 active:scale-95"
                      >
                        <span class="material-symbols-outlined text-sm">photo_camera</span>
                        <span>Instagram</span>
                      </a>
                    </div>
                  </div>

                  <!-- Lyrics Toggle & Reader -->
                  <div v-if="song.lyrics" class="pt-2 border-t border-[#1b4d4f]/10">
                    <button
                      type="button"
                      @click="toggleSongLyrics(song.id)"
                      class="inline-flex items-center gap-1.5 font-headline text-xs font-extrabold uppercase tracking-wider text-[#007681] hover:text-[#1b4d4f] smooth-transition cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-base">lyrics</span>
                      <span>{{ openSongLyrics[song.id] ? 'Ocultar letra' : 'Ver letra completa' }}</span>
                      <span
                        :class="[
                          'material-symbols-outlined text-base smooth-transition',
                          openSongLyrics[song.id] ? 'rotate-180' : ''
                        ]"
                      >
                        expand_more
                      </span>
                    </button>

                    <transition name="fade">
                      <div
                        v-if="openSongLyrics[song.id]"
                        class="mt-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#eaf2f1] text-sm sm:text-base text-[#1c2424]/90 leading-relaxed whitespace-pre-line font-normal"
                      >
                        {{ song.lyrics }}
                      </div>
                    </transition>
                  </div>
                </article>
              </div>
            </section>
          </div>

          <!-- Right Column: Metadata & Share Sidebar (Col span 4) -->
          <div class="lg:col-span-4 space-y-6">
            <!-- Quick Info Card -->
            <div
              v-reveal="{ direction: 'right', delay: 140 }"
              class="bg-white rounded-3xl p-7 border border-[#1b4d4f]/10 shadow-sm space-y-6"
            >
              <h3
                class="font-headline text-sm font-extrabold uppercase tracking-wider text-[#1b4d4f] flex items-center gap-2 border-b border-[#eaf2f1] pb-4"
              >
                <span class="material-symbols-outlined text-[#d49e35] text-xl">info</span>
                Detalles del Encuentro
              </h3>

              <div class="space-y-5">
                <!-- Date -->
                <div class="flex gap-3.5">
                  <div
                    class="w-10 h-10 rounded-2xl bg-[#eaf2f1] text-[#1b4d4f] flex items-center justify-center shrink-0"
                  >
                    <span class="material-symbols-outlined text-xl">event</span>
                  </div>
                  <div>
                    <p class="font-headline text-xs font-extrabold uppercase tracking-wider text-[#007681]">
                      Fecha
                    </p>
                    <p
                      v-if="!event.end_date || event.start_date === event.end_date"
                      class="text-sm font-semibold text-[#1c2424] mt-0.5"
                    >
                      {{ event.start_date }}
                    </p>
                    <p v-else class="text-sm font-semibold text-[#1c2424] mt-0.5">
                      Del {{ event.start_date }}<br />al {{ event.end_date }}
                    </p>
                  </div>
                </div>

                <!-- Time -->
                <div class="flex gap-3.5">
                  <div
                    class="w-10 h-10 rounded-2xl bg-[#eaf2f1] text-[#1b4d4f] flex items-center justify-center shrink-0"
                  >
                    <span class="material-symbols-outlined text-xl">schedule</span>
                  </div>
                  <div>
                    <p class="font-headline text-xs font-extrabold uppercase tracking-wider text-[#007681]">
                      Horario
                    </p>
                    <p class="text-sm font-semibold text-[#1c2424] mt-0.5">
                      {{ event.start_time }}
                      <template v-if="event.end_time"> a {{ event.end_time }}</template>
                    </p>
                  </div>
                </div>

                <!-- Location / Modality -->
                <div class="flex gap-3.5">
                  <div
                    class="w-10 h-10 rounded-2xl bg-[#eaf2f1] text-[#1b4d4f] flex items-center justify-center shrink-0"
                  >
                    <span class="material-symbols-outlined text-xl">
                      {{ event.modality === 'in_person' ? 'location_on' : 'laptop_mac' }}
                    </span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-headline text-xs font-extrabold uppercase tracking-wider text-[#007681]">
                      {{ event.modality === 'in_person' ? 'Ubicación' : 'Modalidad Virtual' }}
                    </p>

                    <template v-if="event.modality === 'in_person'">
                      <p class="text-sm font-semibold text-[#1c2424] mt-0.5">
                        {{ event.venue_name || 'Casa Palotinos' }}
                      </p>
                      <p v-if="event.address" class="text-xs text-[#404848] mt-0.5">
                        {{ event.address }}
                      </p>
                    </template>

                    <template v-else>
                      <p class="text-sm font-semibold text-[#1c2424] mt-0.5">Transmisión en Vivo</p>
                      <a
                        v-if="event.live_url"
                        :href="event.live_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 mt-2.5 px-4 py-2 rounded-[9999px] bg-[#d49e35] hover:bg-[#b88628] text-[#1b4d4f] hover:text-white font-headline text-[11px] font-extrabold uppercase tracking-wider smooth-transition shadow-sm"
                      >
                        <span>Unirme a la transmisión</span>
                        <span class="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                      <p v-else class="text-xs text-[#404848] mt-0.5">Enlace por confirmar</p>
                    </template>
                  </div>
                </div>

                <!-- Special Guest (Optional) -->
                <div v-if="event.guest_name || event.guest_instagram_url" class="flex gap-3.5">
                  <div
                    class="w-10 h-10 rounded-2xl bg-[#d49e35]/15 text-[#b58122] flex items-center justify-center shrink-0"
                  >
                    <span class="material-symbols-outlined text-xl">record_voice_over</span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-headline text-xs font-extrabold uppercase tracking-wider text-[#007681]">
                      Invitado Especial
                    </p>
                    <p v-if="event.guest_name" class="text-sm font-bold text-[#1b4d4f] mt-0.5">
                      {{ event.guest_name }}
                    </p>
                    <a
                      v-if="event.guest_instagram_url"
                      :href="event.guest_instagram_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-[9999px] bg-gradient-to-r from-[#f59e0b]/15 via-[#ec4899]/15 to-[#7c3aed]/15 hover:from-[#f59e0b] hover:via-[#ec4899] hover:to-[#7c3aed] text-[#9d174d] hover:text-white border border-pink-200/80 font-headline text-[11px] font-extrabold tracking-wide smooth-transition shadow-xs active:scale-95"
                    >
                      <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path
                          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                        />
                      </svg>
                      <span>{{ event.guest_instagram_handle || 'Ver en Instagram' }}</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Quick Jump Pills for Prayers & Songs -->
              <div
                v-if="eventPrayers.length > 0 || eventSongs.length > 0"
                class="pt-4 border-t border-[#eaf2f1] flex flex-wrap gap-2"
              >
                <button
                  v-if="eventPrayers.length > 0"
                  type="button"
                  @click="scrollToSection('event-prayers')"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9999px] bg-[#eaf2f1] hover:bg-[#1b4d4f] text-[#1b4d4f] hover:text-white font-headline text-[11px] font-extrabold uppercase tracking-wider smooth-transition cursor-pointer"
                >
                  <span class="material-symbols-outlined text-sm">volunteer_activism</span>
                  <span>{{ eventPrayers.length }} {{ eventPrayers.length === 1 ? 'Oración' : 'Oraciones' }}</span>
                </button>
                <button
                  v-if="eventSongs.length > 0"
                  type="button"
                  @click="scrollToSection('event-songs')"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9999px] bg-[#eaf2f1] hover:bg-[#1b4d4f] text-[#1b4d4f] hover:text-white font-headline text-[11px] font-extrabold uppercase tracking-wider smooth-transition cursor-pointer"
                >
                  <span class="material-symbols-outlined text-sm">music_note</span>
                  <span>{{ eventSongs.length }} {{ eventSongs.length === 1 ? 'Canción' : 'Canciones' }}</span>
                </button>
              </div>
            </div>

            <!-- Share Card -->
            <div
              v-reveal="{ direction: 'right', delay: 200 }"
              class="bg-[#1b4d4f] text-white rounded-3xl p-7 text-center space-y-4 shadow-lg shadow-[#1b4d4f]/15"
            >
              <span
                class="font-headline text-[11px] font-extrabold uppercase tracking-widest text-[#d49e35] block"
              >
                Invita a un Hermano
              </span>
              <p class="font-headline font-bold text-lg leading-snug">
                ¿Deseas compartir este encuentro?
              </p>
              <button
                type="button"
                @click="handleShare"
                class="w-full py-3 px-6 rounded-[9999px] bg-white hover:bg-[#d49e35] text-[#1b4d4f] font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                aria-label="Compartir encuentro"
              >
                <span class="material-symbols-outlined text-base">share</span>
                <span>Compartir Enlace</span>
              </button>
              <transition name="fade">
                <p v-if="shareFeedback" class="text-xs font-semibold text-[#99f0fc]">
                  {{ shareFeedback }}
                </p>
              </transition>
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
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styling for dynamic HTML injected content */
.rich-text :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.rich-text :deep(h2),
.rich-text :deep(h3) {
  font-family: 'Montserrat', sans-serif;
  color: #1b4d4f;
  font-weight: 800;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1.25;
}

.rich-text :deep(h2) {
  font-size: 1.5rem;
}

.rich-text :deep(h3) {
  font-size: 1.25rem;
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
  color: #1b4d4f;
  font-weight: 700;
}

.rich-text :deep(a) {
  color: #007681;
  text-decoration: underline;
  font-weight: 600;
}

.rich-text :deep(blockquote) {
  border-left: 4px solid #d49e35;
  padding-left: 1rem;
  font-style: italic;
  margin: 1.5rem 0;
  color: #1b4d4f;
}
</style>
