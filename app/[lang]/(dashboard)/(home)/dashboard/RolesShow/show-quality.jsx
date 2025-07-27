import WelcomeBlock from "../../project/components/welcome-block"; 
import UpcomingDeadline from "../../project/components/upcoming-deadlines";
import ReportsCard from "../../project/components/reports";
import { useGetData } from "@/hooks/useGetData";
import { usePathname } from "next/navigation";

const ShowQuality = ({ role }) => {
  const pathname = usePathname();
  const { data, isLoading, error } = useGetData({
    endpoint: "dashboard/home-quilty",
    enabledKey: ["quality", pathname],
});

const QualityData = data?.data;



  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">Analytics</div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 mt-10 md:mt-0">
          <WelcomeBlock role={role} data={QualityData} isLoading={isLoading} error={error} />
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
            <ReportsCard role={role} data={QualityData} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <UpcomingDeadline data={QualityData} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default ShowQuality;
