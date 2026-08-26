<script setup lang="ts">
// ContactBentoSection Component Logic
</script>

<template>
  <section class="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Phone Bento -->
    <div class="glass-card p-6 rounded-xl flex items-center gap-4 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer shadow-sm">
      <div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
        <span class="material-symbols-outlined">call</span>
      </div>
      <div>
        <p class="text-label-sm text-on-surface-variant">Teléfono</p>
        <p class="font-bold text-primary">+34 912 345 678</p>
      </div>
    </div>

    <!-- Email Bento -->
    <div class="glass-card p-6 rounded-xl flex items-center gap-4 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer shadow-sm">
      <div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0">
        <span class="material-symbols-outlined">mail</span>
      </div>
      <div>
        <p class="text-label-sm text-on-surface-variant">Email</p>
        <p class="font-bold text-primary">info@resucitadosrcc.com</p>
      </div>
    </div>

    <!-- Socials Bento -->
    <div class="glass-card p-6 rounded-xl flex items-center gap-4 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer shadow-sm">
      <div class="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container flex-shrink-0">
        <span class="material-symbols-outlined">share</span>
      </div>
      <div class="flex-grow">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-label-sm text-on-surface-variant">Redes Sociales</p>
            <p class="font-bold text-primary">@ResucitadosRCC</p>
          </div>
          <div class="flex gap-2 text-primary">
            <span class="material-symbols-outlined">face_nod</span>
            <span class="material-symbols-outlined">group</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
