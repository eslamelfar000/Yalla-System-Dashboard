// components/PartnerBannerEditor.jsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const PartnerBannerEditor = ({ open, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [ourLogo, setOurLogo] = useState(null);
  const [partnerLogo, setPartnerLogo] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const [ourLogoPreview, setOurLogoPreview] = useState(
    initialData?.ourLogo || ""
  );
  const [partnerLogoPreview, setPartnerLogoPreview] = useState(
    initialData?.partnerLogo || ""
  );
  const [bannerPreview, setBannerPreview] = useState(
    initialData?.bannerImage || ""
  );

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !ourLogoPreview ||
      !partnerLogoPreview ||
      !bannerPreview
    )
      return;

    const data = {
      title,
      description,
      ourLogo: ourLogoPreview,
      partnerLogo: partnerLogoPreview,
      bannerImage: bannerPreview,
    };

    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Edit Partner Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            className="resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Our Logo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setOurLogo, setOurLogoPreview)
                }
              />
              {ourLogoPreview && (
                <img
                  src={ourLogoPreview?.src || ourLogoPreview}
                  className="h-16 mt-2 rounded"
                  alt="Our Logo Preview"
                />
              )}
            </div>

            <div>
              <label className="block font-medium">Partner Logo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setPartnerLogo, setPartnerLogoPreview)
                }
              />
              {partnerLogoPreview && (
                <img
                  src={partnerLogoPreview?.src || partnerLogoPreview}
                  className="h-16 mt-2 rounded"
                  alt="Partner Logo Preview"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block font-medium">Banner Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setBannerImage, setBannerPreview)
              }
            />
            {bannerPreview && (
              <img
                src={bannerPreview?.src || bannerPreview}
                className="h-32 mt-2 rounded object-cover"
                alt="Banner Preview"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerBannerEditor;
