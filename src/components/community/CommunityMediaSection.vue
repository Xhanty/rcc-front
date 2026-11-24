<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface SocialMediaPost {
  url: string
  title?: string | null
  description?: string | null
  embed_url?: string | null
  thumbnail_url?: string | null
  author_name?: string | null
  content_type?: string | null
}

interface SocialMediaItem {
  id: number
  platform: 'spotify' | 'youtube' | 'instagram' | 'facebook' | string
  title?: string | null
  subtitle?: string | null
  description?: string | null
  url?: string | null
  profile_url?: string | null
  embed_url?: string | null
  thumbnail_url?: string | null
  author_name?: string | null
  is_embeddable?: boolean
  posts_count?: number
  posts?: SocialMediaPost[]
  show_in_community?: boolean
  show_in_footer?: boolean
  sort_order?: number
}

const fallbackItems: SocialMediaItem[] = [
  {
    id: -1,
    platform: 'spotify',
    title: 'Resucitados RCC',
    subtitle: 'Spotify Oficial • Resucitados RCC',
    description: 'Playlist oficial de la comunidad',
    url: 'https://open.spotify.com/playlist/67iwwYSmq1qUPdhS173WbQ?si=48d30be18c954543',
    profile_url: 'https://open.spotify.com/playlist/67iwwYSmq1qUPdhS173WbQ?si=48d30be18c954543',
    posts: [
      {
        url: 'https://open.spotify.com/playlist/67iwwYSmq1qUPdhS173WbQ?si=48d30be18c954543',
        title: 'Resucitados RCC',
        description: 'Playlist oficial de la comunidad',
        embed_url:
          'https://open.spotify.com/embed/playlist/67iwwYSmq1qUPdhS173WbQ?utm_source=generator&theme=0',
        content_type: 'playlist'
      }
    ],
    sort_order: 1
  }
]

const mediaItems = ref<SocialMediaItem[]>([])
const isLoading = ref(true)
const playingVideoKeys = ref<Record<string, boolean>>({})
const brokenThumbs = ref<Record<string, boolean>>({})

const startVideo = (key: string) => {
  playingVideoKeys.value = { ...playingVideoKeys.value, [key]: true }
}

const markThumbBroken = (key: string) => {
  brokenThumbs.value = { ...brokenThumbs.value, [key]: true }
}

const getYoutubeAutoplayUrl = (embedUrl: string): string => {
  if (!embedUrl) return ''
  return embedUrl.includes('?') ? `${embedUrl}&autoplay=1&rel=0` : `${embedUrl}?autoplay=1&rel=0`
}

const normalizePlatform = (platform?: string): string =>
  (platform || '').trim().toLowerCase()

const getProfileUrl = (item: SocialMediaItem): string =>
  item.profile_url || item.url || ''

const getItemPosts = (item: SocialMediaItem): SocialMediaPost[] => {
  if (Array.isArray(item.posts) && item.posts.length > 0) {
    return item.posts
  }
  if (item.embed_url) {
    return [
      {
        url: item.url || item.profile_url || '',
        title: item.title || null,
        description: item.description || null,
        embed_url: item.embed_url,
        thumbnail_url: item.thumbnail_url || null,
        author_name: item.author_name || null,
        content_type: null
      }
    ]
  }
  return []
}

const isReelPost = (post: SocialMediaPost): boolean =>
  post.content_type === 'reel' ||
  /\/reels?\//i.test(post.url || '') ||
  /\/reels?\//i.test(post.embed_url || '')

const cardSpanClass = (item: SocialMediaItem): string => {
  if (mediaItems.value.length === 1) return 'lg:col-span-2'
  return getItemPosts(item).length >= 2 ? 'lg:col-span-2' : 'lg:col-span-1'
}

const innerPostsGridClass = (count: number, maxCols: 2 | 3 = 2): string => {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2 || maxCols === 2) return 'grid-cols-1 md:grid-cols-2'
  return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
}

