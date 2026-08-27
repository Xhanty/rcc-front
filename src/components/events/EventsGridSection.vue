<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  selectedMonth: string
}>()

interface EventItem {
  id: number
  title: string
  slug: string
  month: 'Octubre' | 'Noviembre' | 'Diciembre'
  dateLabel: string
  desc: string
  time: string
  location: string
  imageUrl: string
  isFeatured?: boolean
}

const allEvents: EventItem[] = [
  {
    id: 1,
    title: 'Gran Asamblea',
    slug: 'gran-asamblea-rcc-2026',
    month: 'Octubre',
    dateLabel: '15 de Octubre, 2024 • 19:00 PM',
    desc: 'Únete a nosotros en una noche de alabanza poderosa, testimonios y la Palabra que transforma corazones.',
    time: '19:00 PM',
    location: 'Capilla Principal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_ihLQcKpJNRBH7qWDNZNiDKpCCq5yCS10xN_wPyrqTt8NmGYGoFc6ggaVYaylVfvigPlmpJTdzvQUhml8fkTlzIcdl_coKiE1V9xrl3k9oxFZRLvbAUNX7qB3-_tq8k8XeWatnACV26ph_h2I-5Wd3UH5Dm3vQI9MbVFgeFtFT7Lt4bukEYVg_dAFJUtKY7DyHVqklbLtUHsazteOZjszWOs5AA0z4lJGo-Fc-We-84G8IgA43BhF56gjG5sdLztS-NaOwsET3GOA',
    isFeatured: true
  },
  {
    id: 2,
    title: 'Retiro de Sanación',
    slug: 'retiro-de-sanacion',
    month: 'Octubre',
    dateLabel: '28-30 de Octubre',
    desc: 'Un fin de semana dedicado al descanso del alma y la restauración interior en presencia del Espíritu Santo.',
    time: 'Todo el día',
    location: 'Centro de Retiros',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfMlq9shhdrK3jdV7uhlKAaOT6Fk3Vo_Sx82IXSRzkSjmfEPTHXRdOzB6hpluvtSKdspI4fEL6SQC18G_sqa5UzgDCVO1RsBcOCidS2gSTJYLtTbqn2YiIJXo6QqyVDQenog5WRVbYMyssveOFFhSX8anjXoJRjod1LFF8eWjUidEqsqmWSeCLTFiqQxpS6ZJbBCMRUDnHvCmxRM4yNodzb0qTXp4cCA3pSonFpZX6jhqPOMKJekssZiLkowaMLHklHbmzx--y5jAf'
  },
  {
    id: 3,
    title: 'Seminario de Vida',
    slug: 'seminario-de-vida',
    month: 'Noviembre',
    dateLabel: 'Cada Jueves de Noviembre',
    desc: 'Descubre los carismas y profundiza en tu relación personal con Dios a través de este seminario formativo.',
    time: '20:00 PM',
    location: 'Salón Comunal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4rfsmY9pV22NXGlbZJ5GxVaHQh2Aqsnpaq9wSbyLMg0I7anXC9JZIGx4yV37Ld4OxDrJzMste5B58r6ZOOcNPERQyhYxV2WF4vB-LuEd8tf0yo4yn8gXxOLnVW9Bl5p-O2XvGrrU63AYfcTlpxrk2Ozw1ks2vXrZ-zcgH1dTZE7rN1hEoLE9zJM086byqH-9wGucFr6nfSQEwQ-LnlftjOpLhgNa-m6vAcHgZvtK6DQ6OMeOhFdEX8P0rp2Js7AUXJmPYao5XuR3n'
  }
]

interface OtherMeeting {
  id: number
  title: string
  monthShort: string
  monthFull: 'Octubre' | 'Noviembre' | 'Diciembre'
  day: string
  location: string
  time: string
}

const otherMeetings: OtherMeeting[] = [
  {
    id: 1,
    title: 'Cena de Comunidad',
    monthShort: 'Nov',
    monthFull: 'Noviembre',
    day: '12',
    location: 'Centro Pastoral',
    time: '20:00 PM'
  },
  {
    id: 2,
    title: 'Vigilia de la Inmaculada',
    monthShort: 'Dic',
    monthFull: 'Diciembre',
    day: '08',
    location: 'Capilla Principal',
    time: '22:00 PM'
  },
  {
    id: 3,
    title: 'Misa de Gallo',
    monthShort: 'Dic',
    monthFull: 'Diciembre',
    day: '24',
    location: 'Templo Mayor',
    time: '00:00 AM'
  }
]

// Reactive Filtering Computeds
const filteredFeaturedEvent = computed(() => {
  if (props.selectedMonth !== 'Todos' && props.selectedMonth !== 'Octubre') return null
  return allEvents.find(e => e.isFeatured) || null
})

const filteredSecondaryEvents = computed(() => {
  return allEvents.filter(e => {
    if (e.isFeatured) return false
    return props.selectedMonth === 'Todos' || e.month === props.selectedMonth
  })
})

const filteredOtherMeetings = computed(() => {
  return otherMeetings.filter(e => {
    return props.selectedMonth === 'Todos' || e.monthFull === props.selectedMonth
  })
})

