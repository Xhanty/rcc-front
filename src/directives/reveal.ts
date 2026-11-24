import type { Directive, DirectiveBinding } from 'vue'

export interface RevealOptions {
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'zoom-img'
  threshold?: number
}

const observerMap = new WeakMap<HTMLElement, IntersectionObserver>()

export const vReveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<RevealOptions | undefined>) {
    const options = binding.value || {}
    const direction = options.direction || 'up'
    const delay = options.delay ?? 0
    const duration = options.duration ?? 750
    const threshold = options.threshold ?? 0.05

    el.classList.add('reveal-base', `reveal-${direction}`)
    el.style.setProperty('--reveal-delay', `${delay}ms`)
    el.style.setProperty('--reveal-duration', `${duration}ms`)

    // Respect user preference for reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            observer.unobserve(el)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -15px 0px'
      }
    )

    observer.observe(el)
    observerMap.set(el, observer)

    // Safety check for elements already inside the viewport on mount (e.g. async-loaded cards)
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible')
        observer.unobserve(el)
      }
    })
  },

  unmounted(el: HTMLElement) {
    const observer = observerMap.get(el)
    if (observer) {
      observer.disconnect()
      observerMap.delete(el)
    }
  }
}
