<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { resolveEventImageUrl } from '../../utils/image'

interface MinistryPerson {
  id: number
  name: string
}

interface Ministry {
  id: number
  slug: string
  title: string
  tag: string
  category: string
  desc: string
  detail: string | null
  imageUrl: string
  leader: MinistryPerson | null
  servants: MinistryPerson[]
  meetingDay: string | null
  meetingTime: string | null
  meetingLocation: string | null
  sortOrder: number
  icon: string
}

const ministries = ref<Ministry[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const brokenImageIds = ref<Record<number, boolean>>({})
const activeMinistry = ref<Ministry | null>(null)

const inferMinistryMeta = (title: string, slug: string): { icon: string; tag: string; category: string } => {
  const text = `${title} ${slug}`.toLowerCase()
  if (/m[uú]sica|salmist|alabanza|coro|adoraci/.test(text)) {
    return { icon: 'music_note', tag: 'Alabanza', category: 'alabanza' }
  }
  if (/interces|oraci[oó]n|adorador|sant[ií]simo/.test(text)) {
    return { icon: 'prayer_times', tag: 'Oración', category: 'oracion' }
  }
  if (/ni[ñn]o|semillero|familia|pareja|matrimonio|infantil/.test(text)) {
    return { icon: 'child_care', tag: 'Familia & Niños', category: 'familia' }
  }
  if (/j[oó]ven|universit|juvenil/.test(text)) {
    return { icon: 'diversity_3', tag: 'Comunidad', category: 'jovenes' }
  }
  if (/evangeliz|misi[oó]n|predic|formaci|ense[ñn]anza/.test(text)) {
    return { icon: 'auto_awesome', tag: 'Misión', category: 'jovenes' }
  }
  if (/medio|comunic|sonido|audiovisual|redes/.test(text)) {
    return { icon: 'podcasts', tag: 'Medios', category: 'jovenes' }
  }
  if (/acogida|log[ií]stica|servicio|social|caridad/.test(text)) {
    return { icon: 'volunteer_activism', tag: 'Servicio', category: 'familia' }
  }
  return { icon: 'auto_awesome', tag: 'Ministerio', category: 'todos' }
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
        const meta = inferMinistryMeta(title, slug)

        return {
          id: item.id,
          slug,
          title,
          tag: meta.tag,
          category: meta.category,
          desc: item.description || 'Espacio de servicio y crecimiento espiritual en nuestra comunidad.',
          detail: item.detail || null,
          imageUrl: resolveEventImageUrl(item.image),
          leader: item.leader && item.leader.name ? { id: item.leader.id, name: item.leader.name } : null,
          servants: Array.isArray(item.servants)
            ? item.servants
                .filter((s: any) => s && s.name)
                .map((s: any) => ({ id: s.id, name: s.name }))
            : [],
          meetingDay: item.meeting_day || null,
          meetingTime: item.meeting_time || null,
          meetingLocation: item.meeting_location || null,
          sortOrder: typeof item.sort_order === 'number' ? item.sort_order : 0,
          icon: meta.icon
        }
      })
      .sort((a: Ministry, b: Ministry) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))

    isLoading.value = false
  } catch (error) {
    console.error('Error fetching ministries:', error)
    hasError.value = true
    ministries.value = []
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMinistries()
})

const handleImageError = (id: number) => {
  brokenImageIds.value = { ...brokenImageIds.value, [id]: true }
}

const openMinistryModal = (ministry: Ministry) => {
  activeMinistry.value = ministry
}

const closeMinistryModal = () => {
  activeMinistry.value = null
}

