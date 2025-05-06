// components/ContactDetailsDisplay.jsx
"use client";

import { Button } from "@/components/ui/button";

export default function ContactDetailsDisplay({ contact, setOpenEditor }) {
  if (!contact) return null;

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>

        <Button onClick={() => setOpenEditor(true)}>Edit Contact</Button>
      </div>
      <p>
        <strong>Email:</strong> {contact.email}
      </p>
      <p>
        <strong>Phone:</strong> {contact.phone}
      </p>
    </div>
  );
}
