// app/admin/enquiries/EnquiriesTable.tsx
'use client';
import { useState } from 'react';
import { Enquiry, PaginationInfo } from '@/types/enquiry';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import EnquiryActions from './EnquiryActions';
import BulkActions from './BulkActions';
import { formatDate } from '@/lib/utils';

interface EnquiriesTableProps {
  enquiries: Enquiry[];
  pagination: PaginationInfo;
  search: string;
  status: string;
}

export default function EnquiriesTable({ enquiries}: EnquiriesTableProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getStatusBadgeVariant = (called: boolean | undefined) => {
    return called ? 'default' : 'secondary';
  };

  return (
    <>
      <BulkActions 
        enquiries={enquiries} 
        selected={selected} 
        onSelectChange={setSelected} 
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <div className="flex items-center">
                <Checkbox 
                  checked={selected.length === enquiries.length && enquiries.length > 0}
                  onCheckedChange={() => {
                    if (selected.length === enquiries.length) {
                      setSelected([]);
                    } else {
                      setSelected(enquiries.map(e => e._id));
                    }
                  }}
                  aria-label="Select all"
                />
              </div>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center h-24">
                No enquiries found.
              </TableCell>
            </TableRow>
          ) : (
            enquiries.map((enquiry) => (
              <TableRow key={enquiry._id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(enquiry._id)}
                    onCheckedChange={() => toggleSelect(enquiry._id)}
                    aria-label={`Select ${enquiry.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{enquiry.name}</TableCell>
                <TableCell>{enquiry.email}</TableCell>
                <TableCell>{enquiry.phone}</TableCell>
                <TableCell><Badge>{enquiry.type}</Badge></TableCell>
                <TableCell>
                  {enquiry.course ? enquiry.course.title : "-"}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {enquiry.message || "-"}
                </TableCell>
                <TableCell>
                  {formatDate(enquiry.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(enquiry.called)}>
                    {enquiry.called ? 'Called' : 'Not Called'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <EnquiryActions enquiry={enquiry} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}