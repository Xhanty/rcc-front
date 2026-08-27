<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const subject = ref('Información General')
const message = ref('')
const isSubmitted = ref(false)
const isLoading = ref(false)
const formError = ref('')

const handleFormSubmit = async () => {
  if (!name.value || !email.value || !subject.value || !message.value) {
    formError.value = 'Todos los campos son obligatorios.'
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
      email: email.value,
      subject: subject.value,
      message: message.value
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
  subject.value = 'Información General'
  message.value = ''
  formError.value = ''
  isSubmitted.value = false
}
</script>

<template>
  <section class="pb-12 z-10 relative">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <!-- Contact Form Box (Col span 7) -->
      <div class="lg:col-span-7 glass-card rounded-xl p-6 md:p-8 space-y-6 md:space-y-8 flex flex-col justify-between">
        <transition name="fade" mode="out-in">
          <!-- Form View -->
          <div v-if="!isSubmitted" class="space-y-6 md:space-y-8">
            <div class="space-y-1">
              <h2 class="font-headline-lg text-headline-lg text-primary">Envíanos un Mensaje</h2>
              <p class="font-body-md text-body-md text-on-surface-variant">Tu mensaje llegará directamente a nuestro
                equipo de acogida.</p>
            </div>

            <form @submit.prevent="handleFormSubmit" class="space-y-6 md:space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div class="flex flex-col gap-1">
                  <label class="font-title-md text-title-md text-primary" for="name">Nombre Completo</label>
                  <input id="name" v-model="name" required class="input-minimal font-body-md py-2 text-on-surface"
                    placeholder="Ej. María García" type="text" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="font-title-md text-title-md text-primary" for="email">Correo Electrónico</label>
                  <input id="email" v-model="email" required class="input-minimal font-body-md py-2 text-on-surface"
                    placeholder="maria@ejemplo.com" type="email" />
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-title-md text-title-md text-primary" for="subject">Asunto</label>
                <select id="subject" v-model="subject"
                  class="input-minimal font-body-md py-2 appearance-none bg-transparent text-on-surface cursor-pointer">
                  <option value="Información General" class="bg-surface text-on-surface">Información General</option>
                  <option value="Petición de Oración" class="bg-surface text-on-surface">Petición de Oración</option>
                  <option value="Pregunta sobre Ministerios" class="bg-surface text-on-surface">Pregunta sobre Ministerios</option>
                  <option value="Eventos y Retiros" class="bg-surface text-on-surface">Eventos y Retiros</option>
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-title-md text-title-md text-primary" for="message">Tu Mensaje</label>
                <textarea id="message" v-model="message" required rows="4"
                  class="input-minimal font-body-md py-2 resize-none text-on-surface"
                  placeholder="¿Cómo podemos ayudarte hoy?"></textarea>
              </div>

              <!-- Error message alert box -->
              <transition name="fade">
                <div v-if="formError" class="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-2 font-body-md">
                  <span class="material-symbols-outlined text-xl">error</span>
                  <span>{{ formError }}</span>
                </div>
              </transition>

              <button type="submit"
                class="w-full md:w-auto px-10 py-4 bg-primary text-on-primary rounded-full font-bold shadow-amber-glow transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                :disabled="isLoading">
                <span v-if="!isLoading">Enviar Mensaje</span>
                <span v-else class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                <span v-if="!isLoading" class="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>

          <!-- Success View -->
          <div v-else class="text-center py-10 space-y-6 flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-secondary text-6xl animate-bounce">check_circle</span>
            <h2 class="font-headline-lg text-headline-lg text-primary">¡Mensaje Enviado!</h2>
            <p class="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              Gracias por contactarnos, <strong>{{ name }}</strong>. Tu mensaje ha sido recibido con éxito. Nuestro
              equipo te responderá a la brevedad.
            </p>
            <div class="italic text-secondary font-headline-lg text-body-lg">
              ¡Que el Señor te bendiga grandemente!
            </div>
            <button @click="resetForm"
              class="border border-secondary text-secondary px-8 py-2 rounded-full font-body-md hover:bg-secondary/5 transition-all cursor-pointer">
              Enviar otro mensaje
            </button>
          </div>
        </transition>
      </div>

      <!-- Schedule & Details Section (Col span 5) -->
      <div class="lg:col-span-5 space-y-6 flex flex-col justify-between">
        <!-- Schedule Card -->
        <div class="glass-card rounded-xl p-6 md:p-8 border-l-4 border-secondary-container flex-grow">
          <div class="flex items-center gap-2 mb-6 text-primary">
            <span class="material-symbols-outlined">schedule</span>
            <h3 class="font-title-md text-title-md">Horarios de Gracia</h3>
          </div>
          <div class="space-y-6">
            <div class="flex justify-between items-start border-b border-outline-variant pb-4">
              <div>
                <p class="font-bold text-primary">Asamblea Carismática</p>
                <p class="text-label-sm text-on-surface-variant mt-0.5">Alabanza, oración y enseñanza</p>
              </div>
              <span
                class="text-label-sm bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-lg flex-shrink-0">Jueves
                19:30</span>
            </div>
            <div class="flex justify-between items-start border-b border-outline-variant pb-4">
              <div>
                <p class="font-bold text-primary">Misa de la Comunidad</p>
                <p class="text-label-sm text-on-surface-variant mt-0.5">Solemne Eucaristía</p>
              </div>
              <span
                class="text-label-sm bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-lg flex-shrink-0">Domingo
                11:00</span>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <p class="font-bold text-primary">Cenáculo de Jóvenes</p>
                <p class="text-label-sm text-on-surface-variant mt-0.5">Grupo de oración juvenil</p>
              </div>
              <span
                class="text-label-sm bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-lg flex-shrink-0">Sábado
                17:00</span>
            </div>
          </div>
        </div>

        <!-- Map Card -->
        <div class="relative group h-64 overflow-hidden rounded-xl shadow-sm border border-outline-variant">
          <img alt="Ubicación Resucitados RCC"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1XHWSKYiKYj2udZMsX-sKRhhMgjWHzlsMt0FAX-hMx90t_qGg9jLqP035SHRcTx5wW_qhFEW_x-ZJopHsBYHxCYB3EelBRyv7t7c3eEQH1xLOHX3F_TnHYJ07p9fNNI4zcH-5d0JiT35WTImrIFeYKLFIlI21p5L7r22LeYg46AuJ71Fm2NW1jN58Ux-89czQvI_0MRkTwm15zMewTuvRDsYLGOgwMqxfEYl7k6TxxN-X2qTUShf3pjqZvl3hYNSNZJYXlFyxU_Al" />
          <div
            class="absolute inset-0 bg-primary/10 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a class="bg-surface px-6 py-2 rounded-full text-primary font-bold shadow-lg flex items-center gap-2"
              href="https://maps.google.com" target="_blank">
              <span class="material-symbols-outlined">map</span>
              Abrir en Google Maps
            </a>
          </div>
          <div
            class="absolute bottom-4 left-4 backdrop-blur-md p-3 rounded border border-primary/10 max-w-[85%]"
            style="background-color: rgba(248, 249, 255, 0.9)">
            <p class="text-label-sm font-bold text-primary">Nuestra Sede</p>
            <p class="text-label-sm text-on-surface-variant mt-0.5">Calle de la Luz 123, Ciudad de Fe, CP 28001</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
