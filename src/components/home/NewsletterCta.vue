<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const isSubscribed = ref(false)

const handleSubscribe = () => {
  if (!email.value) return
  // Simulate network request
  setTimeout(() => {
    isSubscribed.value = true
    email.value = ''
  }, 600)
}
</script>

<template>
  <section class="py-margin-desktop mb-margin-desktop">
    <div class="max-w-max-width mx-auto px-margin-desktop">
      <div class="bg-primary rounded-xl p-gutter md:p-gutter relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-gutter shadow-xl">
        <div class="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div class="relative z-10 text-white max-w-lg">
          <h2 class="font-headline-lg text-headline-lg mb-2">Mantente Conectado</h2>
          <p class="font-body-md text-surface-variant">Recibe reflexiones semanales, avisos de comunidad y noticias de nuestros próximos eventos directamente en tu correo.</p>
        </div>

        <transition name="fade" mode="out-in">
          <form v-if="!isSubscribed" @submit.prevent="handleSubscribe" class="relative z-10 flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input 
              v-model="email" 
              required
              class="bg-white/10 border-b border-white/30 text-white placeholder:text-white/50 px-gutter py-3 focus:border-secondary outline-none min-w-0 w-full sm:min-w-[300px] transition-all" 
              placeholder="Tu correo electrónico" 
              type="email"
            />
            <button type="submit" class="bg-secondary-fixed text-on-secondary-fixed px-gutter py-3 rounded-lg font-body-md hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Suscribirme
            </button>
          </form>
          <div v-else class="relative z-10 text-white bg-secondary/20 border border-secondary px-gutter py-3 rounded-lg font-body-md text-center max-w-sm">
            ¡Gracias por suscribirte! Te contactaremos pronto.
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
