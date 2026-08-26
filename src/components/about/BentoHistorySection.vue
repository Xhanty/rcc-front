<script setup lang="ts">
// BentoHistorySection Component Logic
</script>

<template>
  <section class="py-12 md:py-20 bg-surface-container-lowest">
    <div class="max-w-max-width mx-auto px-6 md:px-margin-desktop">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Historia Card -->
        <div class="md:col-span-2 glass-card rounded-xl p-6 md:p-8 flex flex-col justify-center">
          <div class="flex items-center gap-4 mb-4 text-secondary">
            <span class="material-symbols-outlined text-3xl">history_edu</span>
            <h3 class="font-headline-lg text-headline-lg">Nuestra Historia</h3>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6 md:mb-8">
            Resucitados RCC nació de un pequeño grupo de oración en el invierno de 1998, donde un puñado de fieles buscaba una experiencia más profunda del Pentecostés personal. Lo que comenzó en una sala de estar se transformó en una comunidad vibrante que hoy acoge a cientos de familias, unidas por la alegría de la fe y el servicio desinteresado.
          </p>
          <div class="h-48 w-full rounded-lg overflow-hidden mt-auto shadow-inner">
            <img 
              class="w-full h-full object-cover" 
              alt="communal prayer gathering" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSWtJ067TYY5vVrkJL1vbOMyhm_J9P7Re69cjqA0AG-Eg1FDwxK7HEZFNqbty7t-UWEwYIkVxzpl8VUC4HxvwkOZLJT9BEUnqzVDpMn2dXOseYawnUw473zwckkN5WsTy3KAum_qkT1azCi7ONIulsCs_1W7A7OHqfApvpjI1RdcFPvHbRENKUT3JTufJiLi0xgN0KY3nw0MKOIZ2WfwjmrkPgwqtauL3Owh4n2REZXZh-BhkhBZEwLGG6xxSk4vSTXdg1qvc1uRy5"
            />
          </div>
        </div>

        <!-- Carisma Card -->
        <div class="rounded-xl p-6 md:p-8 bg-primary text-on-primary hover:bg-primary-container transition-all duration-300 shadow-[0_20px_40px_rgba(141,75,0,0.05)] hover:shadow-[0_25px_50px_rgba(141,75,0,0.1)] hover:-translate-y-1">
          <div class="flex items-center gap-4 mb-4 text-secondary-fixed">
            <span class="material-symbols-outlined text-3xl">local_fire_department</span>
            <h3 class="font-headline-lg text-headline-lg">Nuestro Carisma</h3>
          </div>
          <p class="font-body-md text-body-md text-primary-fixed-dim italic mb-6 md:mb-8">
            "Ser antorchas vivas del amor de Dios en medio del mundo."
          </p>
          <p class="font-body-md text-body-md mb-6 md:mb-8">
            Nuestro carisma se centra en la alabanza jubilosa, el estudio profundo de las escrituras y la acogida fraterna. Buscamos que cada miembro descubra sus dones para ponerlos al servicio de la Iglesia.
          </p>
          <ul class="space-y-4">
            <li class="flex items-center gap-3 font-label-sm text-label-sm">
              <span class="material-symbols-outlined text-secondary-fixed">check_circle</span> Alabanza Profética
            </li>
            <li class="flex items-center gap-3 font-label-sm text-label-sm">
              <span class="material-symbols-outlined text-secondary-fixed">check_circle</span> Evangelización Creativa
            </li>
          </ul>
        </div>

        <!-- Misión Card -->
        <div class="glass-card rounded-xl p-6 md:p-8">
          <div class="text-secondary mb-4">
            <span class="material-symbols-outlined text-4xl">explore</span>
          </div>
          <h3 class="font-headline-lg text-headline-lg text-primary mb-2">Misión</h3>
          <p class="font-body-md text-body-md text-on-surface-variant">
            Evangelizar a través del anuncio del Kerigma, propiciando un encuentro personal con Jesucristo vivo.
          </p>
        </div>

        <!-- Visión Card -->
        <div class="glass-card rounded-xl p-6 md:p-8">
          <div class="text-secondary mb-4">
            <span class="material-symbols-outlined text-4xl">visibility</span>
          </div>
          <h3 class="font-headline-lg text-headline-lg text-primary mb-2">Visión</h3>
          <p class="font-body-md text-body-md text-on-surface-variant">
            Ser una comunidad de referencia en la formación de líderes cristianos comprometidos con la justicia social.
          </p>
        </div>

        <!-- Valores Card -->
        <div class="glass-card rounded-xl p-6 md:p-8">
          <div class="text-secondary mb-4">
            <span class="material-symbols-outlined text-4xl">favorite</span>
          </div>
          <h3 class="font-headline-lg text-headline-lg text-primary mb-2">Valores</h3>
          <p class="font-body-md text-body-md text-on-surface-variant">
            Integridad, Unidad, Humildad y una Alegría constante que brota de la esperanza en el Resucitado.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
