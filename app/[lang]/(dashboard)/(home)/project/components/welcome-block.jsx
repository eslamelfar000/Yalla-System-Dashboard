"use client"
import Image from "next/image";
import admin from "@/public/images/all-img/admin.png"
import { useAuth } from "@/hooks/use-auth";

const WelcomeBlock = ({ role }) => {
  const { user } = useAuth(); 
  const data = [
    {
      title: "Today's Task",
      total: "123"
    },
    {
      title: "Overdue Task",
      total: "213"
    },
  ]
  return (
    <div className="w-full h-full bg-primary rounded-md  flex p-6 relative ">
      <div className="flex-1 ">
        <div className="text-md md:text-lg font-semibold text-primary-foreground mb-6">
          Welcome Back <br />
          <span className="text-2xl font-bold">{user?.name}!</span>
        </div>

        {role === "teacher" && (
          <div className=" flex flex-col gap-4 sm:flex-row ">
            {data.map((item, index) => (
              <div
                key={`welcome-text-${index}`}
                className="flex items-center w-full max-w-[130px] p-3 rounded bg-primary-foreground/10 shadow backdrop-blur-sm"
              >
                <div className="flex-1">
                  <div className="text-xs font-semibold text-primary-foreground/80">
                    {item.title}
                  </div>
                  <div className="text-lg font-semibold text-primary-foreground">
                    {item.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 ltr:right-4 rtl:left-4 ltr:md:right-[30%] rtl:md:left-[30%] ltr:md:bottom-5 ltr:2xl:right-10 rtl:2xl:left-10 w-[100px] ">
        <Image src={admin} alt="user" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default WelcomeBlock;