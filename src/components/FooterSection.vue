<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer id="footer" class="w-full pt-10 bg-surface-container dark:bg-inverse-surface">
    <div
      class="max-w-max-width mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-start gap-gutter mb-gutter">
      <!-- Brand column -->
      <div class="md:col-span-1 max-w-xs">
        <div class="flex items-center gap-2 mb-gutter">
          <img alt="Resucitados RCC Logo" class="h-10 w-auto" src="/img/icon.png" />
          <span class="font-headline-lg text-headline-lg text-primary dark:text-inverse-primary">Resucitados RCC</span>
        </div>
        <p class="text-on-surface-variant dark:text-surface-variant font-body-md text-body-md mb-gutter">Llevando la luz
          de la fe a cada rincón, encendidos por el poder transformador del Espíritu Santo.</p>
      </div>

      <!-- Contact column -->
      <div>
        <h4
          class="font-body-md font-bold text-on-surface dark:text-inverse-on-surface mb-gutter uppercase tracking-wider">
          Información de Contacto</h4>
        <ul class="space-y-2 text-on-surface-variant dark:text-surface-variant">
          <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary">location_on</span>
            Medellín</li>
          <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary">mail</span>
            contacto@resucitadosrcc.com</li>
          <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary">call</span> +57
            (304) 133-8305</li>
        </ul>
      </div>
    </div>

    <!-- Copyright Subbar -->
    <div
      class="bg-surface-container-high dark:bg-surface-container-highest w-full py-4 border-t border-outline-variant/10">
      <div
        class="max-w-max-width mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-base">
        <p class="text-on-surface-variant dark:text-surface-variant font-body-md text-body-md">© {{ currentYear }}
          Resucitados RCC. Todos los derechos reservados.</p>
        <div class="flex gap-gutter">
          <a class="text-on-surface-variant dark:text-surface-variant hover:text-primary transition-colors font-body-md"
            href="#contact">Contáctanos</a>
        </div>
      </div>
    </div>
  </footer>
</template>
