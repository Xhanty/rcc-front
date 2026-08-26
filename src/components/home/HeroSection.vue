<script setup lang="ts">
// HeroSection Component Logic
</script>

<template>
  <section class="relative h-[90vh] flex items-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
      <img 
        alt="Encendidos por el Espíritu" 
        class="w-full h-full object-cover object-center" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtxHmagb9p8GT11aii9zC9ND7V3ZfLkUJ05-fF6gbB_cPsu-znSKG_fYNrO-SnUAbGMjnjdaOXpgUDHbZDOQw0teSWrt2jpLPCBjME6jiSBMmB5i9tKpZcsm2X-fQ93NVY2gvUVut-lHoIikfDmOZpBMxiNDwNpQEhXppw_VN2XlpPX2lb7abK30Ij-xjxRcq0QjsNepvOXvYnIKvpFfknP_72ZhIckjV9GRymGmdGXOIUWgQOgNPHCput85hxvzELm_zji82yjB3P"
      />
    </div>
    <div class="max-w-max-width mx-auto px-margin-desktop relative z-20 w-full">
      <div class="max-w-2xl text-white">
        <span class="inline-block px-gutter py-1 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary text-secondary-fixed font-label-sm text-label-sm mb-base">RENOVACIÓN CARISMÁTICA</span>
        <h1 class="font-headline-lg text-headline-lg-mobile md:text-display-lg mb-base leading-tight">Encendidos por el Espíritu</h1>
        <p class="font-body-lg text-body-lg text-surface-variant mb-gutter max-w-lg">Una comunidad que camina bajo la luz de la fe, buscando el encuentro vivo con Jesucristo a través de la alabanza y la fraternidad.</p>
        <div class="flex gap-base">
          <button class="bg-secondary-container text-on-secondary-container px-gutter py-3 rounded-lg font-body-md text-body-md glow-hover flex items-center gap-2">
            Descubrir más <span class="material-symbols-outlined">arrow_forward</span>
          </button>
          <button class="border border-white/30 bg-white/10 backdrop-blur-md text-white px-gutter py-3 rounded-lg font-body-md text-body-md hover:bg-white/20 transition-all">
            Ver Ministerios
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
