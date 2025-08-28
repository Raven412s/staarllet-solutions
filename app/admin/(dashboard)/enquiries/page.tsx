'use client';

import EmailFormModal from '@/components/modals/email-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Clock,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
  called?: boolean;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiries, setSelectedEnquiries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [actionEnquiry, setActionEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    filterEnquiries();
  }, [enquiries, searchTerm, statusFilter]);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/enquiries");
      if (!res.ok) {
        throw new Error("Failed to fetch enquiries");
      }
      const data: Enquiry[] = await res.json();
      setEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEnquiries = () => {
    let result = enquiries;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(enquiry =>
        enquiry.name.toLowerCase().includes(term) ||
        enquiry.email.toLowerCase().includes(term) ||
        enquiry.phone.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'called') {
        result = result.filter(enquiry => enquiry.called);
      } else if (statusFilter === 'not-called') {
        result = result.filter(enquiry => !enquiry.called);
      }
    }

    setFilteredEnquiries(result);
  };

  const toggleEnquirySelection = (enquiryId: string) => {
    setSelectedEnquiries(prev =>
      prev.includes(enquiryId)
        ? prev.filter(id => id !== enquiryId)
        : [...prev, enquiryId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEnquiries.length === filteredEnquiries.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(filteredEnquiries.map(enquiry => enquiry._id));
    }
  };

  const handleToggleCalled = async (id: string, value: boolean) => {
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ called: value }),
      });

      // locally update state
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === id ? { ...enquiry, called: value } : enquiry
        )
      );
    } catch (err) {
      console.error("Failed to update called status", err);
    }
  };

  const handleDeleteEnquiry = async () => {
    if (!actionEnquiry) return;

    try {
      const response = await fetch(`/api/admin/enquiries/${actionEnquiry._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the enquiries list
        fetchEnquiries();
        // Clear selection if deleting
        setSelectedEnquiries(prev => prev.filter(id => id !== actionEnquiry._id));
      } else {
        console.error('Failed to delete enquiry');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    } finally {
      setActionEnquiry(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleBulkDeleteEnquiries = async () => {
    if (selectedEnquiries.length === 0) return;

    try {
      const response = await fetch('/api/admin/enquiries/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedEnquiries }),
      });

      if (response.ok) {
        // Refresh the enquiries list
        fetchEnquiries();
        // Clear selections
        setSelectedEnquiries([]);
      } else {
        console.error('Failed to delete enquiries');
      }
    } catch (error) {
      console.error('Error deleting enquiries:', error);
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const sendBulkEmail = () => {
    if (selectedEnquiries.length === 0) return;

    const selectedEmails = enquiries
      .filter(enquiry => selectedEnquiries.includes(enquiry._id))
      .map(enquiry => enquiry.email)
      .join(',');

    window.location.href = `mailto:${selectedEmails}`;
  };

  const getStatusBadgeVariant = (called: boolean | undefined) => {
    return called ? 'default' : 'secondary';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enquiries</h1>
          <p className="text-muted-foreground">
            Manage all customer enquiries
          </p>
        </div>
        <div className="flex gap-2">
          {selectedEnquiries.length > 0 && (
            <>
              <Button variant="outline" onClick={sendBulkEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Email Selected ({selectedEnquiries.length})
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedEnquiries.length})
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Enquiry Management</CardTitle>
              <CardDescription>
                View and manage all customer enquiries
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search enquiries..."
                  className="w-full sm:w-64 pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="called">Called</SelectItem>
                  <SelectItem value="not-called">Not Called</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedEnquiries.length === filteredEnquiries.length && filteredEnquiries.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </div>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    No enquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEnquiries.includes(enquiry._id)}
                        onCheckedChange={() => toggleEnquirySelection(enquiry._id)}
                        aria-label={`Select ${enquiry.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{enquiry.name}</TableCell>
                    <TableCell>{enquiry.email}</TableCell>
                    <TableCell>{enquiry.phone}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {enquiry.message || "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(enquiry.called)}>
                        {enquiry.called ? 'Called' : 'Not Called'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() => (window.location.href = `tel:${enquiry.phone}`)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </DropdownMenuItem>

                          <EmailFormModal
                            to={enquiry.email}
                            onSubmitted={() => {
                              console.log('Email sent successfully');
                            }}
                          >
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                          </EmailFormModal>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => handleToggleCalled(enquiry._id, !enquiry.called)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Mark as {enquiry.called ? 'Not Called' : 'Called'}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setActionEnquiry(enquiry);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Enquiry
                          </DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the enquiry
              from {actionEnquiry?.name} ({actionEnquiry?.email}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEnquiry}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedEnquiries.length} 
              selected enquiry{selectedEnquiries.length !== 1 ? 's' : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteEnquiries}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedEnquiries.length} Enquiry{selectedEnquiries.length !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}