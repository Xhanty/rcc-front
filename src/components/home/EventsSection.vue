<script setup lang="ts">
interface RCCEvent {
  id: number
  title: string
  dateDay: string
  dateMonth: string
  time: string
  location: string
  imageUrl: string
  alt: string
}

const events: RCCEvent[] = [
  {
    id: 1,
    title: 'Noche de Adoración y Fuego',
    dateDay: '15',
    dateMonth: 'Dic',
    time: '19:30 hrs',
    location: 'Capilla Principal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWoz6MJspU3PdDoJctBRR3QaSpu4m8SXrnhb8zB_N6F3CwDlfXJVVdnZAGIBr5xv1UCSrLL8FAdIKChLTZYqiv_QfoQgtVJXzMpRVOZSz6ae2LPjQLhv-zS9BxiXu7hnQ4BsmIrK9cQpllyJc2ByKdaIVG5qIUE5mGlE_W_fg6wvy7lfZ2MUmRCu0YDvewQ5vYvVCKbJUDLbn-dRHkWY1bdB7APFB7OFk6u7_YO2T9life41-V_BD2ePL-BG3A-ylFGCcoKG323f-',
    alt: 'Vigilia de Oración'
  },
  {
    id: 2,
    title: 'Retiro "Levántate y Brilla"',
    dateDay: '05',
    dateMonth: 'Ene',
    time: '09:00 hrs',
    location: 'Centro de Retiros',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYIHMeilTFwZE7b_BTHptrz9qprlZBy9mTnDJr4qhxfM8sMKPyL3ogFXL0-4FXhvBnhA9eq1oOe0p3tVfsc1gH3vM-J-Fn7rfH9xjcJ1g12CAr2PKzfaxdKZHpPU3yVsYc8R94IQgX-K41XM306CAiPXtZAvSpOKOR4O30aMJIF4k1wmZOwW-nI_Vf-cuWp0E26MSyW2-7LEApjLsaie91YnHqHB6bR-JwAKA5a3p2QJH_lkoTYBnCb54BA_312ZOXSPhRcSvMvHiG',
    alt: 'Retiro Juvenil'
  },
  {
    id: 3,
    title: 'Encuentro de Familias',
    dateDay: '12',
    dateMonth: 'Ene',
    time: '17:00 hrs',
    location: 'Salón Parroquial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_1JyyboN-DNU4akulcDXkb-HbfxM9ioev1B6diLYVc8zRROl_lcI0Nt1Udzi7Fb_OUVFyFYOU1xLdJ1kJM7JYL41rlu_3RGFHFUTjw8I_vuD3V6kQYxXov0eF4s7CLctUNdNNI1U9qyl34VNxaw77V5WbpYdzIvvC4c0cOkm_hELFUOdruqAFCJVUFDQk0-WZowYEHE1HZgXcz_mP6LzM59MzQmDga_08NK3LLgS8TdN-ZAemo4TFJHOH2oP-XmejkJ2L-C6VuUS3',
    alt: 'Cena Fraterna'
  }
]
</script>

<template>
  <section id="events" class="py-margin-desktop bg-surface-container-low">
    <div class="max-w-max-width mx-auto px-margin-desktop">
      <div class="flex flex-col md:flex-row justify-between items-end mb-gutter gap-base">
        <div>
          <span class="text-secondary font-label-sm tracking-widest uppercase">Calendario</span>
          <h2 class="font-headline-lg text-headline-lg text-primary">Próximos Encuentros</h2>
        </div>
        <a class="text-primary font-body-md flex items-center gap-1 hover:text-secondary transition-colors" href="#">
          Ver todo el calendario <span class="material-symbols-outlined">chevron_right</span>
        </a>
      </div>

      <div class="grid md:grid-cols-3 gap-gutter">
        <div 
          v-for="event in events" 
          :key="event.id" 
          class="group bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(141,75,0,0.03)] border border-outline-variant/30 hover:border-secondary/30 transition-all duration-500"
        >
          <!-- Card Image & Date Badge -->
          <div class="h-48 overflow-hidden relative">
            <img 
              :alt="event.alt" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              :src="event.imageUrl"
            />
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-center min-w-[60px]">
              <p class="text-xs font-bold text-secondary uppercase">{{ event.dateMonth }}</p>
              <p class="text-xl font-bold text-primary">{{ event.dateDay }}</p>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-gutter">
            <h3 class="font-headline-lg text-title-md text-primary mb-2">{{ event.title }}</h3>
            <div class="flex items-center gap-2 text-on-surface-variant font-label-sm mb-gutter">
              <span class="material-symbols-outlined text-base">schedule</span> {{ event.time }}
              <span class="material-symbols-outlined text-base">location_on</span> {{ event.location }}
            </div>
            <button class="w-full border border-primary/20 text-primary py-2 rounded-lg font-body-md hover:bg-primary hover:text-white transition-all active:opacity-80">
              Me interesa
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
