<script setup lang="ts">
interface Ministry {
  id: number
  title: string
  subtitle: string
  icon: string
  href: string
}

const ministries: Ministry[] = [
  {
    id: 1,
    title: 'Alabanza',
    subtitle: 'Música y adoración',
    icon: 'music_note',
    href: '#'
  },
  {
    id: 2,
    title: 'Formación',
    subtitle: 'Cursos y talleres',
    icon: 'menu_book',
    href: '#'
  },
  {
    id: 3,
    title: 'Niños',
    subtitle: 'Semillas de fe',
    icon: 'child_care',
    href: '#'
  },
  {
    id: 4,
    title: 'Intercesión',
    subtitle: 'Cadena de oración',
    icon: 'diversity_3',
    href: '#'
  }
]
</script>

<template>
  <section id="ministries" class="py-margin-desktop">
    <div class="max-w-max-width mx-auto px-margin-desktop text-center mb-gutter">
      <h2 class="font-headline-lg text-headline-lg text-primary mb-2">Nuestros Ministerios</h2>
      <p class="font-body-md text-on-surface-variant max-w-xl mx-auto">Hay diversidad de dones, pero el Espíritu es el mismo. Encuentra tu lugar para servir y crecer.</p>
    </div>
    <div class="max-w-max-width mx-auto px-margin-desktop">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-base">
        <a 
          v-for="min in ministries" 
          :key="min.id" 
          :href="min.href" 
          class="group block p-gutter rounded-xl bg-white border border-outline-variant/20 hover:border-secondary/40 transition-all text-center glow-hover"
        >
          <div class="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-gutter group-hover:bg-secondary-container transition-colors duration-300">
            <span class="material-symbols-outlined text-primary text-3xl">{{ min.icon }}</span>
          </div>
          <h4 class="font-title-md text-primary">{{ min.title }}</h4>
          <p class="text-label-sm text-on-surface-variant mt-1">{{ min.subtitle }}</p>
        </a>
      </div>
    </div>
  </section>
</template>
