import { useQuery } from '@tanstack/react-query'

export function useAnalytics(
    params: { from?: string; to?: string },
    options?: { enabled?: boolean }
) {
    const queryString = new URLSearchParams()
    if (params.from) queryString.set('from', params.from)
    if (params.to) queryString.set('to', params.to)

    return useQuery({
        queryKey: ['analytics', params.from || 'default', params.to || 'default'],
        queryFn: async () => {
            const res = await fetch(`/api/analytics?${queryString.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch analytics')
            return res.json()
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes for instant page switching
        gcTime: 10 * 60 * 1000, // Keep in memory 10 mins
        enabled: options?.enabled ?? true,
    })
}
