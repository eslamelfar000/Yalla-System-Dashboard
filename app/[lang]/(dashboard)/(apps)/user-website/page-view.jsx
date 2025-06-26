"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/Shared/loading-button";
import { Icon } from "@iconify/react";
import { RefreshCw } from "lucide-react";
import SwiperSlides from "./components/Swiper/swiper-dashboard";
import PartnerBannerPage from "./components/PartnerBanner/show";
import ContactManagerPage from "./components/ContactDetails/ShowPage";
import { useRefetchData } from "./hooks/useRefetchAllData";
import { useState } from "react";
import { toast } from "react-hot-toast";

const UserWebsiteEditComponent = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { refetchAllData } = useRefetchData();

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await refetchAllData();
      toast.success("All data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
          Edit User Website
        </h3>
        {/* <LoadingButton
          onClick={handleRefreshAll}
          loading={refreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh All Data
        </LoadingButton> */}
      </div>

      <Accordion
        type="single"
        defaultValue="item-1"
        collapsible
        className="w-full space-y-5"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-3 text-lg">
            <div className="cover flex items-center gap-2">
              <Icon icon="heroicons:squares-plus" className="h-8 w-8" />
              Testimonials Slider
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SwiperSlides />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="py-3 text-lg">
            <div className="cover flex items-center gap-2">
              <Icon icon="heroicons:squares-plus" className="h-8 w-8" />
              Partner Banner
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <PartnerBannerPage />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="py-3 text-lg">
            <div className="cover flex items-center gap-2">
              <Icon icon="heroicons:squares-plus" className="h-8 w-8" />
              Contact Page Details
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ContactManagerPage />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default UserWebsiteEditComponent;
