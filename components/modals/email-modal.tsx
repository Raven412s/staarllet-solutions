"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import * as React from "react";
import SendEmailForm from "../forms/send-email-form";

export type EmailFormModalProps = {
    /**
     * Any element that should open the modal when clicked.
     * Commonly a <Button> from shadcn, a link, or a custom node.
     */
    to?: string;
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

export default function EmailFormModal({
    children,
    to,
    title = "Send Mail to user",
    onSubmitted,
    open,
    onOpenChange,
    contentClassName,
}: EmailFormModalProps) {
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

    // This prevents the dropdown from closing when clicking the trigger
    const handleTriggerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleOpenChange(true);
    };

    return (
        <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild onClick={handleTriggerClick}>
                {children}
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[480px] rounded-2xl p-0 overflow-hidden ${contentClassName ?? ""}`}>
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{title}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        <SendEmailForm to={to} onSuccess={handleSuccess} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}