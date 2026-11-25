<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { resolveEventImageUrl } from '../../utils/image'

interface LiturgyGospel {
  title: string
  reference: string
  quote: string | null
  content: string
  audio_url: string | null
}

interface LiturgyReading {
  type: string
  label: string
  title: string
  reference: string
  content: string
}

interface LiturgyMeditation {
  title: string | null
  author: string | null
  content: string
}

interface LiturgySaint {
  name: string
  celebration_type: string | null
  patronage: string | null
  summary: string | null
  biography: string | null
  image: string | null
  prayer: string | null
}

interface LiturgyData {
  date: string
  formatted_date: string
  liturgical_title: string
  liturgical_cycle: string | null
  liturgical_color: string | null
  gospel: LiturgyGospel | null
  readings: LiturgyReading[]
  meditation: LiturgyMeditation | null
  saints: LiturgySaint[]
  source_url: string | null
}

const liturgy = ref<LiturgyData | null>(null)
const isLoading = ref(true)
const hasError = ref(false)

// Active tab: 'gospel' or reading.type ('first_reading', 'psalm', 'second_reading', etc.)
const activeTab = ref<string>('gospel')
const activeSaintIndex = ref(0)
const isSaintDropdownOpen = ref(false)
const saintDropdownRef = ref<HTMLElement | null>(null)
const brokenSaintImages = ref<Record<number, boolean>>({})
const showSaintModal = ref(false)
const isPlayingAudio = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const selectSaint = (idx: number) => {
  activeSaintIndex.value = idx
  isSaintDropdownOpen.value = false
}

const handleDocumentClick = (e: MouseEvent) => {
  if (
    isSaintDropdownOpen.value &&
    saintDropdownRef.value &&
    !saintDropdownRef.value.contains(e.target as Node)
  ) {
    isSaintDropdownOpen.value = false
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})

