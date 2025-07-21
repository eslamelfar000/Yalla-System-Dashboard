"use client";
import React from "react";
import { ContactUsMessagesTable } from "./contact-us-messages-table";

function ContactUsMessagesPage() {
  return (
    <div>
      <div className="flex-1">
        <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
          Contact Us Messages
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          View and manage messages from the contact us form
        </p>
      </div>
      <ContactUsMessagesTable />
    </div>
  );
}

export default ContactUsMessagesPage;
