<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps<{
  selectedYear: number | null
  selectedMonth: number | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedYear', value: number | null): void
  (e: 'update:selectedMonth', value: number | null): void
}>()

interface YearMonthData {
  year: number
  months: number[]
}

const activeYears = ref<YearMonthData[]>([])
const isLoading = ref(true)
const hasError = ref(false)

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const normalizeActiveMonths = (resJson: any): YearMonthData[] => {
  const payload = resJson?.data ?? resJson
  const normalized: YearMonthData[] = []

  const extractMonths = (rawMonths: any): number[] => {
    if (!Array.isArray(rawMonths)) return []
    const nums = rawMonths
      .map((m: any) => {
        if (typeof m === 'number') return m
        if (typeof m === 'string') return parseInt(m, 10)
        if (m && typeof m === 'object') {
          return parseInt(String(m.month ?? m.number ?? m.id ?? ''), 10)
        }
        return NaN
      })
      .filter((n: number) => Number.isInteger(n) && n >= 1 && n <= 12)
    return Array.from(new Set(nums)).sort((a, b) => a - b)
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const yearNum = parseInt(String(item?.year ?? ''), 10)
      if (!Number.isInteger(yearNum)) continue
      const months = extractMonths(item?.months)
      if (months.length > 0) {
        normalized.push({ year: yearNum, months })
      }
    }
  } else if (payload && typeof payload === 'object') {
    for (const [key, value] of Object.entries(payload)) {
      const yearNum = parseInt(key, 10)
      if (!Number.isInteger(yearNum)) continue
      const months = extractMonths(value)
      if (months.length > 0) {
        normalized.push({ year: yearNum, months })
      }
    }
  }

  return normalized.sort((a, b) => b.year - a.year)
}

const findBestInitialDate = (yearsData: YearMonthData[]): { year: number; month: number } | null => {
  if (yearsData.length === 0) return null

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const currentKey = currentYear * 100 + currentMonth

  const allDates: { year: number; month: number; key: number }[] = []
  for (const yData of yearsData) {
    for (const m of yData.months) {
      allDates.push({
        year: yData.year,
        month: m,
        key: yData.year * 100 + m
      })
    }
  }

  if (allDates.length === 0) return null

  allDates.sort((a, b) => a.key - b.key)

  const exactMatch = allDates.find((d) => d.key === currentKey)
  if (exactMatch) {
    return { year: exactMatch.year, month: exactMatch.month }
  }

  const upcomingDates = allDates.filter((d) => d.key > currentKey)
  if (upcomingDates.length > 0 && upcomingDates[0]) {
    return { year: upcomingDates[0].year, month: upcomingDates[0].month }
  }

  const priorDates = allDates.filter((d) => d.key < currentKey)
  if (priorDates.length > 0) {
    const mostRecentPrior = priorDates[priorDates.length - 1]
    if (mostRecentPrior) {
      return { year: mostRecentPrior.year, month: mostRecentPrior.month }
    }
  }

  return allDates[0] ? { year: allDates[0].year, month: allDates[0].month } : null
}

