<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Import Global Layout & UI components
import TopNavBar from './components/TopNavBar.vue'
import FooterSection from './components/FooterSection.vue'
import PrayerFab from './components/PrayerFab.vue'
import TermsModal from './components/TermsModal.vue'
import ScrollProgressBar from './components/ScrollProgressBar.vue'

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

// Import Community & Announcements Page specific components
import CommunityHeroSection from './components/community/CommunityHeroSection.vue'
import CommunityPollsSection from './components/community/CommunityPollsSection.vue'
import CommunityGospelSection from './components/community/CommunityGospelSection.vue'
import CommunityBirthdaysSection from './components/community/CommunityBirthdaysSection.vue'
import CommunityMediaSection from './components/community/CommunityMediaSection.vue'
import CommunityReflectionsSection from './components/community/CommunityReflectionsSection.vue'

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
  if (currentHash.value.startsWith('#community')) return 'community'
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
    <!-- Global Scroll Progress Bar -->
    <ScrollProgressBar />

    <!-- Navigation Bar -->
    <TopNavBar :currentPage="currentPage" />

    <main class="flex-grow">
      <transition name="page-slide" mode="out-in">
        <!-- Home View (Layered Sheet-Over-Sheet Scroll Flow) -->
        <div v-if="currentPage === 'home'" key="home" class="overflow-x-clip">
          <!-- Hero Section (Sticky underlay sheet) -->
          <div class="sheet-underlay z-10">
            <HeroSection />
          </div>

          <!-- Welcome Section (Slides over Hero like a sheet) -->
          <div class="sheet-layer z-20 bg-[#1B4D4F] overflow-hidden">
            <WelcomeSection />
          </div>

          <!-- Events Section (Slides over Welcome like a sheet) -->
          <div class="sheet-layer z-30 bg-[#EAF2F1] overflow-hidden">
            <EventsSection />
          </div>

          <!-- Ministerios Section (Slides over Events like a sheet) -->
          <div class="sheet-layer z-40 bg-white overflow-hidden">
            <MinistriesSection />
          </div>
        </div>

        <!-- About Us View (Layered Sheet-Over-Sheet Scroll Flow) -->
        <div v-else-if="currentPage === 'about'" key="about" class="bg-[#fcf9f8] overflow-x-clip">
          <!-- About Hero Section (normal flow so tall 4-photo strip scrolls fully into view) -->
          <div class="relative z-10">
            <AboutHeroSection />
          </div>

          <!-- Espiritualidad Section -->
          <div class="sheet-layer z-20 bg-[#1b4d4f] overflow-hidden">
            <EspiritualidadSection />
          </div>

          <!-- Bento Grid History -->
          <div class="sheet-layer z-30 bg-[#fcf9f8] overflow-hidden">
            <BentoHistorySection />
          </div>

          <!-- Servidores Section -->
          <div class="relative z-40 bg-[#fcf9f8]">
            <ServidoresSection />
          </div>
        </div>

        <!-- Community & Announcements View (Layered Sheet Flow) -->
        <div v-else-if="currentPage === 'community'" key="community" class="bg-[#fcf9f8] overflow-x-clip">
          <!-- Hero & Quick Navigation -->
          <div class="sheet-underlay z-10">
            <CommunityHeroSection />
          </div>

          <!-- Encuestas & Evangelio Sheet -->
          <div class="sheet-layer z-20 bg-[#fcf9f8] pt-8">
            <CommunityPollsSection />
            <CommunityGospelSection />
          </div>

          <!-- Cumpleaños de la Semana Sheet -->
          <div class="sheet-layer z-30 bg-[#eaf2f1] overflow-hidden">
            <CommunityBirthdaysSection />
          </div>

          <!-- Música & Medios Digitales Sheet -->
          <div class="sheet-layer z-40 bg-[#1b4d4f] overflow-hidden">
            <CommunityMediaSection />
          </div>

          <!-- Reflexiones Pastorales & Buzón de Intercesión Sheet -->
          <div class="sheet-layer z-[45] bg-[#fcf9f8] overflow-hidden">
            <CommunityReflectionsSection />
          </div>
        </div>

        <!-- Ministries View (Layered Sheet Flow) -->
        <div v-else-if="currentPage === 'ministries'" key="ministries" class="bg-[#fcf9f8] overflow-x-clip">
          <!-- Ministries Hero Section -->
          <div class="sheet-underlay z-10 bg-[#1b4d4f]">
            <MinistriesHeroSection />
          </div>

          <!-- Grid of Ministries Sheet -->
          <div class="sheet-layer z-20 bg-[#fcf9f8] pt-8">
            <MinistriesListSection />
          </div>

          <!-- Viviendo en el Espíritu Sheet -->
          <div class="sheet-layer z-30 bg-[#fcf9f8] pt-8">
            <ViviendoEspirituSection />
          </div>
        </div>

        <!-- Events View (Layered Sheet Flow) -->
        <div v-else-if="currentPage === 'events'" key="events" class="bg-[#F6F9F8] overflow-x-clip">
          <!-- Events Hero Section -->
          <div class="relative z-10">
            <EventsHeroSection 
              v-model:selectedYear="selectedYear" 
              v-model:selectedMonth="selectedMonth" 
            />
          </div>

          <!-- Events Grid Section -->
          <div class="relative z-20">
            <EventsGridSection 
              :selectedYear="selectedYear" 
              :selectedMonth="selectedMonth" 
            />
          </div>
        </div>

        <!-- Event Detail View -->
        <div v-else-if="currentPage === 'event-detail'" key="event-detail" class="overflow-x-clip">
          <EventDetailSection :slug="currentSlug" />
        </div>

        <!-- Contact View (Layered Sheet Flow) -->
        <div v-else-if="currentPage === 'contact'" key="contact" class="bg-[#F6F9F8] overflow-x-clip">
          <!-- Contact Hero Section -->
          <div class="sheet-underlay z-10">
            <ContactHeroSection />
          </div>

          <!-- Contact Form/Details Sheet -->
          <div class="sheet-layer z-20 bg-[#F6F9F8] pt-10">
            <ContactFormSection />
          </div>

          <!-- Bento Contacts Sheet -->
          <div class="sheet-layer z-30 bg-[#1b4d4f] overflow-hidden">
            <ContactBentoSection />
          </div>
        </div>
      </transition>
    </main>

    <!-- Footer -->
    <FooterSection />

    <!-- Prayer FAB -->
    <PrayerFab />

    <!-- Global Terms & Privacy Policy Modal -->
    <TermsModal />
  </div>
</template>

<style>
/* MasVida-inspired smooth page transition animations */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateY(18px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
