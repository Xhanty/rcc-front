<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { resolveEventImageUrl } from '../../utils/image'

interface BannerSlide {
  key: string
  src: string
  title: string
  description: string | null
  linkUrl: string | null
}

const defaultGalleryPhotos = [
  {
    alt: 'Alabanza en el templo',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtxHmagb9p8GT11aii9zC9ND7V3ZfLkUJ05-fF6gbB_cPsu-znSKG_fYNrO-SnUAbGMjnjdaOXpgUDHbZDOQw0teSWrt2jpLPCBjME6jiSBMmB5i9tKpZcsm2X-fQ93NVY2gvUVut-lHoIikfDmOZpBMxiNDwNpQEhXppw_VN2XlpPX2lb7abK30Ij-xjxRcq0QjsNepvOXvYnIKvpFfknP_72ZhIckjV9GRymGmdGXOIUWgQOgNPHCput85hxvzELm_zji82yjB3P',
    offset: false
  },
  {
    alt: 'Jóvenes en círculo de oración',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYIHMeilTFwZE7b_BTHptrz9qprlZBy9mTnDJr4qhxfM8sMKPyL3ogFXL0-4FXhvBnhA9eq1oOe0p3tVfsc1gH3vM-J-Fn7rfH9xjcJ1g12CAr2PKzfaxdKZHpPU3yVsYc8R94IQgX-K41XM306CAiPXtZAvSpOKOR4O30aMJIF4k1wmZOwW-nI_Vf-cuWp0E26MSyW2-7LEApjLsaie91YnHqHB6bR-JwAKA5a3p2QJH_lkoTYBnCb54BA_312ZOXSPhRcSvMvHiG',
    offset: true
  },
  {
    alt: 'Cena y fraternidad',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_1JyyboN-DNU4akulcDXkb-HbfxM9ioev1B6diLYVc8zRROl_lcI0Nt1Udzi7Fb_OUVFyFYOU1xLdJ1kJM7JYL41rlu_3RGFHFUTjw8I_vuD3V6kQYxXov0eF4s7CLctUNdNNI1U9qyl34VNxaw77V5WbpYdzIvvC4c0cOkm_hELFUOdruqAFCJVUFDQk0-WZowYEHE1HZgXcz_mP6LzM59MzQmDga_08NK3LLgS8TdN-ZAemo4TFJHOH2oP-XmejkJ2L-C6VuUS3',
    offset: false
  },
  {
    alt: 'Adoración Eucarística y vela',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWoz6MJspU3PdDoJctBRR3QaSpu4m8SXrnhb8zB_N6F3CwDlfXJVVdnZAGIBr5xv1UCSrLL8FAdIKChLTZYqiv_QfoQgtVJXzMpRVOZSz6ae2LPjQLhv-zS9BxiXu7hnQ4BsmIrK9cQpllyJc2ByKdaIVG5qIUE5mGlE_W_fg6wvy7lfZ2MUmRCu0YDvewQ5vYvVCKbJUDLbn-dRHkWY1bdB7APFB7OFk6u7_YO2T9life41-V_BD2ePL-BG3A-ylFGCcoKG323f-',
    offset: true
  }
]

const bannerSlides = ref<BannerSlide[]>([])
const isLoadingBanners = ref(true)
const isFirstImageLoaded = ref(false)
const activeIndex = ref(0)
const isPaused = ref(false)
const brokenSlideKeys = ref<Record<string, boolean>>({})

const AUTOPLAY_MS = 5500
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const validSlides = computed(() =>
  bannerSlides.value.filter((slide) => slide.src && !brokenSlideKeys.value[slide.key])
)

const currentSlide = computed<BannerSlide | null>(() => {
  if (validSlides.value.length === 0) return null
  const safeIndex = activeIndex.value % validSlides.value.length
  return validSlides.value[safeIndex] || validSlides.value[0] || null
})

