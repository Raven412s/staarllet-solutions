// create a request callback modal using a request callback form from @/components/forms/request-callback.tsx and its trigger would be the children. use shadcn ui elements to create the modal itself

"use client";
import RequestCallbackForm from "@/components/forms/request-callback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import * as React from "react";

export type RequestCallbackModalProps = {
  /**
   * Any element that should open the modal when clicked.
   * Commonly a <Button> from shadcn, a link, or a custom node.
   */
  children: React.ReactNode;
  /** Optional custom title for the modal header */
  title?: string;
  /** Optional short description shown under title */
  description?: string;
  /**
   * Called after the form reports success. The modal also auto-closes.
   */
  onSubmitted?: () => void;
  /**
   * Pass to control the open state from a parent.
   */
  open?: boolean;
  /**
   * Controlled open-state change handler.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Extra class names for DialogContent
   */
  contentClassName?: string;
};

export default function RequestCallbackModal({
  children,
  title = "Request a Callback",
  description = "Fill the form and our team will reach out shortly.",
  onSubmitted,
  open,
  onOpenChange,
  contentClassName,
}: RequestCallbackModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const modalOpen = isControlled ? (open as boolean) : internalOpen;

  const handleOpenChange = (next: boolean) => {
    onOpenChange?.(next);
    if (!isControlled) setInternalOpen(next);
  };

  const handleSuccess = () => {
    onSubmitted?.();
    handleOpenChange(false);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={`sm:max-w-[480px] rounded-2xl p-0 overflow-hidden ${contentClassName ?? ""}`}>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          {/*
            The RequestCallbackForm should accept an optional `onSuccess` prop.
            If your form exposes a different callback (e.g., onSubmitSuccess),
            update the prop name below accordingly.
          */}
          <div className="mt-4">
            <RequestCallbackForm onSuccess={handleSuccess} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
