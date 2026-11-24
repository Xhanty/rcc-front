<script setup lang="ts">
import { ref } from 'vue'

const showFaq = ref(false)

const faqs = [
  {
    q: '¿Necesito inscribirme antes de asistir a una asamblea?',
    a: 'No necesitas inscripción previa. Solo llega a Casa Palotinos unos minutos antes del inicio; nuestro equipo de acogida te recibirá con alegría.'
  },
  {
    q: '¿Hay código de vestimenta especial?',
    a: 'No, ven cómodo y tal como eres. Lo más importante es venir con el corazón dispuesto al encuentro con Dios y la comunidad.'
  },
  {
    q: '¿Cómo puedo integrarme a un ministerio?',
    a: 'Puedes escribirnos en el formulario de arriba o acercarte a cualquier servidor al finalizar la asamblea.'
  }
]
</script>

<template>
  <div class="w-full font-jakarta">
    <!-- Kinetic Editorial Ribbon Strip -->
    <div class="w-full bg-[#1b4d4f] overflow-hidden py-7 border-y border-white/10 select-none">
      <div class="animate-marquee-slow opacity-85">
        <div
          class="font-headline text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-white flex items-center gap-6 pr-6"
        >
          <span>CONÉCTATE CON NOSOTROS</span>
          <span class="text-[#d49e35]">✦</span>
          <span class="outline-marquee">WE ARE HERE</span>
          <span class="text-[#d49e35]">✦</span>
          <span>MEDELLÍN, COLOMBIA</span>
          <span class="text-[#d49e35]">✦</span>
          <span class="outline-marquee">UNA FAMILIA EN CRISTO</span>
          <span class="text-[#d49e35]">✦</span>
          <span>CANALES DIRECTOS</span>
          <span class="text-[#d49e35]">✦</span>
        </div>
        <div
          class="font-headline text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-white flex items-center gap-6 pr-6"
          aria-hidden="true"
        >
          <span>CONÉCTATE CON NOSOTROS</span>
          <span class="text-[#d49e35]">✦</span>
          <span class="outline-marquee">WE ARE HERE</span>
          <span class="text-[#d49e35]">✦</span>
          <span>MEDELLÍN, COLOMBIA</span>
          <span class="text-[#d49e35]">✦</span>
          <span class="outline-marquee">UNA FAMILIA EN CRISTO</span>
          <span class="text-[#d49e35]">✦</span>
          <span>CANALES DIRECTOS</span>
          <span class="text-[#d49e35]">✦</span>
        </div>
      </div>
    </div>

    <!-- Direct Contact Channels Grid -->
    <section class="w-full bg-[#f2f7f6] py-16 sm:py-20 border-b border-[#eaf2f1]">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div v-reveal="{ direction: 'up', delay: 50 }" class="text-center max-w-xl mx-auto mb-12">
          <span
            class="font-headline text-xs uppercase tracking-widest text-[#007681] font-extrabold block"
          >
            Canales Directos
          </span>
          <h3 class="font-headline text-2xl sm:text-3xl font-extrabold text-[#1b4d4f] mt-1">
            Conéctate en Tiempo Real
          </h3>
          <p class="text-[#404848] text-sm sm:text-base mt-2 leading-relaxed">
            Elige la vía más cómoda para hablar con nuestros coordinadores o unirte a los grupos de
            WhatsApp comunitarios.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Phone / WhatsApp -->
          <a
            v-reveal="{ direction: 'up', delay: 60 }"
            href="tel:+573103748739"
            class="group bg-white p-6 sm:p-7 rounded-3xl shadow-sm hover:shadow-xl border border-[#eaf2f1] flex items-center gap-4 smooth-transition hover:-translate-y-1.5"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white smooth-transition shadow-sm shrink-0"
            >
              <span class="material-symbols-outlined text-2xl">call</span>
            </div>
            <div class="min-w-0">
              <span class="font-headline text-[11px] font-bold uppercase tracking-wider text-[#707979] block">
                Teléfono / WhatsApp
              </span>
              <span
                class="font-headline text-base font-bold text-[#1c2424] block truncate group-hover:text-[#007681] smooth-transition"
              >
                +57 310 3748739
              </span>
              <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-[9999px] bg-emerald-500 animate-pulse"></span>
                Disponible ahora
              </span>
            </div>
          </a>

          <!-- Instagram -->
          <a
            v-reveal="{ direction: 'up', delay: 130 }"
            href="https://www.instagram.com/resucitadosrcc"
            target="_blank"
            rel="noopener noreferrer"
            class="group bg-white p-6 sm:p-7 rounded-3xl shadow-sm hover:shadow-xl border border-[#eaf2f1] flex items-center gap-4 smooth-transition hover:-translate-y-1.5"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white smooth-transition shadow-sm shrink-0"
            >
              <span class="material-symbols-outlined text-2xl">photo_camera</span>
            </div>
            <div class="min-w-0">
              <span class="font-headline text-[11px] font-bold uppercase tracking-wider text-[#707979] block">
                Instagram
              </span>
              <span
                class="font-headline text-base font-bold text-[#1c2424] block truncate group-hover:text-pink-600 smooth-transition"
              >
                @resucitadosrcc
              </span>
              <span class="text-[11px] text-[#404848] font-medium mt-0.5 block truncate">
                Historias y transmisiones
              </span>
            </div>
          </a>

          <!-- Facebook -->
          <a
            v-reveal="{ direction: 'up', delay: 200 }"
            href="https://www.facebook.com/share/1CYRbLsNjd"
            target="_blank"
            rel="noopener noreferrer"
            class="group bg-white p-6 sm:p-7 rounded-3xl shadow-sm hover:shadow-xl border border-[#eaf2f1] flex items-center gap-4 smooth-transition hover:-translate-y-1.5"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white smooth-transition shadow-sm shrink-0"
            >
              <span class="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div class="min-w-0">
              <span class="font-headline text-[11px] font-bold uppercase tracking-wider text-[#707979] block">
                Facebook
              </span>
              <span
                class="font-headline text-base font-bold text-[#1c2424] block truncate group-hover:text-blue-600 smooth-transition"
              >
                Resucitados RCC
              </span>
              <span class="text-[11px] text-[#404848] font-medium mt-0.5 block truncate">
                Comunidad y Eucaristías
              </span>
            </div>
          </a>

          <!-- Pastoral Email -->
          <a
            v-reveal="{ direction: 'up', delay: 270 }"
            href="mailto:resucitadoscomunidad@gmail.com"
            class="group bg-white p-6 sm:p-7 rounded-3xl shadow-sm hover:shadow-xl border border-[#eaf2f1] flex items-center gap-4 smooth-transition hover:-translate-y-1.5"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-[#d49e35]/15 text-[#d49e35] flex items-center justify-center group-hover:bg-[#d49e35] group-hover:text-white smooth-transition shadow-sm shrink-0"
            >
              <span class="material-symbols-outlined text-2xl">drafts</span>
            </div>
            <div class="min-w-0">
              <span class="font-headline text-[11px] font-bold uppercase tracking-wider text-[#707979] block">
                Correo Pastoral
              </span>
              <span
                class="font-headline text-base font-bold text-[#1c2424] block truncate group-hover:text-[#d49e35] smooth-transition"
              >
                resucitadoscomunidad@gmail.com
              </span>
              <span class="text-[11px] text-[#404848] font-medium mt-0.5 block truncate">
                Atención parroquial
              </span>
            </div>
          </a>
        </div>

        <!-- First Visit FAQ Banner -->
        <div
          v-reveal="{ direction: 'up', delay: 140 }"
          class="mt-12 p-7 sm:p-8 rounded-3xl bg-[#1b4d4f] text-white shadow-xl shadow-[#1b4d4f]/20 border border-[#245A5C]/50 overflow-hidden"
        >
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#d49e35] shrink-0"
              >
                <span class="material-symbols-outlined text-3xl">help_outline</span>
              </div>
              <div>
                <h4 class="font-headline text-lg sm:text-xl font-bold">
                  ¿Primera vez que nos visitas?
                </h4>
                <p class="text-sm text-[#eaf2f1]/80 mt-0.5">
                  No necesitas registro previo ni vestimenta especial. Eres bienvenido tal como eres.
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="showFaq = !showFaq"
              class="px-7 py-3 rounded-[9999px] bg-white text-[#1b4d4f] font-headline text-xs uppercase tracking-wider hover:bg-[#eaf2f1] smooth-transition shadow-md active:scale-95 whitespace-nowrap font-extrabold cursor-pointer flex items-center gap-2"
            >
              <span>{{ showFaq ? 'Ocultar Preguntas' : 'Preguntas Frecuentes' }}</span>
              <span
                :class="[
                  'material-symbols-outlined text-base smooth-transition',
                  showFaq ? 'rotate-180' : ''
                ]"
              >
                expand_more
              </span>
            </button>
          </div>

          <!-- Expandable FAQ Drawer -->
          <transition name="faq-slide">
            <div
              v-if="showFaq"
              class="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div
                v-for="item in faqs"
                :key="item.q"
                class="p-5 rounded-2xl bg-white/10 border border-white/10"
              >
                <h5 class="font-headline text-sm font-bold text-[#d49e35] mb-2">{{ item.q }}</h5>
                <p class="text-xs sm:text-sm text-white/85 leading-relaxed">{{ item.a }}</p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-slide-enter-from,
.faq-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
