'use client'

export function useSectionNav() {
  function scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { scrollTo, scrollToTop }
}