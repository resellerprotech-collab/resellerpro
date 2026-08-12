import { useQuery } from '@tanstack/react-query'

export function useProfile(initialData?: any) {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await fetch('/api/settings/profile')
            if (!res.ok) throw new Error('Failed to fetch profile')
            return res.json()
        },
        initialData: initialData,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        gcTime: 10 * 60 * 1000,
    })
}
