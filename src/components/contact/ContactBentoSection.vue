<script setup lang="ts">
// ContactBentoSection Component Logic
</script>

<template>
  <section class="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Phone Bento -->
    <a href="tel:+573103748739"
      class="glass-card p-6 rounded-xl flex items-center gap-4 hover:translate-y-[-4px] hover:border-[#10b981]/30 transition-all duration-300 cursor-pointer shadow-sm border border-outline-variant/30">
      <div class="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
        style="background-color: #10b981">
        <span class="material-symbols-outlined text-xl">call</span>
      </div>
      <div>
        <p class="text-label-sm text-on-surface-variant">Teléfono</p>
        <p class="font-bold text-primary">+57 310 3748739</p>
      </div>
    </a>

    <!-- Instagram Bento -->
    <a href="https://www.instagram.com/resucitadosrcc" target="_blank"
      class="glass-card p-6 rounded-xl flex items-center gap-4 hover:translate-y-[-4px] hover:border-[#ee2a7b]/30 transition-all duration-300 cursor-pointer shadow-sm border border-outline-variant/30">
      <div class="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
        style="background: linear-gradient(45deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)">
        <!-- SVG Instagram -->
        <svg class="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
          <path
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      </div>
      <div>
        <p class="text-label-sm text-on-surface-variant">Instagram</p>
        <p class="font-bold text-primary">@resucitadosrcc</p>
      </div>
    </a>

    <!-- Facebook Bento -->
    <a href="https://www.facebook.com/share/1CYRbLsNjd" target="_blank"
      class="glass-card p-6 rounded-xl flex items-center gap-4 hover:translate-y-[-4px] hover:border-[#1877F2]/30 transition-all duration-300 cursor-pointer shadow-sm border border-outline-variant/30">
      <div class="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
        style="background-color: #1877F2">
        <!-- SVG Facebook -->
        <svg class="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
          <path d="M9 8H7v3h2v9h4v-9h3.625L17 8h-4V6.25c0-.97.5-1.25 1.25-1.25H17V1h-3c-3 0-5 1.5-5 4.5V8z" />
        </svg>
      </div>
      <div>
        <p class="text-label-sm text-on-surface-variant">Facebook</p>
        <p class="font-bold text-primary">Resucitados RCC</p>
      </div>
    </a>
  </section>
</template>
