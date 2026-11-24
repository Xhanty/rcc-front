<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { resolveEventImageUrl } from '../../utils/image'

interface MemberPresentation {
  has_story?: boolean
  occupation?: string | null
  joined_since?: string | null
  testimony?: string | null
  favorite_verse?: string | null
}

interface MemberMinistry {
  id: number
  title: string
  role?: string | null
}

interface OrgMember {
  id: number
  user_id?: number | null
  name: string
  title?: string | null
  level: number
  role_group: string
  role_group_label?: string | null
  photo_url?: string | null
  has_presentation?: boolean
  presentation?: MemberPresentation | null
  ministries?: MemberMinistry[]
}

interface OrgTier {
  level: number
  role_group: string
  label: string
  members: OrgMember[]
}

const orgChart = ref<OrgTier[]>([])
const isLoading = ref(true)
const brokenPhotos = ref<Record<number, boolean>>({})
const selectedMember = ref<{ member: OrgMember; tierLabel: string } | null>(null)

const jesusHead: OrgMember = {
  id: 0,
  name: 'Jesucristo',
  title: 'Cabeza y Señor de la Comunidad',
  level: 0,
  role_group: 'head',
  role_group_label: 'Rey de Reyes y Señor de Señores',
  photo_url: '/img/jesucristo.jpg'
}

const markPhotoBroken = (id: number) => {
  brokenPhotos.value = { ...brokenPhotos.value, [id]: true }
}

const getMemberPhoto = (member: OrgMember): string => {
  if (!member.photo_url || brokenPhotos.value[member.id]) return ''
  if (member.photo_url.startsWith('/img/')) return member.photo_url
  return resolveEventImageUrl(member.photo_url)
}

const getInitials = (name: string): string => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'RC'
  if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase()
  return `${(parts[0] || '')[0] || ''}${(parts[parts.length - 1] || '')[0] || ''}`.toUpperCase()
}

const getTierBadgeClass = (level: number): string => {
  if (level === 1) {
    return 'bg-[#1b4d4f] text-[#f3d078] border border-[#d49e35]/50 shadow-md'
  }
  if (level === 2) {
    return 'bg-[#007681] text-white border border-[#007681] shadow-sm'
  }
  if (level === 3) {
    return 'bg-[#d49e35] text-[#102e30] border border-[#d49e35] shadow-sm'
  }
  return 'bg-white text-[#1b4d4f] border border-[#1b4d4f]/20 shadow-sm'
}

const getTierIcon = (roleGroup: string, level: number): string => {
  if (roleGroup === 'spiritual_director' || level === 1) return 'church'
  if (roleGroup === 'general_coordinator' || level === 2) return 'workspace_premium'
  if (roleGroup === 'base_group' || level === 3) return 'foundation'
  return 'groups'
}

