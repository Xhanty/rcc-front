<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface BirthdayPerson {
  id: number
  name: string
  day: number
  month: number
  date: string
  formatted_date: string
  is_today: boolean
}

const monthName = ref('')
const totalBirthdays = ref(0)
const birthdays = ref<BirthdayPerson[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const showAll = ref(false)
const blessedIds = ref<Record<number, boolean>>({})

const INITIAL_VISIBLE = 8

const getInitials = (fullName: string): string => {
  const words = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return (words[0] || '').slice(0, 2).toUpperCase()
  return `${(words[0] || '').charAt(0)}${(words[1] || '').charAt(0)}`.toUpperCase()
}

const fetchBirthdays = async () => {
  isLoading.value = true
  hasError.value = false

  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/birthdays`
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
      throw new Error(`Failed to fetch birthdays (${response.status})`)
    }

    const resJson = await response.json()
    const payload = resJson?.data ?? resJson

    monthName.value = payload?.month_name || ''
    const rawList = Array.isArray(payload?.birthdays)
      ? payload.birthdays
      : Array.isArray(payload)
        ? payload
        : []

    birthdays.value = rawList.map((item: any) => ({
      id: item.id,
      name: item.name || 'Hermano de la comunidad',
      day: Number(item.day ?? 0),
      month: Number(item.month ?? 0),
      date: item.date || '',
      formatted_date: item.formatted_date || item.date || '',
      is_today: Boolean(item.is_today)
    }))

    totalBirthdays.value = Number(payload?.total ?? birthdays.value.length)
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching birthdays:', error)
    hasError.value = true
    birthdays.value = []
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBirthdays()
})

const getCurrentWeekRange = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // Monday (0) through Sunday (6)
  const dayOfWeek = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { monday, sunday, year: now.getFullYear() }
}

const isInCurrentWeek = (person: BirthdayPerson): boolean => {
  if (person.is_today) return true
  if (!person.day || !person.month) return false
  const { monday, sunday, year } = getCurrentWeekRange()
  const candidate = new Date(year, person.month - 1, person.day)
  return candidate.getTime() >= monday.getTime() && candidate.getTime() <= sunday.getTime()
}

// Filter to current week only (Monday - Sunday), prioritizing today's birthdays first
const sortedBirthdays = computed(() => {
  return birthdays.value
    .filter(isInCurrentWeek)
    .sort((a, b) => {
      if (a.is_today !== b.is_today) return a.is_today ? -1 : 1
      if (a.day !== b.day) return a.day - b.day
      return a.name.localeCompare(b.name)
    })
})

const visibleBirthdays = computed(() => {
  if (showAll.value || sortedBirthdays.value.length <= INITIAL_VISIBLE) {
    return sortedBirthdays.value
  }
  return sortedBirthdays.value.slice(0, INITIAL_VISIBLE)
})

const hasMore = computed(() => sortedBirthdays.value.length > INITIAL_VISIBLE)

const todayCount = computed(() => sortedBirthdays.value.filter((b) => b.is_today).length)

const weekCount = computed(() => sortedBirthdays.value.length)

const sendBlessing = (id: number) => {
  blessedIds.value = { ...blessedIds.value, [id]: true }
}
</script>

<template>
  <section
    id="cumpleanos"
    class="bg-[#eaf2f1]/60 px-6 lg:px-12 py-20 sm:py-24 relative font-jakarta scroll-mt-24"
  >
    <div class="max-w-7xl mx-auto flex flex-col gap-10">
      <!-- Section Header -->
      <div
        v-reveal="{ direction: 'up', delay: 50 }"
        class="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div class="flex items-center gap-2 mb-1.5 text-[#007681]">
            <span class="material-symbols-outlined text-xl">cake</span>
            <span class="font-headline text-xs uppercase tracking-widest font-extrabold">
              Cumpleaños de la Comunidad
            </span>
          </div>
          <h2
            class="font-headline text-3xl sm:text-4xl font-black text-[#1b4d4f] uppercase tracking-tight"
          >
            Cumpleaños
            <span class="text-[#d49e35]">de esta Semana</span>
          </h2>
          <p class="text-sm sm:text-base text-[#404848] max-w-xl mt-1">
            Oramos y damos gracias a Dios por la vida de nuestros hermanos que celebran un año más
            de bendiciones esta semana.
          </p>
        </div>

        <!-- Summary Badges -->
        <div v-if="!isLoading && weekCount > 0" class="flex flex-wrap items-center gap-2.5">
          <span
            v-if="todayCount > 0"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-[9999px] bg-[#d49e35] text-[#1b4d4f] font-headline text-xs font-extrabold uppercase tracking-wider shadow-sm"
          >
            <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">
              celebration
            </span>
            <span>{{ todayCount }} {{ todayCount === 1 ? 'cumple hoy' : 'cumplen hoy' }}</span>
          </span>
          <span
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-[9999px] bg-white border border-[#1b4d4f]/15 text-[#1b4d4f] font-headline text-xs font-extrabold uppercase tracking-wider shadow-sm"
          >
            <span>{{ weekCount }} {{ weekCount === 1 ? 'esta semana' : 'esta semana' }}</span>
          </span>
        </div>
      </div>

      <!-- Loading Skeletons -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white rounded-3xl p-6 border border-[#1b4d4f]/10 flex flex-col items-center space-y-3"
        >
          <div class="w-20 h-20 rounded-[9999px] bg-[#1b4d4f]/10"></div>
          <div class="h-5 w-3/4 bg-[#1b4d4f]/10 rounded"></div>
          <div class="h-4 w-1/2 bg-[#1b4d4f]/10 rounded"></div>
          <div class="h-9 w-full bg-[#1b4d4f]/10 rounded-[9999px]"></div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="hasError"
        class="bg-white rounded-3xl p-10 text-center border border-[#1b4d4f]/10 max-w-xl mx-auto space-y-4"
      >
        <span class="material-symbols-outlined text-5xl text-[#d49e35]">cloud_off</span>
        <h3 class="font-headline text-xl font-extrabold text-[#1b4d4f]">
          No pudimos cargar los cumpleaños
        </h3>
        <p class="text-sm text-[#404848]">
          Ocurrió un problema al consultar los cumpleañeros del mes. Inténtalo de nuevo.
        </p>
        <button
          type="button"
          @click="fetchBirthdays"
          class="px-7 py-3 rounded-[9999px] bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer"
        >
          Reintentar
        </button>
      </div>

      <!-- Birthdays Grid -->
      <div v-else-if="visibleBirthdays.length > 0" class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article
            v-for="person in visibleBirthdays"
            :key="person.id"
            :class="[
              'bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl smooth-transition hover:-translate-y-1 flex flex-col items-center justify-between text-center gap-3 relative group',
              person.is_today
                ? 'border-2 border-[#d49e35] shadow-md shadow-[#d49e35]/15'
                : 'border border-[#1b4d4f]/10'
            ]"
          >
            <!-- Top Badge: Today highlight or Cake icon -->
            <div v-if="person.is_today" class="absolute top-3.5 right-3.5">
              <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-[9999px] bg-[#d49e35] text-[#1b4d4f] font-headline text-[10px] font-extrabold uppercase tracking-wider shadow-sm"
              >
                <span class="material-symbols-outlined text-xs" style="font-variation-settings: 'FILL' 1;">
                  celebration
                </span>
                ¡Hoy!
              </span>
            </div>
            <div
              v-else
              class="absolute top-4 right-4 bg-[#d49e35]/15 text-[#d49e35] p-1.5 rounded-[9999px]"
            >
              <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">
                cake
              </span>
            </div>

            <!-- Initials Avatar with Gradient Ring -->
            <div class="flex flex-col items-center gap-3 pt-2">
              <div
                :class="[
                  'w-20 h-20 rounded-[9999px] p-1 shadow-md group-hover:scale-105 smooth-transition',
                  person.is_today
                    ? 'bg-gradient-to-tr from-[#d49e35] via-[#f59e0b] to-[#1b4d4f]'
                    : 'bg-gradient-to-tr from-[#1b4d4f] to-[#007681]'
                ]"
              >
                <div
                  :class="[
                    'w-full h-full rounded-[9999px] flex items-center justify-center font-headline text-xl font-black tracking-tight',
                    person.is_today
                      ? 'bg-[#1b4d4f] text-[#d49e35]'
                      : 'bg-[#eaf2f1] text-[#1b4d4f]'
                  ]"
                >
                  {{ getInitials(person.name) }}
                </div>
              </div>

              <div class="space-y-1">
                <h3 class="font-headline text-base sm:text-lg font-bold text-[#1b4d4f] leading-snug">
                  {{ person.name }}
                </h3>
                <p class="text-xs sm:text-sm text-[#404848] font-medium flex items-center justify-center gap-1">
                  <span class="material-symbols-outlined text-sm text-[#007681]">calendar_today</span>
                  <strong class="text-[#1b4d4f]">{{ person.formatted_date }}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="sendBlessing(person.id)"
              :class="[
                'w-full mt-2 py-2.5 rounded-[9999px] font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5',
                blessedIds[person.id]
                  ? 'bg-[#d49e35] text-white shadow-sm'
                  : person.is_today
                    ? 'bg-[#1b4d4f] hover:bg-[#007681] text-white'
                    : 'bg-[#f0eded] hover:bg-[#1b4d4f] hover:text-white text-[#1b4d4f]'
              ]"
            >
              <span v-if="blessedIds[person.id]" class="material-symbols-outlined text-base">
                favorite
              </span>
              <span>{{ blessedIds[person.id] ? '¡Bendición Enviada!' : 'Enviar Bendición' }}</span>
            </button>
          </article>
        </div>

        <!-- Expand / Collapse Toggle when there are many birthdays -->
        <div v-if="hasMore" class="text-center">
          <button
            type="button"
            @click="showAll = !showAll"
            class="inline-flex items-center gap-2 px-7 py-3 rounded-[9999px] bg-white border-2 border-[#1b4d4f] text-[#1b4d4f] hover:bg-[#1b4d4f] hover:text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition active:scale-95 cursor-pointer shadow-sm"
          >
            <span>
              {{
                showAll
                  ? 'Mostrar menos'
                  : `Ver todos los cumpleañeros (${sortedBirthdays.length})`
              }}
            </span>
            <span
              :class="[
                'material-symbols-outlined text-base smooth-transition',
                showAll ? 'rotate-180' : ''
              ]"
            >
              expand_more
            </span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white rounded-3xl p-10 text-center border border-[#1b4d4f]/10 max-w-xl mx-auto space-y-2"
      >
        <span class="material-symbols-outlined text-4xl text-[#d49e35]">cake</span>
        <h3 class="font-headline text-xl font-extrabold text-[#1b4d4f]">
          Sin cumpleaños registrados esta semana
        </h3>
        <p class="text-sm text-[#404848]">
          No hay cumpleañeros registrados para esta semana en {{ monthName || 'este mes' }}.
        </p>
      </div>
    </div>
  </section>
</template>
