import type { Directive, DirectiveBinding } from 'vue'

export interface TiltOptions {
  /** Maximum tilt angle in degrees. Default: 5 */
  max?: number
  /** Slight lift on hover in px. Default: 4 */
  lift?: number
}

interface TiltHandlers {
  onMove: (e: MouseEvent) => void
  onLeave: () => void
}

const handlerMap = new WeakMap<HTMLElement, TiltHandlers>()

export const vTilt: Directive<HTMLElement, TiltOptions | undefined> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<TiltOptions | undefined>) {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches
    ) {
      return
    }

    const max = binding.value?.max ?? 5
    const lift = binding.value?.lift ?? 4

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      const rotateY = (x * max * 2).toFixed(2)
      const rotateX = (-y * max * 2).toFixed(2)

      el.style.transition = 'transform 120ms ease-out'
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-${lift}px)`
    }

    const onLeave = () => {
      el.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    handlerMap.set(el, { onMove, onLeave })
  },

  unmounted(el: HTMLElement) {
    const handlers = handlerMap.get(el)
    if (handlers) {
      el.removeEventListener('mousemove', handlers.onMove)
      el.removeEventListener('mouseleave', handlers.onLeave)
      handlerMap.delete(el)
    }
  }
}