const fetchLiturgyToday = async () => {
  isLoading.value = true
  hasError.value = false
  brokenSaintImages.value = {}

  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/liturgy/today`
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

    if (!response.ok) {
      throw new Error(`Failed to fetch liturgy (${response.status})`)
    }

    const resJson = await response.json()
    const payload = resJson?.data ?? resJson

    liturgy.value = {
      date: payload?.date || '',
      formatted_date: payload?.formatted_date || '',
      liturgical_title: payload?.liturgical_title || 'Liturgia del Día',
      liturgical_cycle: payload?.liturgical_cycle || null,
      liturgical_color: payload?.liturgical_color || null,
      gospel: payload?.gospel
        ? {
            title: payload.gospel.title || 'Evangelio del Día',
            reference: payload.gospel.reference || '',
            quote: payload.gospel.quote || null,
            content: payload.gospel.content || '',
            audio_url: payload.gospel.audio_url || null
          }
        : null,
      readings: Array.isArray(payload?.readings)
        ? payload.readings.map((r: any) => ({
            type: r.type || r.label || 'reading',
            label: r.label || 'Lectura',
            title: r.title || '',
            reference: r.reference || '',
            content: r.content || ''
          }))
        : [],
      meditation:
        payload?.meditation && payload.meditation.content
          ? {
              title: payload.meditation.title || 'Meditación del Día',
              author: payload.meditation.author || null,
              content: payload.meditation.content
            }
          : null,
      saints: Array.isArray(payload?.saints)
        ? payload.saints.map((s: any) => ({
            name: s.name || 'Santo del Día',
            celebration_type: s.celebration_type || 'Memoria',
            patronage: s.patronage || null,
            summary: s.summary || null,
            biography: s.biography || s.summary || null,
            image: resolveEventImageUrl(s.image) || null,
            prayer: s.prayer || null
          }))
        : [],
      source_url: payload?.source_url || null
    }

    activeTab.value = liturgy.value.gospel ? 'gospel' : liturgy.value.readings[0]?.type || 'gospel'
    activeSaintIndex.value = 0
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching daily liturgy:', error)
    hasError.value = true
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLiturgyToday()
  document.addEventListener('click', handleDocumentClick)
})

const readingTabs = computed(() => {
  if (!liturgy.value) return []
  const tabs: { id: string; label: string }[] = []
  if (liturgy.value.gospel) {
    tabs.push({ id: 'gospel', label: 'Evangelio' })
  }
  for (const r of liturgy.value.readings) {
    tabs.push({ id: r.type, label: r.label })
  }
  return tabs
})

const currentReading = computed<LiturgyReading | null>(() => {
  if (!liturgy.value || activeTab.value === 'gospel') return null
  return liturgy.value.readings.find((r) => r.type === activeTab.value) || null
})

const currentSaint = computed<LiturgySaint | null>(() => {
  if (!liturgy.value || liturgy.value.saints.length === 0) return null
  const idx = activeSaintIndex.value % liturgy.value.saints.length
  return liturgy.value.saints[idx] || liturgy.value.saints[0] || null
})

const liturgicalBadgeLabel = computed(() => {
  if (!liturgy.value) return ''
  return [liturgy.value.liturgical_cycle, liturgy.value.liturgical_color]
    .filter(Boolean)
    .join(' • ')
})

const liturgicalColorDotClass = computed(() => {
  const color = (liturgy.value?.liturgical_color || '').toLowerCase()
  if (color.includes('morado')) return 'bg-purple-600'
  if (color.includes('rojo')) return 'bg-red-600'
  if (color.includes('blanco') || color.includes('dorado')) return 'bg-[#d49e35]'
  if (color.includes('rosa')) return 'bg-pink-500'
  return 'bg-emerald-600'
})

const handleSaintImageError = (index: number) => {
  brokenSaintImages.value = { ...brokenSaintImages.value, [index]: true }
}

const toggleAudio = () => {
  if (!audioRef.value) return
  if (isPlayingAudio.value) {
    audioRef.value.pause()
    isPlayingAudio.value = false
  } else {
    audioRef.value.play()
    isPlayingAudio.value = true
  }
}
</script>

<template>
  <section
    id="evangelio"
    class="bg-[#fcf9f8] px-6 lg:px-12 pb-20 relative z-10 font-jakarta scroll-mt-24"
  >
    <!-- Loading Skeletons -->
    <div
      v-if="isLoading"
      class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse"
    >
      <div class="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#eaf2f1] space-y-6">
        <div class="flex justify-between items-center">
          <div class="h-10 w-2/3 bg-[#1b4d4f]/10 rounded-xl"></div>
          <div class="h-8 w-32 bg-[#1b4d4f]/10 rounded-[9999px]"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-9 w-28 bg-[#1b4d4f]/10 rounded-[9999px]"></div>
          <div class="h-9 w-32 bg-[#1b4d4f]/10 rounded-[9999px]"></div>
          <div class="h-9 w-36 bg-[#1b4d4f]/10 rounded-[9999px]"></div>
        </div>
        <div class="h-24 w-full bg-[#1b4d4f]/10 rounded-2xl"></div>
        <div class="space-y-3">
          <div class="h-4 w-full bg-[#1b4d4f]/10 rounded"></div>
          <div class="h-4 w-full bg-[#1b4d4f]/10 rounded"></div>
          <div class="h-4 w-5/6 bg-[#1b4d4f]/10 rounded"></div>
          <div class="h-4 w-4/6 bg-[#1b4d4f]/10 rounded"></div>
        </div>
      </div>

      <div class="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#eaf2f1] space-y-5">
        <div class="flex justify-between">
          <div class="h-6 w-28 bg-[#1b4d4f]/10 rounded-[9999px]"></div>
          <div class="h-5 w-24 bg-[#1b4d4f]/10 rounded"></div>
        </div>
        <div class="h-56 w-full bg-[#1b4d4f]/10 rounded-2xl"></div>
        <div class="h-4 w-full bg-[#1b4d4f]/10 rounded"></div>
        <div class="h-4 w-5/6 bg-[#1b4d4f]/10 rounded"></div>
        <div class="h-10 w-full bg-[#1b4d4f]/10 rounded-[9999px]"></div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="hasError || !liturgy"
      class="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center border border-[#1b4d4f]/10 shadow-md space-y-4"
    >
      <span class="material-symbols-outlined text-5xl text-[#d49e35]">menu_book</span>
      <h3 class="font-headline text-xl font-extrabold text-[#1b4d4f]">
        No pudimos cargar la liturgia de hoy
      </h3>
      <p class="text-sm text-[#404848]">
        Ocurrió un problema al consultar las lecturas y el santo del día. Inténtalo de nuevo.
      </p>
      <button
        type="button"
        @click="fetchLiturgyToday"
        class="px-7 py-3 rounded-[9999px] bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer"
      >
        Reintentar
      </button>
    </div>

    <!-- Loaded Liturgical Content -->
    <div
      v-else
      class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      <!-- LEFT COL: EVANGELIO, LECTURAS & MEDITACIÓN -->
      <article
        v-reveal="{ direction: 'up', delay: 60 }"
        class="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#1b4d4f]/5 border border-[#eaf2f1] flex flex-col gap-6"
      >
        <!-- Liturgical Date Header -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="inline-flex p-2.5 rounded-2xl bg-[#eaf2f1] text-[#1b4d4f] shrink-0">
              <span class="material-symbols-outlined text-2xl">menu_book</span>
            </span>
            <div>
              <span
                class="font-headline text-[11px] font-extrabold text-[#d49e35] uppercase tracking-widest block"
              >
                Liturgia Diaria • {{ liturgy.formatted_date }}
              </span>
              <h2 class="font-headline text-lg sm:text-xl font-bold text-[#1b4d4f] leading-snug">
                {{ liturgy.liturgical_title }}
              </h2>
            </div>
          </div>

          <span
            v-if="liturgicalBadgeLabel"
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-[9999px] bg-[#eaf2f1] font-headline text-[11px] uppercase tracking-wider text-[#007681] font-extrabold"
          >
            <span :class="['w-2 h-2 rounded-[9999px]', liturgicalColorDotClass]"></span>
            <span>{{ liturgicalBadgeLabel }}</span>
          </span>
        </div>

        <!-- Reading Switcher Tabs (Evangelio | Primera Lectura | Salmo | Segunda Lectura) -->
        <div
          v-if="readingTabs.length > 1"
          class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#eaf2f1]"
        >
          <button
            v-for="tab in readingTabs"
            :key="tab.id"
            type="button"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 rounded-[9999px] font-headline text-xs font-extrabold uppercase tracking-wider whitespace-nowrap smooth-transition cursor-pointer mb-2',
              activeTab === tab.id
                ? 'bg-[#1b4d4f] text-white shadow-sm'
                : 'bg-[#f6f9f8] text-[#404848] hover:bg-[#eaf2f1] hover:text-[#1b4d4f]'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Active Reading / Gospel Content -->
        <transition name="fade" mode="out-in">
          <!-- GOSPEL TAB -->
          <div v-if="activeTab === 'gospel' && liturgy.gospel" key="gospel" class="space-y-6">
            <!-- Scripture Quote / Reference Highlight -->
            <div class="bg-[#f6f3f2] rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start">
              <span class="material-symbols-outlined text-4xl text-[#d49e35] shrink-0">
                format_quote
              </span>
              <div class="space-y-1.5">
                <p
                  v-if="liturgy.gospel.quote"
                  class="font-headline text-lg sm:text-xl italic font-semibold text-[#1b4d4f] leading-snug"
                >
                  "{{ liturgy.gospel.quote }}"
                </p>
                <p class="font-headline text-xs uppercase text-[#007681] font-extrabold tracking-wider">
                  {{ liturgy.gospel.title }}
                  <span v-if="liturgy.gospel.reference" class="text-[#404848]">
                    ({{ liturgy.gospel.reference }})
                  </span>
                </p>
              </div>
            </div>

            <!-- Gospel HTML Body -->
            <div
              class="liturgy-rich-text text-base sm:text-lg text-[#404848] leading-relaxed space-y-4"
              v-html="liturgy.gospel.content"
            ></div>
          </div>

          <!-- OTHER READINGS TAB (First Reading, Psalm, Second Reading) -->
          <div v-else-if="currentReading" :key="currentReading.type" class="space-y-6">
            <div class="bg-[#f6f3f2] rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <span
                  class="font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#d49e35] block"
                >
                  {{ currentReading.label }}
                </span>
                <h3 class="font-headline text-lg sm:text-xl font-bold text-[#1b4d4f] mt-0.5">
                  {{ currentReading.title }}
                </h3>
              </div>
              <span
                v-if="currentReading.reference"
                class="px-3.5 py-1.5 rounded-[9999px] bg-white border border-[#1b4d4f]/15 font-headline text-xs font-extrabold text-[#007681]"
              >
                {{ currentReading.reference }}
              </span>
            </div>

            <div
              class="liturgy-rich-text text-base sm:text-lg text-[#404848] leading-relaxed space-y-4"
              v-html="currentReading.content"
            ></div>
          </div>
        </transition>

        <!-- Daily Meditation / Commentary Box -->
        <div
          v-if="liturgy.meditation"
          class="bg-[#eaf2f1]/75 rounded-2xl p-6 space-y-3 border border-[#1b4d4f]/10"
        >
          <div class="flex items-center gap-2 text-[#1b4d4f]">
            <span class="material-symbols-outlined text-xl text-[#d49e35]">psychology_alt</span>
            <h4 class="font-headline text-base sm:text-lg font-extrabold uppercase tracking-tight">
              {{ liturgy.meditation.title || 'Meditación del Día' }}
            </h4>
          </div>
          <div
            class="liturgy-rich-text text-sm sm:text-base text-[#404848] italic leading-relaxed space-y-3"
            v-html="liturgy.meditation.content"
          ></div>
          <p
            v-if="liturgy.meditation.author"
            class="font-headline text-[11px] uppercase tracking-wider text-[#007681] font-extrabold text-right pt-1"
          >
            — {{ liturgy.meditation.author }}
          </p>
        </div>

        <!-- Bottom Action Bar -->
        <div class="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#eaf2f1]">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Audio Player Button (if backend provides audio_url) -->
            <template v-if="liturgy.gospel?.audio_url">
              <audio
                ref="audioRef"
                :src="liturgy.gospel.audio_url"
                @ended="isPlayingAudio = false"
                class="hidden"
              ></audio>
              <button
                type="button"
                @click="toggleAudio"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[9999px] bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-md smooth-transition active:scale-95 cursor-pointer"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ isPlayingAudio ? 'pause_circle' : 'play_circle' }}
                </span>
                <span>{{ isPlayingAudio ? 'Pausar Audio' : 'Escuchar Evangelio' }}</span>
              </button>
            </template>

            <a
              v-if="liturgy.source_url"
              :href="liturgy.source_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-[9999px] bg-[#f6f9f8] hover:bg-[#eaf2f1] text-[#1b4d4f] font-headline text-xs font-bold uppercase tracking-wider smooth-transition border border-[#1b4d4f]/10"
            >
              <span>Fuente Oficial</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>

          <div class="flex items-center gap-1.5 text-[#404848]">
            <span class="material-symbols-outlined text-base text-[#007681]">auto_stories</span>
            <span class="text-xs sm:text-sm font-medium">Palabra de Vida para hoy</span>
          </div>
        </div>
      </article>

      <!-- RIGHT COL: SANTO(S) DEL DÍA -->
      <aside id="santo" class="lg:col-span-4 flex flex-col gap-6 scroll-mt-28">
        <div
          v-if="currentSaint"
          v-reveal="{ direction: 'right', delay: 120 }"
          class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#1b4d4f]/5 border border-[#eaf2f1] flex flex-col gap-5 relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-[#d49e35]/10 rounded-bl-full pointer-events-none"
          ></div>

          <div class="flex items-center justify-between gap-2 relative z-10">
            <span
              class="px-3.5 py-1 rounded-[9999px] bg-[#d49e35]/20 text-[#d49e35] font-headline text-[11px] uppercase tracking-wider font-extrabold"
            >
              {{ liturgy.saints.length > 1 ? 'Santos del Día' : 'Santo del Día' }}
            </span>
            <span class="font-headline text-[11px] uppercase text-[#404848] font-bold">
              {{ liturgy.formatted_date }}
            </span>
          </div>

          <!-- Multi-Saint Custom Full-Width Dropdown (no boxy native select, no space-stealing arrows) -->
          <div
            v-if="liturgy.saints.length > 1"
            ref="saintDropdownRef"
            class="space-y-2.5 relative z-20"
          >
            <div class="relative">
              <button
                type="button"
                @click="isSaintDropdownOpen = !isSaintDropdownOpen"
                :aria-expanded="isSaintDropdownOpen"
                aria-label="Seleccionar santo del día"
                class="w-full rounded-2xl bg-[#f4f8f7] hover:bg-[#eaf2f1] border border-[#1b4d4f]/15 px-3.5 py-2.5 flex items-center justify-between gap-2.5 smooth-transition cursor-pointer text-left shadow-xs"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <span
                    class="px-2.5 py-1 rounded-[9999px] bg-[#1b4d4f] text-[#f3d078] font-headline text-[10px] font-extrabold tracking-wider shrink-0"
                  >
                    {{ activeSaintIndex + 1 }}/{{ liturgy.saints.length }}
                  </span>
                  <span class="font-headline text-xs font-extrabold uppercase tracking-wide text-[#1b4d4f] truncate">
                    {{ currentSaint.name }}
                  </span>
                </div>
                <span
                  :class="[
                    'material-symbols-outlined text-lg text-[#1b4d4f] shrink-0 smooth-transition',
                    isSaintDropdownOpen ? 'rotate-180' : ''
                  ]"
                >
                  expand_more
                </span>
              </button>

              <!-- Custom Rounded Floating List -->
              <transition name="fade">
                <div
                  v-if="isSaintDropdownOpen"
                  class="absolute inset-x-0 top-full mt-2 z-30 bg-white rounded-2xl shadow-2xl shadow-[#1b4d4f]/15 border border-[#1b4d4f]/15 p-1.5 max-h-60 overflow-y-auto space-y-1"
                >
                  <button
                    v-for="(s, sIdx) in liturgy.saints"
                    :key="s.name"
                    type="button"
                    @click="selectSaint(sIdx)"
                    :class="[
                      'w-full rounded-xl px-3 py-2.5 flex items-center justify-between gap-2.5 text-left smooth-transition cursor-pointer',
                      activeSaintIndex === sIdx
                        ? 'bg-[#1b4d4f] text-white shadow-sm'
                        : 'text-[#1b4d4f] hover:bg-[#eaf2f1]'
                    ]"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span
                        :class="[
                          'w-6 h-6 rounded-[9999px] flex items-center justify-center font-headline text-[10px] font-extrabold shrink-0',
                          activeSaintIndex === sIdx
                            ? 'bg-[#d49e35] text-[#102e30]'
                            : 'bg-[#eaf2f1] text-[#007681]'
                        ]"
                      >
                        {{ sIdx + 1 }}
                      </span>
                      <span class="font-headline text-xs font-bold leading-snug">
                        {{ s.name }}
                      </span>
                    </div>
                    <span
                      v-if="activeSaintIndex === sIdx"
                      class="material-symbols-outlined text-base text-[#f3d078] shrink-0"
                    >
                      check
                    </span>
                  </button>
                </div>
              </transition>
            </div>

            <!-- Subtle Quick-Dot Indicators (for up to 8 saints) -->
            <div
              v-if="liturgy.saints.length <= 8"
              class="flex items-center justify-center gap-1.5"
            >
              <button
                v-for="(s, sIdx) in liturgy.saints"
                :key="`dot-${s.name}`"
                type="button"
                @click="selectSaint(sIdx)"
                :aria-label="`Ver ${s.name}`"
                :class="[
                  'h-1.5 rounded-[9999px] smooth-transition cursor-pointer',
                  activeSaintIndex === sIdx
                    ? 'w-6 bg-[#1b4d4f]'
                    : 'w-1.5 bg-[#1b4d4f]/25 hover:bg-[#1b4d4f]/50'
                ]"
              ></button>
            </div>
          </div>

          <!-- Saint Portrait or Fallback Sacred Banner (Full uncropped portrait) -->
          <div class="relative w-full rounded-2xl overflow-hidden shadow-sm bg-[#12383A] group">
            <template v-if="currentSaint.image && !brokenSaintImages[activeSaintIndex]">
              <!-- Blurred backdrop to fill any side margins gracefully -->
              <img
                :src="currentSaint.image"
                aria-hidden="true"
                class="absolute inset-0 w-full h-full object-cover blur-xl opacity-45 scale-110 pointer-events-none"
              />
              <!-- Full uncropped portrait -->
              <img
                :src="currentSaint.image"
                :alt="currentSaint.name"
                @error="handleSaintImageError(activeSaintIndex)"
                class="relative z-10 w-full h-auto max-h-96 object-contain mx-auto block transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </template>
            <div
              v-else
              class="w-full h-60 flex flex-col items-center justify-center bg-gradient-to-br from-[#1b4d4f] via-[#12383A] to-[#007681] p-6 text-center"
            >
              <span class="material-symbols-outlined text-5xl text-[#d49e35] mb-2">
                auto_awesome
              </span>
            </div>

            <div
              class="absolute inset-0 z-20 bg-gradient-to-t from-[#0f2f31]/95 via-[#0f2f31]/25 to-transparent pointer-events-none"
            ></div>
            <div class="absolute bottom-3.5 left-4 right-4 z-30 text-white">
              <p
                v-if="currentSaint.celebration_type"
                class="font-headline text-[10px] font-extrabold uppercase text-[#d49e35] tracking-widest"
              >
                {{ currentSaint.celebration_type }}
              </p>
              <h3 class="font-headline text-xl sm:text-2xl font-bold leading-tight mt-0.5">
                {{ currentSaint.name }}
              </h3>
            </div>
          </div>

          <!-- Saint Summary & Patronage -->
          <div class="space-y-2.5 text-[#404848]">
            <div v-if="currentSaint.patronage" class="flex items-start gap-2">
              <span class="material-symbols-outlined text-[#007681] text-lg mt-0.5 shrink-0">
                shield
              </span>
              <p class="text-sm font-semibold text-[#1b4d4f]">
                {{ currentSaint.patronage }}
              </p>
            </div>
            <p v-if="currentSaint.summary" class="text-sm leading-relaxed line-clamp-4">
              {{ currentSaint.summary }}
            </p>
          </div>

          <!-- Optional Prayer Box -->
          <div
            v-if="currentSaint.prayer"
            class="p-4 rounded-2xl bg-[#f6f3f2] text-[#1b4d4f] space-y-1"
          >
            <span
              class="font-headline text-[10px] uppercase font-extrabold text-[#d49e35] tracking-widest block"
            >
              Oración de Intercesión
            </span>
            <p class="text-sm italic font-medium leading-snug">
              {{ currentSaint.prayer }}
            </p>
          </div>

          <button
            v-if="currentSaint.biography"
            type="button"
            @click="showSaintModal = true"
            class="w-full py-3 rounded-[9999px] bg-[#eaf2f1] hover:bg-[#1b4d4f] hover:text-white text-[#1b4d4f] font-headline text-xs uppercase tracking-wider smooth-transition text-center font-extrabold cursor-pointer active:scale-95"
          >
            Conocer su Vida y Biografía
          </button>
        </div>
      </aside>
    </div>

    <!-- Saint Biography Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showSaintModal && currentSaint"
          @click.self="showSaintModal = false"
          class="fixed inset-0 z-[90] bg-[#002021]/75 backdrop-blur-sm flex items-center justify-center p-4 font-jakarta"
        >
        <div
          class="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-7 sm:p-9 shadow-2xl border border-[#1b4d4f]/15 space-y-5"
        >
          <div class="flex items-start justify-between gap-4 border-b border-[#eaf2f1] pb-4">
            <div>
              <span
                class="font-headline text-[11px] uppercase tracking-widest text-[#d49e35] font-extrabold"
              >
                {{ currentSaint.celebration_type || 'Santo del Día' }} • {{ liturgy?.formatted_date }}
              </span>
              <h3 class="font-headline text-2xl font-extrabold text-[#1b4d4f] mt-0.5">
                {{ currentSaint.name }}
              </h3>
            </div>
            <button
              type="button"
              @click="showSaintModal = false"
              class="w-9 h-9 rounded-[9999px] bg-[#eaf2f1] hover:bg-[#1b4d4f] text-[#1b4d4f] hover:text-white flex items-center justify-center smooth-transition cursor-pointer shrink-0"
              aria-label="Cerrar"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div
            v-if="currentSaint.image && !brokenSaintImages[activeSaintIndex]"
            class="relative rounded-2xl overflow-hidden bg-[#12383A]"
          >
            <img
              :src="currentSaint.image"
              aria-hidden="true"
              class="absolute inset-0 w-full h-full object-cover blur-xl opacity-45 scale-110 pointer-events-none"
            />
            <img
              :src="currentSaint.image"
              :alt="currentSaint.name"
              class="relative z-10 w-full h-auto max-h-80 object-contain mx-auto block"
            />
          </div>

          <div
            class="liturgy-rich-text text-sm sm:text-base text-[#404848] leading-relaxed space-y-3"
            v-html="currentSaint.biography"
          ></div>

          <button
            type="button"
            @click="showSaintModal = false"
            class="w-full py-3 rounded-[9999px] bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
      </transition>
    </Teleport>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.liturgy-rich-text :deep(p) {
  margin-bottom: 0.85rem;
}

.liturgy-rich-text :deep(p:last-child) {
  margin-bottom: 0;
}

.liturgy-rich-text :deep(strong) {
  color: #1b4d4f;
  font-weight: 700;
}
</style>
