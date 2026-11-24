<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { resolveEventImageUrl } from '../../utils/image'

interface ReflectionArticle {
  id: number
  title: string
  slug: string
  category: string
  tagClass: string
  readTime: string
  date: string
  excerpt: string
  content: string
  authorName: string
  authorInitials: string
  authorAvatarUrl: string
  imageUrl: string
  isFeatured: boolean
}

const tagPalette = [
  'bg-[#1b4d4f] text-white',
  'bg-[#d49e35] text-white',
  'bg-[#007681] text-white'
]

const articles = ref<ReflectionArticle[]>([])
const isLoading = ref(true)
const activeArticle = ref<ReflectionArticle | null>(null)
const isLoadingDetail = ref(false)
const brokenCoverIds = ref<Record<number, boolean>>({})
const brokenAvatarIds = ref<Record<number, boolean>>({})

const mapReflection = (raw: any, idx: number): ReflectionArticle => {
  const authorName = raw?.author?.name || raw?.author_name || 'Equipo Pastoral'
  const authorInitials =
    raw?.author?.initials ||
    raw?.author_initials ||
    authorName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase() || '')
      .join('') ||
    'RC'

  const authorAvatarRaw = raw?.author?.avatar_url || raw?.author_avatar_url || null
  const readTime =
    raw?.reading_time_label ||
    (raw?.reading_time_minutes ? `${raw.reading_time_minutes} min lectura` : 'Lectura')

  return {
    id: Number(raw?.id ?? idx + 1),
    title: raw?.title || '',
    slug: raw?.slug || '',
    category: raw?.category || 'Reflexión Pastoral',
    tagClass: tagPalette[idx % tagPalette.length] || 'bg-[#1b4d4f] text-white',
    readTime,
    date: raw?.published_date_short || raw?.published_at || '',
    excerpt: raw?.excerpt || '',
    content: raw?.content || '',
    authorName,
    authorInitials,
    authorAvatarUrl: authorAvatarRaw ? resolveEventImageUrl(authorAvatarRaw) : '',
    imageUrl: raw?.image_url ? resolveEventImageUrl(raw.image_url) : '',
    isFeatured: Boolean(raw?.is_featured)
  }
}

