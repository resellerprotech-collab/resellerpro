import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// System reserved subdomains & path prefixes that must bypass store rewrites
const RESERVED_SUBDOMAINS = ['www', 'app', 'admin', 'api', 'dashboard', 'ekodrix', 'ekodrix-panel', 'auth', 'onboarding']

export async function middleware(request: NextRequest) {
  // 🔓 CORS handling for Headless Commerce API routes
  if (request.nextUrl.pathname.startsWith('/api/v1/headless')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, apikey',
          'Access-Control-Max-Age': '86400'
        }
      })
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Add CORS headers to all headless API responses
  if (request.nextUrl.pathname.startsWith('/api/v1/headless')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, apikey')
  }

  const hostname = (request.headers.get('host') || '').toLowerCase().replace(/:\d+$/, '') // strip port
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'resellerpro.in').toLowerCase()

  // Create Supabase client for middleware context
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 🌐 DOMAIN ROUTING ENGINE (Subdomains & Custom Domains)
  const isStaticFile = request.nextUrl.pathname.startsWith('/_next') ||
                        request.nextUrl.pathname.includes('.') ||
                        request.nextUrl.pathname.startsWith('/api/') ||
                        request.nextUrl.pathname.startsWith('/auth/callback')

  if (!isStaticFile) {
    let shopSlugToRewrite: string | null = null

    // CASE 1: Subdomain Routing (e.g. fashionhub.resellerpro.in OR fashionhub.localhost)
    let currentSubdomain: string | null = null
    if (hostname.endsWith(`.${rootDomain}`)) {
      currentSubdomain = hostname.replace(`.${rootDomain}`, '')
    } else if (hostname.endsWith('.localhost')) {
      currentSubdomain = hostname.replace('.localhost', '')
    }

    if (currentSubdomain && !RESERVED_SUBDOMAINS.includes(currentSubdomain)) {
      shopSlugToRewrite = currentSubdomain
    }

    // CASE 2: White-Label Custom Domain Routing (e.g. www.fashionhubstore.com or fashionhubstore.com)
    const isRootAppDomain = hostname === rootDomain ||
                             hostname === `www.${rootDomain}` ||
                             hostname === 'localhost' ||
                             hostname === '127.0.0.1' ||
                             Boolean(currentSubdomain)

    if (!isRootAppDomain && !shopSlugToRewrite) {
      const cleanCustomDomain = hostname.replace(/^www\./, '')
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('shop_slug')
          .or(`custom_domain.eq.${cleanCustomDomain},custom_domain.eq.${hostname}`)
          .maybeSingle()

        if (profile?.shop_slug) {
          shopSlugToRewrite = profile.shop_slug
        }
      } catch (err) {
        console.warn('[Middleware Custom Domain Error]:', err)
      }
    }

    // Execute Seamless URL Rewrite if store slug detected
    if (shopSlugToRewrite && !request.nextUrl.pathname.startsWith('/store/')) {
      const storeUrl = request.nextUrl.clone()
      storeUrl.pathname = `/store/${shopSlugToRewrite}${request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname}`
      return NextResponse.rewrite(storeUrl)
    }
  }

  // ✋ Allow auth callback to proceed without interference
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return response
  }

  // 🔌 OFFLINE-FIRST: Try to get user from session
  let user = null
  let isOffline = false

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      const isNetworkError =
        error.message?.includes('fetch failed') ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('Network') ||
        error.message?.includes('ENOTFOUND') ||
        error.message?.includes('ERR_INTERNET_DISCONNECTED') ||
        error.message?.includes('ERR_NETWORK_CHANGED') ||
        error.status === 500 ||
        error.status === 0

      if (isNetworkError) {
        isOffline = true
        user = { id: 'offline-user' } as any
      }
    } else {
      user = data.user
    }
  } catch (error) {
    isOffline = true
    user = { id: 'offline-user' } as any
  }

  // 🔐 SESSION ENFORCEMENT: Verify if the session is still active in database
  if (user && !isOffline && !request.nextUrl.pathname.startsWith('/auth') && !request.nextUrl.pathname.startsWith('/api')) {
    try {
      const isSensitivePath = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.includes('/settings')

      if (isSensitivePath) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          let issuedAt = 0

          if (session.access_token) {
            try {
              const payload = JSON.parse(atob(session.access_token.split('.')[1]))
              if (payload.iat) issuedAt = payload.iat * 1000
            } catch (e) {}
          }

          if (!issuedAt) {
            issuedAt = session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).getTime() :
              (session.user.created_at ? new Date(session.user.created_at).getTime() : Date.now())
          }

          const now = Date.now()
          const isBrandNewSession = Math.abs(now - issuedAt) < 60000

          if (!isBrandNewSession) {
            const encoder = new TextEncoder()
            const data = encoder.encode(session.access_token)
            const hashBuffer = await crypto.subtle.digest('SHA-256', data)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashedToken = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

            const { data: dbSession, error: dbError } = await supabase
              .from('user_sessions')
              .select('id')
              .eq('session_token', hashedToken)
              .maybeSingle()

            if (dbError) {
              if (process.env.NODE_ENV !== 'production') {
                console.warn(`[SECURITY] DB error during session check (fail-open): ${dbError.message}`)
              }
            } else if (!dbSession) {
              const url = request.nextUrl.clone()
              url.pathname = '/signin'
              url.searchParams.set('message', 'Security Alert: Your session was terminated from another device.')

              const redirectResponse = NextResponse.redirect(url)
              const project = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0]
              const baseName = `sb-${project}-auth-token`

              request.cookies.getAll().forEach(cookie => {
                if (cookie.name.includes(baseName)) {
                  redirectResponse.cookies.delete(cookie.name)
                }
              })

              return redirectResponse
            }
          }
        }
      }
    } catch (e) {
      console.warn('Security enforcement fail-open:', e)
    }
  }

  // 🔒 Redirect logged-out users away from dashboard & onboarding (only if online)
  const isProtectedPage =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/onboarding')

  if (!user && !isOffline && isProtectedPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // 🔁 Redirect logged-in users away from auth pages
  const isAuthPage =
    request.nextUrl.pathname === '/signin' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/forgot-password' ||
    request.nextUrl.pathname === '/reset-password'

  if (user && !isOffline && isAuthPage) {
    if (request.nextUrl.pathname === '/reset-password') {
      return response
    }

    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
