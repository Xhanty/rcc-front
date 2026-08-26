<script setup lang="ts">
interface ServerMember {
  id: number
  name: string
  role: string
  imageUrl: string
}

const servers: ServerMember[] = [
  {
    id: 1,
    name: 'Pbro. David Solano',
    role: 'Director Espiritual',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiJS62CZJ9QSrxExsf1INT0jc-HfSlGwXebe4OF97Kv_zq__EcSRmRIAn_agMcnCMBMBRvevKWMXmfaivG51clYK8HeIfn5v5sexdb9Fln4ooxDXtKvzMnBpZvnAC9JHGptvD2c2_322j2h-oNTSBF1TfJQcpCWJvIaCf-YwiwDIwSXSTO2qjmYo3ho_nIWjlqaij1AO5Bzn2J3rU_SVHUJEyqCC_SOyjIYQzgFnQUkt1CSoJwPik2gwY84yJZtBYXmaFyERVa4VbN'
  },
  {
    id: 2,
    name: 'Elena Martínez',
    role: 'Coordinadora General',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9SdmRbEvNbk0VIhk5nBK1MBjDK9PUZ77dSjxjbUw-lGOMO9mCJaybFLBfwP_8lDaqaNhCcqmqcpVG_8xVnwhQOTg3DEjeu2BE0V_4CFpzo-RzrZeP5_MunOG8KZg4J7CBbLwXt9ZjOwXeW2ZMkMJlntfvK7H4C4CtBE-jPgLg_fSb5ZFMC6cEiA8-gsSM9d-pgXTtS9q3b6tXuqTJOFWpqnNkVLrgOAMfFUwkKw5f7fcm7DPA0M2_kjL1LHWEaCt9C1l09Ffg7IOB'
  },
  {
    id: 3,
    name: 'Mateo Rivera',
    role: 'Ministerio de Alabanza',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO3xT-9nx2yiccOX4-7-UTyF6sZjmBPyOglg7bc9_re0tvUqb8P6nlVisyafF1m-VhqhojWrbMqqBvfg7DGGNH3EerebW2-WO9ZpZwOkq97mCPFllS0woHTZ1Iv5VnNKTsM9QqGBrb36YAiqchu50VXqzABMmNHBvrbt-GU_Iu2xysBHPix2_ekoRnVllbgYPxDYaGVGVL5k72lBvDrQ3YsGi8I-cJMjRUK7PVr_BfVBQRA1PxiKOww5rbdYY60quE-40KG3_f_0ji'
  },
  {
    id: 4,
    name: 'Lucía Campos',
    role: 'Acción Social',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiJS62CZJ9QSrxExsf1INT0jc-HfSlGwXebe4OF97Kv_zq__EcSRmRIAn_agMcnCMBMBRvevKWMXmfaivG51clYK8HeIfn5v5sexdb9Fln4ooxDXtKvzMnBpZvnAC9JHGptvD2c2_322j2h-oNTSBF1TfJQcpCWJvIaCf-YwiwDIwSXSTO2qjmYo3ho_nIWjlqaij1AO5Bzn2J3rU_SVHUJEyqCC_SOyjIYQzgFnQUkt1CSoJwPik2gwY84yJZtBYXmaFyERVa4VbN'
  }
]
</script>

<template>
  <section class="py-12 md:py-20">
    <div class="max-w-max-width mx-auto px-6 md:px-margin-desktop">
      <div class="text-center mb-12">
        <h2 class="font-headline-lg text-headline-lg text-primary mb-4">Nuestro Equipo de Servidores</h2>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">Hombres y mujeres consagrados al
          servicio de la comunidad y la gloria de Dios.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="serv in servers" :key="serv.id" class="group text-center">
          <!-- Servidor Photo Container -->
          <div
            class="aspect-[4/5] rounded-xl overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-lg">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              :src="serv.imageUrl" :alt="serv.name" />
          </div>
          <!-- Member Info -->
          <h4 class="font-title-md text-title-md text-primary">{{ serv.name }}</h4>
          <p class="font-label-sm text-label-sm text-secondary">{{ serv.role }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
