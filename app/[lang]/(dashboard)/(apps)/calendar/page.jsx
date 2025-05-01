import dynamic from "next/dynamic";
import { getCategories, getEvents } from "@/config/calendar.config";

// ✅ dynamic import of client component
const CalendarView = dynamic(() => import("./CalendarViewWrapper"), {
  ssr: false, // Disable SSR for client-only components
  loading: () => <div>Loading...</div>, // Optional: add loading spinner/fallback
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
