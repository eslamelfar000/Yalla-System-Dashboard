"use client";
import React from "react";

import { ContactsDataTable } from "./contacts-table";

function page() {
  return (
    <div>
      <div className="flex-1">
        <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
          Contacts
        </h3>
      </div>
      <ContactsDataTable />
    </div>
  );
}

export default page;