const getMeetingSummary = (min: Ministry) => {
  const parts = [min.meetingDay, min.meetingTime].filter(Boolean)
  return parts.join(' • ')
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 font-jakarta">
    <div
      class="bg-[#1b4d4f] rounded-[2.5rem] p-6 sm:p-10 lg:p-14 text-white shadow-2xl shadow-[#1b4d4f]/30 relative overflow-hidden"
    >
      <!-- Decorative Kinetic Marquee / Outline Watermark -->
      <div
        class="absolute -top-6 left-0 w-full select-none pointer-events-none overflow-hidden opacity-15"
      >
        <div class="animate-marquee-slow">
          <span
            class="font-headline font-extrabold text-7xl sm:text-8xl tracking-tight outline-marquee uppercase pr-8"
          >
            RESUCITADOS • CARISMA • FE • SERVICIO • COMUNIÓN •
          </span>
          <span
            class="font-headline font-extrabold text-7xl sm:text-8xl tracking-tight outline-marquee uppercase pr-8"
            aria-hidden="true"
          >
            RESUCITADOS • CARISMA • FE • SERVICIO • COMUNIÓN •
          </span>
        </div>
      </div>

      <!-- Ambient Glow -->
      <div
        class="absolute -bottom-24 -right-24 w-96 h-96 bg-[#99f0fc]/10 rounded-[9999px] blur-3xl pointer-events-none"
      ></div>

      <!-- Loading Skeletons -->
      <div
        v-if="isLoading"
        class="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 animate-pulse"
      >
        <div
          v-for="n in 6"
          :key="n"
          class="bg-white/10 border border-white/10 rounded-3xl p-7 h-72 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <div class="flex justify-between">
              <div class="w-12 h-12 rounded-2xl bg-white/15"></div>
              <div class="w-24 h-6 rounded-[9999px] bg-white/15"></div>
            </div>
            <div class="h-7 bg-white/15 rounded-lg w-2/3"></div>
            <div class="h-4 bg-white/10 rounded w-full"></div>
            <div class="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
          <div class="h-9 bg-white/10 rounded-[9999px] w-full"></div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="hasError"
        class="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-10 text-center max-w-xl mx-auto space-y-4"
      >
        <span class="material-symbols-outlined text-5xl text-[#d49e35]">cloud_off</span>
        <h3 class="font-headline text-2xl font-extrabold uppercase">
          No pudimos cargar los ministerios
        </h3>
        <p class="text-sm text-white/80">
          Ocurrió un problema al conectar con el servidor. Inténtalo nuevamente en unos segundos.
        </p>
        <button
          type="button"
          @click="fetchMinistries"
          class="px-7 py-3 rounded-[9999px] bg-[#d49e35] hover:bg-[#b88628] text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer"
        >
          Reintentar
        </button>
      </div>

      <!-- Fluid Cards Grid -->
      <TransitionGroup
        v-else
        name="ministry-grid"
        tag="div"
        class="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
      >
        <!-- Real Ministry Cards from Backend -->
        <article
          v-for="(min, idx) in ministries"
          :key="min.id"
          v-reveal="{ direction: 'up', delay: idx * 70 }"
          v-tilt="{ max: 4, lift: 6 }"
          @click="openMinistryModal(min)"
          class="group bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between text-[#1b1c1c] smooth-transition hover:shadow-2xl hover:shadow-black/25 cursor-pointer"
        >
          <div>
            <!-- Optional Ministry Image Banner -->
            <div
              v-if="min.imageUrl && !brokenImageIds[min.id]"
              class="relative h-44 rounded-2xl overflow-hidden mb-5 bg-[#eaf2f1]"
            >
              <img
                v-parallax="{ range: 20, scale: 1.12 }"
                :src="min.imageUrl"
                :alt="min.title"
                @error="handleImageError(min.id)"
                class="w-full h-full object-cover"
              />
              <span
                class="absolute top-3 left-3 font-headline text-[10px] uppercase tracking-widest text-[#1b4d4f] font-extrabold px-3 py-1 rounded-[9999px] bg-white/95 shadow-sm"
              >
                {{ min.tag }}
              </span>
            </div>

            <!-- Icon & Tag Header (when no image) -->
            <div v-else class="flex items-center justify-between mb-6">
              <span
                class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#eaf2f1] text-[#1b4d4f] group-hover:bg-[#1b4d4f] group-hover:text-white group-hover:scale-105 smooth-transition"
              >
                <span class="material-symbols-outlined text-2xl">{{ min.icon }}</span>
              </span>
              <span
                class="font-headline text-[11px] uppercase tracking-widest text-[#1b4d4f] font-extrabold px-3 py-1 rounded-[9999px] bg-[#eaf2f1]"
              >
                {{ min.tag }}
              </span>
            </div>

            <h3
              class="font-headline text-2xl font-bold tracking-tight text-[#1b4d4f] mb-2.5 group-hover:text-[#007681] smooth-transition"
            >
              {{ min.title }}
            </h3>
            <p class="text-[#404848] text-sm sm:text-base leading-relaxed mb-5 font-normal line-clamp-3">
              {{ min.desc }}
            </p>

            <!-- Compact Meeting & Leader Metadata -->
            <div
              v-if="getMeetingSummary(min) || min.meetingLocation || min.leader"
              class="space-y-1.5 mb-5 text-xs text-[#404848]"
            >
              <p v-if="getMeetingSummary(min)" class="flex items-center gap-1.5 font-semibold text-[#1b4d4f]">
                <span class="material-symbols-outlined text-sm text-[#007681] shrink-0">schedule</span>
                <span>{{ getMeetingSummary(min) }}</span>
              </p>
              <p v-if="min.meetingLocation" class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-[#007681] shrink-0">location_on</span>
                <span class="truncate">{{ min.meetingLocation }}</span>
              </p>
              <p v-if="min.leader" class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-[#d49e35] shrink-0">person</span>
                <span class="truncate">Líder: <strong class="text-[#1b4d4f]">{{ min.leader.name }}</strong></span>
              </p>
            </div>
          </div>

          <div class="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span class="font-headline text-xs font-bold tracking-wider text-[#1b4d4f] uppercase">
              Descubrir
            </span>
            <div
              class="w-9 h-9 rounded-[9999px] bg-[#eaf2f1] group-hover:bg-[#1b4d4f] group-hover:text-white flex items-center justify-center text-[#1b4d4f] smooth-transition"
            >
              <span
                class="material-symbols-outlined text-base group-hover:translate-x-0.5 smooth-transition"
              >
                arrow_forward
              </span>
            </div>
          </div>
        </article>

        <!-- Prominent CTA Card -->
        <div
          key="cta-card"
          v-reveal="{ direction: 'scale', delay: 180 }"
          class="bg-[#002021] border-2 border-[#d49e35] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden text-center sm:text-left shadow-xl smooth-transition hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#d49e35]/15"
        >
          <div
            class="absolute -right-12 -top-12 w-48 h-48 bg-[#d49e35]/15 rounded-[9999px] blur-2xl pointer-events-none"
          ></div>

          <div class="relative z-10">
            <div
              class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#d49e35]/20 text-[#d49e35] mb-6 border border-[#d49e35]/40"
            >
              <span class="material-symbols-outlined text-3xl">volunteer_activism</span>
            </div>
            <h3
              class="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight mb-3 uppercase"
            >
              ¿Sientes el llamado?
            </h3>
            <p class="text-white/80 text-sm sm:text-base leading-relaxed mb-8 font-normal">
              Hay un lugar para ti en nuestra comunidad. Descubre tus dones y carismas para ponerlos
              al servicio con amor y pasión.
            </p>
          </div>

          <a
            href="#contact"
            class="relative z-10 w-full bg-[#d49e35] hover:bg-[#b88628] text-white font-headline font-bold text-xs sm:text-sm tracking-wider uppercase py-4 px-6 rounded-[9999px] shadow-lg smooth-transition active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Unirme a un ministerio</span>
            <span
              class="material-symbols-outlined text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 smooth-transition"
            >
              north_east
            </span>
          </a>
        </div>
      </TransitionGroup>
    </div>

    <!-- Ministry Detail Modal (Full Backend Data: detail HTML, leader, servants, schedule) -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="activeMinistry"
          @click.self="closeMinistryModal"
          class="fixed inset-0 z-[90] bg-[#002021]/75 backdrop-blur-sm flex items-center justify-center p-4 font-jakarta"
        >
        <div
          class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#1b4d4f]/15 relative"
        >
          <!-- Optional Banner Image -->
          <div
            v-if="activeMinistry.imageUrl && !brokenImageIds[activeMinistry.id]"
            class="relative h-52 sm:h-60 overflow-hidden bg-[#1b4d4f]"
          >
            <img
              :src="activeMinistry.imageUrl"
              :alt="activeMinistry.title"
              @error="handleImageError(activeMinistry.id)"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#1b4d4f]/90 via-transparent to-black/20"
            ></div>
            <button
              type="button"
              @click="closeMinistryModal"
              class="absolute top-4 right-4 w-9 h-9 rounded-[9999px] bg-white/90 hover:bg-[#1b4d4f] text-[#1b4d4f] hover:text-white flex items-center justify-center smooth-transition cursor-pointer shadow-md"
              aria-label="Cerrar"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
            <div class="absolute bottom-4 left-6 right-6 text-white">
              <span class="font-headline text-[11px] uppercase tracking-widest text-[#d49e35] font-extrabold">
                {{ activeMinistry.tag }}
              </span>
              <h3 class="font-headline text-2xl sm:text-3xl font-extrabold leading-tight mt-0.5">
                {{ activeMinistry.title }}
              </h3>
            </div>
          </div>

          <div class="p-6 sm:p-8 space-y-6">
            <!-- Header (when no image banner) -->
            <div
              v-if="!activeMinistry.imageUrl || brokenImageIds[activeMinistry.id]"
              class="flex items-start justify-between gap-4"
            >
              <div class="flex items-center gap-3.5">
                <span
                  class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1b4d4f] text-white shrink-0"
                >
                  <span class="material-symbols-outlined text-2xl">{{ activeMinistry.icon }}</span>
                </span>
                <div>
                  <span
                    class="font-headline text-[11px] uppercase tracking-widest text-[#007681] font-extrabold block"
                  >
                    {{ activeMinistry.tag }}
                  </span>
                  <h3 class="font-headline text-2xl font-extrabold text-[#1b4d4f] leading-tight">
                    {{ activeMinistry.title }}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                @click="closeMinistryModal"
                class="w-9 h-9 rounded-[9999px] bg-[#eaf2f1] hover:bg-[#1b4d4f] text-[#1b4d4f] hover:text-white flex items-center justify-center smooth-transition cursor-pointer shrink-0"
                aria-label="Cerrar"
              >
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <!-- Description -->
            <p class="text-[#1b4d4f] font-semibold text-base leading-relaxed border-l-4 border-[#d49e35] pl-4">
              {{ activeMinistry.desc }}
            </p>

            <!-- Rich HTML Detail (when available) -->
            <div
              v-if="activeMinistry.detail"
              class="ministry-rich-text text-[#404848] text-sm sm:text-base leading-relaxed p-5 rounded-2xl bg-[#f6f9f8] border border-[#eaf2f1]"
              v-html="activeMinistry.detail"
            ></div>

            <!-- Schedule & Location Info -->
            <div
              v-if="getMeetingSummary(activeMinistry) || activeMinistry.meetingLocation"
              class="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <div
                v-if="getMeetingSummary(activeMinistry)"
                class="flex items-center gap-3 p-4 rounded-2xl bg-[#eaf2f1]/70 border border-[#1b4d4f]/10"
              >
                <span class="material-symbols-outlined text-[#007681] text-2xl shrink-0">schedule</span>
                <div>
                  <span class="font-headline text-[10px] font-extrabold uppercase tracking-wider text-[#007681] block">
                    Horario de Reunión
                  </span>
                  <span class="text-sm font-bold text-[#1b4d4f]">
                    {{ getMeetingSummary(activeMinistry) }}
                  </span>
                </div>
              </div>

              <div
                v-if="activeMinistry.meetingLocation"
                class="flex items-center gap-3 p-4 rounded-2xl bg-[#eaf2f1]/70 border border-[#1b4d4f]/10"
              >
                <span class="material-symbols-outlined text-[#007681] text-2xl shrink-0">location_on</span>
                <div>
                  <span class="font-headline text-[10px] font-extrabold uppercase tracking-wider text-[#007681] block">
                    Lugar
                  </span>
                  <span class="text-sm font-bold text-[#1b4d4f]">
                    {{ activeMinistry.meetingLocation }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Leader & Servants Team -->
            <div
              v-if="activeMinistry.leader || activeMinistry.servants.length > 0"
              class="space-y-4 pt-2 border-t border-[#eaf2f1]"
            >
              <div v-if="activeMinistry.leader" class="flex items-center gap-3">
                <span
                  class="w-10 h-10 rounded-[9999px] bg-[#d49e35]/20 text-[#d49e35] flex items-center justify-center shrink-0"
                >
                  <span class="material-symbols-outlined text-xl">workspace_premium</span>
                </span>
                <div>
                  <span class="font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#d49e35] block">
                    Líder del Ministerio
                  </span>
                  <span class="font-headline text-sm sm:text-base font-bold text-[#1b4d4f]">
                    {{ activeMinistry.leader.name }}
                  </span>
                </div>
              </div>

              <div v-if="activeMinistry.servants.length > 0" class="space-y-2">
                <span class="font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#007681] block">
                  Servidores ({{ activeMinistry.servants.length }})
                </span>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="servant in activeMinistry.servants"
                    :key="servant.id"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[9999px] bg-[#eaf2f1] text-[#1b4d4f] text-xs font-semibold border border-[#1b4d4f]/10"
                  >
                    <span class="w-1.5 h-1.5 rounded-[9999px] bg-[#007681]"></span>
                    <span>{{ servant.name }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#contact"
                @click="closeMinistryModal"
                class="flex-1 bg-[#d49e35] hover:bg-[#b88628] text-white font-headline font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-[9999px] shadow-md smooth-transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Quiero servir aquí</span>
                <span class="material-symbols-outlined text-base">north_east</span>
              </a>
              <button
                type="button"
                @click="closeMinistryModal"
                class="px-6 py-3.5 rounded-[9999px] border border-[#1b4d4f]/20 text-[#1b4d4f] hover:bg-[#eaf2f1] font-headline font-bold text-xs uppercase tracking-wider smooth-transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      </transition>
    </Teleport>
  </section>
</template>

<style scoped>
.ministry-grid-move,
.ministry-grid-enter-active,
.ministry-grid-leave-active {
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.ministry-grid-enter-from,
.ministry-grid-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

.ministry-grid-leave-active {
  position: absolute;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.ministry-rich-text :deep(p) {
  margin-bottom: 0.75rem;
}
.ministry-rich-text :deep(p:last-child) {
  margin-bottom: 0;
}
.ministry-rich-text :deep(ul) {
  list-style-type: disc;
  margin-left: 1.25rem;
  margin-bottom: 0.75rem;
}
.ministry-rich-text :deep(strong) {
  color: #1b4d4f;
  font-weight: 700;
}
</style>