const hasVisibleEvents = computed(() => {
  return filteredFeaturedEvent.value !== null ||
    filteredSecondaryEvents.value.length > 0 ||
    filteredOtherMeetings.value.length > 0
})
</script>

<template>
  <section class="px-6 max-w-max-width mx-auto pb-20 z-10 relative">
    <transition name="fade" mode="out-in">
      <div v-if="hasVisibleEvents" class="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <!-- Main Featured Event (Col span 2) -->
        <div v-if="filteredFeaturedEvent"
          class="lg:col-span-2 group relative rounded-xl overflow-hidden glass-card ethereal-glow flex flex-col justify-between">
          <div class="aspect-video relative overflow-hidden flex-grow min-h-[250px]">
            <img :alt="filteredFeaturedEvent.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              :src="filteredFeaturedEvent.imageUrl" />
            <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6 md:p-10 text-white">
              <span
                class="inline-block px-4 py-1 bg-secondary text-on-secondary-fixed rounded-full text-xs font-bold mb-4">Evento
                Principal</span>
              <h2 class="font-headline-lg text-headline-lg mb-2 leading-tight">
                {{ filteredFeaturedEvent.title }}
              </h2>
              <p class="font-body-md text-body-md flex items-center gap-2 opacity-90">
                <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                {{ filteredFeaturedEvent.dateLabel }}
              </p>
            </div>
          </div>
          <div class="p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-base">
            <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
              {{ filteredFeaturedEvent.desc }}
            </p>
            <a :href="'#events/' + filteredFeaturedEvent.slug"
              class="bg-primary text-on-primary px-8 py-3 rounded-xl font-title-md shadow-lg active:scale-95 transition-all mt-4 md:mt-0 cursor-pointer block text-center">
              Ver Detalles
            </a>
          </div>
        </div>

        <!-- Secondary Cards -->
        <div v-for="event in filteredSecondaryEvents" :key="event.id"
          class="group glass-card ethereal-glow rounded-xl flex flex-col justify-between">
          <div class="aspect-[4/3] relative overflow-hidden rounded-t-xl min-h-[180px]">
            <img :alt="event.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              :src="event.imageUrl" />
          </div>
          <div class="p-6 md:p-8 flex flex-col flex-grow">
            <h3 class="font-headline-lg text-title-md md:text-headline-lg text-primary mb-2 leading-tight">
              {{ event.title }}
            </h3>
            <p class="font-label-sm text-label-sm text-secondary mb-4 uppercase tracking-widest">{{ event.dateLabel }}
            </p>
            <p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
              {{ event.desc }}
            </p>
            <div class="mt-auto pt-4 faded-rule">
              <a :href="'#events/' + event.slug"
                class="w-full mt-2 border border-secondary text-secondary py-3 rounded-xl font-title-md hover:bg-secondary/5 transition-all cursor-pointer active:scale-95 block text-center">
                Ver Detalles
              </a>
            </div>
          </div>
        </div>

        <!-- Other Events List (Col span 2) -->
        <div v-if="filteredOtherMeetings.length > 0"
          :class="['glass-card ethereal-glow rounded-xl p-6 md:p-10', { 'lg:col-span-2': filteredSecondaryEvents.length % 2 === 0 }]">
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-headline-lg text-headline-lg text-primary">Otros Encuentros</h3>
            <a class="font-body-md text-body-md text-secondary hover:underline" href="#">Ver calendario completo</a>
          </div>
          <div class="space-y-4">
            <div v-for="(meeting, index) in filteredOtherMeetings" :key="meeting.id"
              :class="['flex items-center justify-between py-6', { 'faded-rule': index !== filteredOtherMeetings.length - 1 }]">
              <div class="flex items-center gap-6">
                <!-- Date column -->
                <div
                  class="w-14 h-14 flex flex-col items-center justify-center bg-surface-container-high text-primary rounded-xl flex-shrink-0">
                  <span class="text-[10px] font-bold uppercase leading-none">{{ meeting.monthShort }}</span>
                  <span class="text-xl font-bold leading-none mt-1">{{ meeting.day }}</span>
                </div>
                <div>
                  <h4 class="font-title-md text-title-md text-on-surface leading-tight">{{ meeting.title }}</h4>
                  <p class="font-body-md text-on-surface-variant mt-1">{{ meeting.location }} • {{ meeting.time }}</p>
                </div>
              </div>
              <button class="text-secondary hover:text-primary transition-colors cursor-pointer">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 glass-card rounded-xl max-w-xl mx-auto p-10">
        <span class="material-symbols-outlined text-secondary text-5xl animate-pulse">event_busy</span>
        <h3 class="font-headline-lg text-headline-lg text-primary mt-4">Sin Eventos</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mt-2">
          No hay eventos programados para el mes de {{ selectedMonth }}. Te invitamos a revisar los otros meses del
          calendario.
        </p>
        <button @click="$emit('reset-filter')"
          class="mt-6 bg-primary text-on-primary px-8 py-2 rounded-full font-body-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer">
          Ver Todo
        </button>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
