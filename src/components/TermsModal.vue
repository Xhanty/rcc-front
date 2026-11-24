<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const currentYear = new Date().getFullYear()

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('open-terms-modal', openModal)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('open-terms-modal', openModal)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <transition name="terms-fade">
    <div
      v-if="isOpen"
      @click.self="closeModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      class="fixed inset-0 z-[95] bg-[#002021]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-jakarta"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[88vh] overflow-hidden border border-[#1b4d4f]/15 flex flex-col"
      >
        <!-- Modal Header -->
        <div
          class="bg-[#1b4d4f] px-6 sm:px-8 py-5 text-white flex items-center justify-between gap-4 relative overflow-hidden shrink-0"
        >
          <div
            class="absolute -right-8 -top-8 w-32 h-32 bg-[#d49e35]/20 rounded-[9999px] blur-2xl pointer-events-none"
          ></div>

          <div class="flex items-center gap-3 relative z-10 min-w-0">
            <div
              class="w-10 h-10 rounded-2xl bg-[#d49e35]/20 border border-[#d49e35]/40 text-[#d49e35] flex items-center justify-center shrink-0"
            >
              <span class="material-symbols-outlined text-xl">gavel</span>
            </div>
            <div class="min-w-0">
              <span
                class="font-headline text-[10px] font-extrabold uppercase tracking-widest text-[#d49e35] block leading-none"
              >
                Resucitados RCC • Ley 1581 de 2012
              </span>
              <h2
                id="terms-modal-title"
                class="font-headline text-base sm:text-xl font-extrabold tracking-tight leading-tight mt-0.5 truncate"
              >
                Términos, Condiciones y Política de Datos
              </h2>
            </div>
          </div>

          <button
            type="button"
            @click="closeModal"
            aria-label="Cerrar términos y condiciones"
            class="relative z-10 w-9 h-9 rounded-[9999px] bg-white/10 hover:bg-white/20 text-white flex items-center justify-center smooth-transition cursor-pointer shrink-0"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Scrollable Legal Content -->
        <div class="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#323a3a] leading-relaxed">
          <div class="p-4 rounded-2xl bg-[#eaf2f1]/75 border border-[#1b4d4f]/15 text-xs sm:text-sm text-[#1b4d4f]">
            <strong>Resumen práctico:</strong> Si nos envías un mensaje o petición de oración
            <strong>sin correo ni teléfono</strong>, no recolectamos datos de contacto. Si decides
            incluir tu correo electrónico o teléfono, los usaremos únicamente para responderte y
            acompañarte pastoralmente, bajo estricta confidencialidad y conforme a la ley colombiana
            de protección de datos (Ley 1581 de 2012).
          </div>

          <section class="space-y-2">
            <h3 class="font-headline text-sm sm:text-base font-extrabold text-[#1b4d4f] uppercase tracking-wide">
              1. Responsable del Tratamiento
            </h3>
            <p>
              La <strong>Comunidad Católica Carismática Resucitados RCC</strong>, con sede en
              <strong>Calle 60 #50-16 (Casa Palotinos), Medellín, Antioquia, Colombia</strong>,
              correo electrónico
              <a
                href="mailto:resucitadoscomunidad@gmail.com"
                class="text-[#007681] font-semibold hover:underline"
              >
                resucitadoscomunidad@gmail.com
              </a>
              y teléfono <strong>+57 310 3748739</strong>, es la responsable del uso y protección de
              los datos personales que voluntariamente nos suministres a través de este sitio web.
            </p>
          </section>

          <section class="space-y-2">
            <h3 class="font-headline text-sm sm:text-base font-extrabold text-[#1b4d4f] uppercase tracking-wide">
              2. Marco Legal Aplicable
            </h3>
            <p>
              Esta política y estos términos se rigen por la legislación vigente de la República de
              Colombia, en especial el <strong>Artículo 15 de la Constitución Política</strong>
              (derecho a la intimidad, buen nombre y <em>Habeas Data</em>), la
              <strong>Ley Estatutaria 1581 de 2012</strong>, el
              <strong>Decreto 1377 de 2013</strong>, el
              <strong>Decreto Único Reglamentario 1074 de 2015</strong> y la
              <strong>Ley 133 de 1994</strong> sobre libertad religiosa y de cultos.
            </p>
          </section>

          <section class="space-y-2">
            <h3 class="font-headline text-sm sm:text-base font-extrabold text-[#1b4d4f] uppercase tracking-wide">
              3. Datos Sensibles y Carácter Facultativo
            </h3>
            <p>
              De conformidad con el artículo 5 de la Ley 1581 de 2012, la información relacionada con
              convicciones religiosas, peticiones de oración o situaciones personales de fe constituye
              <strong>dato sensible</strong>. Ninguna persona está obligada a suministrar datos
              sensibles ni datos de contacto: puedes compartir tus intenciones sin proporcionar correo
              electrónico ni teléfono. Al ingresar voluntariamente tus datos de contacto y marcar la
              casilla de aceptación, otorgas tu autorización previa, expresa e informada para su
              tratamiento conforme a estas finalidades.
            </p>
          </section>

          <section class="space-y-2">
            <h3 class="font-headline text-sm sm:text-base font-extrabold text-[#1b4d4f] uppercase tracking-wide">
              4. Finalidades del Tratamiento de Datos
            </h3>
            <ul class="list-disc pl-5 space-y-1.5">
              <li>
                Atender y responder mensajes, consultas de información general, vinculación a
                ministerios, participación en eventos o solicitudes de asesoría con el sacerdote
                asesor.
              </li>
              <li>
                Recibir, custodiar y presentar peticiones de oración ante nuestro equipo de
                intercesión comunitaria con estricta confidencialidad.
              </li>
              <li>
                Contactarte únicamente por los canales que hayas suministrado (correo electrónico o
                teléfono/WhatsApp) para dar seguimiento a tu solicitud.
              </li>
              <li>
                <strong>Cero comercialización:</strong> Resucitados RCC nunca vende, alquila ni cede
                tus datos personales a terceros con fines comerciales o publicitarios.
              </li>
            </ul>
          </section>

          <section class="space-y-2">
            <h3 class="font-headline text-sm sm:text-base font-extrabold text-[#1b4d4f] uppercase tracking-wide">
              5. Confidencialidad y Alcance del Acompañamiento Pastoral
            </h3>
            <p>
              Las intenciones de oración y mensajes enviados son tratados con reserva por los
              servidores designados del equipo de acogida e intercesión. El acompañamiento espiritual
              y los contenidos de este sitio tienen finalidad exclusivamente pastoral y evangelizadora;
              <strong>
                no sustituyen atención médica, psicológica, psiquiátrica ni asesoría jurídica
                profesional
              </strong>.
            </p>
          </section>

          <section class="space-y-2">
            <h3 class="font-headline text-sm sm:text-base font-extrabold text-[#1b4d4f] uppercase tracking-wide">
              6. Derechos de los Titulares (Derechos ARCO)
            </h3>
            <p>
              Como titular de tus datos personales, conforme al artículo 8 de la Ley 1581 de 2012,
              tienes derecho en cualquier momento a:
            </p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Conocer, actualizar y rectificar tus datos personales.</li>
              <li>Solicitar prueba de la autorización otorgada.</li>
              <li>Ser informado respecto del uso que se le ha dado a tus datos.</li>
              <li>
                Revocar la autorización y/o solicitar la supresión definitiva de tus datos escribiendo
                a
                <a
                  href="mailto:resucitadoscomunidad@gmail.com"
                  class="text-[#007681] font-semibold hover:underline"
                >
                  resucitadoscomunidad@gmail.com
                </a>.
              </li>
              <li>
                Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por presuntas
                infracciones a la normativa de protección de datos.
              </li>
            </ul>
          </section>

          <section class="space-y-2">
            <h3 class="font-headline text-sm sm:text-base font-extrabold text-[#1b4d4f] uppercase tracking-wide">
              7. Menores de Edad
            </h3>
            <p>
              Resucitados RCC respeta el interés superior de los niños, niñas y adolescentes. Si eres
              menor de 18 años, el suministro de datos personales de contacto deberá contar con la
              autorización de tus padres o representante legal.
            </p>
          </section>

          <section class="space-y-2">
            <h3 class="font-headline text-sm sm:text-base font-extrabold text-[#1b4d4f] uppercase tracking-wide">
              8. Uso del Sitio, Encuestas y Enlaces a Terceros
            </h3>
            <p>
              El usuario se compromete a hacer un uso respetuoso y de buena fe de los formularios,
              encuestas comunitarias y contenidos del portal. Este sitio integra enlaces y
              reproductores oficiales de plataformas externas (como Spotify, YouTube, Instagram,
              Facebook y Google Maps), cuyas políticas de privacidad y cookies son administradas de
              forma independiente por dichos proveedores.
            </p>
          </section>

          <p class="text-xs text-[#707979] pt-2 border-t border-[#eaf2f1]">
            Última actualización: {{ currentYear }} • Comunidad Católica Carismática Resucitados RCC,
            Medellín, Colombia.
          </p>
        </div>

        <!-- Modal Footer -->
        <div
          class="px-6 sm:px-8 py-4 bg-[#f6f9f8] border-t border-[#eaf2f1] flex items-center justify-end gap-3 shrink-0"
        >
          <button
            type="button"
            @click="closeModal"
            class="px-7 py-2.5 rounded-[9999px] bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-xs uppercase tracking-widest font-extrabold smooth-transition active:scale-95 cursor-pointer shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.terms-fade-enter-active,
.terms-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.terms-fade-enter-from,
.terms-fade-leave-to {
  opacity: 0;
}
</style>
