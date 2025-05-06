"use client";

import { useState } from "react";
import ContactDetailsDisplay from "./ShowDetails";
import ContactDetailsEditor from "./EditDetails";
import { Button } from "@/components/ui/button";

export default function ContactManagerPage() {
  const [openEditor, setOpenEditor] = useState(false);

  const [contactDetails, setContactDetails] = useState({
    email: "info@example.com",
    phone: "+123 456 7890",
  });

  return (
    <div className="container">
      <ContactDetailsDisplay
        contact={contactDetails}
        setOpenEditor={setOpenEditor}
      />

      <ContactDetailsEditor
        open={openEditor}
        onClose={() => setOpenEditor(false)}
        onSave={(data) => setContactDetails(data)}
        initialData={contactDetails}
      />
    </div>
  );
}
