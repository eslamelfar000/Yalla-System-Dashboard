// components/ContactDetailsEditor.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/Shared/loading-button";

export default function ContactDetailsEditor({
  open,
  onClose,
  onSave,
  initialData,
  loading = false,
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
    } else {
      setEmail("");
      setPhone("");
    }
  }, [initialData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !phone) return;

    await onSave({ email, phone });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton type="submit" loading={loading}>
              Save
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
