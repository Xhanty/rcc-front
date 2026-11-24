<script setup lang="ts">
const pillars = [
  {
    icon: 'auto_awesome',
    title: 'Carismas Vivos',
    desc: 'Dones del Espíritu Santo operando hoy para edificar a la Iglesia.'
  },
  {
    icon: 'temple_hindu',
    title: 'Adoración',
    desc: 'Alabanza vibrante, música y encuentro personal con el Señor.'
  },
  {
    icon: 'groups',
    title: 'Comunidad',
    desc: 'Caminar juntos como hermanos de verdad en fraternidad sincera.'
  },
  {
    icon: 'volunteer_activism',
    title: 'Misión Activa',
    desc: 'Llevar la Buena Nueva con valentía a las periferias y familias.'
  }
]
</script>

<template>
  <div class="font-jakarta">
    <!-- Deep Forest Teal Signature Section -->
    <section
      id="esencia"
      class="relative bg-[#1B4D4F] text-white py-24 sm:py-32 px-6 lg:px-12 overflow-hidden"
    >
      <!-- Kinetic Outline Marquee Accent -->
      <div
        aria-hidden="true"
        class="select-none pointer-events-none overflow-hidden whitespace-nowrap opacity-20 py-2 -mt-10 mb-10"
      >
        <div class="animate-marquee-slow">
          <span
            class="font-headline font-black text-6xl sm:text-8xl tracking-tight outline-marquee uppercase pr-10"
          >
            ¿QUIÉNES SOMOS? • PENTECOSTÉS HOY • FE VIVA •
          </span>
          <span
            class="font-headline font-black text-6xl sm:text-8xl tracking-tight outline-marquee uppercase pr-10"
          >
            ¿QUIÉNES SOMOS? • PENTECOSTÉS HOY • FE VIVA •
          </span>
        </div>
      </div>

      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <!-- Left: Overlapping Photo with Rotating Stamp Badge -->
          <div v-reveal="{ direction: 'left', delay: 80 }" class="lg:col-span-6 relative">
            <div
              class="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto lg:max-w-none border border-white/10 group"
            >
              <img
                v-parallax="{ range: 36, scale: 1.14 }"
                alt="Fraternidad Resucitados"
                class="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYIHMeilTFwZE7b_BTHptrz9qprlZBy9mTnDJr4qhxfM8sMKPyL3ogFXL0-4FXhvBnhA9eq1oOe0p3tVfsc1gH3vM-J-Fn7rfH9xjcJ1g12CAr2PKzfaxdKZHpPU3yVsYc8R94IQgX-K41XM306CAiPXtZAvSpOKOR4O30aMJIF4k1wmZOwW-nI_Vf-cuWp0E26MSyW2-7LEApjLsaie91YnHqHB6bR-JwAKA5a3p2QJH_lkoTYBnCb54BA_312ZOXSPhRcSvMvHiG"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#133738]/90 via-transparent to-transparent pointer-events-none"
              ></div>
              <div class="absolute bottom-8 left-8 right-8">
                <h3
                  class="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-tight"
                >
                  SOMOS GENTE <br />
                  <span class="outline-marquee text-3xl sm:text-4xl">COMO TÚ</span>
                </h3>
              </div>
            </div>

            <!-- Circular Rotating Stamp Badge -->
            <div
              class="absolute -bottom-8 right-2 sm:-right-6 z-20 w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center pointer-events-none select-none"
            >
              <div class="relative w-full h-full flex items-center justify-center">
                <svg class="w-full h-full animate-[spin_22s_linear_infinite]" viewBox="0 0 160 160">
                  <defs>
                    <path
                      d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                      id="homeStampCirclePath"
                    />
                  </defs>
                  <text
                    fill="#ffffff"
                    class="font-headline"
                    font-size="11.5"
                    font-weight="800"
                    letter-spacing="3.2"
                  >
                    <textPath href="#homeStampCirclePath">
                      • VEN Y VIVE • UN NUEVO PENTECOSTÉS
                    </textPath>
                  </text>
                </svg>
                <div
                  class="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-[9999px] bg-[#D49E35] flex items-center justify-center text-[#1B4D4F] shadow-xl"
                >
                  <span class="material-symbols-outlined text-3xl">local_fire_department</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Content & 4 Pillar Cards -->
          <div v-reveal="{ direction: 'right', delay: 140 }" class="lg:col-span-6 space-y-8 mt-6 lg:mt-0">
            <div>
              <span
                class="inline-block px-4 py-1.5 rounded-[9999px] bg-white/10 text-[#D49E35] font-headline text-xs font-extrabold uppercase tracking-widest mb-4"
              >
                Nuestra Esencia
              </span>
              <h2
                class="font-headline text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase"
              >
                Todos tienen un lugar en <span class="text-[#D49E35]">Resucitados</span>.
              </h2>
              <p class="text-white/80 text-base sm:text-lg leading-relaxed mt-5">
                Cada semana en Resucitados RCC, católicos, buscadores y personas con sed de Dios nos
                reunimos para alabar con libertad, escuchar la Palabra y experimentar la gracia viva
                del Espíritu Santo que transforma vidas reales.
              </p>
            </div>

            <!-- 4 Clean Pillar Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                v-for="(pillar, idx) in pillars"
                :key="pillar.title"
                v-reveal="{ direction: 'up', delay: 120 + idx * 70 }"
                class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 smooth-transition"
              >
                <span class="material-symbols-outlined text-[#D49E35] text-3xl mb-3 block">
                  {{ pillar.icon }}
                </span>
                <h4 class="font-headline font-extrabold text-lg text-white">{{ pillar.title }}</h4>
                <p class="text-white/70 text-xs sm:text-sm mt-1 leading-relaxed">
                  {{ pillar.desc }}
                </p>
              </div>
            </div>

            <div>
              <a
                href="#ministries"
                class="inline-flex items-center gap-2 px-7 py-3.5 rounded-[9999px] border-2 border-white/40 text-white font-headline text-xs font-extrabold tracking-widest uppercase hover:bg-white hover:text-[#1B4D4F] smooth-transition active:scale-95 group"
              >
                <span>Explora los Carismas</span>
                <span
                  class="material-symbols-outlined text-sm group-hover:translate-x-1 smooth-transition"
                >
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Split Highlight Banner -->
    <section class="bg-[#133738] text-white py-20 px-6 lg:px-12 border-t border-white/10">
      <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
        <div v-reveal="{ direction: 'left', delay: 80 }" class="lg:col-span-7 space-y-6">
          <h2
            class="font-headline text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase"
          >
            ¿Buscas una experiencia <br />
            <span class="text-[#D49E35]">que cambie tu vida?</span>
          </h2>
          <p class="text-white/80 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            No somos un espectáculo ni una rutina dominical. Cada asamblea es una oportunidad real
            de encontrarnos cara a cara con Jesús Resucitado, dejar que el Espíritu Santo sane
            nuestras heridas y edificar juntos una comunidad llena de fe.
          </p>
          <div class="pt-2">
            <a
              href="#events"
              class="inline-flex items-center gap-2 px-7 py-3.5 rounded-[9999px] border-2 border-white/40 text-white font-headline text-xs font-extrabold tracking-widest uppercase hover:bg-[#D49E35] hover:border-[#D49E35] hover:text-[#1B4D4F] smooth-transition active:scale-95"
            >
              Únete Este Domingo
            </a>
          </div>
        </div>

        <div v-reveal="{ direction: 'right', delay: 140 }" class="lg:col-span-5">
          <div
            class="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/10] border border-white/15 group"
          >
            <img
              v-parallax="{ range: 30, scale: 1.14 }"
              alt="Asamblea orando con manos alzadas"
              class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtxHmagb9p8GT11aii9zC9ND7V3ZfLkUJ05-fF6gbB_cPsu-znSKG_fYNrO-SnUAbGMjnjdaOXpgUDHbZDOQw0teSWrt2jpLPCBjME6jiSBMmB5i9tKpZcsm2X-fQ93NVY2gvUVut-lHoIikfDmOZpBMxiNDwNpQEhXppw_VN2XlpPX2lb7abK30Ij-xjxRcq0QjsNepvOXvYnIKvpFfknP_72ZhIckjV9GRymGmdGXOIUWgQOgNPHCput85hxvzELm_zji82yjB3P"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
