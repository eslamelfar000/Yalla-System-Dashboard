// components/PartnerBannerEditor.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/Shared/loading-button";

const PartnerBannerEditor = ({
  open,
  onClose,
  onSave,
  initialData,
  loading = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [partnerLogo, setPartnerLogo] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [partnerLogoPreview, setPartnerLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLogoPreview(initialData.logo || "");
      setPartnerLogoPreview(initialData.partner_logo || "");
      setBannerPreview(initialData.banner || "");
    } else {
      setTitle("");
      setDescription("");
      setLogoPreview("");
      setPartnerLogoPreview("");
      setBannerPreview("");
    }
  }, [initialData, open]);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const data = {
      title,
      description,
      logo: logo || logoPreview,
      partner_logo: partnerLogo || partnerLogoPreview,
      banner: bannerImage || bannerPreview,
    };

    await onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Edit Partner Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 grid">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            className="resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Our Logo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setLogo, setLogoPreview)}
              />
              {logoPreview && (
                <img
                  src={logoPreview?.src || logoPreview}
                  className="h-16 mt-2 rounded object-contain"
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
                  className="h-16 mt-2 rounded object-contain"
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
                className="h-[300px] mt-2 rounded object-contain w-full"
                alt="Banner Preview"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton type="submit" loading={loading}>
              Save
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerBannerEditor;
