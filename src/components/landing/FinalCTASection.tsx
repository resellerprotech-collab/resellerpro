'use client'

export default function FinalCTASection() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <img
          src="/images/final_cta_banner.png"
          alt="Reseller Pro CTA"
          className="w-full max-w-5xl h-auto rounded-3xl object-cover shadow-[10px] border border-border/40"
        />
      </div>
    </section>
  )
}