<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const name = ref('')
const email = ref('')
const phone = ref('')
const subject = ref('Información General')
const message = ref('')
const acceptedTerms = ref(false)
const isSubmitted = ref(false)
const isLoading = ref(false)
const formError = ref('')

const requiresTerms = computed(() => Boolean(email.value.trim() || phone.value.trim()))

watch(requiresTerms, (needed) => {
  if (!needed) {
    acceptedTerms.value = false
  }
})

const openTermsModal = () => {
  window.dispatchEvent(new CustomEvent('open-terms-modal'))
}

const handleFormSubmit = async () => {
  if (!name.value || !subject.value || !message.value) {
    formError.value = 'El nombre, asunto y mensaje son campos obligatorios.'
    return
  }

  if (requiresTerms.value && !acceptedTerms.value) {
    formError.value =
      'Debes aceptar los Términos, Condiciones y Política de Tratamiento de Datos para enviar tus datos de contacto.'
    return
  }

  isLoading.value = true
  formError.value = ''

  try {
    const url = `${import.meta.env.VITE_API_URL}contacts`
    const key = import.meta.env.VITE_API_KEY

    if (!url || !key) {
      throw new Error('API config is missing')
    }

    const payload = {
      name: name.value,
      email: email.value || null,
      phone: phone.value ? String(phone.value) : null,
      subject: subject.value,
      message: message.value,
      accepted_terms: requiresTerms.value ? acceptedTerms.value : false,
      terms_version: requiresTerms.value && acceptedTerms.value ? '2026-v1' : null
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': key
      },
      body: JSON.stringify(payload)
    })

    const resJson = await response.json()

    if (!response.ok) {
      if (resJson.errors) {
        const errorMsgs = Object.values(resJson.errors).flat().join(' ')
        throw new Error(errorMsgs || resJson.message || 'Error de validación.')
      }
      throw new Error(resJson.message || 'Error al enviar el mensaje de contacto.')
    }

    isSubmitted.value = true
    isLoading.value = false
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    formError.value = error.message || 'Error al conectar con el servidor. Inténtalo de nuevo.'
    isLoading.value = false
  }
}

const resetForm = () => {
  name.value = ''
  email.value = ''
  phone.value = ''
  subject.value = 'Información General'
  message.value = ''
  acceptedTerms.value = false
  formError.value = ''
  isSubmitted.value = false
}

const scheduleItems = [
  {
    title: 'Asamblea Carismática',
    desc: 'Alabanza viva, predicación y adoración',
    time: 'Todos los Miércoles 7:00 PM',
    highlight: false
  }
]
</script>

