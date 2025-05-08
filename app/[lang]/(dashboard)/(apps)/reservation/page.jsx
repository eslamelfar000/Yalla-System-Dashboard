"use client";
import React from "react";
import ReservationDataTable from "./reservation-table";
import ReserveAfterDataTable from "./reserveAfter-table";
function page() {
  return (
    <div>
      {/* <Card title="Simple"> */}
      <div className="">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
            Trail and Pay Before Students
          </h3>
        </div>
        <ReservationDataTable />
      </div>
      <div className="mt-20">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
            Pay After Sessions Students
          </h3>
        </div>
        <ReserveAfterDataTable />
      </div>
      {/* </Card> */}
    </div>
  );
}

export default page;
