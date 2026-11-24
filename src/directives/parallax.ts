import type { Directive, DirectiveBinding } from 'vue'

export interface ParallaxOptions {
  /** Max travel in pixels. Positive moves opposite to scroll; negative moves with scroll. Default: 34 */
  range?: number
  /** Axis of translation: 'y' (default) or 'x' (horizontal scroll-linked drift). */
  axis?: 'y' | 'x'
  /** Optional scroll-linked rotation in degrees (great for floating stamp badges!). Default: 0 */
  rotate?: number
  /** Slight scale applied to prevent edge gaps inside overflow-hidden containers. Default: 1.12 */
  scale?: number
}

interface ParallaxEntry {
  el: HTMLElement
  range: number
  axis: 'y' | 'x'
  rotate: number
  scale: number
}

const activeEntries = new Set<ParallaxEntry>()
let isListening = false
let rafId: number | null = null

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const updateAll = () => {
  rafId = null
  if (prefersReducedMotion()) return

  const vh = window.innerHeight || 1
  const halfVh = vh / 2

  activeEntries.forEach((entry) => {
    const container = entry.el.parentElement || entry.el
    const rect = container.getBoundingClientRect()

    // Skip elements well outside the viewport for 60fps performance
    if (rect.bottom < -160 || rect.top > vh + 160) return

    // Progress from -1 (bottom of screen) through 0 (center) to +1 (top of screen)
    const centerY = rect.top + rect.height / 2
    const progress = Math.max(-1, Math.min(1, (halfVh - centerY) / (halfVh + rect.height / 2)))
    const offset = progress * entry.range

    const tx = entry.axis === 'x' ? offset : 0
    const ty = entry.axis === 'y' ? offset : 0
    const rot = entry.rotate ? ` rotate(${(progress * entry.rotate).toFixed(2)}deg)` : ''
    const scl = entry.scale !== 1 ? ` scale(${entry.scale})` : ''

    entry.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)${rot}${scl}`
  })
}

const scheduleUpdate = () => {
  if (rafId !== null) return
  rafId = window.requestAnimationFrame(updateAll)
}

const ensureListeners = () => {
  if (isListening || typeof window === 'undefined') return
  isListening = true
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate, { passive: true })
}

const cleanupListenersIfEmpty = () => {
  if (!isListening || activeEntries.size > 0 || typeof window === 'undefined') return
  isListening = false
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
}

const entryMap = new WeakMap<HTMLElement, ParallaxEntry>()

export const vParallax: Directive<HTMLElement, ParallaxOptions | undefined> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ParallaxOptions | undefined>) {
    if (prefersReducedMotion()) return

    const options = binding.value || {}
    const entry: ParallaxEntry = {
      el,
      range: options.range ?? 34,
      axis: options.axis ?? 'y',
      rotate: options.rotate ?? 0,
      scale: options.scale ?? 1.12
    }

    el.style.willChange = 'transform'
    activeEntries.add(entry)
    entryMap.set(el, entry)

    ensureListeners()
    scheduleUpdate()
  },

  unmounted(el: HTMLElement) {
    const entry = entryMap.get(el)
    if (entry) {
      activeEntries.delete(entry)
      entryMap.delete(el)
    }
    cleanupListenersIfEmpty()
  }
}
