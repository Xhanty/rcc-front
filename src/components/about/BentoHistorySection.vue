<script setup lang="ts">
const stats = [
  { value: '26+', label: 'Años de gracia', spanFullOnMobile: false },
  { value: '100s', label: 'Familias unidas', spanFullOnMobile: false },
  { value: '1', label: 'Mismo Señor', spanFullOnMobile: true }
]

const foundations = [
  {
    icon: 'explore',
    iconBg: 'bg-[#1b4d4f] text-white',
    title: 'Misión',
    desc: 'Evangelizar a través del anuncio vivo del Kerigma, propiciando un encuentro personal, transformador y duradero con Jesucristo.'
  },
  {
    icon: 'visibility',
    iconBg: 'bg-[#007681] text-white',
    title: 'Visión',
    desc: 'Ser una comunidad viva de formación para jóvenes y profesionales consagrados y comprometidos con el prójimo y la justicia social.'
  },
  {
    icon: 'favorite',
    iconBg: 'bg-[#d49e35] text-[#1b1c1c]',
    title: 'Valores',
    desc: 'Integridad de corazón, Unidad en la diversidad carismática, Humildad activa y alegría fraterna que brota de la Resurrección.'
  }
]
</script>

<template>
  <section id="historia" class="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 font-jakarta">
    <div
      v-reveal="{ direction: 'up', delay: 60 }"
      class="bg-white rounded-[2.5rem] p-8 sm:p-14 lg:p-16 border border-[#e5e2e1] shadow-sm"
    >
      <!-- Top Row: Historia + Image -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div v-reveal="{ direction: 'left', delay: 100 }" class="lg:col-span-7 space-y-6">
          <span class="inline-block font-headline text-[#006972] text-xs font-black uppercase tracking-[0.2em]">
            Nuestra Trayectoria • Desde 1998
          </span>

          <h2 class="font-headline font-extrabold text-3xl sm:text-5xl text-[#1b4d4f] uppercase tracking-tight">
            Nuestra Historia
          </h2>

          <p class="text-[#1b1c1c]/80 text-base sm:text-lg leading-relaxed">
            Resucitados RCC nació de un pequeño grupo de oración en el invierno de 1998, donde un
            puñado de fieles buscaba una experiencia más profunda del Pentecostés personal. Lo que
            comenzó en una sala de estar se transformó en una comunidad vibrante que hoy acoge a
            cientos de familias, unidas por la alegría de la fe y el servicio desinteresado.
          </p>

          <!-- Stats Row -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-5 border-t border-neutral-200">
            <div
              v-for="stat in stats"
              :key="stat.label"
              :class="[
                'bg-[#eaf2f1] rounded-2xl p-4 text-center smooth-transition hover:-translate-y-0.5',
                stat.spanFullOnMobile ? 'col-span-2 sm:col-span-1' : ''
              ]"
            >
              <span class="font-headline font-black text-3xl sm:text-4xl text-[#1b4d4f] block">
                {{ stat.value }}
              </span>
              <span class="font-headline text-[11px] font-bold uppercase tracking-wider text-[#006972]">
                {{ stat.label }}
              </span>
            </div>
          </div>
        </div>

        <div v-reveal="{ direction: 'right', delay: 140 }" class="lg:col-span-5">
          <div
            class="rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[5/4] shadow-md border border-neutral-200 group"
          >
            <img
              v-parallax="{ range: 28, scale: 1.12 }"
              alt="Oración Comunitaria"
              class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSWtJ067TYY5vVrkJL1vbOMyhm_J9P7Re69cjqA0AG-Eg1FDwxK7HEZFNqbty7t-UWEwYIkVxzpl8VUC4HxvwkOZLJT9BEUnqzVDpMn2dXOseYawnUw473zwckkN5WsTy3KAum_qkT1azCi7ONIulsCs_1W7A7OHqfApvpjI1RdcFPvHbRENKUT3JTufJiLi0xgN0KY3nw0MKOIZ2WfwjmrkPgwqtauL3Owh4n2REZXZh-BhkhBZEwLGG6xxSk4vSTXdg1qvc1uRy5"
            />
          </div>
        </div>
      </div>

      <!-- Bottom Row: Misión, Visión y Valores -->
      <div id="valores" class="mt-16 pt-12 border-t border-[#e5e2e1]">
        <div v-reveal="{ direction: 'up', delay: 60 }" class="text-center max-w-xl mx-auto mb-10">
          <span class="font-headline text-xs font-bold uppercase tracking-widest text-[#006972]">
            Propósito &amp; Fundamentos
          </span>
          <h3 class="font-headline font-extrabold text-2xl sm:text-3xl text-[#1b4d4f] uppercase tracking-tight mt-1">
            Lo Que Nos Mueve
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(item, idx) in foundations"
            :key="item.title"
            v-reveal="{ direction: 'up', delay: 80 + idx * 80 }"
            class="bg-[#eaf2f1] rounded-3xl p-8 border border-[#c0c8c8]/40 hover:-translate-y-1.5 hover:shadow-md smooth-transition"
          >
            <div
              :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm',
                item.iconBg
              ]"
            >
              <span class="material-symbols-outlined text-2xl">{{ item.icon }}</span>
            </div>
            <h4 class="font-headline font-black text-xl text-[#1b4d4f] uppercase tracking-tight mb-3">
              {{ item.title }}
            </h4>
            <p class="text-[#1b1c1c]/75 text-sm leading-relaxed">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
