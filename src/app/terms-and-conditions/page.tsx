import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { FileText } from 'lucide-react'

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Navbar />

            <main className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Home Hero Background Theme */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-gradient-to-tr from-cyan-500/15 via-blue-400/10 to-transparent rounded-full blur-[100px]" />
                    <div className="absolute top-[30%] left-[25%] w-[250px] h-[250px] bg-blue-500/10 rounded-full blur-[80px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* Header with Home Hero Theme */}
                    <div className="mb-10 text-center space-y-2.5">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]" style={{ fontFamily: "'Switzer', sans-serif" }}>
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                Terms & Conditions
                            </span>
                        </h1>
                        <p className="text-xs text-slate-500 max-w-lg mx-auto font-medium">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 text-sm sm:text-[14.5px] text-slate-600 leading-relaxed">
                        <section>
                            <p>
                                These Terms & Conditions ("Terms") govern your access to and use
                                of <strong>ResellerPro</strong>. By creating an account or using
                                the platform, you agree to be bound by these Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                1. Service Description
                            </h2>
                            <p>
                                ResellerPro is a cloud-based SaaS platform that helps resellers
                                manage products, customers, orders, analytics, and business
                                workflows through a subscription-based model.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                2. Account Registration
                            </h2>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li>You must create an account to use ResellerPro</li>
                                <li>You are responsible for maintaining account security</li>
                                <li>
                                    You agree to provide accurate and up-to-date information
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                3. Subscription & Billing
                            </h2>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li>
                                    ResellerPro offers Free, Professional, and Business plans
                                </li>
                                <li>Paid plans are billed on a monthly basis</li>
                                <li>
                                    Subscription prices are displayed clearly on the pricing page
                                </li>
                                <li>
                                    Payments are processed securely via <strong>Razorpay</strong>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                4. Cancellation & Refunds
                            </h2>
                            <p>
                                You may cancel your subscription at any time. Your access will
                                continue until the end of the current billing cycle.
                            </p>
                            <p className="mt-1.5">
                                Refunds, if applicable, are handled in accordance with Razorpay
                                policies and the plan terms. Promotional or discounted plans may
                                not be eligible for refunds.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                5. Fair Usage Policy
                            </h2>
                            <p>You agree not to:</p>
                            <ul className="list-disc pl-5 space-y-1.5 mt-1.5">
                                <li>Use the platform for illegal or unauthorized purposes</li>
                                <li>Attempt to disrupt, reverse engineer, or misuse services</li>
                                <li>Abuse system limits or features unfairly</li>
                            </ul>
                            <p className="mt-1.5">
                                We reserve the right to suspend or terminate accounts that
                                violate these Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                6. Data Ownership
                            </h2>
                            <p>
                                You retain full ownership of your business data. ResellerPro
                                does not claim ownership over your content. We process your data
                                solely to provide and improve the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                7. Service Availability
                            </h2>
                            <p>
                                ResellerPro is provided on an “as is” and “as available” basis.
                                While we aim for high availability, uninterrupted service is
                                not guaranteed.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                8. Changes to Terms
                            </h2>
                            <p>
                                We may update these Terms from time to time. Continued use of
                                ResellerPro after changes indicates acceptance of the updated
                                Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                9. Contact Information
                            </h2>
                            <p>
                                If you have any questions about these Terms & Conditions, you
                                can contact us at:
                            </p>
                            <p className="mt-1.5">
                                📧 <strong>resellerpro.tech@gmail.com</strong>
                                <br />
                                📞 <strong>+91 77367 67759</strong>
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
