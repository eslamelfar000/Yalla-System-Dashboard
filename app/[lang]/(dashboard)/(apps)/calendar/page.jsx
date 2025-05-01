import dynamic from "next/dynamic";
import { getCategories, getEvents } from "@/config/calendar.config";

// ✅ dynamic import of client component
const CalendarView = dynamic(() => import("./CalendarViewWrapper"), {
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
