<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const requestText = ref('')
const requesterName = ref('')
const requesterEmail = ref('')
const requesterPhone = ref('')
const acceptedTerms = ref(false)
const isSubmitted = ref(false)
const isLoading = ref(false)
const petitionError = ref('')

const requiresTerms = computed(() =>
  Boolean(requesterEmail.value.trim() || requesterPhone.value.trim())
)

watch(requiresTerms, (needed) => {
  if (!needed) {
    acceptedTerms.value = false
  }
})

const openTermsModal = () => {
  window.dispatchEvent(new CustomEvent('open-terms-modal'))
}

const openModal = () => {
  isOpen.value = true
}

const toggleModal = () => {
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    isSubmitted.value = false
    requestText.value = ''
    requesterName.value = ''
    requesterEmail.value = ''
    requesterPhone.value = ''
    acceptedTerms.value = false
    petitionError.value = ''
  }
}

onMounted(() => {
  window.addEventListener('open-prayer-modal', openModal)
})

onUnmounted(() => {
  window.removeEventListener('open-prayer-modal', openModal)
})

const handleSubmit = async () => {
  if (!requesterName.value || !requestText.value) {
    petitionError.value = 'Tu nombre y la intención de oración son obligatorios.'
    return
  }

  if (requiresTerms.value && !acceptedTerms.value) {
    petitionError.value =
      'Debes aceptar los Términos, Condiciones y Política de Datos al incluir correo o teléfono.'
    return
  }

  isLoading.value = true
  petitionError.value = ''

  try {
    const url = `${import.meta.env.VITE_API_URL}petitions`
    const key = import.meta.env.VITE_API_KEY

    if (!url || !key) {
      throw new Error('API config is missing')
    }

    const payload = {
      name: requesterName.value,
      petition: requestText.value,
      email: requesterEmail.value || null,
      phone: requesterPhone.value ? String(requesterPhone.value) : null,
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
      throw new Error(resJson.message || 'Error al enviar la petición de oración.')
    }

    isSubmitted.value = true
    isLoading.value = false
  } catch (error: any) {
    console.error('Error submitting prayer petition:', error)
    petitionError.value = error.message || 'Error al conectar con el servidor. Inténtalo de nuevo.'
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[70] font-jakarta">
    <!-- Floating Action Button (FAB) -->
    <button
      type="button"
      @click="toggleModal"
      class="relative w-14 h-14 bg-[#d49e35] hover:bg-[#b88628] text-white rounded-[9999px] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 smooth-transition cursor-pointer group ring-4 ring-[#d49e35]/30"
      title="Petición de Oración"
      aria-label="Abrir formulario de petición de oración"
    >
      <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">
        volunteer_activism
      </span>
      <span
        class="hidden sm:block absolute right-full mr-3.5 bg-[#1b4d4f] text-white border border-white/15 px-4 py-2 rounded-[9999px] font-headline text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 smooth-transition shadow-xl pointer-events-none"
      >
        Pide Oración
      </span>
    </button>

    <!-- Interactive Prayer Modal -->
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        @click.self="toggleModal"
        class="fixed inset-0 bg-[#002021]/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#1b4d4f]/15 flex flex-col"
        >
          <!-- Modal Header -->
          <div class="bg-[#1b4d4f] px-6 py-5 text-white flex justify-between items-center gap-3 relative overflow-hidden">
            <div
              class="absolute -right-8 -top-8 w-28 h-28 bg-[#d49e35]/20 rounded-[9999px] blur-2xl pointer-events-none"
            ></div>

            <div class="flex items-center gap-3 relative z-10">
              <div
                class="w-10 h-10 rounded-2xl bg-[#d49e35]/20 border border-[#d49e35]/40 text-[#d49e35] flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">
                  volunteer_activism
                </span>
              </div>
              <div>
                <span class="font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#d49e35] block leading-none">
                  Intercesión Comunitaria
                </span>
                <h3 class="font-headline text-lg font-extrabold tracking-tight leading-tight mt-0.5">
                  Petición de Oración
                </h3>
              </div>
            </div>

            <button
              type="button"
              @click="toggleModal"
              class="relative z-10 w-9 h-9 rounded-[9999px] bg-white/10 hover:bg-white/20 text-white flex items-center justify-center smooth-transition cursor-pointer shrink-0"
              aria-label="Cerrar"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 sm:p-7">
            <transition name="fade" mode="out-in">
              <!-- Form View -->
              <form v-if="!isSubmitted" key="form" @submit.prevent="handleSubmit" class="space-y-4">
                <p class="text-[#404848] text-sm leading-relaxed">
                  Comparte tu intención. Nuestra comunidad se compromete a interceder por ti ante el
                  Señor.
                </p>

                <div class="space-y-1">
                  <label
                    for="pName"
                    class="block font-headline font-bold text-[11px] text-[#1b4d4f] uppercase tracking-wider"
                  >
                    Tu Nombre <span class="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    id="pName"
                    v-model="requesterName"
                    type="text"
                    required
                    placeholder="Escribe tu nombre"
                    class="w-full bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] placeholder:text-[#707979] text-sm py-2.5 px-3.5 rounded-t-xl smooth-transition focus:outline-none"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div class="space-y-1">
                    <label
                      for="pEmail"
                      class="block font-headline font-bold text-[11px] text-[#1b4d4f] uppercase tracking-wider"
                    >
                      Email (Opcional)
                    </label>
                    <input
                      id="pEmail"
                      v-model="requesterEmail"
                      type="email"
                      placeholder="maria@ejemplo.com"
                      class="w-full bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] placeholder:text-[#707979] text-sm py-2.5 px-3.5 rounded-t-xl smooth-transition focus:outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <label
                      for="pPhone"
                      class="block font-headline font-bold text-[11px] text-[#1b4d4f] uppercase tracking-wider"
                    >
                      Teléfono (Opcional)
                    </label>
                    <input
                      id="pPhone"
                      v-model="requesterPhone"
                      type="tel"
                      placeholder="Ej. 3103748739"
                      class="w-full bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] placeholder:text-[#707979] text-sm py-2.5 px-3.5 rounded-t-xl smooth-transition focus:outline-none"
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label
                    for="pText"
                    class="block font-headline font-bold text-[11px] text-[#1b4d4f] uppercase tracking-wider"
                  >
                    Intención de Oración <span class="text-[#ba1a1a]">*</span>
                  </label>
                  <textarea
                    id="pText"
                    v-model="requestText"
                    required
                    rows="4"
                    placeholder="¿Por qué o por quién deseas que oremos?"
                    class="w-full bg-[#f6f9f8] focus:bg-white border-0 border-b-2 border-[#1b4d4f]/25 focus:border-[#1b4d4f] text-[#1c2424] placeholder:text-[#707979] text-sm py-2.5 px-3.5 rounded-t-xl smooth-transition focus:outline-none resize-none"
                  ></textarea>
                </div>

                <!-- Conditional Terms & Data Protection Consent -->
                <div>
                  <label
                    v-if="requiresTerms"
                    class="flex items-start gap-2.5 p-3 rounded-2xl bg-[#f6f9f8] border border-[#1b4d4f]/20 cursor-pointer select-none smooth-transition hover:border-[#1b4d4f]/40"
                  >
                    <input
                      v-model="acceptedTerms"
                      type="checkbox"
                      class="mt-0.5 w-4 h-4 rounded border-[#1b4d4f]/40 text-[#1b4d4f] focus:ring-[#1b4d4f] cursor-pointer shrink-0 accent-[#1b4d4f]"
                    />
                    <span class="text-[11px] sm:text-xs text-[#323a3a] leading-relaxed">
                      Autorizo el tratamiento de mis datos y acepto los
                      <button
                        type="button"
                        @click.stop.prevent="openTermsModal"
                        class="text-[#007681] hover:text-[#1b4d4f] font-bold underline underline-offset-2 cursor-pointer"
                      >
                        Términos y Política de Datos
                      </button>
                      (Ley 1581 de 2012). <span class="text-[#ba1a1a]">*</span>
                    </span>
                  </label>

                  <p v-else class="text-[11px] text-[#707979] leading-relaxed px-1">
                    Envío sin datos de contacto. Si agregas correo o teléfono, deberás aceptar los
                    <button
                      type="button"
                      @click="openTermsModal"
                      class="text-[#007681] hover:text-[#1b4d4f] font-bold underline underline-offset-2 cursor-pointer"
                    >
                      Términos y Política de Datos
                    </button>.
                  </p>
                </div>

                <!-- Error Alert Box -->
                <transition name="fade">
                  <div
                    v-if="petitionError"
                    class="p-3 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 text-[#ba1a1a] rounded-2xl text-xs font-semibold flex items-center gap-2 leading-tight"
                  >
                    <span class="material-symbols-outlined text-base shrink-0">error</span>
                    <span>{{ petitionError }}</span>
                  </div>
                </transition>

                <button
                  type="submit"
                  :disabled="isLoading || (requiresTerms && !acceptedTerms)"
                  class="w-full bg-[#d49e35] hover:bg-[#b88628] text-white py-3.5 px-6 rounded-[9999px] font-headline text-xs uppercase tracking-widest font-extrabold shadow-lg hover:shadow-[#d49e35]/30 smooth-transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span v-if="!isLoading">Enviar Petición</span>
                  <span
                    v-else
                    class="w-5 h-5 border-2 border-white/30 border-t-white rounded-[9999px] animate-spin"
                  ></span>
                  <span v-if="!isLoading" class="material-symbols-outlined text-base">send</span>
                </button>
              </form>

              <!-- Success View -->
              <div v-else key="success" class="text-center py-4 space-y-4">
                <div
                  class="w-16 h-16 rounded-[9999px] bg-[#eaf2f1] text-[#1b4d4f] flex items-center justify-center mx-auto shadow-sm"
                >
                  <span class="material-symbols-outlined text-4xl text-[#d49e35]">auto_awesome</span>
                </div>
                <h4 class="font-headline text-xl font-extrabold text-[#1b4d4f]">
                  Intención Recibida
                </h4>
                <p class="text-[#404848] text-sm leading-relaxed">
                  Pondremos tu intención en manos del Señor en nuestra próxima cadena de intercesión.
                </p>
                <div
                  class="p-4 rounded-2xl bg-[#eaf2f1]/70 border border-[#1b4d4f]/10 italic text-[#1b4d4f] font-garamond text-base"
                >
                  "El Señor está cerca de todos los que lo invocan." — Salmo 145:18
                </div>
                <button
                  type="button"
                  @click="toggleModal"
                  class="w-full bg-[#1b4d4f] hover:bg-[#007681] text-white py-3 rounded-[9999px] font-headline text-xs uppercase tracking-widest font-extrabold smooth-transition active:scale-95 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
