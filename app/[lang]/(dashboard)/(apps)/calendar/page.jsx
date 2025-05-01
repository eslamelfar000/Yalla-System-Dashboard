import { getCategories, getEvents } from "@/config/calendar.config";
import dynamic from "next/dynamic";

// 👇 dynamic import with SSR disabled
const CalendarView = dynamic(() => import("./calender-view"), {
  ssr: false,
});

const CalenderPage = async () => {
  const events = await getEvents();
  const categories = await getCategories();

  return (
    <div>
      <CalendarView events={events?.data} categories={categories?.data} />
    </div>
  );
};

export default CalenderPage;
