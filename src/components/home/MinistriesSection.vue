<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { resolveEventImageUrl } from '../../utils/image'

interface HomeMinistry {
  id: number
  title: string
  imageUrl: string
  icon: string
  sortOrder: number
}

const ministries = ref<HomeMinistry[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const brokenImageIds = ref<Record<number, boolean>>({})

const inferMinistryIcon = (title: string, slug: string): string => {
  const text = `${title} ${slug}`.toLowerCase()
  if (/m[uú]sica|salmist|alabanza|coro|adoraci/.test(text)) return 'music_note'
  if (/interces|oraci[oó]n|adorador|sant[ií]simo/.test(text)) return 'prayer_times'
  if (/ni[ñn]o|semillero|familia|pareja|matrimonio|infantil/.test(text)) return 'child_care'
  if (/j[oó]ven|universit|juvenil/.test(text)) return 'diversity_3'
  if (/formaci|ense[ñn]anza|escuela|estudio|biblia/.test(text)) return 'menu_book'
  if (/medio|comunic|sonido|audiovisual|redes/.test(text)) return 'podcasts'
  if (/acogida|log[ií]stica|servicio|social|caridad/.test(text)) return 'volunteer_activism'
  return 'auto_awesome'
}

const fetchMinistries = async () => {
  isLoading.value = true
  hasError.value = false
  brokenImageIds.value = {}

  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/ministries`
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
      throw new Error(`Failed to fetch ministries (${response.status})`)
    }

    const resJson = await response.json()
    const rawList = Array.isArray(resJson) ? resJson : resJson.data || []

    ministries.value = rawList
      .map((item: any) => {
        const title = item.title || item.name || 'Ministerio'
        const slug = item.slug || ''

        return {
          id: item.id,
          title,
          imageUrl: resolveEventImageUrl(item.image),
          icon: inferMinistryIcon(title, slug),
          sortOrder: typeof item.sort_order === 'number' ? item.sort_order : 0
        }
      })
      .sort((a: HomeMinistry, b: HomeMinistry) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
      .slice(0, 4)

    isLoading.value = false
  } catch (error) {
    console.error('Error fetching home ministries:', error)
    hasError.value = true
    ministries.value = []
    isLoading.value = false
  }
}

const handleImageError = (id: number) => {
  brokenImageIds.value = { ...brokenImageIds.value, [id]: true }
}

onMounted(() => {
  fetchMinistries()
})
</script>

<template>
  <div class="font-jakarta">
    <!-- Ministerios Section (Crisp White Background) -->
    <section class="bg-white py-24 sm:py-32 px-6 lg:px-12">
      <div class="max-w-7xl mx-auto">
        <div v-reveal="{ direction: 'up', delay: 60 }" class="text-center max-w-2xl mx-auto mb-16">
          <span
            class="font-headline text-xs font-extrabold tracking-[0.22em] text-[#007681] uppercase block mb-2"
          >
            Dones &amp; Servicio
          </span>
          <h2
            class="font-headline text-3xl sm:text-5xl font-black tracking-tight text-[#1B4D4F] uppercase"
          >
            Nuestros Ministerios
          </h2>
          <p class="text-[#404848] text-sm sm:text-base mt-3 leading-relaxed">
            Hay diversidad de dones, pero el Espíritu es el mismo. Encuentra un lugar donde servir
            con propósito.
          </p>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="isLoading" class="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 animate-pulse">
          <div
            v-for="n in 4"
            :key="n"
            class="p-6 sm:p-8 rounded-3xl bg-[#FCF9F8] border border-zinc-200/80 flex flex-col items-center space-y-4"
          >
            <div class="w-20 h-20 rounded-[9999px] bg-[#1B4D4F]/10"></div>
            <div class="h-5 w-2/3 bg-[#1B4D4F]/10 rounded"></div>
          </div>
        </div>

        <!-- Loaded Ministries Grid (Compact Photo/Icon + Title only) -->
        <div v-else-if="ministries.length > 0" class="space-y-10">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <a
              v-for="(min, idx) in ministries"
              :key="min.id"
              v-reveal="{ direction: 'up', delay: idx * 75 }"
              href="#ministries"
              class="group p-6 sm:p-8 rounded-3xl bg-[#FCF9F8] border border-zinc-200/80 hover:border-[#1B4D4F] hover:bg-[#1B4D4F] smooth-transition hover:-translate-y-1.5 hover:shadow-xl text-center flex flex-col items-center justify-center cursor-pointer"
            >
              <!-- Compact Circular Photo or Icon -->
              <div
                v-if="min.imageUrl && !brokenImageIds[min.id]"
                class="w-20 h-20 rounded-[9999px] overflow-hidden mb-5 ring-4 ring-white group-hover:ring-[#D49E35] shadow-md smooth-transition group-hover:scale-105 bg-[#eaf2f1]"
              >
                <img
                  :src="min.imageUrl"
                  :alt="min.title"
                  @error="handleImageError(min.id)"
                  class="w-full h-full object-cover"
                />
              </div>

              <div
                v-else
                class="w-20 h-20 rounded-[9999px] bg-white text-[#1B4D4F] group-hover:bg-[#D49E35] group-hover:text-[#1B4D4F] flex items-center justify-center mb-5 shadow-sm smooth-transition group-hover:scale-105"
              >
                <span class="material-symbols-outlined text-3xl">{{ min.icon }}</span>
              </div>

              <h3
                class="font-headline font-extrabold text-sm sm:text-base text-[#1B4D4F] group-hover:text-white smooth-transition uppercase tracking-tight leading-snug"
              >
                {{ min.title }}
              </h3>
            </a>
          </div>

          <div class="text-center">
            <a
              href="#ministries"
              class="inline-flex items-center gap-2 px-7 py-3 rounded-[9999px] border-2 border-[#1B4D4F] text-[#1B4D4F] hover:bg-[#1B4D4F] hover:text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition active:scale-95 group"
            >
              <span>Ver todos los ministerios</span>
              <span
                class="material-symbols-outlined text-base group-hover:translate-x-0.5 smooth-transition"
              >
                arrow_forward
              </span>
            </a>
          </div>
        </div>

        <!-- Empty / Error State -->
        <div
          v-else
          class="bg-[#FCF9F8] rounded-3xl p-10 text-center border border-zinc-200/80 max-w-xl mx-auto"
        >
          <span class="material-symbols-outlined text-4xl text-[#007681] mb-3 block">
            volunteer_activism
          </span>
          <h3 class="font-headline font-extrabold text-xl text-[#1B4D4F] mb-2">
            {{ hasError ? 'No pudimos cargar los ministerios' : 'Conoce nuestros ministerios' }}
          </h3>
          <p class="text-sm text-[#404848] mb-5">
            Descubre cómo puedes poner tus dones al servicio de la comunidad.
          </p>
          <a
            href="#ministries"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-[9999px] bg-[#1B4D4F] text-white font-headline text-xs font-extrabold uppercase tracking-wider hover:bg-[#007681] smooth-transition"
          >
            Ir a Ministerios
          </a>
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
