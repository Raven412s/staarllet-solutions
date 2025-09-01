'use client';

import { useRouter } from 'next/navigation';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFilterProps {
    search: string;
    status: string;
}

export default function SearchFilter({ search, status }: SearchFilterProps) {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState(search || '');
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const buildUrl = (updates: Record<string, string>) => {
        const params = new URLSearchParams();

        // Keep existing params
        if (searchValue) params.set('search', searchValue);
        if (status && status !== 'all') params.set('status', status);

        // Apply updates
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        return `/admin/enquiries?${params.toString()}`;
    };

    // Debounced search effect
    useEffect(() => {
        // Clear any existing timeout
        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeout = setTimeout(() => {
            // Push query even if searchValue is empty
            router.push(buildUrl({ page: '1' }));
        }, 500); // 500ms debounce

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchValue, status]);


    const handleStatusChange = (value: string) => {
        router.push(buildUrl({ status: value, page: '1' }));
    };

    const handleApplyFilters = () => {
        router.push(buildUrl({ search: searchValue, status, page: '1' }));
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search enquiries..."
                    className="w-full sm:w-64 pl-8"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>

            <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-32 min-w-max">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="called">Called</SelectItem>
                    <SelectItem value="not-called">Not Called</SelectItem>
                </SelectContent>
            </Select>

            <Button onClick={handleApplyFilters} size="sm">
                Apply Filters
            </Button>
        </div>
    );
}
