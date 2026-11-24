<script setup lang="ts">
const currentYear = new Date().getFullYear()

const highlights = [
  'Formación espiritual constante',
  'Compañerismo y fraternidad viva',
  'Impacto transformador en la comunidad'
]
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 font-jakarta">
    <div
      v-reveal="{ direction: 'up', delay: 60 }"
      class="bg-[#eaf2f1] rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-[#1b4d4f]/15 shadow-sm"
    >
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <!-- Image Column -->
        <div v-reveal="{ direction: 'left', delay: 120 }" class="lg:col-span-7">
          <div class="relative overflow-hidden rounded-3xl shadow-xl group">
            <img
              v-parallax="{ range: 32, scale: 1.14 }"
              alt="Comunidad Resucitados RCC"
              class="w-full h-[340px] sm:h-[440px] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD14E8H-cDLd4-p5p6n0kvbcU14Uv4CNGkp8OFlxN1eSwF5jQdhnQlBMb5qZk06Se-HNnGjR2qNKS6q9gtyglyPUpdOx32jjiKktyQ1fSiuOZa-X8Te0cS5yn88b0BCihoeBaHs5tBwtWXuIwaUDe_cvyuNeN4fhqSP1NeeeCaN0ggFD_nnWD72iNao8NalZv_fYns6A7UTWNnsh6kbr0690nzPSoD9ZiOwN_wsMsXpB7cDIzyb2cIoIVz5RXPx4xtUcyjqMxa7v-q"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#1b4d4f]/80 via-transparent to-transparent pointer-events-none"
            ></div>
            <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <span
                class="font-headline text-xs uppercase tracking-widest font-bold px-4 py-1.5 rounded-pill bg-[#1b4d4f]/80 backdrop-blur-md border border-white/20"
              >
                Vida en Comunidad
              </span>
              <span class="font-headline text-xs font-semibold text-white/90">
                RCC {{ currentYear }}
              </span>
            </div>
          </div>
        </div>

        <!-- Text Details Column -->
        <div v-reveal="{ direction: 'right', delay: 180 }" class="lg:col-span-5 flex flex-col justify-center">
          <span
            class="font-headline text-xs uppercase tracking-widest text-[#007681] font-extrabold mb-3 block"
          >
            Propósito &amp; Comunión
          </span>
          <h2
            class="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b4d4f] tracking-tight mb-5 leading-tight uppercase"
          >
            Viviendo en el Espíritu
          </h2>
          <p class="text-[#404848] text-base sm:text-lg mb-8 leading-relaxed font-normal">
            No somos solo grupos de trabajo, somos una familia unida por el amor de Cristo. Cada
            ministerio es una expresión del Reino de Dios aquí y ahora.
          </p>

          <div class="space-y-4">
            <div
              v-for="(item, idx) in highlights"
              :key="item"
              v-reveal="{ direction: 'up', delay: 220 + idx * 90 }"
              class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/75 border border-[#1b4d4f]/10 hover:bg-white hover:translate-x-1.5 smooth-transition"
            >
              <div
                class="w-9 h-9 rounded-pill bg-[#1b4d4f] flex items-center justify-center text-white shrink-0"
              >
                <span class="material-symbols-outlined text-xl">check</span>
              </div>
              <span class="text-[#1b4d4f] font-semibold text-base">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
