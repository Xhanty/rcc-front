<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer id="footer" class="w-full pt-10 bg-surface-container dark:bg-inverse-surface">
    <div
      class="max-w-max-width mx-auto px-margin-desktop flex flex-col lg:flex-row justify-between items-start gap-gutter mb-gutter">
      <!-- Brand column -->
      <div class="lg:max-w-xs flex-shrink-0">
        <div class="flex items-center gap-2 mb-gutter">
          <img alt="Resucitados RCC Logo" class="h-10 w-auto" src="/img/icon.png" />
          <span class="font-headline-lg text-headline-lg text-primary dark:text-inverse-primary">Resucitados RCC</span>
        </div>
        <p class="text-on-surface-variant dark:text-surface-variant font-body-md text-body-md mb-gutter">Llevando la luz
          de la fe a cada rincón, encendidos por el poder transformador del Espíritu Santo.</p>
      </div>

      <!-- Info Columns (2 Columns on desktop) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter md:gap-16 w-full lg:w-auto">

        <!-- Socials Column -->
        <div>
          <h4
            class="font-body-md font-bold text-on-surface dark:text-inverse-on-surface mb-gutter uppercase tracking-wider">
            Síguenos</h4>
          <ul class="space-y-3 text-on-surface-variant dark:text-surface-variant">
            <li class="flex items-center gap-2 font-body-md text-body-md">
              <a href="https://www.instagram.com/resucitadosrcc" target="_blank"
                class="flex items-center gap-2 hover:text-primary transition-colors group">
                <svg class="w-5 h-5 fill-current text-secondary group-hover:text-primary transition-colors"
                  viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>Instagram</span>
              </a>
            </li>
            <li class="flex items-center gap-2 font-body-md text-body-md">
              <a href="https://www.facebook.com/share/1CYRbLsNjd" target="_blank"
                class="flex items-center gap-2 hover:text-primary transition-colors group">
                <svg class="w-5 h-5 fill-current text-secondary group-hover:text-primary transition-colors"
                  viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.625L17 8h-4V6.25c0-.97.5-1.25 1.25-1.25H17V1h-3c-3 0-5 1.5-5 4.5V8z" />
                </svg>
                <span>Facebook</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div>
          <h4
            class="font-body-md font-bold text-on-surface dark:text-inverse-on-surface mb-gutter uppercase tracking-wider">
            Información de Contacto</h4>
          <ul class="space-y-3 text-on-surface-variant dark:text-surface-variant">
            <li class="flex items-start gap-2 font-body-md text-body-md">
              <span class="material-symbols-outlined text-secondary flex-shrink-0 mt-0.5">location_on</span>
              <span>Calle 60 #50-16<br />(Casa Palotinos) - Medellín</span>
            </li>
            <li class="flex items-center gap-2 font-body-md text-body-md">
              <span class="material-symbols-outlined text-secondary flex-shrink-0">mail</span>
              <a href="mailto:resucitadoscomunidad@gmail.com"
                class="hover:text-primary hover:underline transition-colors">
                resucitadoscomunidad@gmail.com
              </a>
            </li>
            <li class="flex items-center gap-2 font-body-md text-body-md">
              <span class="material-symbols-outlined text-secondary flex-shrink-0">call</span>
              <a href="tel:+573103748739" class="hover:text-primary hover:underline transition-colors">
                +57 310 3748739
              </a>
            </li>
          </ul>
        </div>
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
