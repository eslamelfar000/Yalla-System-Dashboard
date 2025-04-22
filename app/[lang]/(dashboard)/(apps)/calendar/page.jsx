import { getCategories, getEvents } from "@/config/calendar.config";
import CalendarView from "./calender-view";
import dynamic from "next/dynamic";

const FCalendar = dynamic(() => import("./calender-view"), {
  ssr: false,
});

const CalenderPage = async () => {
  const events = await getEvents();
  const categories = await getCategories();
  return (
    <div>
      {/* <CalendarView events={events?.data} categories={categories?.data} /> */}
      <br />
      <FCalendar events={events?.data} categories={categories?.data} />
    </div>
  );
};

export default CalenderPage;
