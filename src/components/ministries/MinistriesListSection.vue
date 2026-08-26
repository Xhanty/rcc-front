<script setup lang="ts">
interface Ministry {
  id: number
  title: string
  desc: string
  icon: string
}

const ministries: Ministry[] = [
  {
    id: 1,
    title: 'Música (Salmistas)',
    desc: 'Elevamos el espíritu a través de la alabanza carismática. Un espacio para adorar a Dios mediante el talento musical y la oración cantada.',
    icon: 'music_note'
  },
  {
    id: 2,
    title: 'Jóvenes',
    desc: 'Una comunidad vibrante donde los jóvenes encuentran su identidad en Cristo, comparten sus retos y viven una fe auténtica y moderna.',
    icon: 'diversity_3'
  },
  {
    id: 3,
    title: 'Intercesión',
    desc: 'El motor espiritual de nuestra comunidad. Dedicados a la oración profunda por las necesidades del mundo, la Iglesia y cada hermano.',
    icon: 'prayer_times' // NOTE: using prayer_times as defined, but will fallback if needed. We can use favorite/volunteer_activism or standard icons.
  },
  {
    id: 4,
    title: 'Evangelización',
    desc: 'Llevamos el mensaje del Evangelio a cada rincón con nuevas formas y pasión, invitando a todos a un encuentro personal con el Espíritu Santo.',
    icon: 'auto_awesome'
  },
  {
    id: 5,
    title: 'Niños',
    desc: 'Sembrando la semilla de la fe con alegría. Enseñamos a los más pequeños a conocer a Jesús a través de juegos, música y catequesis creativa.',
    icon: 'child_care'
  }
]
</script>

<template>
  <section class="pb-16 md:pb-20 relative z-10">
    <div class="max-w-max-width mx-auto px-6 md:px-margin-desktop">
      <!-- Grid of Ministries -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        
        <!-- Loop through ministries -->
        <div 
          v-for="min in ministries" 
          :key="min.id" 
          class="glass-card p-6 md:p-8 rounded-xl flex flex-col hover-glow transition-all duration-300"
        >
          <div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-base">
            <span class="material-symbols-outlined text-primary text-3xl">{{ min.icon }}</span>
          </div>
          <h3 class="font-headline-lg text-title-md md:text-headline-lg text-primary mb-base leading-tight">
            {{ min.title }}
          </h3>
          <p class="font-body-md text-body-md text-on-surface-variant flex-grow mb-base">
            {{ min.desc }}
          </p>
          <div class="fade-rule mb-base"></div>
          <button class="flex items-center gap-2 font-label-sm text-label-sm text-secondary group uppercase cursor-pointer active:opacity-80">
            Saber más 
            <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        <!-- Call to Action Card -->
        <div class="bg-primary p-6 md:p-8 rounded-xl flex flex-col justify-center items-center text-center shadow-lg transform md:translate-y-4">
          <span class="material-symbols-outlined text-secondary-fixed text-4xl mb-base" data-weight="fill">volunteer_activism</span>
          <h3 class="font-headline-lg text-title-md md:text-headline-lg text-on-primary mb-base leading-tight">
            ¿Sientes el llamado?
          </h3>
          <p class="font-body-md text-body-md text-on-primary/80 mb-base">
            Hay un lugar para ti en nuestra comunidad. Descubre tus carismas y ponlos al servicio de Dios.
          </p>
          <button class="w-full bg-secondary text-on-secondary font-label-sm text-label-sm py-3 rounded-lg hover:bg-secondary-container transition-colors active:scale-95 duration-200 uppercase cursor-pointer">
            Unirme a un ministerio
          </button>
        </div>

      </div>
    </div>
  </section>
</template>
