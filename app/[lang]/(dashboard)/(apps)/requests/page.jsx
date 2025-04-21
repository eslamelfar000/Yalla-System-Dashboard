"use client";
import React from "react";
import PayBoxDataTable from "./paybox-table";
import PayAfterDataTable from "./pay-after-tables";
function page() {
  return (
    <div>
      <div className="flex-1">
        <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
          PayBox Requests
        </h3>
      </div>
      <PayBoxDataTable />

      {/* .............. */}
      <div className="mt-20">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
            Pay After Sessions Requests
          </h3>
        </div>
        <PayAfterDataTable />
      </div>
    </div>
  );
}

export default page;
