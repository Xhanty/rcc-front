<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface FooterSocialItem {
  id: number
  platform: string
  title?: string | null
  url?: string | null
  profile_url?: string | null
  show_in_footer?: boolean
  sort_order?: number
}

const currentYear = new Date().getFullYear()

const fallbackFooterSocials: FooterSocialItem[] = [
  {
    id: -1,
    platform: 'instagram',
    title: 'Instagram',
    url: 'https://www.instagram.com/resucitadosrcc',
    sort_order: 1
  },
  {
    id: -2,
    platform: 'facebook',
    title: 'Facebook',
    url: 'https://www.facebook.com/share/1CYRbLsNjd',
    sort_order: 2
  }
]

const footerSocials = ref<FooterSocialItem[]>(fallbackFooterSocials)

const normalizePlatform = (platform?: string): string =>
  (platform || '').trim().toLowerCase()

const getPlatformLabel = (item: FooterSocialItem): string => {
  const p = normalizePlatform(item.platform)
  if (p === 'instagram') return 'Instagram'
  if (p === 'facebook') return 'Facebook'
  if (p === 'youtube') return 'YouTube'
  if (p === 'spotify') return 'Spotify'
  return item.title?.trim() || item.platform || 'Red Social'
}

const fetchFooterSocials = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/social-media?placement=footer`
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
    const payload = resJson?.data ?? resJson
    const rawList: FooterSocialItem[] = Array.isArray(payload?.footer)
      ? payload.footer
      : Array.isArray(payload?.items)
        ? payload.items.filter((i: FooterSocialItem) => i.show_in_footer === true)
        : Array.isArray(payload)
          ? payload
          : []

    if (rawList.length > 0) {
      footerSocials.value = [...rawList].sort(
        (a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0)
      )
    }
  } catch (error) {
    console.error('Error fetching footer social links:', error)
  }
}

const openTermsModal = () => {
  window.dispatchEvent(new CustomEvent('open-terms-modal'))
}

onMounted(() => {
  fetchFooterSocials()
})
</script>

<template>
  <footer
    id="footer"
    class="relative z-50 bg-[#1b4d4f] text-white -mt-8 pt-16 pb-12 rounded-t-[2.75rem] border-t border-white/10 shadow-[0_-20px_55px_rgba(0,26,28,0.2)] font-jakarta"
  >
    <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
      <div
        class="flex flex-col lg:flex-row justify-between items-start gap-12 pb-14 border-b border-white/10"
      >
        <!-- Brand Column -->
        <div class="max-w-sm">
          <a href="#" class="flex items-center gap-3 mb-4 group">
            <div
              class="h-10 w-10 rounded-[9999px] bg-white flex items-center justify-center p-1.5 shadow-sm ring-4 ring-white/10 group-hover:scale-105 smooth-transition shrink-0"
            >
              <img
                alt="Resucitados RCC Logo"
                class="h-full w-full object-contain"
                src="/img/icon.png"
              />
            </div>
            <span class="font-headline font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight">
              Resucitados RCC
            </span>
          </a>

          <p class="text-white/75 text-sm leading-relaxed font-normal">
            Llevando la luz de la fe a cada rincón, encendidos por el poder transformador del
            Espíritu Santo.
          </p>
        </div>

        <!-- Links & Contact Columns -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-14 w-full lg:w-auto">
          <!-- Enlaces -->
          <div>
            <h4 class="font-headline text-xs font-extrabold text-[#d49e35] uppercase tracking-widest mb-4">
              Enlaces
            </h4>
            <ul class="space-y-2.5 text-sm text-white/80 font-medium">
              <li>
                <a class="hover:text-white smooth-transition" href="#">Inicio</a>
              </li>
              <li>
                <a class="hover:text-white smooth-transition" href="#about">Nosotros</a>
              </li>
              <li>
                <a class="hover:text-white smooth-transition" href="#community">Vida Comunitaria</a>
              </li>
              <li>
                <a class="hover:text-white smooth-transition" href="#ministries">Ministerios</a>
              </li>
              <li>
                <a class="hover:text-white smooth-transition" href="#events">Eventos</a>
              </li>
              <li>
                <a class="hover:text-white smooth-transition" href="#contact">Contáctanos</a>
              </li>
            </ul>
          </div>

          <!-- Síguenos (Dinámico desde /configuration/social-media) -->
          <div>
            <h4 class="font-headline text-xs font-extrabold text-[#d49e35] uppercase tracking-widest mb-4">
              Síguenos
            </h4>
            <ul class="space-y-3 text-sm text-white/80 font-medium">
              <li v-for="social in footerSocials" :key="social.id">
                <a
                  v-if="social.profile_url || social.url"
                  :href="social.profile_url || social.url || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2.5 hover:text-white smooth-transition group"
                >
                  <!-- Instagram -->
                  <svg
                    v-if="normalizePlatform(social.platform) === 'instagram'"
                    class="w-4 h-4 fill-current text-[#d49e35] group-hover:scale-110 smooth-transition shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                    />
                  </svg>
                  <!-- Facebook -->
                  <svg
                    v-else-if="normalizePlatform(social.platform) === 'facebook'"
                    class="w-4 h-4 fill-current text-[#d49e35] group-hover:scale-110 smooth-transition shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 8H7v3h2v9h4v-9h3.625L17 8h-4V6.25c0-.97.5-1.25 1.25-1.25H17V1h-3c-3 0-5 1.5-5 4.5V8z"
                    />
                  </svg>
                  <!-- YouTube -->
                  <svg
                    v-else-if="normalizePlatform(social.platform) === 'youtube'"
                    class="w-4 h-4 fill-current text-[#d49e35] group-hover:scale-110 smooth-transition shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                  <!-- Spotify -->
                  <svg
                    v-else-if="normalizePlatform(social.platform) === 'spotify'"
                    class="w-4 h-4 fill-current text-[#d49e35] group-hover:scale-110 smooth-transition shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                    />
                  </svg>
                  <!-- Fallback Icon -->
                  <span
                    v-else
                    class="material-symbols-outlined text-base text-[#d49e35] group-hover:scale-110 smooth-transition shrink-0"
                  >
                    public
                  </span>
                  <span>{{ getPlatformLabel(social) }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Información de Contacto -->
          <div>
            <h4 class="font-headline text-xs font-extrabold text-[#d49e35] uppercase tracking-widest mb-4">
              Contacto
            </h4>
            <ul class="space-y-3 text-sm text-white/80 font-medium">
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[#d49e35] text-base mt-0.5 shrink-0">
                  location_on
                </span>
                <span>Calle 60 #50-16<br />(Casa Palotinos) - Medellín</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#d49e35] text-base shrink-0">mail</span>
                <a
                  href="mailto:resucitadoscomunidad@gmail.com"
                  class="hover:text-white hover:underline smooth-transition break-all"
                >
                  resucitadoscomunidad@gmail.com
                </a>
              </li>
              <li class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#d49e35] text-base shrink-0">call</span>
                <a
                  href="tel:+573103748739"
                  class="hover:text-white hover:underline smooth-transition"
                >
                  +57 310 3748739
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Copyright Bar -->
      <div
        class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4"
      >
        <p>© {{ currentYear }} Resucitados RCC. Todos los derechos reservados.</p>
        <div class="flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            @click="openTermsModal"
            class="hover:text-white smooth-transition cursor-pointer"
          >
            Términos y Política de Datos
          </button>
          <a class="hover:text-white smooth-transition" href="#contact">Contáctanos</a>
        </div>
      </div>
    </div>
  </footer>
</template>