const fetchServants = async () => {
  isLoading.value = true
  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/servants`
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

    if (Array.isArray(payload?.org_chart) && payload.org_chart.length > 0) {
      orgChart.value = [...payload.org_chart]
        .filter((tier: OrgTier) => Array.isArray(tier?.members) && tier.members.length > 0)
        .sort((a: OrgTier, b: OrgTier) => Number(a.level) - Number(b.level))
      return
    }

    const flatItems: OrgMember[] = Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : []

    if (flatItems.length > 0) {
      const grouped = new Map<number, OrgTier>()
      for (const member of flatItems) {
        const lvl = Number(member.level || 5)
        if (!grouped.has(lvl)) {
          grouped.set(lvl, {
            level: lvl,
            role_group: member.role_group || `level_${lvl}`,
            label: member.role_group_label || member.title || `Nivel ${lvl}`,
            members: []
          })
        }
        grouped.get(lvl)!.members.push(member)
      }
      orgChart.value = Array.from(grouped.values()).sort((a, b) => a.level - b.level)
    }
  } catch (error) {
    console.error('Error fetching servants org chart:', error)
  } finally {
    isLoading.value = false
  }
}

const hasPresentation = (member: OrgMember): boolean => {
  if (member.has_presentation || member.presentation?.has_story) return true
  const p = member.presentation
  return Boolean(p?.occupation || p?.joined_since || p?.testimony || p?.favorite_verse)
}

const formatMinistryRole = (role?: string | null): string => {
  if (!role) return ''
  const r = role.toLowerCase()
  if (r === 'leader') return 'Líder'
  if (r === 'servant') return 'Servidor'
  return role
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedMember.value) {
    selectedMember.value = null
  }
}

onMounted(() => {
  fetchServants()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="font-jakarta">
    <!-- Equipo de Servidores (Organigrama Arquitectónico Compacto) -->
    <section
      id="equipo"
      class="relative bg-[#eaf2f1] border-y border-[#1b4d4f]/10 py-16 sm:py-20 scroll-mt-24 overflow-hidden org-canvas"
    >
      <!-- Ambient Corner Glows -->
      <div
        aria-hidden="true"
        class="absolute -top-24 -right-24 w-80 h-80 rounded-[9999px] bg-[#007681]/10 blur-3xl pointer-events-none"
      ></div>
      <div
        aria-hidden="true"
        class="absolute -bottom-24 -left-24 w-80 h-80 rounded-[9999px] bg-[#d49e35]/10 blur-3xl pointer-events-none"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <!-- Section Header -->
        <div
          v-reveal="{ direction: 'up', delay: 50 }"
          class="text-center max-w-2xl mx-auto mb-12 space-y-3"
        >
          <span
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-[9999px] bg-white/85 border border-[#1b4d4f]/15 text-[#006972] font-headline text-[11px] uppercase tracking-[0.22em] font-extrabold shadow-sm"
          >
            <span class="w-2 h-2 rounded-[9999px] bg-[#d49e35]"></span>
            Organigrama Comunitario
          </span>
          <h2
            class="font-headline font-black text-3xl sm:text-5xl text-[#1b4d4f] uppercase tracking-tight"
          >
            Equipo de Servidores
          </h2>
          <p class="text-[#324040] text-sm sm:text-base leading-relaxed">
            Estructura de servicio fraterno guiada por el Espíritu Santo para acompañar a toda la
            comunidad.
          </p>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="flex flex-col items-center gap-6 py-4">
          <div class="w-72 h-24 rounded-3xl bg-white/70 animate-pulse"></div>
          <div class="w-0.5 h-6 bg-[#1b4d4f]/15"></div>
          <div class="flex flex-wrap justify-center gap-4 w-full">
            <div
              v-for="n in 4"
              :key="n"
              class="w-44 h-40 rounded-2xl bg-white/70 animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Architectural Organigram Tree (Compact so multiple levels are visible together) -->
        <div v-else class="flex flex-col items-center">
          <!-- LEVEL 0: JESUCRISTO — Cabeza y Señor de la Comunidad -->
          <div class="w-full flex flex-col items-center">
            <div v-reveal="{ direction: 'up', delay: 20 }" class="flex flex-col items-center mb-4">
              <div
                class="inline-flex items-center gap-2 px-4 py-1.5 rounded-[9999px] bg-gradient-to-r from-[#d49e35] to-[#e5b54f] text-[#102e30] font-headline text-[11px] font-black uppercase tracking-widest shadow-md"
              >
                <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">
                  auto_awesome
                </span>
                <span>Cabeza de la Comunidad</span>
              </div>
              <div aria-hidden="true" class="w-0.5 h-3.5 bg-[#d49e35]/70"></div>
            </div>

            <button
              type="button"
              @click="selectedMember = { member: jesusHead, tierLabel: 'Cabeza de la Comunidad' }"
              v-reveal="{ direction: 'scale', delay: 40 }"
              class="group relative bg-gradient-to-br from-[#1b4d4f] via-[#13383a] to-[#0e2a2c] text-white rounded-[2rem] px-6 py-5 border-2 border-[#d49e35] shadow-2xl shadow-[#1b4d4f]/25 hover:shadow-[#d49e35]/30 hover:-translate-y-1 smooth-transition flex items-center gap-5 text-left w-full max-w-md cursor-pointer overflow-hidden"
            >
              <!-- Subtle Golden Halo Glow -->
              <div
                aria-hidden="true"
                class="absolute -left-6 -top-6 w-36 h-36 rounded-[9999px] bg-[#d49e35]/20 blur-2xl pointer-events-none"
              ></div>

              <div
                class="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-[9999px] overflow-hidden ring-[3px] ring-[#f3d078] shadow-lg shadow-black/30 bg-[#12383A] shrink-0"
              >
                <img
                  :src="jesusHead.photo_url!"
                  alt="Jesucristo — Cabeza y Señor de la Comunidad"
                  class="w-full h-full object-cover object-top group-hover:scale-105 smooth-transition"
                />
              </div>

              <div class="relative z-10 min-w-0 space-y-1">
                <span
                  class="font-headline text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#f3d078] block"
                >
                  Rey de Reyes y Señor de Señores
                </span>
                <h3 class="font-headline font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">
                  Jesucristo
                </h3>
                <p class="font-headline text-[11px] font-bold uppercase tracking-wider text-white/85">
                  Cabeza y Señor de la Comunidad
                </p>
                <p class="text-[11px] text-[#f3d078]/85 italic pt-0.5">
                  «Él es la cabeza del cuerpo, que es la Iglesia» — Col 1, 18
                </p>
              </div>
            </button>
          </div>

          <div
            v-for="(tier, tierIdx) in orgChart"
            :key="tier.role_group || tier.level"
            class="w-full flex flex-col items-center"
          >
            <!-- Vertical Connector Trunk from Previous Level (including from Jesucristo -> Level 1) -->
            <div aria-hidden="true" class="flex flex-col items-center">
              <div
                :class="[
                  'w-0.5 h-6',
                  tierIdx === 0
                    ? 'bg-gradient-to-b from-[#d49e35] to-[#1b4d4f]/45'
                    : 'bg-gradient-to-b from-[#1b4d4f]/25 to-[#1b4d4f]/45'
                ]"
              ></div>
              <span class="w-2 h-2 rounded-[9999px] bg-[#d49e35] ring-4 ring-[#d49e35]/20"></span>
              <div class="w-0.5 h-3 bg-[#1b4d4f]/30"></div>
            </div>

            <!-- Level Label Pill -->
            <div
              v-reveal="{ direction: 'up', delay: 30 + tierIdx * 40 }"
              class="flex flex-col items-center mb-4"
            >
              <div
                :class="[
                  'inline-flex items-center gap-2 px-4 py-1.5 rounded-[9999px] font-headline text-[11px] font-extrabold uppercase tracking-widest',
                  getTierBadgeClass(tier.level)
                ]"
              >
                <span class="material-symbols-outlined text-sm">
                  {{ getTierIcon(tier.role_group, tier.level) }}
                </span>
                <span>{{ tier.label }}</span>
              </div>

              <!-- Stem down to cards -->
              <div aria-hidden="true" class="w-0.5 h-4 bg-[#1b4d4f]/25"></div>

              <!-- Horizontal Branching Bar (when level has 2+ members) -->
              <div
                v-if="tier.members.length > 1"
                aria-hidden="true"
                class="hidden md:block h-0.5 bg-gradient-to-r from-transparent via-[#1b4d4f]/30 to-transparent rounded-full"
                :style="{ width: `${Math.min(tier.members.length * 180, 760)}px` }"
              ></div>
            </div>

            <!-- LEVEL 1: Featured Horizontal Flagship Node(s) (Director Espiritual) -->
            <div
              v-if="tier.level === 1"
              class="w-full flex flex-wrap justify-center gap-4 sm:gap-5"
            >
              <button
                v-for="(member, mIdx) in tier.members"
                :key="member.id"
                type="button"
                @click="selectedMember = { member, tierLabel: tier.label }"
                v-reveal="{ direction: 'scale', delay: 40 + mIdx * 50 }"
                class="group bg-[#1b4d4f] text-white rounded-3xl px-5 py-4 border-2 border-[#d49e35]/65 shadow-xl shadow-[#1b4d4f]/20 hover:shadow-2xl hover:-translate-y-1 smooth-transition flex items-center gap-4 text-left w-full max-w-sm cursor-pointer"
              >
                <div
                  class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[9999px] overflow-hidden ring-[3px] ring-[#d49e35] bg-[#12383A] shrink-0 shadow-md"
                >
                  <img
                    v-if="getMemberPhoto(member)"
                    :src="getMemberPhoto(member)"
                    :alt="member.name"
                    @error="markPhotoBroken(member.id)"
                    class="w-full h-full object-cover object-top group-hover:scale-105 smooth-transition"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center font-headline font-black text-xl text-[#f3d078]"
                  >
                    {{ getInitials(member.name) }}
                  </div>
                </div>
                <div class="min-w-0">
                  <span
                    class="font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#d49e35] block"
                  >
                    {{ member.title || member.role_group_label || tier.label }}
                  </span>
                  <h3 class="font-headline font-extrabold text-lg sm:text-xl text-white leading-snug mt-0.5 truncate">
                    {{ member.name }}
                  </h3>
                  <span
                    v-if="hasPresentation(member)"
                    class="inline-flex items-center gap-1 mt-1.5 text-[10px] font-headline font-bold uppercase tracking-wider text-[#f3d078]/90 group-hover:text-white smooth-transition"
                  >
                    <span class="material-symbols-outlined text-xs">auto_stories</span>
                    <span>Conocer historia</span>
                  </span>
                </div>
              </button>
            </div>

            <!-- LEVEL 2: Prominent Horizontal Coordinator Node(s) -->
            <div
              v-else-if="tier.level === 2"
              class="w-full flex flex-wrap justify-center gap-4 sm:gap-5"
            >
              <button
                v-for="(member, mIdx) in tier.members"
                :key="member.id"
                type="button"
                @click="selectedMember = { member, tierLabel: tier.label }"
                v-reveal="{ direction: 'up', delay: 40 + mIdx * 50 }"
                class="group bg-white rounded-2xl px-4 py-3.5 border-2 border-[#007681]/30 hover:border-[#007681] shadow-md hover:shadow-xl hover:-translate-y-1 smooth-transition flex items-center gap-3.5 text-left w-full max-w-xs cursor-pointer"
              >
                <div
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-[9999px] overflow-hidden ring-2 ring-[#007681]/35 group-hover:ring-[#d49e35] bg-[#eaf2f1] shrink-0 smooth-transition"
                >
                  <img
                    v-if="getMemberPhoto(member)"
                    :src="getMemberPhoto(member)"
                    :alt="member.name"
                    @error="markPhotoBroken(member.id)"
                    class="w-full h-full object-cover object-top group-hover:scale-105 smooth-transition"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gradient-to-br from-[#1b4d4f] to-[#007681] flex items-center justify-center font-headline font-black text-base text-[#f3d078]"
                  >
                    {{ getInitials(member.name) }}
                  </div>
                </div>
                <div class="min-w-0">
                  <h3
                    class="font-headline font-bold text-base text-[#1b4d4f] group-hover:text-[#007681] smooth-transition leading-snug truncate"
                  >
                    {{ member.name }}
                  </h3>
                  <p class="font-headline text-[10px] uppercase tracking-wider text-[#007681] font-bold mt-0.5 truncate">
                    {{ member.title || member.role_group_label || tier.label }}
                  </p>
                  <span
                    v-if="hasPresentation(member)"
                    class="inline-flex items-center gap-1 mt-1 text-[10px] font-headline font-bold text-[#b58122] group-hover:text-[#1b4d4f] smooth-transition"
                  >
                    <span class="material-symbols-outlined text-xs">auto_stories</span>
                    <span>{{ member.presentation?.occupation || 'Conocer historia' }}</span>
                  </span>
                </div>
              </button>
            </div>

            <!-- LEVELS 3, 4, 5: Compact Scannable Organigram Nodes -->
            <div
              v-else
              class="w-full flex flex-wrap justify-center gap-4 sm:gap-5"
            >
              <button
                v-for="(member, mIdx) in tier.members"
                :key="member.id"
                type="button"
                @click="selectedMember = { member, tierLabel: tier.label }"
                v-reveal="{ direction: 'up', delay: 40 + mIdx * 45 }"
                class="group relative bg-white rounded-2xl px-4 py-4 border border-[#1b4d4f]/12 hover:border-[#d49e35]/70 shadow-sm hover:shadow-lg hover:-translate-y-1 smooth-transition flex flex-col items-center text-center w-[156px] sm:w-[186px] cursor-pointer"
              >
                <!-- Top Tiny Connector Tick -->
                <span
                  aria-hidden="true"
                  class="hidden md:block absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-[9999px] bg-white border-2 border-[#1b4d4f]/30 group-hover:border-[#d49e35] smooth-transition"
                ></span>

                <!-- Circular Avatar -->
                <div
                  class="w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-[9999px] overflow-hidden ring-2 ring-[#eaf2f1] group-hover:ring-[#d49e35] bg-[#eaf2f1] mb-3 shadow-sm smooth-transition"
                >
                  <img
                    v-if="getMemberPhoto(member)"
                    :src="getMemberPhoto(member)"
                    :alt="member.name"
                    @error="markPhotoBroken(member.id)"
                    class="w-full h-full object-cover object-top group-hover:scale-105 smooth-transition"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gradient-to-br from-[#1b4d4f] to-[#007681] flex items-center justify-center font-headline font-black text-lg text-[#f3d078]"
                  >
                    {{ getInitials(member.name) }}
                  </div>
                </div>

                <!-- Name & Role -->
                <h3
                  class="font-headline font-bold text-sm text-[#1b4d4f] group-hover:text-[#007681] smooth-transition leading-snug line-clamp-2"
                >
                  {{ member.name }}
                </h3>
                <p
                  class="font-headline text-[10px] uppercase tracking-wider text-[#006972]/90 font-semibold mt-1 line-clamp-2"
                >
                  {{ member.title || member.role_group_label || tier.label }}
                </p>

                <!-- Subtle Story / Occupation Indicator -->
                <span
                  v-if="hasPresentation(member)"
                  class="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[9999px] bg-[#eaf2f1] group-hover:bg-[#d49e35]/20 text-[#1b4d4f] font-headline text-[9px] font-extrabold uppercase tracking-wider smooth-transition max-w-full"
                >
                  <span class="material-symbols-outlined text-[11px] text-[#d49e35] shrink-0">
                    auto_stories
                  </span>
                  <span class="truncate">
                    {{ member.presentation?.occupation || 'Ver historia' }}
                  </span>
                </span>
              </button>
            </div>
          </div>
          <!-- Subtle Empty State if no servants registered yet -->
          <div
            v-if="orgChart.length === 0"
            class="mt-8 text-center py-8 px-6 rounded-3xl bg-white/80 border border-[#1b4d4f]/10 text-[#404848] max-w-md"
          >
            <p class="text-sm">
              Próximamente conocerás aquí al equipo de servidores de nuestra comunidad.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Portrait & Personal Story Modal -->
    <transition name="fade">
      <div
        v-if="selectedMember"
        @click.self="selectedMember = null"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-[85] bg-[#002021]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      >
        <div
          :class="[
            'bg-white rounded-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#1b4d4f]/15 relative flex flex-col',
            hasPresentation(selectedMember.member) ||
            (selectedMember.member.ministries && selectedMember.member.ministries.length > 0)
              ? 'max-w-2xl'
              : 'max-w-xs'
          ]"
        >
          <button
            type="button"
            @click="selectedMember = null"
            aria-label="Cerrar"
            class="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-[9999px] bg-[#1b4d4f]/85 hover:bg-[#1b4d4f] text-white flex items-center justify-center smooth-transition cursor-pointer shadow-md"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>

          <!-- Rich Two-Column Layout when Presentation or Ministries exist -->
          <div
            v-if="
              hasPresentation(selectedMember.member) ||
              (selectedMember.member.ministries && selectedMember.member.ministries.length > 0)
            "
            class="grid grid-cols-1 md:grid-cols-12 overflow-y-auto"
          >
            <!-- Left Portrait Column -->
            <div
              class="md:col-span-5 bg-[#1b4d4f] text-white flex flex-col justify-between relative"
            >
              <div class="aspect-[4/4] md:aspect-auto md:h-full min-h-[260px] relative overflow-hidden bg-[#12383A]">
                <img
                  v-if="getMemberPhoto(selectedMember.member)"
                  :src="getMemberPhoto(selectedMember.member)"
                  :alt="selectedMember.member.name"
                  class="w-full h-full object-cover object-top"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-[#1b4d4f] to-[#007681] flex items-center justify-center font-headline font-black text-6xl text-[#f3d078]"
                >
                  {{ getInitials(selectedMember.member.name) }}
                </div>
                <div
                  class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0f2e30]/95 via-[#0f2e30]/50 to-transparent"
                ></div>
                <div class="absolute bottom-4 left-4 right-4 text-left">
                  <span
                    class="inline-block px-3 py-1 rounded-[9999px] bg-[#d49e35] text-[#102e30] font-headline text-[10px] font-black uppercase tracking-widest mb-1.5"
                  >
                    {{ selectedMember.tierLabel }}
                  </span>
                  <h3 class="font-headline font-extrabold text-xl leading-tight text-white">
                    {{ selectedMember.member.name }}
                  </h3>
                  <p class="font-headline text-[11px] uppercase tracking-wider text-[#f3d078] font-bold mt-0.5">
                    {{ selectedMember.member.title || selectedMember.member.role_group_label }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Right Human Story Column -->
            <div class="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5 text-left">
              <div class="space-y-4">
                <!-- Occupation & Joined Since Chips -->
                <div
                  v-if="
                    selectedMember.member.presentation?.occupation ||
                    selectedMember.member.presentation?.joined_since
                  "
                  class="flex flex-wrap gap-2 pr-6"
                >
                  <span
                    v-if="selectedMember.member.presentation?.occupation"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9999px] bg-[#eaf2f1] text-[#1b4d4f] font-headline text-[11px] font-bold"
                  >
                    <span class="material-symbols-outlined text-sm text-[#007681]">work</span>
                    <span>{{ selectedMember.member.presentation.occupation }}</span>
                  </span>
                  <span
                    v-if="selectedMember.member.presentation?.joined_since"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9999px] bg-[#d49e35]/15 text-[#8a6113] font-headline text-[11px] font-bold"
                  >
                    <span class="material-symbols-outlined text-sm text-[#d49e35]">calendar_month</span>
                    <span>{{ selectedMember.member.presentation.joined_since }}</span>
                  </span>
                </div>

                <!-- Personal Testimony -->
                <div v-if="selectedMember.member.presentation?.testimony" class="space-y-1.5">
                  <span
                    class="font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#007681] block"
                  >
                    Mi historia en Resucitados
                  </span>
                  <p class="text-sm text-[#323a3a] leading-relaxed whitespace-pre-line">
                    {{ selectedMember.member.presentation.testimony }}
                  </p>
                </div>

                <!-- Favorite Bible Verse / Quote -->
                <div
                  v-if="selectedMember.member.presentation?.favorite_verse"
                  class="p-4 rounded-2xl bg-[#eaf2f1]/75 border-l-4 border-[#d49e35] text-sm italic text-[#1b4d4f] font-medium leading-relaxed"
                >
                  {{ selectedMember.member.presentation.favorite_verse }}
                </div>

                <!-- Ministries Served -->
                <div
                  v-if="selectedMember.member.ministries && selectedMember.member.ministries.length > 0"
                  class="space-y-2 pt-1"
                >
                  <span
                    class="font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#707979] block"
                  >
                    Ministerios donde sirve
                  </span>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="min in selectedMember.member.ministries"
                      :key="min.id"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-[9999px] bg-[#f6f9f8] border border-[#1b4d4f]/15 text-xs font-bold text-[#1b4d4f]"
                    >
                      <span class="w-1.5 h-1.5 rounded-[9999px] bg-[#d49e35]"></span>
                      <span>{{ min.title }}</span>
                      <span
                        v-if="formatMinistryRole(min.role)"
                        class="text-[10px] text-[#007681] font-extrabold uppercase"
                      >
                        · {{ formatMinistryRole(min.role) }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-[#eaf2f1] flex justify-end">
                <button
                  type="button"
                  @click="selectedMember = null"
                  class="px-6 py-2.5 rounded-[9999px] bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>

          <!-- Compact Portrait View (Jesucristo or members without presentation yet) -->
          <div v-else class="text-center">
            <div class="aspect-[4/5] w-full bg-[#eaf2f1] overflow-hidden">
              <img
                v-if="getMemberPhoto(selectedMember.member)"
                :src="getMemberPhoto(selectedMember.member)"
                :alt="selectedMember.member.name"
                class="w-full h-full object-cover object-top"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-[#1b4d4f] to-[#007681] flex items-center justify-center font-headline font-black text-5xl text-[#f3d078]"
              >
                {{ getInitials(selectedMember.member.name) }}
              </div>
            </div>

            <div class="p-5 space-y-1">
              <span
                class="inline-block px-3 py-1 rounded-[9999px] bg-[#eaf2f1] text-[#006972] font-headline text-[10px] font-extrabold uppercase tracking-widest mb-1"
              >
                {{ selectedMember.tierLabel }}
              </span>
              <h3 class="font-headline font-extrabold text-xl text-[#1b4d4f]">
                {{ selectedMember.member.name }}
              </h3>
              <p class="font-headline text-xs uppercase tracking-wider text-[#007681] font-semibold">
                {{ selectedMember.member.title || selectedMember.member.role_group_label }}
              </p>
              <p
                v-if="selectedMember.member.level === 0"
                class="text-xs text-[#404848] italic pt-2"
              >
                «Él es la cabeza del cuerpo, que es la Iglesia» — Col 1, 18
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Call to Action Banner -->
    <section class="max-w-7xl mx-auto px-6 lg:px-12 py-14 pb-20">
      <div
        v-reveal="{ direction: 'scale', delay: 80 }"
        class="bg-[#1b4d4f] text-white rounded-[2.5rem] p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-xl shadow-[#1b4d4f]/20"
      >
        <div
          class="absolute -right-16 -bottom-16 w-80 h-80 rounded-[9999px] bg-[#007681]/40 blur-3xl pointer-events-none"
        ></div>

        <div class="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <span
            class="inline-block px-4 py-1.5 rounded-[9999px] bg-[#d49e35] text-[#1b1c1c] font-headline text-xs font-black uppercase tracking-widest"
          >
            Bienvenido a Casa
          </span>

          <h2
            class="font-headline font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-tight"
          >
            ¿Quieres ser parte de nuestra historia?
          </h2>

          <p class="text-white/80 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
            Estamos con las puertas y el corazón abiertos para recibirte en nuestra próxima asamblea
            de oración, formación y adoración.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#events"
              class="w-full sm:w-auto bg-[#d49e35] text-[#1b1c1c] hover:bg-[#e2ac41] px-8 py-4 rounded-[9999px] font-headline font-black text-xs uppercase tracking-widest smooth-transition shadow-md active:scale-95 text-center"
            >
              Ver Calendario de Asambleas
            </a>
            <a
              href="#contact"
              class="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#1b4d4f] px-8 py-4 rounded-[9999px] font-headline font-bold text-xs uppercase tracking-widest smooth-transition active:scale-95 text-center"
            >
              Escríbenos Directamente
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.org-canvas {
  background-image: radial-gradient(rgba(27, 77, 79, 0.11) 1px, transparent 1px);
  background-size: 22px 22px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