const fetchReflections = async () => {
  isLoading.value = true
  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/reflections`
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
    const rawList = Array.isArray(resJson) ? resJson : resJson.data || []
    articles.value = rawList.map((item: any, idx: number) => mapReflection(item, idx))
  } catch (error) {
    console.error('Error fetching reflections:', error)
    articles.value = []
  } finally {
    isLoading.value = false
  }
}

const openArticle = async (article: ReflectionArticle) => {
  activeArticle.value = article
  if (!article.content && article.slug) {
    isLoadingDetail.value = true
    try {
      const url = `${import.meta.env.VITE_API_URL}configuration/reflections/${encodeURIComponent(article.slug)}`
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
      const detail = resJson?.data ?? resJson
      if (detail?.content && activeArticle.value?.id === article.id) {
        activeArticle.value = { ...activeArticle.value, content: detail.content }
      }
    } catch (error) {
      console.error('Error fetching reflection detail:', error)
    } finally {
      isLoadingDetail.value = false
    }
  }
}

const openPrayerModal = () => {
  window.dispatchEvent(new CustomEvent('open-prayer-modal'))
}

onMounted(() => {
  fetchReflections()
})
</script>

<template>
  <div class="bg-[#fcf9f8] font-jakarta">
    <!-- REFLEXIONES & CARTAS PASTORALES -->
    <section id="reflexiones" class="px-6 lg:px-12 py-20 sm:py-24 scroll-mt-24">
      <div class="max-w-7xl mx-auto flex flex-col gap-12">
        <!-- Header -->
        <div
          v-reveal="{ direction: 'up', delay: 50 }"
          class="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <span
              class="font-headline text-xs uppercase tracking-widest text-[#d49e35] font-extrabold block mb-1"
            >
              Formación &amp; Crecimiento Espiritual
            </span>
            <h2
              class="font-headline text-3xl sm:text-4xl font-black text-[#1b4d4f] uppercase tracking-tight"
            >
              Reflexiones &amp; Cartas Pastorales
            </h2>
            <p class="text-sm sm:text-base text-[#404848] max-w-2xl mt-1">
              Profundidad doctrinal, discernimiento carismático y testimonio práctico guiados por
              nuestros sacerdotes asesores y líderes de comunidad.
            </p>
          </div>
          <a
            href="#about"
            class="inline-flex items-center gap-1.5 text-[#1b4d4f] font-headline text-xs uppercase tracking-wider font-extrabold hover:text-[#007681] group self-start md:self-auto"
          >
            <span>Conocer nuestra espiritualidad</span>
            <span class="material-symbols-outlined text-base group-hover:translate-x-1 smooth-transition">
              arrow_forward
            </span>
          </a>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
          <div
            v-for="n in 3"
            :key="n"
            class="bg-white rounded-3xl overflow-hidden border border-[#eaf2f1]"
          >
            <div class="h-52 bg-[#eaf2f1]"></div>
            <div class="p-6 sm:p-8 space-y-3">
              <div class="h-4 w-32 bg-[#eaf2f1] rounded"></div>
              <div class="h-6 w-5/6 bg-[#eaf2f1] rounded"></div>
              <div class="h-14 w-full bg-[#eaf2f1] rounded"></div>
            </div>
          </div>
        </div>

        <!-- Dynamic Articles Grid -->
        <div
          v-else-if="articles.length > 0"
          :class="[
            'grid grid-cols-1 gap-8',
            articles.length === 1
              ? 'max-w-xl mx-auto'
              : articles.length === 2
                ? 'md:grid-cols-2 max-w-4xl mx-auto'
                : 'md:grid-cols-3'
          ]"
        >
          <article
            v-for="(art, idx) in articles"
            :key="art.id"
            v-reveal="{ direction: 'up', delay: idx * 80 }"
            v-tilt="{ max: 4, lift: 6 }"
            @click="openArticle(art)"
            class="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl smooth-transition flex flex-col group cursor-pointer border border-[#eaf2f1]"
          >
            <div class="relative h-52 overflow-hidden bg-gradient-to-br from-[#1b4d4f] to-[#007681]">
              <img
                v-if="art.imageUrl && !brokenCoverIds[art.id]"
                v-parallax="{ range: 22, scale: 1.12 }"
                :alt="art.title"
                :src="art.imageUrl"
                @error="brokenCoverIds[art.id] = true"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-white/25"
              >
                <span class="material-symbols-outlined text-6xl">menu_book</span>
              </div>

              <div class="absolute top-4 left-4 flex items-center gap-2">
                <span
                  :class="[
                    'px-3.5 py-1 rounded-[9999px] font-headline text-[10px] uppercase font-extrabold tracking-wider shadow-sm',
                    art.tagClass
                  ]"
                >
                  {{ art.category }}
                </span>
              </div>
            </div>

            <div class="p-6 sm:p-8 flex flex-col justify-between flex-grow gap-5">
              <div class="space-y-2.5">
                <div
                  class="flex items-center gap-2 text-[#404848] font-headline text-[11px] font-bold uppercase tracking-wider"
                >
                  <span>{{ art.readTime }}</span>
                  <template v-if="art.date">
                    <span>•</span>
                    <span>{{ art.date }}</span>
                  </template>
                </div>
                <h3
                  class="font-headline text-xl font-bold text-[#1b4d4f] group-hover:text-[#007681] smooth-transition leading-snug"
                >
                  {{ art.title }}
                </h3>
                <p v-if="art.excerpt" class="text-sm text-[#404848] leading-relaxed line-clamp-3">
                  {{ art.excerpt }}
                </p>
              </div>

              <div class="pt-4 border-t border-[#eaf2f1] flex items-center justify-between">
                <div class="flex items-center gap-2.5 min-w-0">
                  <img
                    v-if="art.authorAvatarUrl && !brokenAvatarIds[art.id]"
                    :src="art.authorAvatarUrl"
                    :alt="art.authorName"
                    @error="brokenAvatarIds[art.id] = true"
                    class="w-8 h-8 rounded-[9999px] object-cover ring-2 ring-[#eaf2f1] shrink-0"
                  />
                  <span
                    v-else
                    class="w-8 h-8 rounded-[9999px] bg-[#eaf2f1] flex items-center justify-center text-[#1b4d4f] font-headline font-extrabold text-xs shrink-0"
                  >
                    {{ art.authorInitials }}
                  </span>
                  <span class="font-headline text-xs font-bold text-[#1b4d4f] truncate">
                    {{ art.authorName }}
                  </span>
                </div>
                <span
                  class="material-symbols-outlined text-[#007681] group-hover:translate-x-1 smooth-transition shrink-0"
                >
                  east
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="bg-white rounded-3xl p-10 text-center border border-[#eaf2f1] max-w-xl mx-auto space-y-2"
        >
          <span class="material-symbols-outlined text-4xl text-[#007681]">menu_book</span>
          <h3 class="font-headline text-xl font-extrabold text-[#1b4d4f]">
            Próximamente nuevas reflexiones
          </h3>
          <p class="text-sm text-[#404848]">
            Estamos preparando nuevas lecturas y cartas pastorales para fortalecer tu caminar de fe.
          </p>
        </div>
      </div>
    </section>

    <!-- BUZÓN DE INTERCESIÓN COMUNITARIA -->
    <section class="px-6 lg:px-12 pb-20">
      <div class="max-w-7xl mx-auto">
        <div
          v-reveal="{ direction: 'scale', delay: 70 }"
          class="bg-[#1b4d4f] text-white rounded-[2.5rem] p-8 sm:p-14 shadow-2xl shadow-[#1b4d4f]/20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10"
        >
          <div
            class="absolute -right-20 -bottom-20 w-80 h-80 rounded-[9999px] bg-[#d49e35]/15 blur-2xl pointer-events-none"
          ></div>

          <div class="relative z-10 space-y-4 max-w-2xl text-center lg:text-left">
            <div
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-[9999px] bg-[#d49e35]/20 text-[#d49e35] font-headline text-xs uppercase tracking-wider font-extrabold"
            >
              <span class="material-symbols-outlined text-base">favorite</span>
              <span>Buzón de Intercesión Comunitaria</span>
            </div>

            <h2
              class="font-headline text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight"
            >
              ¿Tienes una Intención <br class="hidden sm:inline" />
              <span class="text-[#d49e35]">en el Corazón?</span>
            </h2>

            <p class="text-base sm:text-lg text-white/80 leading-relaxed">
              Nuestro equipo de intercesores ora cada mañana por las peticiones recibidas. Además,
              tus intenciones serán presentadas solemnemente ante el Santísimo Sacramento en la
              próxima Asamblea de Alabanza.
            </p>

            <div
              class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-white/75 text-xs sm:text-sm font-medium"
            >
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[#d49e35] text-lg">lock</span>
                100% Confidencial
              </span>
              <span>•</span>
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[#d49e35] text-lg">volunteer_activism</span>
                Oración Continua 24/7
              </span>
            </div>
          </div>

          <div class="relative z-10 w-full lg:w-auto shrink-0 flex flex-col gap-3">
            <button
              type="button"
              @click="openPrayerModal"
              class="px-8 py-4 rounded-[9999px] bg-[#d49e35] hover:bg-[#b88527] text-white font-headline text-xs uppercase font-extrabold tracking-wider shadow-xl smooth-transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-outlined text-xl">send</span>
              <span>Enviar Petición de Oración</span>
            </button>
            <a
              href="#ministries"
              class="px-8 py-4 rounded-[9999px] bg-white/10 hover:bg-white/20 text-white font-headline text-xs uppercase font-extrabold tracking-wider smooth-transition flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-xl">volunteer_activism</span>
              <span>Unirme al Equipo de Intercesión</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Reflection Reader Modal -->
    <transition name="fade">
      <div
        v-if="activeArticle"
        @click.self="activeArticle = null"
        class="fixed inset-0 z-[85] bg-[#002021]/75 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#1b4d4f]/15 flex flex-col"
        >
          <div class="relative h-52 sm:h-60 shrink-0 bg-gradient-to-br from-[#1b4d4f] to-[#007681]">
            <img
              v-if="activeArticle.imageUrl && !brokenCoverIds[activeArticle.id]"
              :src="activeArticle.imageUrl"
              :alt="activeArticle.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#12383A]/95 via-[#12383A]/35 to-transparent"></div>
            <button
              type="button"
              @click="activeArticle = null"
              class="absolute top-4 right-4 w-9 h-9 rounded-[9999px] bg-white/90 text-[#1b4d4f] hover:bg-[#1b4d4f] hover:text-white flex items-center justify-center smooth-transition cursor-pointer shadow"
              aria-label="Cerrar"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
            <div class="absolute bottom-4 left-6 right-6 text-white">
              <span class="font-headline text-[11px] uppercase tracking-widest text-[#d49e35] font-extrabold">
                {{ activeArticle.category }} • {{ activeArticle.readTime }}
                <template v-if="activeArticle.date"> • {{ activeArticle.date }}</template>
              </span>
              <h3 class="font-headline text-xl sm:text-2xl font-extrabold leading-tight mt-1">
                {{ activeArticle.title }}
              </h3>
            </div>
          </div>

          <!-- Scrollable Content Body -->
          <div class="p-6 sm:p-8 overflow-y-auto space-y-4">
            <p
              v-if="activeArticle.excerpt"
              class="text-base text-[#1b4d4f] font-semibold leading-relaxed border-l-4 border-[#d49e35] pl-4"
            >
              {{ activeArticle.excerpt }}
            </p>

            <div v-if="isLoadingDetail" class="space-y-2.5 animate-pulse py-4">
              <div class="h-4 bg-[#eaf2f1] rounded w-full"></div>
              <div class="h-4 bg-[#eaf2f1] rounded w-5/6"></div>
              <div class="h-4 bg-[#eaf2f1] rounded w-4/5"></div>
            </div>

            <div
              v-else-if="activeArticle.content"
              class="rich-text text-sm sm:text-base text-[#404848] leading-relaxed"
              v-html="activeArticle.content"
            ></div>
          </div>

          <!-- Modal Footer -->
          <div
            class="px-6 sm:px-8 py-4 bg-[#f6f9f8] border-t border-[#eaf2f1] flex items-center justify-between gap-4 shrink-0"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <img
                v-if="activeArticle.authorAvatarUrl && !brokenAvatarIds[activeArticle.id]"
                :src="activeArticle.authorAvatarUrl"
                :alt="activeArticle.authorName"
                class="w-8 h-8 rounded-[9999px] object-cover ring-2 ring-[#eaf2f1] shrink-0"
              />
              <span
                v-else
                class="w-8 h-8 rounded-[9999px] bg-[#1b4d4f] text-[#f3d078] flex items-center justify-center font-headline font-extrabold text-xs shrink-0"
              >
                {{ activeArticle.authorInitials }}
              </span>
              <span class="font-headline text-xs font-extrabold uppercase text-[#007681] truncate">
                Por {{ activeArticle.authorName }}
              </span>
            </div>
            <button
              type="button"
              @click="activeArticle = null"
              class="px-6 py-2.5 rounded-[9999px] bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer shrink-0"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
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

.rich-text :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.rich-text :deep(h2),
.rich-text :deep(h3) {
  font-family: 'Montserrat', sans-serif;
  color: #1b4d4f;
  font-weight: 800;
  margin-top: 1.5rem;
  margin-bottom: 0.6rem;
}

.rich-text :deep(ul) {
  list-style-type: disc;
  margin-left: 1.25rem;
  margin-bottom: 1rem;
}

.rich-text :deep(ol) {
  list-style-type: decimal;
  margin-left: 1.25rem;
  margin-bottom: 1rem;
}

.rich-text :deep(blockquote) {
  border-left: 4px solid #d49e35;
  padding-left: 1rem;
  font-style: italic;
  color: #1b4d4f;
  margin: 1.25rem 0;
}

.rich-text :deep(strong) {
  color: #1b4d4f;
  font-weight: 700;
}
</style>
