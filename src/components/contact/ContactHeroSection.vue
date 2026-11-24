<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <section
    class="relative w-full bg-[#1b4d4f] text-white overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32 font-jakarta"
  >
    <!-- Kinetic Background Ghost Editorial Marquee -->
    <div
      aria-hidden="true"
      class="absolute inset-0 pointer-events-none select-none flex flex-col justify-around opacity-10 overflow-hidden leading-none"
    >
      <div class="animate-marquee-slow">
        <span
          class="font-headline text-[76px] md:text-[128px] font-extrabold whitespace-nowrap outline-marquee uppercase tracking-widest pr-12"
        >
          CONTACTO • ENCUENTRO • COMUNIDAD • FE VIVA •
        </span>
        <span
          class="font-headline text-[76px] md:text-[128px] font-extrabold whitespace-nowrap outline-marquee uppercase tracking-widest pr-12"
        >
          CONTACTO • ENCUENTRO • COMUNIDAD • FE VIVA •
        </span>
      </div>
      <div class="animate-marquee-slow" style="animation-direction: reverse; animation-duration: 44s;">
        <span
          class="font-headline text-[66px] md:text-[108px] font-extrabold whitespace-nowrap outline-marquee uppercase tracking-widest pr-12"
        >
          WE ARE HERE • RENOVACIÓN CARISMÁTICA • {{ currentYear }} •
        </span>
        <span
          class="font-headline text-[66px] md:text-[108px] font-extrabold whitespace-nowrap outline-marquee uppercase tracking-widest pr-12"
        >
          WE ARE HERE • RENOVACIÓN CARISMÁTICA • {{ currentYear }} •
        </span>
      </div>
    </div>

    <!-- Subtle Ambient Glows -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-[#007681]/25 rounded-[9999px] blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-24 -left-24 w-96 h-96 bg-[#d49e35]/15 rounded-[9999px] blur-3xl pointer-events-none"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
      <!-- Badge Pill -->
      <div
        v-reveal="{ direction: 'up', delay: 40 }"
        class="inline-flex items-center gap-2 px-5 py-2 rounded-[9999px] bg-white/10 text-[#d49e35] border border-white/20 backdrop-blur-md mb-6 shadow-sm"
      >
        <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">
          volunteer_activism
        </span>
        <span class="font-headline text-xs uppercase tracking-widest font-extrabold">
          Estamos para caminar contigo
        </span>
      </div>

      <!-- Monumental Heading + Rotated Seal Badge -->
      <div v-reveal="{ direction: 'up', delay: 110 }" class="relative max-w-4xl mx-auto">
        <h1
          class="font-headline text-4xl sm:text-5xl md:text-[68px] font-extrabold tracking-tight text-white leading-[1.08] uppercase"
        >
          CONTACTO Y
          <span
            class="text-[#d49e35] underline decoration-white/20 decoration-wavy underline-offset-8"
          >
            UBICACIÓN
          </span>
        </h1>

        <!-- Floating Rotated Stamp Badge (Scroll-linked rotation) -->
        <div
          v-parallax="{ range: 16, rotate: 24, scale: 1 }"
          class="hidden md:flex absolute -right-16 -top-6 w-24 h-24 rounded-[9999px] border-2 border-dashed border-[#d49e35]/60 items-center justify-center text-center p-2 bg-[#245A5C]/70 backdrop-blur-md shadow-lg select-none"
        >
          <div
            class="font-headline text-[9px] uppercase font-extrabold tracking-widest text-white leading-tight flex flex-col items-center justify-center"
          >
            <span class="text-[#d49e35] text-base material-symbols-outlined">church</span>
            <span>ESTAMOS AQUÍ</span>
            <span class="text-[#d49e35]">MEDELLÍN</span>
          </div>
        </div>
      </div>

      <!-- Subtitle -->
      <p
        v-reveal="{ direction: 'up', delay: 180 }"
        class="mt-6 max-w-2xl text-base sm:text-lg text-[#eaf2f1]/90 leading-relaxed font-normal"
      >
        ¿Tienes preguntas, peticiones de oración o simplemente deseas integrarte a nuestros grupos de
        jóvenes y asambleas? Escríbenos, las puertas siempre están abiertas.
      </p>

      <!-- Quick Info Pills -->
      <div
        v-reveal="{ direction: 'up', delay: 250 }"
        class="mt-10 flex flex-wrap items-center justify-center gap-3.5 text-xs font-semibold tracking-wider text-white/90"
      >
        <div
          class="flex items-center gap-2 px-5 py-2.5 rounded-[9999px] bg-[#245A5C]/65 border border-white/15 backdrop-blur-md shadow-sm"
        >
          <span class="material-symbols-outlined text-[#d49e35] text-base">location_on</span>
          <span>Casa Palotinos • Medellín</span>
        </div>
        <div
          class="flex items-center gap-2 px-5 py-2.5 rounded-[9999px] bg-[#245A5C]/65 border border-white/15 backdrop-blur-md shadow-sm"
        >
          <span class="material-symbols-outlined text-[#d49e35] text-base">schedule</span>
          <span>Todos los Miércoles 7:00 PM</span>
        </div>
        <div
          class="flex items-center gap-2 px-5 py-2.5 rounded-[9999px] bg-[#245A5C]/65 border border-white/15 backdrop-blur-md shadow-sm"
        >
          <span class="material-symbols-outlined text-[#d49e35] text-base">bolt</span>
          <span>Respuesta en menos de 24 hrs</span>
        </div>
      </div>
    </div>
  </section>
</template>
