<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

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

const isYearDropdownOpen = ref(false)
const isMonthDropdownOpen = ref(false)
const filterBarRef = ref<HTMLElement | null>(null)

const toggleYearDropdown = () => {
  isYearDropdownOpen.value = !isYearDropdownOpen.value
  if (isYearDropdownOpen.value) isMonthDropdownOpen.value = false
}

const toggleMonthDropdown = () => {
  isMonthDropdownOpen.value = !isMonthDropdownOpen.value
  if (isMonthDropdownOpen.value) isYearDropdownOpen.value = false
}

const handleOutsideClick = (e: MouseEvent) => {
  if (
    (isYearDropdownOpen.value || isMonthDropdownOpen.value) &&
    filterBarRef.value &&
    !filterBarRef.value.contains(e.target as Node)
  ) {
    isYearDropdownOpen.value = false
    isMonthDropdownOpen.value = false
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

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
  document.addEventListener('click', handleOutsideClick)
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
  isYearDropdownOpen.value = false
}

const selectMonth = (monthNum: number) => {
  if (effectiveYear.value !== null && props.selectedYear !== effectiveYear.value) {
    emit('update:selectedYear', effectiveYear.value)
  }
  emit('update:selectedMonth', monthNum)
  isMonthDropdownOpen.value = false
}

const activeMonthName = computed(() => {
  if (props.selectedMonth) {
    return monthNames[Number(props.selectedMonth) - 1] || 'Mes'
  }
  return 'Seleccionar mes'
})

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

        <!-- Active Year & Month Modern Calendar Filter Bar -->
        <div
          v-else-if="activeYears.length > 0"
          ref="filterBarRef"
          class="pb-6 border-b border-[#1b4d4f]/10"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Matching Year & Month Custom Dropdowns (scales cleanly to any number of years & months) -->
            <div class="flex items-end gap-2.5 sm:gap-3 w-full sm:w-auto">
              <!-- Year Dropdown -->
              <div class="relative shrink-0 w-[124px] sm:w-40">
                <span
                  class="block font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#1b4d4f]/65 mb-1.5 pl-1"
                >
                  Año
                </span>
                <button
                  type="button"
                  @click="toggleYearDropdown"
                  :aria-expanded="isYearDropdownOpen"
                  aria-label="Seleccionar año"
                  class="w-full px-4 py-2.5 rounded-2xl bg-[#d49e35] hover:bg-[#c48e29] text-[#102e30] font-headline text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-between gap-2 shadow-sm cursor-pointer smooth-transition"
                >
                  <span class="flex items-center gap-1.5 truncate">
                    <span class="material-symbols-outlined text-base">event</span>
                    <span>{{ effectiveYear }}</span>
                  </span>
                  <span
                    :class="[
                      'material-symbols-outlined text-base smooth-transition shrink-0',
                      isYearDropdownOpen ? 'rotate-180' : ''
                    ]"
                  >
                    expand_more
                  </span>
                </button>

                <transition name="fade">
                  <div
                    v-if="isYearDropdownOpen"
                    class="absolute left-0 right-0 top-full mt-2 z-40 bg-white rounded-2xl shadow-2xl shadow-[#1b4d4f]/20 border border-[#1b4d4f]/15 p-1.5 max-h-60 overflow-y-auto space-y-1"
                  >
                    <button
                      v-for="y in activeYears"
                      :key="y.year"
                      type="button"
                      @click="selectYear(y.year)"
                      :class="[
                        'w-full px-3.5 py-2.5 rounded-xl font-headline text-xs font-extrabold uppercase tracking-wider flex items-center justify-between gap-2 smooth-transition cursor-pointer',
                        effectiveYear === y.year
                          ? 'bg-[#d49e35] text-[#102e30] shadow-xs'
                          : 'text-[#1b4d4f] hover:bg-[#eaf2f1]'
                      ]"
                    >
                      <span>{{ y.year }}</span>
                      <span
                        v-if="effectiveYear === y.year"
                        class="material-symbols-outlined text-base"
                      >
                        check
                      </span>
                    </button>
                  </div>
                </transition>
              </div>

              <!-- Month Dropdown -->
              <div class="relative flex-1 min-w-0 sm:flex-none sm:w-56">
                <span
                  class="block font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#1b4d4f]/65 mb-1.5 pl-1"
                >
                  Mes
                </span>
                <button
                  type="button"
                  @click="toggleMonthDropdown"
                  :aria-expanded="isMonthDropdownOpen"
                  aria-label="Seleccionar mes"
                  class="w-full px-4 py-2.5 rounded-2xl bg-[#1b4d4f] hover:bg-[#13383a] text-white font-headline text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-between gap-2 shadow-sm cursor-pointer smooth-transition"
                >
                  <span class="flex items-center gap-1.5 truncate">
                    <span class="material-symbols-outlined text-base text-[#f3d078]">
                      calendar_month
                    </span>
                    <span class="truncate">{{ activeMonthName }}</span>
                  </span>
                  <span
                    :class="[
                      'material-symbols-outlined text-base text-[#f3d078] smooth-transition shrink-0',
                      isMonthDropdownOpen ? 'rotate-180' : ''
                    ]"
                  >
                    expand_more
                  </span>
                </button>

                <transition name="fade">
                  <div
                    v-if="isMonthDropdownOpen"
                    class="absolute right-0 sm:left-0 top-full mt-2 z-40 w-[260px] sm:w-[300px] bg-white rounded-2xl shadow-2xl shadow-[#1b4d4f]/20 border border-[#1b4d4f]/15 p-2 grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto"
                  >
                    <button
                      v-for="monthNum in availableMonths"
                      :key="`m-${monthNum}`"
                      type="button"
                      @click="selectMonth(monthNum)"
                      :class="[
                        'px-3 py-2.5 rounded-xl font-headline text-[11px] font-extrabold uppercase tracking-wide text-center smooth-transition cursor-pointer whitespace-nowrap',
                        Number(selectedMonth) === monthNum
                          ? 'bg-[#1b4d4f] text-white shadow-xs'
                          : 'bg-[#f4f8f7] text-[#1b4d4f] hover:bg-[#eaf2f1]'
                      ]"
                    >
                      {{ monthNames[monthNum - 1] }}
                    </button>
                  </div>
                </transition>
              </div>
            </div>

            <!-- Active Period Pill -->
            <div
              class="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-[9999px] bg-white border border-[#1b4d4f]/10 font-headline text-[11px] uppercase tracking-widest font-extrabold text-[#1b4d4f]/75 whitespace-nowrap shrink-0 self-end shadow-xs"
            >
              <span class="material-symbols-outlined text-sm text-[#d49e35]">calendar_today</span>
              <span>Mostrando {{ activePeriodLabel }}</span>
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
