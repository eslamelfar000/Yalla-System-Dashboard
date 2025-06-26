"use client";

import { useState } from "react";
import ContactDetailsDisplay from "./ShowDetails";
import ContactDetailsEditor from "./EditDetails";
import { Button } from "@/components/ui/button";
import DataErrorBoundary from "../Shared/DataErrorBoundary";
import { useSettingsAPI } from "../../api/settings-api";

export default function ContactManagerPage() {
  const [openEditor, setOpenEditor] = useState(false);

  const { getContactSettings, updateSettings } = useSettingsAPI();

  // Get contact settings data using the hook
  const { data: contactData, isLoading, error, refetch } = getContactSettings;
  const settings = contactData?.data || {};

  console.log(contactData);

  const contactDetails = {
    email: settings.email || "",
    phone: settings.phone || "",
  };

  const handleSaveContact = async (data) => {
    await updateSettings.mutateAsync({
      settings: {
        email: data.email,
        phone: data.phone,
      },
    });
    setOpenEditor(false);
  };

  const handleRetry = async () => {
    await refetch();
  };

  return (
    <DataErrorBoundary
      error={error}
      isLoading={isLoading}
      onRetry={handleRetry}
      dataType="contact-settings"
    >
      <div className="container">
        <ContactDetailsDisplay
          contact={contactDetails}
          setOpenEditor={setOpenEditor}
        />

        <ContactDetailsEditor
          open={openEditor}
          onClose={() => setOpenEditor(false)}
          onSave={handleSaveContact}
          initialData={contactDetails}
          loading={updateSettings.isPending}
        />
      </div>
    </DataErrorBoundary>
  );
}
