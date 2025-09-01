// app/admin/enquiries/EnquiryActions.tsx
'use client';
import { useState } from 'react';
import { Clock, Mail, MoreHorizontal, Phone, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import EmailFormModal from '@/components/modals/email-modal';
import { Enquiry } from '@/types/enquiry';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/modals/confirmation-modal';


interface EnquiryActionsProps {
  enquiry: Enquiry;
}

export default function EnquiryActions({ enquiry }: EnquiryActionsProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ called: !enquiry.called }),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method: 'DELETE',
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to delete enquiry:', error);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <a href={`tel:${enquiry.phone}`}>
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </a>
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
          <DropdownMenuItem onClick={handleStatusUpdate}>
            <Clock className="h-4 w-4 mr-2" />
            Mark as {enquiry.called ? 'Not Called' : 'Called'}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)} 
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Enquiry
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Enquiry"
        description="Are you sure you want to delete this enquiry? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}