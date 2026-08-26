<script setup lang="ts">
// ViviendoEspirituSection Component Logic
</script>

<template>
  <section class="py-12 md:py-20 bg-surface-container-low relative overflow-hidden">
    <div class="max-w-max-width mx-auto px-6 md:px-margin-desktop grid md:grid-cols-2 gap-gutter items-center">
      <!-- Image Column (Left on desktop, bottom on mobile) -->
      <div class="order-2 md:order-1 mt-6 md:mt-0">
        <img 
          alt="Comunidad Resucitados RCC" 
          class="rounded-xl shadow-xl w-full h-[300px] md:h-[400px] object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD14E8H-cDLd4-p5p6n0kvbcU14Uv4CNGkp8OFlxN1eSwF5jQdhnQlBMb5qZk06Se-HNnGjR2qNKS6q9gtyglyPUpdOx32jjiKktyQ1fSiuOZa-X8Te0cS5yn88b0BCihoeBaHs5tBwtWXuIwaUDe_cvyuNeN4fhqSP1NeeeCaN0ggFD_nnWD72iNao8NalZv_fYns6A7UTWNnsh6kbr0690nzPSoD9ZiOwN_wsMsXpB7cDIzyb2cIoIVz5RXPx4xtUcyjqMxa7v-q"
        />
      </div>

      <!-- Text details Column (Right on desktop, top on mobile) -->
      <div class="order-1 md:order-2">
        <h2 class="font-headline-lg text-headline-lg-mobile md:text-display-lg text-primary mb-6 md:mb-8 leading-tight">
          Viviendo en el Espíritu
        </h2>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6">
          No somos solo grupos de trabajo, somos una familia unida por el amor de Cristo. Cada ministerio es una expresión del Reino de Dios aquí y ahora.
        </p>
        <div class="space-y-base">
          <div class="flex items-center gap-base">
            <span class="material-symbols-outlined text-secondary text-xl">check_circle</span>
            <span class="font-body-md text-body-md">Formación espiritual constante</span>
          </div>
          <div class="flex items-center gap-base">
            <span class="material-symbols-outlined text-secondary text-xl">check_circle</span>
            <span class="font-body-md text-body-md">Compañerismo y fraternidad</span>
          </div>
          <div class="flex items-center gap-base">
            <span class="material-symbols-outlined text-secondary text-xl">check_circle</span>
            <span class="font-body-md text-body-md">Impacto real en la comunidad</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
