<script setup lang="ts">
const quickSections = [
  { id: 'encuestas', label: 'Encuestas' },
  { id: 'evangelio', label: 'Evangelio & Fe' },
  { id: 'santo', label: 'Santo del Día' },
  { id: 'cumpleanos', label: 'Cumpleaños' },
  { id: 'musica', label: 'Música & Alabanza' },
  { id: 'reflexiones', label: 'Reflexiones' }
]

const scrollToBlock = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <section
    class="relative bg-[#1b4d4f] text-white px-6 lg:px-12 pt-32 sm:pt-40 pb-24 sm:pb-28 overflow-hidden font-jakarta"
  >
    <!-- Massive Kinetic Outline Watermark -->
    <div
      aria-hidden="true"
      class="absolute -top-6 left-0 w-full select-none pointer-events-none overflow-hidden opacity-15"
    >
      <div class="animate-marquee-slow">
        <span
          class="font-headline text-[100px] lg:text-[165px] font-extrabold uppercase tracking-tighter outline-marquee whitespace-nowrap pr-14"
        >
          PALABRA • VIDA • RESURRECCIÓN • COMUNIDAD •
        </span>
        <span
          class="font-headline text-[100px] lg:text-[165px] font-extrabold uppercase tracking-tighter outline-marquee whitespace-nowrap pr-14"
        >
          PALABRA • VIDA • RESURRECCIÓN • COMUNIDAD •
        </span>
      </div>
    </div>

    <!-- Ambient Glows -->
    <div
      class="absolute -top-32 right-10 w-96 h-96 bg-[#d49e35]/15 rounded-[9999px] blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute bottom-0 left-8 w-80 h-80 bg-[#007681]/25 rounded-[9999px] blur-3xl pointer-events-none"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto flex flex-col gap-8">
      <!-- Top Row: Identity Badge & Rotated Stamp -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div v-reveal="{ direction: 'up', delay: 40 }" class="flex items-center gap-2.5">
          <span
            class="inline-flex items-center justify-center w-9 h-9 rounded-[9999px] bg-[#d49e35]/20 text-[#d49e35]"
          >
            <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">
              local_fire_department
            </span>
          </span>
          <span class="font-headline text-xs font-extrabold uppercase tracking-widest text-[#d49e35]">
            Anuncios y Vida Comunitaria • RCC
          </span>
        </div>

        <!-- Rotated Circular Stamp Badge (Scroll-linked rotation) -->
        <div
          v-reveal="{ direction: 'scale', delay: 120 }"
          class="hidden sm:block relative group"
        >
          <div
            v-parallax="{ range: 14, rotate: -22, scale: 1 }"
            class="w-28 h-28 rounded-[9999px] bg-white text-[#1b4d4f] p-2 flex items-center justify-center shadow-xl select-none"
          >
            <div
              class="w-full h-full rounded-[9999px] border-2 border-dashed border-[#1b4d4f]/40 flex flex-col items-center justify-center text-center p-2"
            >
              <span class="material-symbols-outlined text-xl text-[#d49e35]">auto_awesome</span>
              <span class="font-headline font-black text-[10px] tracking-widest uppercase leading-none mt-1">
                PAN DE VIDA
              </span>
              <span class="font-headline text-[8px] font-extrabold uppercase tracking-wider text-[#007681] mt-0.5">
                COMUNIDAD VIVA
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monumental Heading -->
      <div class="space-y-4 max-w-4xl">
        <h1
          v-reveal="{ direction: 'up', delay: 100 }"
          class="font-headline text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight font-extrabold text-white leading-[1.06]"
        >
          Vida, Palabra <br />
          <span class="text-[#d49e35] italic">&amp; Comunidad</span>
        </h1>
        <p
          v-reveal="{ direction: 'up', delay: 170 }"
          class="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed"
        >
          Anuncios oficiales, encuestas comunitarias, Palabra viva del Evangelio, latir fraterno y
          el fuego del Espíritu Santo en el corazón de Resucitados RCC.
        </p>
      </div>

      <!-- Quick Section Jump Pills -->
      <div
        v-reveal="{ direction: 'up', delay: 230 }"
        class="pt-2 flex flex-wrap gap-2.5 items-center"
      >
        <button
          type="button"
          @click="scrollToBlock('encuestas')"
          class="px-5 py-2.5 rounded-[9999px] bg-white text-[#1b4d4f] font-headline text-xs font-extrabold uppercase tracking-wider shadow-sm smooth-transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          Todo
        </button>
        <button
          v-for="sec in quickSections"
          :key="sec.id"
          type="button"
          @click="scrollToBlock(sec.id)"
          class="px-5 py-2.5 rounded-[9999px] bg-white/10 hover:bg-white/20 text-white font-headline text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/15 smooth-transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          {{ sec.label }}
        </button>
      </div>
    </div>
  </section>
</template>
