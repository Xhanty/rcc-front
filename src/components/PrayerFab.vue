<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const requestText = ref('')
const requesterName = ref('')
const requesterEmail = ref('')
const requesterPhone = ref('')
const isSubmitted = ref(false)
const isLoading = ref(false)
const petitionError = ref('')

const toggleModal = () => {
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    isSubmitted.value = false
    requestText.value = ''
    requesterName.value = ''
    requesterEmail.value = ''
    requesterPhone.value = ''
    petitionError.value = ''
  }
}

const handleSubmit = async () => {
  if (!requesterName.value || !requestText.value) {
    petitionError.value = 'Todos los campos son obligatorios.'
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
      phone: requesterPhone.value ? String(requesterPhone.value) : null
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
  <div class="fixed bottom-gutter right-gutter z-40">
    <!-- Floating Action Button (FAB) -->
    <button 
      @click="toggleModal"
      class="bg-secondary text-on-secondary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center glow-hover transition-transform active:scale-90 cursor-pointer"
      title="Petición de Oración"
    >
      <span class="material-symbols-outlined text-3xl" data-weight="fill">volunteer_activism</span>
    </button>

    <!-- Interactive Prayer Modal -->
    <transition name="fade-in">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-outline-variant/30 flex flex-col">
          <!-- Modal Header -->
          <div class="bg-primary p-gutter text-white flex justify-between items-center">
            <h3 class="font-headline-lg text-title-md flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl">volunteer_activism</span> Petición de Oración
            </h3>
            <button @click="toggleModal" class="text-white hover:text-secondary-fixed transition-colors cursor-pointer text-xl font-bold">
              ✕
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-gutter">
            <transition name="fade" mode="out-in">
              <!-- Form View -->
              <form v-if="!isSubmitted" @submit.prevent="handleSubmit" class="space-y-base">
                <p class="text-on-surface-variant font-body-md text-body-md">
                  Comparte tu intención. Nuestra comunidad se compromete a interceder por ti ante el Señor.
                </p>
                 <div class="flex flex-col gap-1">
                  <label for="pName" class="font-body-md font-bold text-xs text-primary uppercase">Tu Nombre</label>
                  <input 
                    id="pName"
                    v-model="requesterName" 
                    type="text" 
                    required
                    placeholder="Escribe tu nombre" 
                    class="border-b border-outline-variant/50 p-2 outline-none focus:border-secondary transition-all w-full text-on-surface"
                  />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="flex flex-col gap-1">
                    <label for="pEmail" class="font-body-md font-bold text-xs text-primary uppercase">Email (Opcional)</label>
                    <input 
                      id="pEmail"
                      v-model="requesterEmail" 
                      type="email" 
                      placeholder="maria@ejemplo.com" 
                      class="border-b border-outline-variant/50 p-2 outline-none focus:border-secondary transition-all w-full text-on-surface text-sm"
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="pPhone" class="font-body-md font-bold text-xs text-primary uppercase">Teléfono (Opcional)</label>
                    <input 
                      id="pPhone"
                      v-model="requesterPhone" 
                      type="number" 
                      placeholder="Ej. 3103748739" 
                      class="border-b border-outline-variant/50 p-2 outline-none focus:border-secondary transition-all w-full text-on-surface text-sm"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label for="pText" class="font-body-md font-bold text-xs text-primary uppercase">Intención de Oración</label>
                  <textarea 
                    id="pText"
                    v-model="requestText"
                    required 
                    rows="4" 
                    placeholder="¿Por qué o por quién deseas que oremos?" 
                    class="border border-outline-variant/50 rounded-lg p-2 outline-none focus:border-secondary transition-all w-full text-on-surface resize-none"
                  ></textarea>
                </div>
                <!-- Error Alert Box -->
                <transition name="fade">
                  <div v-if="petitionError" class="p-3 bg-error/10 border border-error/20 text-error rounded-lg text-xs font-semibold flex items-center gap-1.5 leading-tight">
                    <span class="material-symbols-outlined text-base">error</span>
                    <span>{{ petitionError }}</span>
                  </div>
                </transition>

                <button type="submit" :disabled="isLoading" class="w-full bg-primary text-on-primary py-3 rounded-lg font-body-md text-body-md glow-hover transition-all cursor-pointer active:opacity-80 flex items-center justify-center gap-2">
                  <span v-if="!isLoading">Enviar Petición</span>
                  <span v-else class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                </button>
              </form>

              <!-- Success View -->
              <div v-else class="text-center py-base space-y-base">
                <span class="material-symbols-outlined text-secondary text-5xl animate-pulse">auto_awesome</span>
                <h4 class="font-headline-lg text-title-md text-primary">Intención Recibida</h4>
                <p class="text-on-surface-variant font-body-md text-body-md">
                  Pondremos tu intención en manos del Señor en nuestra próxima cadena de intercesión.
                </p>
                <div class="italic text-secondary font-headline-lg text-body-lg">
                  "El Señor está cerca de todos los que lo invocan." - Salmo 145:18
                </div>
                <button @click="toggleModal" class="w-full border border-primary/20 text-primary py-2 rounded-lg font-body-md hover:bg-primary hover:text-white transition-all cursor-pointer">
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
.fade-in-enter-active, .fade-in-leave-active {
  transition: opacity 0.3s ease;
}
.fade-in-enter-from, .fade-in-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
