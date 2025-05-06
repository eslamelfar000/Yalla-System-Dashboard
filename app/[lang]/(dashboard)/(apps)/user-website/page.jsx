import React from "react";
import UserWebsiteEditComponent from "./page-view";

function page() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
        Edit User Website
      </h3>
      <UserWebsiteEditComponent />
    </div>
  );
}

export default page;
