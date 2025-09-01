// app/admin/enquiries/BulkActions.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Enquiry } from '@/types/enquiry';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/modals/confirmation-modal';


interface BulkActionsProps {
  enquiries: Enquiry[];
  selected: string[];
  onSelectChange: (selected: string[]) => void;
}

export default function BulkActions({ enquiries, selected, onSelectChange }: BulkActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const selectAll = () => {
    if (selected.length === enquiries.length) {
      onSelectChange([]);
    } else {
      onSelectChange(enquiries.map(e => e._id));
    }
  };

  const handleBulkDelete = async () => {
    const res = await fetch('/api/admin/enquiries/bulk', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert('Failed to delete selected enquiries');
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <Button variant="outline" onClick={selectAll}>
          {selected.length === enquiries.length ? 'Deselect All' : 'Select All'}
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => setIsDeleteDialogOpen(true)} 
          disabled={selected.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected ({selected.length})
        </Button>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Enquiries"
        description={`Are you sure you want to delete ${selected.length} enquiry(s)? This action cannot be undone.`}
        onConfirm={handleBulkDelete}
        confirmText="Delete"
      />
    </>
  );
}