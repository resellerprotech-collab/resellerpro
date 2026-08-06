'use client'

import FeaturesSection from '@/components/landing/FeaturesSection'
import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-20 lg:pt-10">
                <FeaturesSection />
            </main>
            <Footer />
        </div>
    )
}