const fetchCommunityMedia = async () => {
  isLoading.value = true
  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/social-media?placement=community`
    const key = import.meta.env.VITE_API_KEY
    if (!url || !key) {
      mediaItems.value = fallbackItems
      return
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': key
      }
    })

    if (!response.ok) {
      mediaItems.value = fallbackItems
      return
    }

    const resJson = await response.json()
    const payload = resJson?.data ?? resJson
    const rawList: SocialMediaItem[] = Array.isArray(payload?.community)
      ? payload.community
      : Array.isArray(payload?.items)
        ? payload.items.filter((i: SocialMediaItem) => i.show_in_community !== false)
        : Array.isArray(payload)
          ? payload
          : []

    const sorted = [...rawList].sort(
      (a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0)
    )

    mediaItems.value = sorted.length > 0 ? sorted : fallbackItems
  } catch (error) {
    console.error('Error fetching community social media:', error)
    mediaItems.value = fallbackItems
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCommunityMedia()
})
</script>

<template>
  <section
    id="musica"
    class="bg-[#1b4d4f] text-white px-6 lg:px-12 py-20 sm:py-24 relative overflow-hidden font-jakarta scroll-mt-24"
  >
    <!-- Ambient Glow -->
    <div
      class="absolute top-1/2 left-0 w-72 h-72 bg-[#d49e35]/10 rounded-[9999px] blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-24 right-0 w-80 h-80 bg-[#007681]/20 rounded-[9999px] blur-3xl pointer-events-none"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto flex flex-col gap-12">
      <!-- Header -->
      <div
        v-reveal="{ direction: 'up', delay: 50 }"
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <span
            class="font-headline text-xs uppercase tracking-widest text-[#d49e35] font-extrabold block mb-1"
          >
            Alabanza &amp; Medios Digitales
          </span>
          <h2
            class="font-headline text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight"
          >
            Música que Enciende <span class="italic font-normal text-[#99f0fc]">el Espíritu</span>
          </h2>
        </div>
        <p class="text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
          Conéctate en oración constante. Escucha nuestra música oficial, revive enseñanzas y
          comparte la vida de nuestra comunidad en medios digitales.
        </p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          v-for="n in 2"
          :key="n"
          class="bg-white/10 rounded-3xl p-6 sm:p-8 border border-white/15 animate-pulse space-y-5"
        >
          <div class="h-5 w-48 bg-white/15 rounded-full"></div>
          <div class="h-64 w-full bg-white/10 rounded-2xl"></div>
          <div class="h-10 w-40 bg-white/15 rounded-full"></div>
        </div>
      </div>

      <!-- Dynamic Platform Cards (1 master card per social network, rendering all its posts inside) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <template v-for="(item, idx) in mediaItems" :key="item.id">
          <!-- SPOTIFY MASTER CARD -->
          <article
            v-if="normalizePlatform(item.platform) === 'spotify'"
            v-reveal="{ direction: 'up', delay: 80 + idx * 60 }"
            :class="[
              'bg-white text-[#1b1c1c] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between gap-6',
              cardSpanClass(item)
            ]"
          >
            <div class="space-y-5">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span
                    class="w-8 h-8 rounded-[9999px] bg-[#1DB954] flex items-center justify-center text-white shrink-0"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path
                        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                      />
                    </svg>
                  </span>
                  <span
                    class="font-headline text-[11px] uppercase tracking-widest text-[#404848] font-extrabold truncate"
                  >
                    {{ item.subtitle || 'Spotify Oficial • Resucitados RCC' }}
                  </span>
                </div>
                <span class="material-symbols-outlined text-[#007681] text-xl shrink-0">podcasts</span>
              </div>

              <!-- Spotify Playlists Grid -->
              <div
                v-if="getItemPosts(item).length > 0"
                :class="['grid gap-5', innerPostsGridClass(getItemPosts(item).length, 2)]"
              >
                <div
                  v-for="(post, pIdx) in getItemPosts(item)"
                  :key="`${item.id}-sp-${pIdx}`"
                  class="space-y-3"
                >
                  <div
                    v-if="post.embed_url"
                    class="rounded-2xl overflow-hidden shadow-md bg-[#121212]"
                  >
                    <iframe
                      :title="post.title || item.title || 'Spotify Resucitados RCC'"
                      :src="post.embed_url"
                      width="100%"
                      height="352"
                      frameborder="0"
                      allowfullscreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      class="block w-full"
                    ></iframe>
                  </div>
                  <div v-else class="flex items-center gap-4 p-4 rounded-2xl bg-[#f4f8f7]">
                    <img
                      v-if="post.thumbnail_url && !brokenThumbs[`${item.id}-sp-${pIdx}`]"
                      :src="post.thumbnail_url"
                      :alt="post.title || item.title || 'Spotify'"
                      @error="markThumbBroken(`${item.id}-sp-${pIdx}`)"
                      class="w-20 h-20 rounded-xl object-cover shadow shrink-0"
                    />
                    <div class="min-w-0">
                      <h3 class="font-headline text-lg font-extrabold text-[#1b4d4f] truncate">
                        {{ post.title || item.title }}
                      </h3>
                      <p v-if="post.description" class="text-sm text-[#404848] mt-1 line-clamp-2">
                        {{ post.description }}
                      </p>
                    </div>
                  </div>

                  <!-- Post Title & Description (shown under Spotify embed when provided) -->
                  <div
                    v-if="post.embed_url && (post.title || post.description)"
                    class="px-1 space-y-1"
                  >
                    <h3
                      v-if="post.title"
                      class="font-headline text-base sm:text-lg font-extrabold text-[#1b4d4f] leading-snug"
                    >
                      {{ post.title }}
                    </h3>
                    <p v-if="post.description" class="text-sm text-[#404848] leading-relaxed">
                      {{ post.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-[#eaf2f1] flex flex-wrap items-center justify-between gap-3">
              <a
                v-if="getProfileUrl(item) || getItemPosts(item)[0]?.url"
                :href="getProfileUrl(item) || getItemPosts(item)[0]?.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-[9999px] bg-[#1DB954] hover:bg-[#19a54a] text-white font-headline text-xs uppercase tracking-wider font-extrabold shadow-md smooth-transition active:scale-95"
              >
                <span class="material-symbols-outlined text-lg">play_arrow</span>
                <span>Abrir en Spotify</span>
              </a>
              <span class="text-xs sm:text-sm text-[#404848] font-medium">
                Playlist oficial de la comunidad
              </span>
            </div>
          </article>

          <!-- YOUTUBE MASTER CARD -->
          <article
            v-else-if="normalizePlatform(item.platform) === 'youtube'"
            v-reveal="{ direction: 'up', delay: 80 + idx * 60 }"
            :class="[
              'bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 border border-white/15',
              cardSpanClass(item)
            ]"
          >
            <div class="space-y-5">
              <div class="flex items-center justify-between gap-3">
                <span
                  class="flex items-center gap-2 text-white font-headline text-[11px] uppercase tracking-widest font-extrabold min-w-0"
                >
                  <span class="material-symbols-outlined text-[#ff6b6b] text-xl shrink-0">
                    smart_display
                  </span>
                  <span class="truncate">{{ item.subtitle || 'YouTube RCC • Enseñanzas' }}</span>
                </span>
                <span
                  class="px-3 py-1 rounded-[9999px] bg-[#ba1a1a]/30 text-[#ffdad6] font-headline text-[10px] uppercase font-bold shrink-0"
                >
                  {{
                    getItemPosts(item).length > 1
                      ? `${getItemPosts(item).length} Videos`
                      : 'YouTube'
                  }}
                </span>
              </div>

              <!-- YouTube Videos Grid -->
              <div
                v-if="getItemPosts(item).length > 0"
                :class="['grid gap-6', innerPostsGridClass(getItemPosts(item).length, 3)]"
              >
                <div
                  v-for="(post, pIdx) in getItemPosts(item)"
                  :key="`${item.id}-yt-${pIdx}`"
                  class="flex flex-col gap-3"
                >
                  <div
                    class="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-[#0d2627]"
                  >
                    <!-- Active Iframe Player -->
                    <iframe
                      v-if="
                        post.embed_url &&
                        (playingVideoKeys[`${item.id}-yt-${pIdx}`] ||
                          !post.thumbnail_url ||
                          brokenThumbs[`${item.id}-yt-${pIdx}`])
                      "
                      :title="post.title || item.title || 'Video de YouTube'"
                      :src="
                        playingVideoKeys[`${item.id}-yt-${pIdx}`]
                          ? getYoutubeAutoplayUrl(post.embed_url)
                          : post.embed_url
                      "
                      width="100%"
                      height="100%"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                      loading="lazy"
                      class="w-full h-full block"
                    ></iframe>

                    <!-- HD Thumbnail Preview with Play Button -->
                    <button
                      v-else-if="post.embed_url && post.thumbnail_url"
                      type="button"
                      @click="startVideo(`${item.id}-yt-${pIdx}`)"
                      :aria-label="`Reproducir ${post.title || 'video'}`"
                      class="w-full h-full relative group cursor-pointer block text-left"
                    >
                      <img
                        :src="post.thumbnail_url"
                        :alt="post.title || item.title || 'Video de YouTube'"
                        @error="markThumbBroken(`${item.id}-yt-${pIdx}`)"
                        class="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                      />
                      <div
                        class="absolute inset-0 bg-[#1b4d4f]/35 group-hover:bg-[#1b4d4f]/20 smooth-transition"
                      ></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div
                          class="w-16 h-16 rounded-[9999px] bg-[#d49e35] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 smooth-transition"
                        >
                          <span
                            class="material-symbols-outlined text-3xl"
                            style="font-variation-settings: 'FILL' 1;"
                          >
                            play_arrow
                          </span>
                        </div>
                      </div>
                    </button>

                    <!-- Direct Link Fallback -->
                    <a
                      v-else
                      :href="post.url || getProfileUrl(item)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-full h-full relative group block"
                    >
                      <img
                        v-if="post.thumbnail_url && !brokenThumbs[`${item.id}-yt-${pIdx}`]"
                        :src="post.thumbnail_url"
                        :alt="post.title || 'Video de YouTube'"
                        @error="markThumbBroken(`${item.id}-yt-${pIdx}`)"
                        class="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                      />
                      <div
                        class="absolute inset-0 bg-[#1b4d4f]/40 group-hover:bg-[#1b4d4f]/20 smooth-transition flex items-center justify-center"
                      >
                        <div
                          class="w-16 h-16 rounded-[9999px] bg-[#d49e35] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 smooth-transition"
                        >
                          <span
                            class="material-symbols-outlined text-3xl"
                            style="font-variation-settings: 'FILL' 1;"
                          >
                            play_arrow
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>

                  <div class="space-y-1">
                    <h3
                      v-if="post.title || (getItemPosts(item).length === 1 && item.title)"
                      class="font-headline text-lg sm:text-xl font-extrabold text-white leading-snug"
                    >
                      {{ post.title || item.title }}
                    </h3>
                    <p
                      v-if="post.description || (getItemPosts(item).length === 1 && item.description)"
                      class="text-sm text-white/80 leading-relaxed"
                    >
                      {{ post.description || item.description }}
                    </p>
                    <a
                      v-if="post.url && !getProfileUrl(item)"
                      :href="post.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1.5 text-xs font-headline font-bold uppercase tracking-wider text-[#d49e35] hover:text-white smooth-transition pt-1"
                    >
                      <span>Abrir en YouTube</span>
                      <span class="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="getProfileUrl(item) || item.author_name"
              class="pt-2 flex flex-wrap items-center justify-between gap-3"
            >
              <a
                v-if="getProfileUrl(item)"
                :href="getProfileUrl(item)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-[9999px] bg-white text-[#1b4d4f] hover:bg-[#d49e35] hover:text-white font-headline text-xs uppercase tracking-wider font-extrabold smooth-transition active:scale-95"
              >
                <span class="material-symbols-outlined text-lg">smart_display</span>
                <span>Ver en YouTube</span>
              </a>
              <span
                v-if="item.author_name"
                class="text-xs sm:text-sm text-white/75 font-medium truncate max-w-xs"
              >
                {{ item.author_name }}
              </span>
            </div>
          </article>

          <!-- INSTAGRAM MASTER CARD (Editorial Frameless Glassmorphic Style) -->
          <article
            v-else-if="normalizePlatform(item.platform) === 'instagram'"
            v-reveal="{ direction: 'up', delay: 80 + idx * 60 }"
            :class="[
              'bg-white/10 backdrop-blur-md text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15 flex flex-col justify-between gap-6',
              cardSpanClass(item)
            ]"
          >
            <div class="space-y-6">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span
                    class="w-8 h-8 rounded-[9999px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path
                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                      />
                    </svg>
                  </span>
                  <span
                    class="font-headline text-[11px] uppercase tracking-widest text-white font-extrabold truncate"
                  >
                    {{ item.subtitle || 'Instagram • Resucitados RCC' }}
                  </span>
                </div>
                <span
                  v-if="getItemPosts(item).length > 1"
                  class="px-3 py-1 rounded-[9999px] bg-[#d49e35]/20 text-[#f3d078] border border-[#d49e35]/30 font-headline text-[10px] uppercase font-extrabold shrink-0"
                >
                  {{ getItemPosts(item).length }} Publicaciones
                </span>
                <span v-else class="material-symbols-outlined text-[#f3d078] text-xl shrink-0">
                  photo_camera
                </span>
              </div>

              <!-- Editorial Instagram Posts / Reels Grid (clips Instagram's white header/footer & black sidebars) -->
              <div
                v-if="getItemPosts(item).length > 0"
                :class="[
                  'grid gap-6 items-stretch',
                  innerPostsGridClass(getItemPosts(item).length, 3)
                ]"
              >
                <div
                  v-for="(post, pIdx) in getItemPosts(item)"
                  :key="`${item.id}-ig-${pIdx}`"
                  class="bg-[#113335]/85 border border-white/10 hover:border-[#d49e35]/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-xl smooth-transition"
                >
                  <div class="space-y-4">
                    <!-- Custom Branded Post Mini-Header -->
                    <div class="flex items-center justify-between gap-2 px-1">
                      <div class="flex items-center gap-2 min-w-0">
                        <span
                          class="w-2 h-2 rounded-[9999px] bg-[#d49e35] shrink-0"
                        ></span>
                        <span class="font-headline text-[11px] font-bold tracking-wider uppercase text-white/80 truncate">
                          {{ isReelPost(post) ? 'Reel • @resucitadosrcc' : 'Post • @resucitadosrcc' }}
                        </span>
                      </div>
                      <a
                        v-if="post.url"
                        :href="post.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Abrir publicación en Instagram"
                        class="w-7 h-7 rounded-[9999px] bg-white/10 hover:bg-[#d49e35] text-white flex items-center justify-center smooth-transition shrink-0"
                      >
                        <span class="material-symbols-outlined text-sm">north_east</span>
                      </a>
                    </div>

                    <!-- Cropped Full-Bleed Embed Viewport -->
                    <div
                      v-if="post.embed_url"
                      :class="[
                        'relative mx-auto w-full rounded-2xl overflow-hidden bg-[#0a2122] ring-1 ring-white/15 shadow-lg',
                        isReelPost(post) ? 'max-w-[300px] h-[430px]' : 'max-w-[360px] h-[400px]'
                      ]"
                    >
                      <iframe
                        :title="post.title || item.title || 'Publicación de Instagram'"
                        :src="post.embed_url"
                        frameborder="0"
                        scrolling="no"
                        allowtransparency="true"
                        loading="lazy"
                        :class="[
                          'absolute left-1/2 -translate-x-1/2 border-0 bg-[#0a2122]',
                          isReelPost(post)
                            ? '-top-[56px] w-[420px] h-[640px]'
                            : '-top-[56px] w-[360px] h-[580px]'
                        ]"
                      ></iframe>
                    </div>
                  </div>

                  <!-- Post Title & Description -->
                  <div
                    v-if="post.title || post.description"
                    class="px-1 pt-1 space-y-1 text-left"
                  >
                    <h3
                      v-if="post.title"
                      class="font-headline text-lg font-extrabold text-white leading-snug"
                    >
                      {{ post.title }}
                    </h3>
                    <p
                      v-if="post.description"
                      class="text-sm text-white/75 leading-relaxed"
                    >
                      {{ post.description }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Profile-Only Fallback (when no posts are attached) -->
              <div
                v-else
                class="p-5 rounded-2xl bg-white/10 border border-white/15"
              >
                <h3 class="font-headline text-xl font-extrabold text-white">
                  {{ item.title || '@resucitadosrcc' }}
                </h3>
                <p v-if="item.description" class="text-sm text-white/80 mt-1.5 leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>

            <!-- Single Bottom Profile CTA -->
            <div class="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <a
                v-if="getProfileUrl(item)"
                :href="getProfileUrl(item)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-[9999px] bg-white text-[#1b4d4f] hover:bg-[#d49e35] hover:text-white font-headline text-xs uppercase tracking-wider font-extrabold shadow-md smooth-transition active:scale-95"
              >
                <span class="material-symbols-outlined text-lg">open_in_new</span>
                <span>Ver en Instagram</span>
              </a>
              <span class="text-xs sm:text-sm text-white/70 font-medium">
                @resucitadosrcc
              </span>
            </div>
          </article>

          <!-- FACEBOOK / OTHER PLATFORM CARD -->
          <article
            v-else
            v-reveal="{ direction: 'up', delay: 80 + idx * 60 }"
            :class="[
              'bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-5 border border-white/15',
              cardSpanClass(item)
            ]"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span
                    class="w-8 h-8 rounded-[9999px] bg-[#1877F2] flex items-center justify-center text-white shrink-0"
                  >
                    <svg
                      v-if="normalizePlatform(item.platform) === 'facebook'"
                      class="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 8H7v3h2v9h4v-9h3.625L17 8h-4V6.25c0-.97.5-1.25 1.25-1.25H17V1h-3c-3 0-5 1.5-5 4.5V8z"
                      />
                    </svg>
                    <span v-else class="material-symbols-outlined text-base">public</span>
                  </span>
                  <span
                    class="font-headline text-[11px] uppercase tracking-widest text-white/90 font-extrabold truncate"
                  >
                    {{ item.subtitle || `${item.platform} • Resucitados RCC` }}
                  </span>
                </div>
                <span class="material-symbols-outlined text-[#99f0fc] text-xl shrink-0">
                  groups
                </span>
              </div>

              <div
                v-if="item.thumbnail_url && !brokenThumbs[`${item.id}-fb`]"
                class="rounded-2xl overflow-hidden aspect-video bg-[#0d2627] shadow-lg"
              >
                <img
                  :src="item.thumbnail_url"
                  :alt="item.title || 'Facebook'"
                  @error="markThumbBroken(`${item.id}-fb`)"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="space-y-2 pt-1">
                <h3 class="font-headline text-xl sm:text-2xl font-extrabold text-white">
                  {{ item.title || 'Resucitados RCC' }}
                </h3>
                <p v-if="item.description" class="text-sm text-white/80 leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>

            <div class="pt-2 flex flex-wrap items-center justify-between gap-3">
              <a
                v-if="getProfileUrl(item)"
                :href="getProfileUrl(item)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-[9999px] bg-white text-[#1b4d4f] hover:bg-[#d49e35] hover:text-white font-headline text-xs uppercase tracking-wider font-extrabold smooth-transition active:scale-95"
              >
                <span class="material-symbols-outlined text-lg">open_in_new</span>
                <span>
                  {{
                    normalizePlatform(item.platform) === 'facebook'
                      ? 'Visitar en Facebook'
                      : 'Abrir enlace'
                  }}
                </span>
              </a>
              <span v-if="item.author_name" class="text-xs sm:text-sm text-white/70">
                {{ item.author_name }}
              </span>
            </div>
          </article>
        </template>
      </div>
    </div>
  </section>
</template>
