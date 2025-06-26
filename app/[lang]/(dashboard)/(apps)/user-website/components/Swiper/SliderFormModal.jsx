// components/SliderFormModal.jsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import LoadingButton from "@/components/Shared/loading-button";

const SliderFormModal = ({
  open,
  onClose,
  onSave,
  initialData,
  loading = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setImageFile(null);
      setPreview(initialData.image);
    } else {
      setTitle("");
      setDescription("");
      setImageFile(null);
      setPreview(null);
    }
  }, [initialData, open]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const data = {
      id: initialData?.id,
      title,
      description,
      image: imageFile || preview,
    };

    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Review" : "Add New Review"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="text"
            placeholder="Review Title"
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
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!initialData} // Only required for new reviews
          />
          {preview && (
            <div className="cover h-[250px] w-full mt-4 overflow-y-auto rounded">
              <img
                src={preview?.src || preview}
                alt="Preview"
                className="w-full h-full rounded object-cover object-center"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton
              disabled={
                !title ||
                !description ||
                (!initialData && !imageFile) ||
                loading
              }
              type="submit"
              className="select-none"
              loading={loading}
            >
              {initialData
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                ? "Adding..."
                : "Add"}
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SliderFormModal;