const fetchActiveMonths = async () => {
  isLoading.value = true
  hasError.value = false

  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/events/active-months`
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
      throw new Error(`Failed to fetch active months (${response.status})`)
    }

    const resJson = await response.json()
    activeYears.value = normalizeActiveMonths(resJson)

    if (activeYears.value.length > 0) {
      const isCurrentSelectionValid =
        props.selectedYear !== null &&
        props.selectedMonth !== null &&
        activeYears.value.some(
          (y) => y.year === Number(props.selectedYear) && y.months.includes(Number(props.selectedMonth))
        )

      if (!isCurrentSelectionValid) {
        const bestDate = findBestInitialDate(activeYears.value)
        if (bestDate) {
          emit('update:selectedYear', bestDate.year)
          emit('update:selectedMonth', bestDate.month)
        }
      }
    }
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching active months:', error)
    hasError.value = true
    isLoading.value = false
  }
}

onMounted(() => {
  fetchActiveMonths()
})

watch(
  () => [props.selectedYear, props.selectedMonth],
  () => {
    if (
      activeYears.value.length > 0 &&
      (props.selectedYear === null || props.selectedMonth === null)
    ) {
      const bestDate = findBestInitialDate(activeYears.value)
      if (bestDate) {
        emit('update:selectedYear', bestDate.year)
        emit('update:selectedMonth', bestDate.month)
      }
    }
  }
)

const effectiveYear = computed(() => {
  if (props.selectedYear !== null) return Number(props.selectedYear)
  return activeYears.value[0]?.year ?? null
})

const availableMonths = computed(() => {
  if (effectiveYear.value === null) return []
  return activeYears.value.find((y) => y.year === effectiveYear.value)?.months || []
})

const selectYear = (year: number) => {
  emit('update:selectedYear', year)
  const yearData = activeYears.value.find((y) => y.year === year)
  if (yearData && yearData.months.length > 0) {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    let targetMonth: number | null = null

    if (year === currentYear) {
      if (yearData.months.includes(currentMonth)) {
        targetMonth = currentMonth
      } else {
        const upcoming = yearData.months.filter((m) => m > currentMonth)
        if (upcoming.length > 0) {
          targetMonth = upcoming[0] ?? null
        } else {
          targetMonth = yearData.months[yearData.months.length - 1] ?? null
        }
      }
    } else if (year < currentYear) {
      targetMonth = yearData.months[yearData.months.length - 1] ?? null
    } else {
      targetMonth = yearData.months[0] ?? null
    }

    emit('update:selectedMonth', targetMonth)
  }
}

const selectMonth = (monthNum: number) => {
  if (effectiveYear.value !== null && props.selectedYear !== effectiveYear.value) {
    emit('update:selectedYear', effectiveYear.value)
  }
  emit('update:selectedMonth', monthNum)
}

const activePeriodLabel = computed(() => {
  if (props.selectedMonth && effectiveYear.value) {
    return `${monthNames[Number(props.selectedMonth) - 1]} ${effectiveYear.value}`
  }
  return `Destacados ${new Date().getFullYear()}`
})
</script>

<template>
  <div class="font-jakarta">
    <!-- Deep Forest Teal Color-Blocked Hero -->
    <section
      class="relative bg-[#1b4d4f] text-white pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden"
    >
      <!-- Subtle Kinetic Marquee Watermark -->
      <div
        aria-hidden="true"
        class="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-25 overflow-hidden"
      >
        <div class="animate-marquee-slow transform -rotate-2">
          <span
            class="font-headline font-black text-7xl md:text-[140px] uppercase tracking-tight outline-marquee whitespace-nowrap pr-12"
          >
            COMUNIDAD — ENCUENTRO — ESPÍRITU — RENOVACIÓN —
          </span>
          <span
            class="font-headline font-black text-7xl md:text-[140px] uppercase tracking-tight outline-marquee whitespace-nowrap pr-12"
          >
            COMUNIDAD — ENCUENTRO — ESPÍRITU — RENOVACIÓN —
          </span>
        </div>
      </div>

      <!-- Ambient Glow -->
      <div
        class="absolute -top-24 -right-24 w-96 h-96 bg-[#007681]/25 rounded-[9999px] blur-3xl pointer-events-none"
      ></div>

      <div
        class="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-10"
      >
        <div class="max-w-2xl">
          <div
            v-reveal="{ direction: 'up', delay: 40 }"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[9999px] bg-white/10 backdrop-blur-md border border-white/20 text-[#d49e35] font-headline text-xs font-extrabold uppercase tracking-widest mb-6"
          >
            <span class="w-2 h-2 rounded-[9999px] bg-[#d49e35] animate-pulse"></span>
            Una Comunidad de Fe
          </div>

          <h1
            v-reveal="{ direction: 'up', delay: 110 }"
            class="font-headline text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.06] mb-6 uppercase"
          >
            EVENTOS &amp; <br />
            <span class="text-white/90">ENCUENTROS.</span>
          </h1>

          <p
            v-reveal="{ direction: 'up', delay: 180 }"
            class="text-base sm:text-lg md:text-xl text-white/80 font-normal leading-relaxed max-w-xl"
          >
            No te pierdas nada de lo que está sucediendo en nuestra comunidad. Espacios diseñados
            para el crecimiento espiritual, la sanación y la comunión carismática vibrante.
          </p>
        </div>

        <!-- Circular Rotating Stamped Badge -->
        <div
          v-reveal="{ direction: 'scale', delay: 220 }"
          class="hidden lg:flex flex-col items-center justify-center shrink-0"
        >
          <div
            class="relative w-36 h-36 rounded-[9999px] border-2 border-dashed border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm group hover:border-[#d49e35] smooth-transition"
          >
            <svg
              class="absolute inset-0 w-full h-full animate-[spin_24s_linear_infinite]"
              viewBox="0 0 100 100"
            >
              <path
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="transparent"
                id="eventsCirclePath"
              />
              <text class="text-[9.2px] font-bold uppercase tracking-[0.23em] fill-white font-headline">
                <textPath href="#eventsCirclePath">
                  • PRÓXIMOS ENCUENTROS • RESUCITADOS RCC
                </textPath>
              </text>
            </svg>
            <span
              class="material-symbols-outlined text-white text-3xl group-hover:scale-110 group-hover:text-[#d49e35] smooth-transition"
            >
              event_available
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Overlapping Soft Mint Filter Bar (Year & Active Months from Backend) -->
    <div class="relative -mt-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 z-20">
      <div
        class="bg-[#F2F7F6] rounded-t-[2.5rem] px-6 sm:px-8 md:px-14 pt-6 sm:pt-8 md:pt-12 pb-6 border-x border-t border-[#1b4d4f]/10"
      >
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex flex-wrap items-center gap-3 pb-6 border-b border-[#1b4d4f]/10 animate-pulse"
        >
          <div class="h-10 bg-[#1b4d4f]/10 rounded-[9999px] w-24"></div>
          <div class="h-10 bg-[#1b4d4f]/10 rounded-[9999px] w-28"></div>
          <div class="h-10 bg-[#1b4d4f]/10 rounded-[9999px] w-28"></div>
          <div class="h-10 bg-[#1b4d4f]/10 rounded-[9999px] w-28"></div>
        </div>

        <!-- Active Year & Month Capsule Filter Bar -->
        <div
          v-else-if="activeYears.length > 0"
          class="space-y-4 pb-6 border-b border-[#1b4d4f]/10"
        >
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <!-- Years Selector -->
              <div class="flex items-center gap-2 shrink-0">
                <span class="font-headline text-[11px] font-extrabold uppercase tracking-widest text-[#1b4d4f]/70">
                  Año:
                </span>
                <div class="flex flex-wrap items-center gap-1.5">
                  <button
                    v-for="y in activeYears"
                    :key="y.year"
                    type="button"
                    @click="selectYear(y.year)"
                    :class="[
                      'px-5 py-2 rounded-[9999px] font-headline text-xs font-extrabold tracking-wider uppercase smooth-transition whitespace-nowrap cursor-pointer active:scale-95',
                      effectiveYear === y.year
                        ? 'bg-[#d49e35] text-[#1b4d4f] shadow-sm'
                        : 'bg-white text-[#1c2424]/70 hover:text-[#1b4d4f] border border-[#1b4d4f]/15 hover:border-[#1b4d4f]'
                    ]"
                  >
                    {{ y.year }}
                  </button>
                </div>
              </div>

              <!-- Vertical Divider -->
              <div class="hidden sm:block w-px h-7 bg-[#1b4d4f]/15"></div>

              <!-- Months Selector -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-headline text-[11px] font-extrabold uppercase tracking-widest text-[#1b4d4f]/70">
                  Mes:
                </span>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-for="monthNum in availableMonths"
                    :key="monthNum"
                    type="button"
                    @click="selectMonth(monthNum)"
                    :class="[
                      'px-4 sm:px-5 py-2 rounded-[9999px] font-headline text-xs font-bold tracking-wider uppercase smooth-transition whitespace-nowrap cursor-pointer active:scale-95',
                      Number(selectedMonth) === monthNum
                        ? 'bg-[#1b4d4f] text-white shadow-sm'
                        : 'bg-white text-[#1c2424]/75 hover:text-[#1b4d4f] border border-[#1b4d4f]/15 hover:border-[#1b4d4f]'
                    ]"
                  >
                    {{ monthNames[monthNum - 1] }}
                  </button>
                </div>
              </div>
            </div>

            <div
              class="font-headline text-xs uppercase tracking-widest font-extrabold text-[#1b4d4f]/60 hidden xl:block whitespace-nowrap"
            >
              Mostrando {{ activePeriodLabel }}
            </div>
          </div>
        </div>

        <!-- Empty / Error Filter State -->
        <div
          v-else
          class="pb-5 border-b border-[#1b4d4f]/10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-sm font-semibold text-[#1b4d4f]/75"
        >
          <span>
            {{
              hasError
                ? 'No se pudieron cargar los meses activos desde el servidor.'
                : 'No hay fechas de eventos disponibles por el momento.'
            }}
          </span>
          <button
            v-if="hasError"
            type="button"
            @click="fetchActiveMonths"
            class="px-4 py-1.5 rounded-[9999px] bg-[#1b4d4f] text-white font-headline text-xs font-bold uppercase tracking-wider hover:bg-[#007681] smooth-transition cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
