<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Import Global Layout & UI components
import TopNavBar from './components/TopNavBar.vue'
import FooterSection from './components/FooterSection.vue'
import PrayerFab from './components/PrayerFab.vue'

// Import Home Page specific components
import HeroSection from './components/home/HeroSection.vue'
import WelcomeSection from './components/home/WelcomeSection.vue'
import EventsSection from './components/home/EventsSection.vue'
import MinistriesSection from './components/home/MinistriesSection.vue'

// Import About Page specific components
import AboutHeroSection from './components/about/AboutHeroSection.vue'
import BentoHistorySection from './components/about/BentoHistorySection.vue'
import EspiritualidadSection from './components/about/EspiritualidadSection.vue'
import ServidoresSection from './components/about/ServidoresSection.vue'

// Import Ministries Page specific components
import MinistriesHeroSection from './components/ministries/MinistriesHeroSection.vue'
import MinistriesListSection from './components/ministries/MinistriesListSection.vue'
import ViviendoEspirituSection from './components/ministries/ViviendoEspirituSection.vue'

// Import Events Page specific components
import EventsHeroSection from './components/events/EventsHeroSection.vue'
import EventsGridSection from './components/events/EventsGridSection.vue'
import EventDetailSection from './components/events/EventDetailSection.vue'

// Import Contact Page specific components
import ContactHeroSection from './components/contact/ContactHeroSection.vue'
import ContactFormSection from './components/contact/ContactFormSection.vue'
import ContactBentoSection from './components/contact/ContactBentoSection.vue'

const currentHash = ref(window.location.hash)
const selectedYear = ref<number | null>(null)
const selectedMonth = ref<number | null>(null)

const handleHashChange = () => {
  currentHash.value = window.location.hash
  selectedYear.value = null
  selectedMonth.value = null
  // Scroll to top when page changes
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})

// Determine active page view
const currentPage = computed(() => {
  if (currentHash.value.startsWith('#about')) return 'about'
  if (currentHash.value.startsWith('#ministries')) return 'ministries'
  if (currentHash.value.startsWith('#events/')) return 'event-detail'
  if (currentHash.value.startsWith('#events')) return 'events'
  if (currentHash.value.startsWith('#contact')) return 'contact'
  return 'home'
})

const currentSlug = computed(() => {
  if (currentPage.value === 'event-detail') {
    return currentHash.value.substring(8) // '#events/' is 8 characters long
  }
  return ''
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-background font-body-md ethereal-bg flex flex-col">
    <!-- Navigation Bar -->
    <TopNavBar :currentPage="currentPage" />

    <main class="flex-grow">
      <transition name="fade" mode="out-in">
        <!-- Home View -->
        <div v-if="currentPage === 'home'" key="home">
          <!-- Hero Section -->
          <HeroSection />

          <!-- Welcome Section -->
          <WelcomeSection />

          <!-- Events -->
          <EventsSection />

          <!-- Ministerios / Ministries -->
          <MinistriesSection />
        </div>

        <!-- About Us View -->
        <div v-else-if="currentPage === 'about'" key="about">
          <!-- About Hero Section -->
          <AboutHeroSection />

          <!-- Bento Grid History -->
          <BentoHistorySection />

          <!-- Espiritualidad Section -->
          <EspiritualidadSection />

          <!-- Servidores Section -->
          <ServidoresSection />
        </div>

        <!-- Ministries View -->
        <div v-else-if="currentPage === 'ministries'" key="ministries">
          <!-- Ministries Hero Section -->
          <MinistriesHeroSection />

          <!-- Grid of Ministries -->
          <MinistriesListSection />

          <!-- Viviendo en el Espíritu Section -->
          <ViviendoEspirituSection />
        </div>

        <!-- Events View -->
        <div v-else-if="currentPage === 'events'" key="events">
          <!-- Events Hero Section -->
          <EventsHeroSection 
            v-model:selectedYear="selectedYear" 
            v-model:selectedMonth="selectedMonth" 
          />

          <!-- Events Grid Section -->
          <EventsGridSection 
            :selectedYear="selectedYear" 
            :selectedMonth="selectedMonth" 
          />
        </div>

        <!-- Event Detail View -->
        <div v-else-if="currentPage === 'event-detail'" key="event-detail">
          <EventDetailSection :slug="currentSlug" />
        </div>

        <!-- Contact View -->
        <div v-else-if="currentPage === 'contact'" key="contact">
          <div class="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pt-8 pb-20">
            <!-- Contact Hero Section -->
            <ContactHeroSection />

            <!-- Contact Form/Details Section -->
            <ContactFormSection />

            <!-- Bento Contacts Section -->
            <ContactBentoSection />
          </div>
        </div>
      </transition>
    </main>

    <!-- Footer -->
    <FooterSection />

    <!-- Prayer FAB -->
    <PrayerFab />
  </div>
</template>

<style>
/* Smooth page transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
