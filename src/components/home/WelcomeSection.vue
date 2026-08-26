<script setup lang="ts">
// WelcomeSection Component Logic
</script>

<template>
  <section id="about" class="py-margin-desktop bg-surface-container-lowest">
    <div class="max-w-max-width mx-auto px-margin-desktop">
      <div class="grid md:grid-cols-2 gap-gutter items-center">
        <!-- Story Copy -->
        <div class="relative">
          <div class="absolute -top-4 -left-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>
          <h2 class="font-headline-lg text-headline-lg text-primary mb-base">Nuestra Esencia: <br/><span class="text-secondary">Un Nuevo Pentecostés</span></h2>
          <div class="space-y-base text-on-surface-variant font-body-md text-body-md">
            <p>En Resucitados RCC, creemos en la acción viva y constante del Espíritu Santo en la Iglesia hoy. Nuestro carisma es la "Efusión del Espíritu", un fuego que renueva los corazones y nos impulsa a la evangelización audaz.</p>
            <p>Somos una familia que se reúne para adorar, sanar y crecer en la fe, compartiendo la alegría del Evangelio con cada persona que toca nuestras puertas.</p>
          </div>
          <div class="mt-gutter border-l-4 border-secondary-container pl-gutter italic font-headline-lg text-on-surface text-title-md">
            "La fe no es una luz que ciega, sino una lámpara que guía nuestros pasos en la noche."
          </div>
        </div>

        <!-- Pillar Cards Grid -->
        <div class="grid grid-cols-2 gap-base">
          <div class="space-y-base pt-gutter">
            <div class="glass-card p-gutter rounded-xl shadow-sm text-center hover:scale-105 transition-transform duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-2" data-weight="fill">temple_hindu</span>
              <h3 class="font-title-md text-primary">Adoración</h3>
            </div>
            <div class="glass-card p-gutter rounded-xl shadow-sm text-center md:translate-x-4 hover:scale-105 transition-transform duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-2">groups</span>
              <h3 class="font-title-md text-primary">Comunidad</h3>
            </div>
          </div>
          <div class="space-y-base">
            <div class="glass-card p-gutter rounded-xl shadow-sm text-center hover:scale-105 transition-transform duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-2">auto_awesome</span>
              <h3 class="font-title-md text-primary">Carismas</h3>
            </div>
            <div class="glass-card p-gutter rounded-xl shadow-sm text-center md:-translate-x-4 hover:scale-105 transition-transform duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-2">volunteer_activism</span>
              <h3 class="font-title-md text-primary">Misión</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
