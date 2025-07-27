"use client";
import { getUserRoleFromCookies } from "@/lib/auth-utils";
import { useState } from "react";
import ShowAdmin from "./RolesShow/show-admin";
import ShowQuality from "./RolesShow/show-quality";
import ShowTeacher from "./RolesShow/show-teacher";

const DashboardPageView = () => {
  const userRole = getUserRoleFromCookies();
  const [role, setRole] = useState(userRole);

  return (
    <>
      {/* Role Switch Buttons */}
      {/* <ul className="flex items-center justify-center gap-4 my-6">
        <li>
          <Button onClick={() => setRole("admin")}>Admin</Button>
        </li>
        <li>
          <Button onClick={() => setRole("teacher")}>Teacher</Button>
        </li>
        <li>
          <Button onClick={() => setRole("quality")}>Quality</Button>
        </li>
      </ul> */}
      {/* Admin Dashboard */}
      {role === "admin" && <ShowAdmin role={role} />}

      {/* Quality Dashboard */}
      {role === "quality" && <ShowQuality role={role} />}

      {/* Teacher Dashboard */}
      {role === "teacher" && <ShowTeacher role={role} />}
    </>
  );
};

export default DashboardPageView;
