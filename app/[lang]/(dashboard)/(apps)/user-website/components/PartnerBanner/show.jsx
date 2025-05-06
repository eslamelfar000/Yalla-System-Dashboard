"use client";

import { useState } from "react";
import PartnerBannerEditor from "./PartnerBannerEditor";
import PartnerBannerPreview from "./PartnerBannerPreview";
import { Button } from "@/components/ui/button";
import image1 from "@/public/images/card/card2.jpg";
import ourlogo from "@/public/yallalogo.png";
import partnerlogo from "@/public/images/all-img/book-1.png";


export default function PartnerBannerPage() {
  const [editorOpen, setEditorOpen] = useState(false);

  const [bannerData, setBannerData] = useState({
    title: "Official Collaboration",
    description:
      "We're proud to partner with TechCorp to bring you smarter solutions.",
    ourLogo: ourlogo, // make sure these exist in /public/images
    partnerLogo: partnerlogo,
    bannerImage: image1,
  });

  return (
    <div className="container py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Partner Banner</h1>
        <div className="flex gap-2">
          <Button onClick={() => setEditorOpen(true)}>Edit Banner</Button>
          <Button disabled={true} className="select-none">Save Changes</Button>
        </div>
      </div>

      <PartnerBannerPreview data={bannerData} />

      <PartnerBannerEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={(data) => {
          setBannerData(data);
          setEditorOpen(false);
        }}
        initialData={bannerData}
      />
    </div>
  );
}
