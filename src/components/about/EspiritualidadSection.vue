<script setup lang="ts">
// EspiritualidadSection Component Logic
</script>

<template>
  <section id="carisma" class="bg-[#1b4d4f] text-white py-16 lg:py-24 relative overflow-hidden font-jakarta">
    <!-- Decorative Kinetic Marquee Outlined Text -->
    <div
      aria-hidden="true"
      class="w-full overflow-hidden whitespace-nowrap opacity-25 select-none mb-10 -mt-6 pointer-events-none"
    >
      <div class="animate-marquee-slow">
        <span
          class="font-headline font-black text-6xl sm:text-8xl lg:text-9xl outline-marquee tracking-tighter uppercase pr-10"
        >
          EFUSIÓN • PENTECOSTÉS HOY • CARISMAS • FE VIVA •
        </span>
        <span
          class="font-headline font-black text-6xl sm:text-8xl lg:text-9xl outline-marquee tracking-tighter uppercase pr-10"
        >
          EFUSIÓN • PENTECOSTÉS HOY • CARISMAS • FE VIVA •
        </span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <!-- Left: Big Editorial Headline & Charismatic Focus -->
        <div v-reveal="{ direction: 'left', delay: 80 }" class="lg:col-span-6 space-y-6">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-[9999px] bg-white/10 border border-white/20 text-[#99f0fc] font-headline text-xs font-bold uppercase tracking-widest"
          >
            <span class="material-symbols-outlined text-sm">local_fire_department</span>
            Espiritualidad &amp; Carisma
          </div>

          <h2
            class="font-headline font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[1.08]"
          >
            El Bautismo en el Espíritu
          </h2>

          <blockquote
            class="text-xl sm:text-2xl font-semibold text-[#99f0fc] leading-snug border-l-4 border-[#d49e35] pl-5 my-4"
          >
            "Ser antorchas vivas del amor de Dios en medio del mundo."
          </blockquote>

          <p class="text-white/85 text-base sm:text-lg leading-relaxed font-normal">
            La esencia de nuestra comunidad es la Efusión del Espíritu Santo: reactivar con fervor
            renovado las gracias de nuestro bautismo, promoviendo una alabanza jubilosa, amor
            ferviente a las Sagradas Escrituras y fraternidad activa.
          </p>

          <div class="pt-4 flex flex-wrap gap-4">
            <div
              class="bg-[#003638] border border-white/10 rounded-2xl p-5 flex-1 min-w-[210px] hover:border-[#d49e35]/40 smooth-transition"
            >
              <div
                class="flex items-center gap-2 text-[#99f0fc] font-headline font-bold text-sm mb-1.5 uppercase tracking-wide"
              >
                <span class="material-symbols-outlined text-base">auto_awesome</span>
                Pentecostés Hoy
              </div>
              <p class="text-xs text-white/75 leading-relaxed">
                El Espíritu Santo continúa actuando en nuestras vidas cotidianas con el mismo poder
                transformador de los Hechos.
              </p>
            </div>

            <div
              class="bg-[#003638] border border-white/10 rounded-2xl p-5 flex-1 min-w-[210px] hover:border-[#d49e35]/40 smooth-transition"
            >
              <div
                class="flex items-center gap-2 text-[#99f0fc] font-headline font-bold text-sm mb-1.5 uppercase tracking-wide"
              >
                <span class="material-symbols-outlined text-base">record_voice_over</span>
                Dones &amp; Carismas
              </div>
              <p class="text-xs text-white/75 leading-relaxed">
                Evangelización moderna, oración compartida, acogida cálida y servicio desinteresado
                para bien de la Iglesia.
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Rounded Visual Card with Circular Gold Stamp -->
        <div v-reveal="{ direction: 'right', delay: 140 }" class="lg:col-span-6 flex justify-center">
          <div class="relative w-full max-w-lg">
            <div
              class="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/15 aspect-square group"
            >
              <img
                v-parallax="{ range: 34, scale: 1.14 }"
                alt="Luz del Espíritu Santo"
                class="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3vuyrNuwN7LsIg3D9Xx8PjUey5EB2qP1PZ1WUzWCPCG1I_a6LFNcXNt2Cph91tlzO6Yke-pUH--03pzUjnOx8Y1IDr4Bv3Zs6HJ-w9HVclefywxHZzd_iZH6aKrtzmGgMpgVisX1pOYkZAKe0Tg848geJDzE-lLWitt8gt6LWxrf31R0d4-A8P6uHKf6ToH3Rx34aoo1iy23ULM2LHa9c3nHE7q3mTc2a-69ymvS7bNFUvU66YIAfBYjAYu5rCTOSdYhIlv4TvtuC"
              />
            </div>

            <!-- Circular Highlight Stamp -->
            <div
              class="absolute -bottom-6 -right-3 sm:bottom-6 sm:-right-8 bg-[#d49e35] text-[#1b1c1c] w-28 h-28 rounded-[9999px] flex flex-col items-center justify-center p-3 text-center shadow-xl rotate-6 hover:rotate-0 smooth-transition font-headline font-black text-xs uppercase tracking-tight leading-tight select-none"
            >
              <span>FUEGO</span>
              <span class="text-[9px] font-bold tracking-widest">ESPÍRITU</span>
              <span>SANTO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
