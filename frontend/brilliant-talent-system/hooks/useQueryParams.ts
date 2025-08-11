'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useQueryParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Set a single query parameter
    const setQueryParam = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        router.push(`${pathname}?${params.toString()}`);
    };

    // Set multiple query parameters at once
    const setQueryParams = (paramsObj: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(paramsObj).forEach(([name, value]) => {
            params.set(name, value);
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    // Delete a query parameter
    const deleteQueryParam = (name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(name);
        router.push(`${pathname}?${params.toString()}`);
    };

    return { setQueryParam, setQueryParams, deleteQueryParam };
}