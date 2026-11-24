<script setup lang="ts">
// MinistriesHeroSection Component
</script>

<template>
  <section
    class="relative w-full bg-[#1b4d4f] text-white px-6 sm:px-10 lg:px-12 pt-32 sm:pt-40 pb-24 sm:pb-28 overflow-hidden font-jakarta"
  >
    <!-- Kinetic Outline Watermark -->
    <div
      aria-hidden="true"
      class="absolute -top-6 left-0 w-full select-none pointer-events-none overflow-hidden opacity-15"
    >
      <div class="animate-marquee-slow">
        <span
          class="font-headline text-[100px] lg:text-[165px] font-extrabold uppercase tracking-tighter outline-marquee whitespace-nowrap pr-14"
        >
          SERVICIO • CARISMA • ALABANZA • COMUNIÓN •
        </span>
        <span
          class="font-headline text-[100px] lg:text-[165px] font-extrabold uppercase tracking-tighter outline-marquee whitespace-nowrap pr-14"
        >
          SERVICIO • CARISMA • ALABANZA • COMUNIÓN •
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
              diversity_3
            </span>
          </span>
          <span class="font-headline text-xs font-extrabold uppercase tracking-widest text-[#d49e35]">
            Comunidad Carismática • RCC
          </span>
        </div>

        <!-- Rotated Circular Stamp Badge -->
        <div v-reveal="{ direction: 'scale', delay: 120 }" class="hidden sm:block relative">
          <div
            v-parallax="{ range: 14, rotate: -22, scale: 1 }"
            class="w-28 h-28 rounded-[9999px] bg-white text-[#1b4d4f] p-2 flex items-center justify-center shadow-xl select-none"
          >
            <div
              class="w-full h-full rounded-[9999px] border-2 border-dashed border-[#1b4d4f]/40 flex flex-col items-center justify-center text-center p-2"
            >
              <span class="material-symbols-outlined text-xl text-[#d49e35]">volunteer_activism</span>
              <span class="font-headline font-black text-[10px] tracking-widest uppercase leading-none mt-1">
                SERVICIO
              </span>
              <span class="font-headline text-[8px] font-extrabold uppercase tracking-wider text-[#007681] mt-0.5">
                EN EL ESPÍRITU
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Heading & Description Row -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div v-reveal="{ direction: 'up', delay: 100 }">
          <h1
            class="font-headline text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.04]"
          >
            NUESTROS<br />
            <span class="text-[#d49e35] italic">MINISTERIOS</span>
          </h1>
        </div>

        <div v-reveal="{ direction: 'up', delay: 170 }" class="max-w-md lg:pb-1">
          <p class="text-white/85 text-base sm:text-lg font-normal leading-relaxed">
            Descubre las diversas formas en que nuestra comunidad vive, comparte y celebra la fe.
            Espacios orgánicos de crecimiento, servicio y comunión viva.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
