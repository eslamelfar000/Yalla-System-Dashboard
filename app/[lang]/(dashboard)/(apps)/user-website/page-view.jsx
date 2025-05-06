"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@iconify/react";
import SwiperSlides from "./components/Swiper/swiper-dashboard";
import PartnerBannerPage from "./components/PartnerBanner/show";
import ContactManagerPage from "./components/ContactDetails/ShowPage";

const UserWebsiteEditComponent = () => {
  return (
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
            Swiper Slides
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
  );
};

export default UserWebsiteEditComponent;
