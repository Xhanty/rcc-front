<script setup lang="ts">
defineProps<{
  selectedMonth: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedMonth', value: string): void
}>()

const months = ['Todos', 'Octubre', 'Noviembre', 'Diciembre']

const setFilter = (month: string) => {
  emit('update:selectedMonth', month)
}
</script>

<template>
  <section class="relative pt-24 pb-12 overflow-hidden">
    <!-- Background Blurs -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-b from-surface-container-low to-background opacity-80"></div>
      <div class="absolute -top-40 -left-40 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-secondary-container/10 rounded-full blur-[80px] md:blur-[120px]"></div>
      <div class="absolute top-20 -right-20 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-primary-fixed/20 rounded-full blur-[60px] md:blur-[100px]"></div>
    </div>

    <div class="relative z-10 px-6 max-w-max-width mx-auto text-center">
      <h1 class="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary mb-base leading-tight">
        Próximos Encuentros
      </h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 opacity-90">
        Espacios sagrados diseñados para el crecimiento espiritual, la sanación y la comunión vibrante de nuestra comunidad carismática.
      </p>

      <!-- Filter Row -->
      <div class="flex flex-wrap justify-center gap-2 items-center mt-base">
        <span class="font-body-md text-body-md text-on-surface-variant self-center mr-2">Filtrar por mes:</span>
        <button 
          v-for="m in months" 
          :key="m"
          @click="setFilter(m)"
          :class="[
            'px-6 py-2 rounded-full font-label-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-95',
            selectedMonth === m 
              ? 'bg-primary text-on-primary' 
              : 'border border-outline/20 text-on-surface-variant hover:border-secondary hover:text-secondary'
          ]"
        >
          {{ m }}
        </button>
      </div>
    </div>
  </section>
</template>
