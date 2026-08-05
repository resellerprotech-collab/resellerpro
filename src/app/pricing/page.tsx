"use client"

import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'

import PricingSection from '@/components/landing/PricingSection'

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-20 lg:pt-24">
                <PricingSection />
            </main>
            <Footer />
        </div>
    )
}
