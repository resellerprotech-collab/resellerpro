import type { Metadata, Viewport } from 'next'
import { Spline_Sans, Inter } from 'next/font/google'
import './globals.css'
import { Toaster as Sonner } from 'sonner'
import { ThemeProvider } from '../components/providers/theme-provider'
import { Providers } from './providers'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { OfflineBanner } from '@/components/shared/OfflineBanner'
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";

const splineSans = Spline_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-spline-sans' })
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ResellerPro - Manage Your Reselling Business',
  description:
    'ResellerPro is an AI-powered CRM platform for WhatsApp and Instagram resellers to manage leads, orders, and automation.',
  keywords: 'whatsapp crm, instagram crm, reseller crm, resellerpro, order tracking, ai automation',
  openGraph: {
    title: 'ResellerPro - WhatsApp CRM',
    description: 'AI-powered CRM for WhatsApp resellers',
    url: 'https://resellerpro.in',
    siteName: 'ResellerPro',
    images: [

      {
        url: 'https://resellerpro.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResellerPro Dashboard',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@resellerpro',
    title: 'ResellerPro - WhatsApp CRM',
    description: 'AI-powered CRM for WhatsApp resellers',
    images: ['https://resellerpro.in/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-180x180.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ResellerPro',
              url: 'https://resellerpro.in',
              logo: 'https://resellerpro.in/icons/icon-512x512.png',
              sameAs: [
                'https://www.instagram.com/resellerpro',
                'https://www.facebook.com/resellerpro',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ResellerPro',
              url: 'https://resellerpro.in',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://resellerpro.in/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* 🚀 SELF-HEALING / CACHE-BUSTER: Force clear stale Service Workers causing UI issues */}
        <script id="force-update" dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(registrations => {
                for(let registration of registrations) {
                  // In development or if explicitly requested, unregister stale workers
                  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                  if (isDev) {
                    registration.unregister();
                  }
                }
              });
            }
            // Add build timestamp to window to identify deployment
            window.__BUILD_ID__ = "${new Date().toISOString()}";
          `
        }} />

        {/* Meta Pixel Code */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1701032171126774');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1701032171126774&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${splineSans.variable} ${inter.variable} ${splineSans.className}`}>
        {/* <AppLoader /> */}
        <Providers>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <OfflineBanner />
              {children}
              <Analytics />
              <Sonner
                position="top-right"
                richColors={false}
                expand={false}
                gap={8}
                toastOptions={{
                  classNames: {
                    toast: 'rp-toast',
                  },
                }}
              />
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
