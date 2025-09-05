'use client';

import { useRouter } from 'next/navigation';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFilterProps {
    search: string;
    role: string;
    status: string;
    sortBy: string;
    sortOrder: string;
}

export default function SearchFilter({ search, role, status, sortBy, sortOrder }: SearchFilterProps) {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState(search || '');
    const [selectedRole, setSelectedRole] = useState(role || 'all');
    const [selectedStatus, setSelectedStatus] = useState(status || 'all');
    const [selectedSort, setSelectedSort] = useState(`${sortBy}:${sortOrder}` || 'createdAt:desc');
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    // Update local state when props change (URL parameters change)
    useEffect(() => {
        setSearchValue(search || '');
        setSelectedRole(role || 'all');
        setSelectedStatus(status || 'all');
        setSelectedSort(`${sortBy}:${sortOrder}` || 'createdAt:desc');
    }, [search, role, status, sortBy, sortOrder]);

    const buildUrl = (updates: Record<string, string>) => {
        const params = new URLSearchParams();

        // Use current local state values, not props
        if (searchValue) params.set('search', searchValue);
        if (selectedRole && selectedRole !== 'all') params.set('role', selectedRole);
        if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus);
        
        // Handle sort
        const [currentSortBy, currentSortOrder] = selectedSort.split(':');
        if (currentSortBy && currentSortBy !== 'createdAt') params.set('sortBy', currentSortBy);
        if (currentSortOrder && currentSortOrder !== 'desc') params.set('sortOrder', currentSortOrder);

        // Apply updates (like page reset)
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        return `/admin/users?${params.toString()}`;
    };

    // Debounced search effect
    useEffect(() => {
        // Clear any existing timeout
        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeout = setTimeout(() => {
            router.push(buildUrl({ page: '1' }));
        }, 500); // 500ms debounce

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchValue, selectedRole, selectedStatus, selectedSort]);

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
    };

    const handleSortChange = (value: string) => {
        setSelectedSort(value);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search users..."
                    className="w-full sm:w-64 pl-8"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>

            <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full sm:w-32 min-w-max">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-32 min-w-max">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
            </Select>

            <Select value={selectedSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-40 min-w-max">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt:desc">Newest First</SelectItem>
                    <SelectItem value="createdAt:asc">Oldest First</SelectItem>
                    <SelectItem value="name:asc">Name A-Z</SelectItem>
                    <SelectItem value="name:desc">Name Z-A</SelectItem>
                    <SelectItem value="email:asc">Email A-Z</SelectItem>
                    <SelectItem value="email:desc">Email Z-A</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}