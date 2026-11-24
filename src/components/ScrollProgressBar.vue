<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
let rafId: number | null = null

const updateProgress = () => {
  rafId = null
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight
  progress.value = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0
}

const onScroll = () => {
  if (rafId !== null) return
  rafId = window.requestAnimationFrame(updateProgress)
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <div
    aria-hidden="true"
    class="fixed top-0 left-0 w-full h-[3px] z-[60] pointer-events-none bg-transparent"
  >
    <div
      class="h-full bg-gradient-to-r from-[#007681] via-[#d49e35] to-[#f5c451] shadow-[0_0_10px_rgba(212,158,53,0.65)] transition-[width] duration-75 ease-out"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>