const startAutoplay = () => {
  stopAutoplay()
  if (validSlides.value.length <= 1) return
  autoplayTimer = setInterval(() => {
    if (!isPaused.value && validSlides.value.length > 1) {
      activeIndex.value = (activeIndex.value + 1) % validSlides.value.length
    }
  }, AUTOPLAY_MS)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const nextSlide = () => {
  if (validSlides.value.length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % validSlides.value.length
  startAutoplay()
}

const prevSlide = () => {
  if (validSlides.value.length <= 1) return
  activeIndex.value =
    (activeIndex.value - 1 + validSlides.value.length) % validSlides.value.length
  startAutoplay()
}

const goToSlide = (index: number) => {
  activeIndex.value = index
  startAutoplay()
}

const handleSlideLoad = () => {
  isFirstImageLoaded.value = true
}

const handleSlideError = (key: string) => {
  brokenSlideKeys.value = { ...brokenSlideKeys.value, [key]: true }
  if (activeIndex.value >= validSlides.value.length) {
    activeIndex.value = 0
  }
  if (validSlides.value.length === 0) {
    isFirstImageLoaded.value = true
  }
}

const fetchHomeBanners = async () => {
  isLoadingBanners.value = true
  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/banners/home`
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
    const rawBanners = Array.isArray(resJson) ? resJson : resJson.data || []

    const sortedBanners = [...rawBanners].sort(
      (a: any, b: any) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0)
    )

    const slides: BannerSlide[] = []
    for (const banner of sortedBanners) {
      const rawImages: string[] =
        Array.isArray(banner?.images) && banner.images.length > 0
          ? banner.images
          : banner?.image
            ? [banner.image]
            : []

      rawImages.forEach((img, idx) => {
        const resolved = resolveEventImageUrl(img)
        if (!resolved) return
        slides.push({
          key: `${banner.id ?? 'b'}-${idx}`,
          src: resolved,
          title: banner.title || 'Resucitados RCC',
          description: banner.description || null,
          linkUrl: banner.link_url || null
        })
      })
    }

    bannerSlides.value = slides
    activeIndex.value = 0
    // Preload all slide images so carousel transitions are instant without layout shifts
    slides.forEach((slide) => {
      const preload = new Image()
      preload.src = slide.src
    })
    if (slides.length > 1) {
      startAutoplay()
    }
  } catch (error) {
    console.error('Error fetching home banners:', error)
  } finally {
    isLoadingBanners.value = false
  }
}

onMounted(() => {
  fetchHomeBanners()
})

onUnmounted(() => {
  stopAutoplay()
})

const scrollToEsencia = () => {
  const el = document.getElementById('esencia')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <!-- Dynamic Banner Hero (shown immediately while loading & when banners exist, preventing any flash of fallback) -->
  <section
    v-if="isLoadingBanners || currentSlide"
    class="relative bg-[#FCF9F8] pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 text-center font-jakarta overflow-hidden"
  >
    <!-- Upper Deep Forest Teal Backdrop (covers top portion behind title & upper banner, leaving cream below) -->
    <div
      aria-hidden="true"
      class="absolute inset-x-0 top-0 h-[76%] sm:h-[78%] bg-[#133738] pointer-events-none"
    >
      <div
        class="absolute -top-24 right-10 w-96 h-96 bg-[#D49E35]/10 rounded-[9999px] blur-3xl"
      ></div>
      <div
        class="absolute bottom-10 left-8 w-80 h-80 bg-[#007681]/20 rounded-[9999px] blur-3xl"
      ></div>
    </div>

    <div class="relative max-w-6xl mx-auto">
      <!-- Monumental Headline sitting cleanly over the top edge of the banner -->
      <div class="relative z-20 max-w-4xl mx-auto px-2">
        <p
          v-reveal="{ direction: 'up', delay: 40 }"
          class="font-headline text-[11px] sm:text-xs font-extrabold tracking-[0.26em] text-[#D49E35] uppercase mb-3"
        >
          Comunidad Católica Carismática
        </p>

        <h1
          v-reveal="{ direction: 'up', delay: 100 }"
          class="font-headline text-4xl sm:text-6xl lg:text-[74px] font-black tracking-tight text-white leading-[0.98] uppercase drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
        >
          RESUCITADOS
          <span class="text-[#D49E35]">RCC</span>
        </h1>
      </div>

      <!-- Rounded Banner Container positioned slightly beneath the monumental title -->
      <div
        @mouseenter="isPaused = true"
        @mouseleave="isPaused = false"
        class="relative z-10 -mt-3 sm:-mt-6 lg:-mt-8"
      >
        <div
          class="relative rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/25 border border-white/15 bg-[#12383A] min-h-[260px] sm:min-h-[380px] lg:min-h-[460px] flex items-center justify-center group"
        >
          <!-- Subtle top scrim so straddling text/subtitle stays readable without hiding the image -->
          <div
            class="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-[#0e2a2b]/75 via-[#0e2a2b]/30 to-transparent z-10 pointer-events-none"
          ></div>

          <!-- Compact Subtitle & Outline Pill CTA tucked right under the headline -->
          <div
            class="absolute inset-x-0 top-5 sm:top-8 z-20 px-6 flex flex-col items-center gap-3 pointer-events-none"
          >
            <p
              class="max-w-xl text-xs sm:text-sm md:text-base text-white/95 font-semibold tracking-wide uppercase drop-shadow"
            >
              Viviendo la fe en el Espíritu Santo para todos, en todo lugar
            </p>
            <button
              type="button"
              @click="scrollToEsencia"
              class="pointer-events-auto inline-flex items-center gap-1.5 px-6 py-2 rounded-[9999px] border border-white/80 bg-[#133738]/40 hover:bg-white hover:text-[#1B4D4F] text-white backdrop-blur-md font-headline text-[11px] font-extrabold tracking-widest uppercase smooth-transition active:scale-95 cursor-pointer shadow-md"
            >
              <span>Conócenos</span>
              <span class="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>

          <!-- Smooth Shimmer Overlay (stays visible until the first banner image actually finishes loading, preventing layout jump) -->
          <div
            :class="[
              'absolute inset-0 z-[5] bg-gradient-to-br from-[#1b4d4f] via-[#133738] to-[#007681]/60 flex items-center justify-center transition-opacity duration-500 pointer-events-none',
              isLoadingBanners || !isFirstImageLoaded ? 'opacity-100 animate-pulse' : 'opacity-0'
            ]"
          >
            <span class="material-symbols-outlined text-5xl text-white/20">image</span>
          </div>

          <!-- Full Uncropped Image (object-contain / natural aspect ratio — fades in smoothly once decoded) -->
          <transition v-if="currentSlide" name="banner-slide" mode="out-in">
            <component
              :is="currentSlide.linkUrl ? 'a' : 'div'"
              :key="currentSlide.key"
              :href="currentSlide.linkUrl || undefined"
              :target="currentSlide.linkUrl ? '_blank' : undefined"
              :rel="currentSlide.linkUrl ? 'noopener noreferrer' : undefined"
              class="block relative w-full bg-[#12383A]"
            >
              <img
                v-parallax="{ range: 18, scale: 1.03 }"
                :src="currentSlide.src"
                :alt="currentSlide.description || currentSlide.title"
                @load="handleSlideLoad"
                @error="handleSlideError(currentSlide.key)"
                :class="[
                  'w-full h-auto max-h-[82vh] object-contain mx-auto block transition-opacity duration-500',
                  isFirstImageLoaded ? 'opacity-100' : 'opacity-0'
                ]"
              />

              <!-- Optional Bottom Caption / Link Bar (only if description or linkUrl exists) -->
              <div
                v-if="currentSlide.description || currentSlide.linkUrl"
                class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f2f31]/85 via-[#0f2f31]/35 to-transparent px-6 sm:px-10 pt-12 pb-5 sm:pb-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left text-white z-20"
              >
                <p
                  v-if="currentSlide.description"
                  class="text-sm sm:text-base font-medium text-white/95 max-w-2xl leading-snug"
                >
                  {{ currentSlide.description }}
                </p>
                <span
                  v-if="currentSlide.linkUrl"
                  class="inline-flex items-center gap-1.5 px-5 py-2 rounded-[9999px] bg-[#D49E35] text-[#1B4D4F] font-headline text-xs font-extrabold uppercase tracking-wider shadow-md shrink-0 self-start sm:self-auto"
                >
                  <span>Ver más</span>
                  <span class="material-symbols-outlined text-sm">north_east</span>
                </span>
              </div>
            </component>
          </transition>

          <!-- Carousel Controls (only shown when there are 2+ banners) -->
          <template v-if="validSlides.length > 1">
            <button
              type="button"
              @click="prevSlide"
              aria-label="Banner anterior"
              class="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-[9999px] bg-[#1B4D4F]/75 hover:bg-[#1B4D4F] text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg smooth-transition opacity-85 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer active:scale-95"
            >
              <span class="material-symbols-outlined text-xl">chevron_left</span>
            </button>

            <button
              type="button"
              @click="nextSlide"
              aria-label="Siguiente banner"
              class="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-[9999px] bg-[#1B4D4F]/75 hover:bg-[#1B4D4F] text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg smooth-transition opacity-85 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer active:scale-95"
            >
              <span class="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </template>
        </div>

        <!-- Pagination Dots (reserved height so layout never shifts when banners load) -->
        <div class="mt-5 h-3 flex items-center justify-center gap-2">
          <template v-if="validSlides.length > 1">
            <button
              v-for="(slide, idx) in validSlides"
              :key="slide.key"
              type="button"
              @click="goToSlide(idx)"
              :aria-label="`Ir al banner ${idx + 1}`"
              :class="[
                'h-2.5 rounded-[9999px] smooth-transition cursor-pointer',
                activeIndex % validSlides.length === idx
                  ? 'w-9 bg-[#1B4D4F]'
                  : 'w-2.5 bg-[#1B4D4F]/25 hover:bg-[#1B4D4F]/50'
              ]"
            ></button>
          </template>
        </div>
      </div>
    </div>
  </section>

  <!-- Fallback Hero (when backend returns no banners) -->
  <section
    v-else
    class="bg-[#FCF9F8] pt-32 sm:pt-40 pb-20 sm:pb-24 px-6 lg:px-12 text-center font-jakarta"
  >
    <div class="max-w-5xl mx-auto space-y-6">
      <p
        v-reveal="{ direction: 'up', delay: 40 }"
        class="font-headline text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#1B4D4F] uppercase"
      >
        Comunidad Católica Carismática
      </p>

      <h1
        v-reveal="{ direction: 'up', delay: 110 }"
        class="font-headline text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight text-[#1B4D4F] leading-[1.06] uppercase"
      >
        Viviendo la Fe en el <br class="hidden sm:inline" />
        <span class="text-[#D49E35]">Espíritu Santo</span> <br />
        Para
        <span
          class="bg-[#1B4D4F] text-white px-3.5 py-0.5 rounded-xl inline-block transform -rotate-1 shadow-sm"
        >
          Todos
        </span>
        , En Todo Lugar
      </h1>

      <p
        v-reveal="{ direction: 'up', delay: 180 }"
        class="max-w-xl mx-auto text-base sm:text-lg text-[#404848] font-normal leading-relaxed pt-2"
      >
        Todos son bienvenidos. Todos tienen un nuevo paso en Dios. Todos pueden ser renovados por el
        fuego y el amor de Jesucristo.
      </p>

      <div v-reveal="{ direction: 'up', delay: 240 }" class="pt-4 flex justify-center">
        <button
          type="button"
          @click="scrollToEsencia"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-[9999px] bg-[#1B4D4F] text-white font-headline text-xs sm:text-sm font-extrabold tracking-wider uppercase hover:bg-[#133738] smooth-transition shadow-md hover:shadow-xl transform active:scale-95 cursor-pointer group"
        >
          <span>Conoce Nuestra Comunidad</span>
          <span
            class="material-symbols-outlined text-base group-hover:translate-y-0.5 smooth-transition"
          >
            expand_more
          </span>
        </button>
      </div>
    </div>

    <!-- Fallback 4-Photo Staggered Strip -->
    <div
      class="max-w-7xl mx-auto mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-2"
    >
      <div
        v-for="(photo, idx) in defaultGalleryPhotos"
        :key="photo.alt"
        v-reveal="{ direction: 'up', delay: 100 + idx * 85 }"
        :class="[
          'rounded-3xl overflow-hidden aspect-[4/5] shadow-lg group bg-[#eaf2f1]',
          photo.offset ? 'md:translate-y-6' : ''
        ]"
      >
        <img
          v-parallax="{ range: photo.offset ? -26 : 26, scale: 1.12 }"
          :alt="photo.alt"
          :src="photo.src"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.banner-slide-enter-from {
  opacity: 0;
  transform: scale(1.02);
}

.banner-slide-leave-to {
  opacity: 0;
  transform: scale(0.99);
}
</style>
