'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white transition-all duration-200 overflow-hidden hover:border-slate-300">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none group cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 pr-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 group-hover:text-blue-600 transition-colors">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
            {question}
          </span>
        </div>
        <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-in-out transform ${
          isOpen 
            ? 'bg-blue-600 text-white rounded-full rotate-180 shadow-sm' 
            : 'bg-slate-100 text-slate-500 rounded-md group-hover:bg-blue-500/10 group-hover:text-blue-600'
        }`}>
          <Plus className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}>
        <div className="overflow-hidden">
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 pl-11 sm:pl-14 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  const faqs = [
    {
      question: "How does the Smart Paste feature work?",
      answer: "Simply copy a customer's message from WhatsApp (containing their name, phone, and address), then paste it into Reseller Pro. Our intelligent system automatically extracts and organizes all the information into the right fields. No manual typing needed!"
    },
    {
      question: "Can I use Reseller Pro with Instagram as well?",
      answer: "Yes! While we integrate directly with WhatsApp for automated messaging, you can manually add orders from Instagram or any other platform. Copy-paste customer details from Instagram DMs just like WhatsApp, and manage everything in one dashboard."
    },
    {
      question: "What happens when I exceed 10 orders on the free plan?",
      answer: "You'll receive a notification when approaching your limit. You can upgrade to Pro for unlimited orders anytime, or wait until next month when your order count resets. Your existing data stays safe and accessible."
    },
    {
      question: "Is my customer data secure and private?",
      answer: "Absolutely. All your data is encrypted and stored securely. We never share your customer information with anyone. Your business data is completely private and belongs only to you."
    },
    {
      question: "Do I need any technical knowledge to get started?",
      answer: "Not at all! Reseller Pro is designed to be simple and intuitive. If you can use WhatsApp, you can use Reseller Pro. Setup takes less than 5 minutes, and our interface is straightforward with no learning curve."
    },
    {
      question: "Can I send messages to dealers directly from the app?",
      answer: "Yes! With one click, you can send pre-formatted messages to your dealers via WhatsApp. The app creates the perfect message format with order details, and opens WhatsApp ready to send. It saves you tons of time on repetitive communication."
    },
    {
      question: "How do branded invoices work?",
      answer: "You can upload your business logo and set your business name in settings. When you generate invoices, they'll automatically include your branding, making you look more professional to your customers. The invoices are clean, modern, and ready to share."
    },
    {
      question: "Can I cancel or downgrade my plan anytime?",
      answer: "Yes, you have complete flexibility. Downgrade to the free plan or cancel anytime with no questions asked. Your data remains accessible even if you downgrade, and you can upgrade again whenever you're ready."
    },
    {
      question: "What kind of support do you provide?",
      answer: "Free plan users get email support with response within 24-48 hours. Pro and Business plan users get priority support with faster response times. We're committed to helping you succeed with Reseller Pro."
    },
    {
      question: "Will there be more features in the future?",
      answer: "Definitely! We're actively developing new features including an AI Chat Assistant for automatic customer replies, advanced analytics dashboard, and more integrations. As an early user, you'll get access to new features as they launch."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-12 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 relative">
      {/* Top Section Container */}
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-2">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Everything you need to know about Reseller Pro. Can't find what you're looking for?{' '}
         
          </p>
        </div>

        {/* FAQ Items Accordion */}
        <div className="space-y-3 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={index >= 4 && !showAllMobile ? 'hidden md:block' : 'block'}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            </div>
          ))}

          {/* Mobile View More / Show Less Button */}
          <div className="md:hidden text-center pt-2">
            <button
              type="button"
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors shadow-xs cursor-pointer"
            >
              <span>{showAllMobile ? 'Show Less' : 'View More Questions'}</span>
              {showAllMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA Box (Wider Container with Centered Content) */}
      <div className="max-w-4xl lg:max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-lg w-full overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 max-w-3xl mx-auto">
            {/* Left 3D Support Graphic */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/support_headset_3d.png"
                alt="Customer Support"
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Right Content Column */}
            <div className="text-center md:text-left space-y-3">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                Still have questions?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-md leading-relaxed">
                We're here to help! Reach out to our team and we'll get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href="mailto:resellerpro.tech@gmail.com"
                  className="w-full sm:w-auto px-6 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold text-xs sm:text-sm shadow-xs text-center"
                >
                  Email Us
                </a>
                <a
                  href="tel:+917736767759"
                  className="w-full sm:w-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg transition-all font-semibold text-xs sm:text-sm backdrop-blur-xs text-center"
                >
                  Call +91 7736767759
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}