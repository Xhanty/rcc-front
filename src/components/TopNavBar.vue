<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  currentPage: string
}>()

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="w-full top-0 sticky z-50 backdrop-blur-md border-b border-outline-variant shadow-sm h-20"
    style="background-color: rgba(248, 249, 255, 0.8)">
    <div class="max-w-max-width mx-auto px-6 md:px-margin-desktop flex justify-between items-center h-full">
      <!-- Logo and Brand -->
      <div @click="closeMobileMenu" class="flex items-center gap-2 cursor-pointer active:opacity-80">
        <img alt="Resucitados RCC Logo" class="h-10 min-[900px]:h-12 w-auto object-contain" src="/img/icon.png" />
        <a href="#" class="font-display-lg text-title-md text-primary">Resucitados RCC</a>
      </div>

      <!-- Desktop Navigation Links -->
      <nav class="hidden min-[900px]:flex items-center gap-8">
        <a href="#" :class="[
          'font-body-md text-body-md cursor-pointer transition-colors duration-200',
          currentPage === 'home'
            ? 'text-primary border-b-2 border-primary font-bold pb-1'
            : 'text-on-surface-variant hover:text-primary'
        ]">
          Inicio
        </a>
        <a href="#about" :class="[
          'font-body-md text-body-md cursor-pointer transition-colors duration-200',
          currentPage === 'about'
            ? 'text-primary border-b-2 border-primary font-bold pb-1'
            : 'text-on-surface-variant hover:text-primary'
        ]">
          Sobre Nosotros
        </a>
        <a href="#ministries" :class="[
          'font-body-md text-body-md cursor-pointer transition-colors duration-200',
          currentPage === 'ministries'
            ? 'text-primary border-b-2 border-primary font-bold pb-1'
            : 'text-on-surface-variant hover:text-primary'
        ]">
          Ministerios
        </a>
        <a href="#events" :class="[
          'font-body-md text-body-md cursor-pointer transition-colors duration-200',
          currentPage === 'events'
            ? 'text-primary border-b-2 border-primary font-bold pb-1'
            : 'text-on-surface-variant hover:text-primary'
        ]">
          Eventos
        </a>
        <a href="#contact" :class="[
          'font-body-md text-body-md cursor-pointer transition-colors duration-200',
          currentPage === 'contact'
            ? 'text-primary border-b-2 border-primary font-bold pb-1'
            : 'text-on-surface-variant hover:text-primary'
        ]">
          Contáctanos
        </a>
      </nav>

      <!-- Desktop Join Action -->
      <button
        class="hidden min-[900px]:block bg-primary text-on-primary px-8 py-2 rounded-full font-body-md text-body-md hover:bg-primary-container transition-all active:scale-95 duration-200 cursor-pointer">
        Únete
      </button>

      <!-- Mobile Hamburger Button -->
      <button @click="toggleMobileMenu"
        class="min-[900px]:hidden p-base text-primary cursor-pointer active:opacity-80 flex items-center justify-center"
        aria-label="Toggle Menu">
        <span class="material-symbols-outlined text-3xl">
          {{ isMobileMenuOpen ? 'close' : 'menu' }}
        </span>
      </button>
    </div>

    <transition name="slide-down">
      <div v-if="isMobileMenuOpen"
        class="min-[900px]:hidden absolute top-20 left-0 w-full backdrop-blur-md border-b border-outline-variant shadow-lg z-40 transition-all duration-300 ease-in-out"
        style="background-color: rgba(248, 249, 255, 0.95)">
        <div class="px-6 py-6 flex flex-col gap-gutter">
          <a @click="closeMobileMenu" href="#" :class="[
            'font-body-md text-body-md cursor-pointer',
            currentPage === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'
          ]">
            Inicio
          </a>
          <a @click="closeMobileMenu" href="#about" :class="[
            'font-body-md text-body-md cursor-pointer',
            currentPage === 'about' ? 'text-primary font-bold' : 'text-on-surface-variant'
          ]">
            Sobre Nosotros
          </a>
          <a @click="closeMobileMenu" href="#ministries" :class="[
            'font-body-md text-body-md cursor-pointer',
            currentPage === 'ministries' ? 'text-primary font-bold' : 'text-on-surface-variant'
          ]">
            Ministerios
          </a>
          <a @click="closeMobileMenu" href="#events" :class="[
            'font-body-md text-body-md cursor-pointer',
            currentPage === 'events' ? 'text-primary font-bold' : 'text-on-surface-variant'
          ]">
            Eventos
          </a>
          <a @click="closeMobileMenu" href="#contact" :class="[
            'font-body-md text-body-md cursor-pointer',
            currentPage === 'contact' ? 'text-primary font-bold' : 'text-on-surface-variant'
          ]">
            Contáctanos
          </a>

          <div class="h-[1px] bg-outline-variant/30 my-2"></div>

          <button @click="closeMobileMenu"
            class="w-full bg-primary text-on-primary py-3 rounded-full font-body-md text-body-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer">
            Únete
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 400px;
  opacity: 1;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