<template>
  <section class="relative w-full max-w-7xl mx-auto px-6 md:px-12 -mt-14 pb-20 z-20 font-jakarta">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Form Card (Col span 7) -->
      <div
        v-reveal="{ direction: 'up', delay: 80 }"
        class="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-10 md:p-12 shadow-2xl shadow-[#1b4d4f]/10 border border-[#eaf2f1] flex flex-col relative overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-6 mb-8 border-b border-[#eaf2f1] gap-4">
          <div>
            <div
              class="inline-flex items-center gap-2 text-[#1b4d4f] font-headline text-xs uppercase tracking-widest mb-2 font-extrabold"
            >
              <span class="w-2 h-2 rounded-[9999px] bg-[#d49e35] animate-pulse"></span>
              Atención Fraterna
            </div>
            <h2 class="font-headline text-2xl sm:text-3xl text-[#1b4d4f] font-extrabold tracking-tight">
              Envíanos un Mensaje
            </h2>
            <p class="text-[#404848] text-sm mt-1">
              Tu mensaje llegará directamente a nuestro equipo de acogida e intercesión.
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-[#eaf2f1] flex items-center justify-center text-[#1b4d4f] shadow-inner shrink-0"
          >
            <span class="material-symbols-outlined text-2xl">mail</span>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleFormSubmit" class="space-y-6">
          <!-- Full Name -->
          <div class="space-y-1.5">
            <label
              class="block font-headline text-xs font-bold uppercase text-[#1b4d4f] tracking-wider"
              for="contact-name"
            >
              Nombre Completo <span class="text-[#ba1a1a]">*</span>
            </label>
            <div class="relative">
              <input
                id="contact-name"
                v-model="name"
                required
                type="text"
                placeholder="Ej. María García"
                class="w-full bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] placeholder:text-[#707979] text-sm sm:text-base py-3.5 pl-4 pr-11 rounded-t-xl smooth-transition focus:ring-0 focus:outline-none"
              />
              <span
                class="material-symbols-outlined absolute right-3.5 top-3.5 text-[#707979] pointer-events-none text-xl"
              >
                person
              </span>
            </div>
          </div>

          <!-- Email & Phone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label
                class="block font-headline text-xs font-bold uppercase text-[#1b4d4f] tracking-wider"
                for="contact-email"
              >
                Correo Electrónico
              </label>
              <div class="relative">
                <input
                  id="contact-email"
                  v-model="email"
                  type="email"
                  placeholder="maria@ejemplo.com"
                  class="w-full bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] placeholder:text-[#707979] text-sm sm:text-base py-3.5 pl-4 pr-11 rounded-t-xl smooth-transition focus:ring-0 focus:outline-none"
                />
                <span
                  class="material-symbols-outlined absolute right-3.5 top-3.5 text-[#707979] pointer-events-none text-xl"
                >
                  alternate_email
                </span>
              </div>
            </div>

            <div class="space-y-1.5">
              <label
                class="block font-headline text-xs font-bold uppercase text-[#1b4d4f] tracking-wider"
                for="contact-phone"
              >
                Teléfono (Opcional)
              </label>
              <div class="relative">
                <input
                  id="contact-phone"
                  v-model="phone"
                  type="tel"
                  placeholder="Ej. 310 374 8739"
                  class="w-full bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] placeholder:text-[#707979] text-sm sm:text-base py-3.5 pl-4 pr-11 rounded-t-xl smooth-transition focus:ring-0 focus:outline-none"
                />
                <span
                  class="material-symbols-outlined absolute right-3.5 top-3.5 text-[#707979] pointer-events-none text-xl"
                >
                  call
                </span>
              </div>
            </div>
          </div>

          <!-- Subject -->
          <div class="space-y-1.5">
            <label
              class="block font-headline text-xs font-bold uppercase text-[#1b4d4f] tracking-wider"
              for="contact-subject"
            >
              Asunto / Motivo <span class="text-[#ba1a1a]">*</span>
            </label>
            <div class="relative">
              <select
                id="contact-subject"
                v-model="subject"
                required
                class="w-full appearance-none bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] text-sm sm:text-base py-3.5 pl-4 pr-11 rounded-t-xl smooth-transition focus:ring-0 focus:outline-none cursor-pointer"
              >
                <option value="Información General">Información General</option>
                <option value="Ministerios">Ministerios</option>
                <option value="Evento">Evento</option>
                <option value="Asesoría con el Padre">Asesoría con el Padre</option>
              </select>
              <span
                class="material-symbols-outlined absolute right-3.5 top-3.5 text-[#707979] pointer-events-none text-xl"
              >
                expand_more
              </span>
            </div>
          </div>

          <!-- Message -->
          <div class="space-y-1.5">
            <label
              class="block font-headline text-xs font-bold uppercase text-[#1b4d4f] tracking-wider"
              for="contact-message"
            >
              Tu Mensaje <span class="text-[#ba1a1a]">*</span>
            </label>
            <textarea
              id="contact-message"
              v-model="message"
              required
              rows="4"
              placeholder="¿Cómo podemos ayudarte o acompañarte hoy?"
              class="w-full bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] placeholder:text-[#707979] text-sm sm:text-base py-3 px-4 rounded-t-xl smooth-transition focus:ring-0 focus:outline-none resize-none"
            ></textarea>
          </div>

          <!-- Conditional Terms & Data Protection Consent -->
          <div class="space-y-2">
            <label
              v-if="requiresTerms"
              class="flex items-start gap-3 p-4 rounded-2xl bg-[#f6f9f8] border border-[#1b4d4f]/20 cursor-pointer select-none smooth-transition hover:border-[#1b4d4f]/40"
            >
              <input
                v-model="acceptedTerms"
                type="checkbox"
                class="mt-0.5 w-4 h-4 rounded border-[#1b4d4f]/40 text-[#1b4d4f] focus:ring-[#1b4d4f] cursor-pointer shrink-0 accent-[#1b4d4f]"
              />
              <span class="text-xs sm:text-sm text-[#323a3a] leading-relaxed">
                Autorizo el tratamiento de mis datos personales y acepto los
                <button
                  type="button"
                  @click.stop.prevent="openTermsModal"
                  class="text-[#007681] hover:text-[#1b4d4f] font-bold underline underline-offset-2 cursor-pointer"
                >
                  Términos, Condiciones y Política de Datos
                </button>
                (Ley 1581 de 2012). <span class="text-[#ba1a1a]">*</span>
              </span>
            </label>

            <p v-else class="text-xs text-[#707979] flex flex-wrap items-center gap-1 px-1">
              <span class="material-symbols-outlined text-sm text-[#007681]">verified_user</span>
              <span>Sin datos de contacto. Si incluyes correo o teléfono, deberás aceptar los</span>
              <button
                type="button"
                @click="openTermsModal"
                class="text-[#007681] hover:text-[#1b4d4f] font-bold underline underline-offset-2 cursor-pointer"
              >
                Términos y Política de Datos
              </button>
              <span>.</span>
            </p>
          </div>

          <!-- Error Alert -->
          <transition name="fade">
            <div
              v-if="formError"
              class="p-4 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 text-[#ba1a1a] rounded-2xl flex items-center gap-2.5 text-sm font-medium"
            >
              <span class="material-symbols-outlined text-xl shrink-0">error</span>
              <span>{{ formError }}</span>
            </div>
          </transition>

          <!-- Submit Row -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              :disabled="isLoading || (requiresTerms && !acceptedTerms)"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[9999px] bg-[#d49e35] hover:bg-[#b88628] text-white font-headline text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:shadow-[#d49e35]/25 smooth-transition active:scale-95 font-extrabold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">Enviar Mensaje</span>
              <span
                v-else
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-[9999px] animate-spin"
              ></span>
              <span v-if="!isLoading" class="material-symbols-outlined text-lg">send</span>
            </button>
            <span class="text-xs text-[#404848] font-medium text-center sm:text-right">
              Tus datos son tratados con confidencialidad pastoral.
            </span>
          </div>
        </form>

        <!-- Success Overlay -->
        <transition name="fade">
          <div
            v-if="isSubmitted"
            class="absolute inset-0 bg-white/95 backdrop-blur-md p-10 flex flex-col items-center justify-center text-center z-20"
          >
            <div
              class="w-16 h-16 rounded-[9999px] bg-[#eaf2f1] text-[#1b4d4f] flex items-center justify-center mb-4 shadow-sm"
            >
              <span class="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 class="font-headline text-2xl text-[#1b4d4f] font-extrabold mb-2">
              ¡Mensaje Recibido!
            </h3>
            <p class="text-[#404848] text-base max-w-sm mb-6 leading-relaxed">
              Paz y Bien, <strong class="text-[#1b4d4f]">{{ name }}</strong>. Hemos recibido tus
              palabras. Un hermano del equipo de acogida se comunicará contigo muy pronto.
            </p>
            <button
              type="button"
              @click="resetForm"
              class="px-7 py-3 rounded-[9999px] bg-[#1b4d4f] text-white font-headline text-xs uppercase tracking-wider font-bold hover:bg-[#12383A] smooth-transition cursor-pointer active:scale-95"
            >
              Enviar otro mensaje
            </button>
          </div>
        </transition>
      </div>

      <!-- Right Column: Asymmetric Cards (Col span 5) -->
      <div class="lg:col-span-5 space-y-6 flex flex-col">
        <!-- Mission Quote Card -->
        <div
          v-reveal="{ direction: 'right', delay: 120 }"
          class="bg-white rounded-3xl p-7 sm:p-8 shadow-lg shadow-[#1b4d4f]/5 border border-[#eaf2f1] relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-4 gap-3">
            <div class="flex items-center gap-2.5 text-[#d49e35]">
              <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">
                favorite
              </span>
              <span
                class="font-headline text-xs uppercase text-[#1b4d4f] tracking-wider font-extrabold"
              >
                Nuestra Misión
              </span>
            </div>
            <span
              class="font-headline text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-[9999px] bg-[#d49e35]/15 text-[#d49e35] whitespace-nowrap"
            >
              Abierto para ti
            </span>
          </div>

          <p class="text-sm sm:text-base text-[#1c2424]/90 leading-relaxed font-normal">
            En la <strong class="text-[#1b4d4f] font-semibold">Comunidad Resucitados RCC</strong>,
            nos unimos para vivir y proclamar el poder del Resucitado, llevando esperanza, sanación y
            restauración a cada rincón encendidos por el fuego del Espíritu Santo.
          </p>

          <div class="mt-6 pt-5 border-t border-[#eaf2f1]">
            <blockquote class="font-garamond italic text-lg sm:text-xl text-[#d49e35] text-center">
              "Donde dos o tres están reunidos en mi nombre, allí estoy yo en medio de ellos."
            </blockquote>
            <p
              class="text-center font-headline text-xs font-extrabold uppercase tracking-widest text-[#1b4d4f] mt-2"
            >
              — Mateo 18:20
            </p>
          </div>
        </div>

        <!-- Location Map Card (Live Google Maps Embed + Direct Link) -->
        <div
          v-reveal="{ direction: 'right', delay: 200 }"
          class="bg-[#1b4d4f] rounded-3xl overflow-hidden shadow-xl shadow-[#1b4d4f]/20 text-white relative group border border-[#245A5C]/40"
        >
          <div class="relative w-full h-64 overflow-hidden bg-[#12383A]">
            <iframe
              title="Ubicación Casa Palotinos — Medellín"
              src="https://maps.google.com/maps?q=6.2601,-75.5622&hl=es&z=17&output=embed"
              width="100%"
              height="100%"
              style="border: 0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="w-full h-full block"
            ></iframe>
            <a
              href="https://maps.app.goo.gl/WgFzwABxffXPaoLs5"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir ubicación en Google Maps"
              class="absolute top-4 right-4 z-10 bg-white text-[#1b4d4f] w-11 h-11 rounded-[9999px] flex items-center justify-center shadow-lg smooth-transition group-hover:rotate-12 hover:scale-105"
            >
              <span class="material-symbols-outlined text-2xl">near_me</span>
            </a>
          </div>

          <div class="p-6 bg-[#12383A]">
            <div class="flex items-start justify-between gap-4">
              <div>
                <span
                  class="font-headline text-[11px] uppercase tracking-widest text-[#d49e35] font-extrabold block"
                >
                  Nuestra Sede Principal
                </span>
                <h4 class="font-headline text-lg font-bold text-white mt-0.5">
                  Casa Palotinos — Medellín
                </h4>
                <p class="text-[#eaf2f1]/80 text-sm mt-1.5 flex items-start gap-1.5">
                  <span class="material-symbols-outlined text-base text-[#d49e35] mt-0.5 shrink-0">
                    pin_drop
                  </span>
                  <span>Calle 60 #50-16, Medellín, Antioquia, Colombia</span>
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/WgFzwABxffXPaoLs5"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 rounded-[9999px] bg-white/10 hover:bg-white/20 text-white font-headline text-[11px] font-bold tracking-wide uppercase flex items-center gap-1 whitespace-nowrap smooth-transition shadow-sm shrink-0"
              >
                <span>Cómo llegar</span>
                <span class="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Weekly Schedule Card -->
        <div
          v-reveal="{ direction: 'right', delay: 280 }"
          class="bg-white rounded-3xl p-6 sm:p-7 shadow-md shadow-[#1b4d4f]/5 border border-[#eaf2f1] space-y-4"
        >
          <div class="flex items-center justify-between gap-2">
            <span
              class="font-headline text-xs uppercase tracking-wider text-[#1b4d4f] font-extrabold flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-lg text-[#d49e35]">calendar_month</span>
              Horarios Comunitarios
            </span>
            <span
              class="font-headline text-[11px] font-bold px-3 py-1 rounded-[9999px] bg-[#eaf2f1] text-[#007681] whitespace-nowrap"
            >
              Presencial &amp; Transmitido
            </span>
          </div>

          <div class="divide-y divide-[#eaf2f1]">
            <div
              v-for="item in scheduleItems"
              :key="item.title"
              class="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3"
            >
              <div>
                <p class="font-bold text-sm text-[#1c2424]">{{ item.title }}</p>
                <p class="text-xs text-[#404848]">{{ item.desc }}</p>
              </div>
              <span
                :class="[
                  'font-headline text-[11px] font-extrabold px-3 py-1 rounded-[9999px] shadow-sm whitespace-nowrap shrink-0',
                  item.highlight
                    ? 'text-[#d49e35] bg-[#d49e35]/10 border border-[#d49e35]/20'
                    : 'text-[#1b4d4f] bg-[#f6f9f8] border border-[#eaf2f1]'
                ]"
              >
                {{ item.time }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
