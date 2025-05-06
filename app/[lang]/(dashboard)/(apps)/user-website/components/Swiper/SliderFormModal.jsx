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

const SliderFormModal = ({ open, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
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
    if (!title || (!preview && !imageFile)) return;

    const data = {
      id: initialData?.id,
      title,
      description,
      image: imageFile ? URL.createObjectURL(imageFile) : preview, // generate URL from file
    };

    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Slider" : "Add New Slider"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="text"
            placeholder="Slider Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            className="resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <div className="cover h-[300px] w-full mt-4 overflow-y-auto rounded">
              <img
                src={preview?.src || preview}
                alt="Preview"
                className="w-full rounded object-cover"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={
                title === "" ||
                description === "" ||
                (!initialData ? imageFile === null : '') ||
                preview === null
              }
              type="submit"
              className="select-none"
            >
              {initialData ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SliderFormModal;
