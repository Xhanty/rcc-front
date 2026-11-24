<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { resolveEventImageUrl } from '../../utils/image'

interface AboutMediaItem {
  key: string
  url: string
  type: 'video' | 'image'
  muted: boolean
  title: string
}

const mediaItems = ref<AboutMediaItem[]>([])
const activeIndex = ref(0)
const brokenKeys = ref<Record<string, boolean>>({})
let imageTimer: ReturnType<typeof setTimeout> | null = null

const isVideoUrl = (url: string): boolean => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)

const validMedia = computed(() =>
  mediaItems.value.filter((item) => item.url && !brokenKeys.value[item.key])
)

const activeMedia = computed<AboutMediaItem | null>(() => {
  if (validMedia.value.length === 0) return null
  const safeIndex = activeIndex.value % validMedia.value.length
  return validMedia.value[safeIndex] || validMedia.value[0] || null
})

const clearImageTimer = () => {
  if (imageTimer) {
    clearTimeout(imageTimer)
    imageTimer = null
  }
}

const advanceMedia = () => {
  if (validMedia.value.length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % validMedia.value.length
  scheduleNextIfImage()
}

const scheduleNextIfImage = () => {
  clearImageTimer()
  if (validMedia.value.length <= 1) return
  if (activeMedia.value?.type === 'image') {
    imageTimer = setTimeout(() => {
      advanceMedia()
    }, 6000)
  }
}

const handleVideoEnded = () => {
  if (validMedia.value.length > 1) {
    advanceMedia()
  }
}

const handleMediaError = (key: string) => {
  brokenKeys.value = { ...brokenKeys.value, [key]: true }
  if (activeIndex.value >= validMedia.value.length) {
    activeIndex.value = 0
  }
  scheduleNextIfImage()
}

const fetchAboutBanners = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/banners/about`
    const key = import.meta.env.VITE_API_KEY
    if (!url || !key) return

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': key
      }
    })

    if (!response.ok) return

    const resJson = await response.json()
    const rawBanners = Array.isArray(resJson) ? resJson : resJson.data || []

    const sortedBanners = [...rawBanners].sort(
      (a: any, b: any) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0)
    )

    const items: AboutMediaItem[] = []
    for (const banner of sortedBanners) {
      const title = banner?.title || 'Resucitados RCC'
      const defaultMuted = banner?.muted !== false

      if (Array.isArray(banner?.media) && banner.media.length > 0) {
        banner.media.forEach((m: any, idx: number) => {
          const resolved = resolveEventImageUrl(m?.url)
          if (!resolved) return
          const type: 'video' | 'image' =
            m?.type === 'video' || isVideoUrl(resolved) ? 'video' : 'image'
          items.push({
            key: `${banner.id ?? 'about'}-m-${idx}`,
            url: resolved,
            type,
            muted: m?.muted !== false,
            title
          })
        })
        continue
      }

      const rawVideos: string[] =
        Array.isArray(banner?.videos) && banner.videos.length > 0
          ? banner.videos
          : banner?.video
            ? [banner.video]
            : []

      if (rawVideos.length > 0) {
        rawVideos.forEach((vid, idx) => {
          const resolved = resolveEventImageUrl(vid)
          if (!resolved) return
          items.push({
            key: `${banner.id ?? 'about'}-v-${idx}`,
            url: resolved,
            type: 'video',
            muted: defaultMuted,
            title
          })
        })
        continue
      }

      const rawImages: string[] =
        Array.isArray(banner?.images) && banner.images.length > 0
          ? banner.images
          : banner?.image
            ? [banner.image]
            : []

      rawImages.forEach((img, idx) => {
        const resolved = resolveEventImageUrl(img)
        if (!resolved) return
        const type: 'video' | 'image' =
          banner?.media_type === 'video' || isVideoUrl(resolved) ? 'video' : 'image'
        items.push({
          key: `${banner.id ?? 'about'}-i-${idx}`,
          url: resolved,
          type,
          muted: defaultMuted,
          title
        })
      })
    }

    mediaItems.value = items
    activeIndex.value = 0
    scheduleNextIfImage()
  } catch (error) {
    console.error('Error fetching about banners:', error)
  }
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  fetchAboutBanners()
})

onUnmounted(() => {
  clearImageTimer()
})
</script>

<template>
  <section
    class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1b4d4f] via-[#12383A] to-[#0c2729] pt-32 sm:pt-36 pb-24 font-jakarta"
  >
    <!-- Full-Section Background Video / Media (strictly clipped to this section) -->
    <div v-if="activeMedia" class="absolute inset-0 z-0 pointer-events-none">
      <video
        v-if="activeMedia.type === 'video'"
        :key="activeMedia.key"
        :src="activeMedia.url"
        autoplay
        muted
        :loop="validMedia.length === 1"
        playsinline
        preload="auto"
        @ended="handleVideoEnded"
        @error="handleMediaError(activeMedia.key)"
        class="w-full h-full object-cover"
      ></video>
      <img
        v-else
        :key="activeMedia.key"
        :src="activeMedia.url"
        :alt="activeMedia.title"
        @error="handleMediaError(activeMedia.key)"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Cinematic Teal Overlay for Text Readability -->
    <div
      class="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#0d2a2c]/75 via-[#12383A]/55 to-[#0d2a2c]/80"
    ></div>

    <!-- Foreground Hero Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
      <span
        v-reveal="{ direction: 'up', delay: 40 }"
        class="inline-block px-4 py-1.5 rounded-[9999px] bg-white/15 backdrop-blur-md border border-white/20 text-[#f3d078] font-headline text-xs font-extrabold uppercase tracking-widest mb-6"
      >
        Comunidad Católica Carismática
      </span>

      <h1
        v-reveal="{ direction: 'up', delay: 110 }"
        class="font-headline font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-5xl mx-auto mb-6 uppercase drop-shadow-sm"
      >
        Haciendo a Cristo vivo en <span class="text-[#d49e35]">todos,</span> en todo lugar
      </h1>

      <p
        v-reveal="{ direction: 'up', delay: 180 }"
        class="text-base sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-normal mb-10"
      >
        Somos una comunidad que vive y transmite la alegría del Espíritu Santo en la vida moderna
        con audacia apostólica, fraternidad sincera y esperanza.
      </p>

      <div
        v-reveal="{ direction: 'up', delay: 240 }"
        class="flex flex-wrap items-center justify-center gap-3"
      >
        <button
          type="button"
          @click="scrollToSection('carisma')"
          class="bg-[#d49e35] text-[#102e30] hover:bg-[#e5b34b] px-7 py-3 rounded-[9999px] font-headline text-xs font-extrabold uppercase tracking-widest smooth-transition shadow-lg shadow-black/20 active:scale-95 cursor-pointer"
        >
          El Carisma
        </button>
        <button
          type="button"
          @click="scrollToSection('historia')"
          class="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 px-7 py-3 rounded-[9999px] font-headline text-xs font-bold uppercase tracking-widest smooth-transition active:scale-95 cursor-pointer"
        >
          Nuestra Historia
        </button>
        <button
          type="button"
          @click="scrollToSection('equipo')"
          class="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 px-7 py-3 rounded-[9999px] font-headline text-xs font-bold uppercase tracking-widest smooth-transition active:scale-95 cursor-pointer"
        >
          Servidores
        </button>
      </div>
    </div>

    <!-- Subtle Scroll Down Cue -->
    <button
      type="button"
      @click="scrollToSection('carisma')"
      aria-label="Desplazar hacia abajo"
      class="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-[9999px] bg-white/10 hover:bg-white/20 border border-white/25 text-white flex items-center justify-center backdrop-blur-sm smooth-transition animate-bounce cursor-pointer"
    >
      <span class="material-symbols-outlined text-xl">keyboard_arrow_down</span>
    </button>
  </section>
</template>
