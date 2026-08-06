import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { ShieldCheck } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
                                Privacy Policy
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
                                ResellerPro ("we", "our", or "us") operates a subscription-based
                                SaaS platform designed to help resellers manage products,
                                customers, orders, and business workflows. We respect your
                                privacy and are committed to protecting your personal
                                information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                1. Information We Collect
                            </h2>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li>Account information such as name, email, and phone number</li>
                                <li>
                                    Business data including products, customers, orders, and
                                    invoices
                                </li>
                                <li>
                                    Subscription and payment status (we do not store card or UPI
                                    details)
                                </li>
                                <li>
                                    Usage data to improve performance, security, and user
                                    experience
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                2. How We Use Your Information
                            </h2>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li>To create and manage your account</li>
                                <li>To provide subscription-based services</li>
                                <li>To process payments and renewals</li>
                                <li>To communicate important updates and support messages</li>
                                <li>To improve and secure the platform</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                3. Payments
                            </h2>
                            <p>
                                All payments on ResellerPro are processed securely through
                                <strong> Razorpay</strong>. We do not store your card, UPI, or
                                banking details on our servers. Razorpay’s privacy policy
                                governs payment transactions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                4. Data Security
                            </h2>
                            <p>
                                We use industry-standard security practices, including
                                encryption and access controls, to protect your data. While no
                                system is completely secure, we continuously work to safeguard
                                your information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                5. Data Sharing
                            </h2>
                            <p>
                                We do not sell or rent your personal data. Information may only
                                be shared with trusted third parties such as payment processors
                                (Razorpay) or when required by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                6. Your Rights
                            </h2>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li>Access or update your account information</li>
                                <li>Request deletion of your account</li>
                                <li>Contact us regarding privacy-related concerns</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                7. Contact Us
                            </h2>
                            <p>
                                If you have any questions about this Privacy Policy, you can
                                contact us at:
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
