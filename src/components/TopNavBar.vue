<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  currentPage: string
}>()

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

const navItems = [
  { id: 'home', label: 'Inicio', href: '#' },
  { id: 'about', label: 'Nosotros', href: '#about' },
  { id: 'community', label: 'Vida Comunitaria', href: '#community' },
  { id: 'ministries', label: 'Ministerios', href: '#ministries' },
  { id: 'events', label: 'Eventos', href: '#events' },
  { id: 'contact', label: 'Contacto', href: '#contact' }
]

const isItemActive = (itemId: string, currentPage: string) => {
  if (itemId === 'events' && currentPage === 'event-detail') return true
  return currentPage === itemId
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full z-50 px-4 sm:px-8 transition-all duration-500 ease-out',
      isScrolled ? 'pt-2.5 pb-1' : 'pt-4 pb-2'
    ]"
  >
    <nav
      :class="[
        'max-w-7xl mx-auto backdrop-blur-xl rounded-[9999px] px-5 sm:px-7 border border-white/15 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] text-white transition-all duration-500 ease-out',
        isScrolled
          ? 'bg-[#1b4d4f]/95 py-2.5 shadow-2xl shadow-[#1b4d4f]/35'
          : 'bg-[#1b4d4f]/95 py-3.5 shadow-xl shadow-[#1b4d4f]/25'
      ]"
    >
      <!-- Logo & Brand -->
      <a
        href="#"
        @click="closeMobileMenu"
        class="flex items-center gap-3 group cursor-pointer active:opacity-80 shrink-0 justify-self-start"
      >
        <div
          class="h-10 w-10 rounded-[9999px] bg-white flex items-center justify-center p-1.5 shadow-sm ring-4 ring-white/10 group-hover:scale-105 smooth-transition shrink-0"
        >
          <img
            alt="Resucitados RCC Logo"
            class="h-full w-full object-contain"
            src="/img/icon.png"
          />
        </div>
        <span
          class="font-headline font-extrabold text-base sm:text-lg tracking-tight text-white uppercase whitespace-nowrap"
        >
          Resucitados RCC
        </span>
      </a>

      <!-- Desktop Floating Oval Nav Pills -->
      <div
        class="hidden md:flex items-center space-x-1 bg-white/10 px-2.5 py-1.5 rounded-[9999px] border border-white/15 font-headline text-xs uppercase tracking-wider font-bold justify-self-center"
      >
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          :class="[
            'px-4 py-1.5 rounded-[9999px] smooth-transition cursor-pointer whitespace-nowrap',
            isItemActive(item.id, currentPage)
              ? 'bg-white text-[#1b4d4f] font-extrabold shadow-sm'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          ]"
        >
          {{ item.label }}
        </a>
      </div>

      <!-- Right Spacer (Desktop) & Mobile Menu Toggle -->
      <div class="flex items-center justify-end justify-self-end">
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-white p-2 hover:bg-white/10 rounded-[9999px] smooth-transition flex items-center justify-center cursor-pointer"
          aria-label="Abrir menú de navegación"
        >
          <span class="material-symbols-outlined text-2xl">
            {{ isMobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </nav>

    <!-- Mobile Dropdown Glass Menu -->
    <transition name="nav-dropdown">
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden max-w-7xl mx-auto mt-2.5 bg-[#1b4d4f]/95 backdrop-blur-xl rounded-3xl border border-white/15 shadow-2xl shadow-[#1b4d4f]/40 overflow-hidden text-white"
      >
        <div class="p-4 flex flex-col gap-1.5 font-headline">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            @click="closeMobileMenu"
            :class="[
              'px-5 py-3 rounded-[9999px] text-xs uppercase tracking-wider font-bold smooth-transition flex items-center justify-between',
              isItemActive(item.id, currentPage)
                ? 'bg-white text-[#1b4d4f] shadow-sm'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            ]"
          >
            <span>{{ item.label }}</span>
            <span
              v-if="isItemActive(item.id, currentPage)"
              class="w-2 h-2 rounded-[9999px] bg-[#007681]"
            ></span>
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.nav-dropdown-enter-active,
.nav-dropdown-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top center;
}

.nav-dropdown-enter-from,
.nav-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
