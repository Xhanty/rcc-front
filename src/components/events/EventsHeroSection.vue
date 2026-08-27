<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

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

const fetchActiveMonths = async () => {
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
      throw new Error('Failed to fetch active months')
    }
    
    const resJson = await response.json()
    const rawData = resJson.data || []
    activeYears.value = rawData.map((item: any) => {
      return {
        year: item.year,
        months: item.months ? [...item.months].sort((a: number, b: number) => a - b) : []
      }
    }).sort((a: any, b: any) => b.year - a.year)
    
    if (activeYears.value.length > 0) {
      // Default to the first year and its first month if not set
      if (props.selectedYear === null || props.selectedMonth === null) {
        const firstYearObj = activeYears.value[0]
        if (firstYearObj) {
          emit('update:selectedYear', firstYearObj.year)
          if (firstYearObj.months && firstYearObj.months.length > 0) {
            emit('update:selectedMonth', firstYearObj.months[0] ?? null)
          }
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

const selectYear = (year: number) => {
  emit('update:selectedYear', year)
  const yearData = activeYears.value.find(y => y.year === year)
  if (yearData && yearData.months && yearData.months.length > 0) {
    emit('update:selectedMonth', yearData.months[0] ?? null)
  }
}

const selectMonth = (monthNum: number) => {
  emit('update:selectedMonth', monthNum)
}
</script>

<template>
  <section class="relative pt-24 pb-12 overflow-hidden">
    <!-- Background Blurs -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-b from-surface-container-low to-background opacity-80"></div>
      <div
        class="absolute -top-40 -left-40 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-secondary-container/10 rounded-full blur-[80px] md:blur-[120px]">
      </div>
      <div
        class="absolute top-20 -right-20 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-primary-fixed/20 rounded-full blur-[60px] md:blur-[100px]">
      </div>
    </div>

    <div class="relative z-10 px-6 max-w-max-width mx-auto text-center">
      <h1 class="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary mb-base leading-tight">
        Próximos Encuentros
      </h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 opacity-90">
        Espacios sagrados diseñados para el crecimiento espiritual, la sanación y la comunión vibrante de nuestra
        comunidad carismática.
      </p>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-4">
        <div class="animate-pulse flex gap-2">
          <div class="h-10 bg-surface-container-highest rounded-full w-20"></div>
          <div class="h-10 bg-surface-container-highest rounded-full w-28"></div>
          <div class="h-10 bg-surface-container-highest rounded-full w-24"></div>
        </div>
      </div>

      <!-- Loaded Filter Controls -->
      <div v-else-if="activeYears.length > 0"
        class="max-w-4xl mx-auto glass-card p-5 rounded-2xl border border-outline-variant/30">
        
        <div class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          
          <!-- Years Selector Group -->
          <div class="flex items-center gap-3">
            <span class="font-body-md text-on-surface font-semibold shrink-0">Año:</span>
            <div class="flex gap-1.5">
              <button
                v-for="y in activeYears"
                :key="y.year"
                @click="selectYear(y.year)"
                :class="[
                  'px-4 py-1.5 rounded-full font-label-md transition-all duration-200 cursor-pointer active:scale-95 shadow-sm text-sm',
                  selectedYear === y.year
                    ? 'bg-secondary text-white font-bold'
                    : 'border border-outline/20 text-on-surface-variant hover:border-secondary hover:text-secondary'
                ]"
              >
                {{ y.year }}
              </button>
            </div>
          </div>

          <!-- Divider -->
          <div class="hidden md:block w-[1px] self-stretch bg-outline-variant/50"></div>

          <!-- Months Selector Group -->
          <div class="flex flex-wrap items-center gap-3">
            <span class="font-body-md text-on-surface font-semibold shrink-0">Mes:</span>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="monthNum in activeYears.find(y => y.year === selectedYear)?.months || []"
                :key="monthNum"
                @click="selectMonth(monthNum)"
                :class="[
                  'px-4 py-1.5 rounded-full font-label-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-95 text-sm',
                  selectedMonth === monthNum
                    ? 'bg-primary text-on-primary font-bold'
                    : 'border border-outline/20 text-on-surface-variant hover:border-secondary hover:text-secondary'
                ]"
              >
                {{ monthNames[monthNum - 1] }}
              </button>
            </div>
          </div>

        </div>

      </div>

      <!-- Error / Empty State -->
      <div v-else class="text-center py-4 text-secondary font-semibold">
        No hay fechas de eventos disponibles por el momento.
      </div>
    </div>
  </section>
</template>
