// components/SwiperDashboard.jsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SliderFormModal from "./SliderFormModal";
import SwiperItemCard from "./SwiperItemCard";
import image1 from "@/public/images/avatar/avatar-1.jpg";
import image2 from "@/public/images/avatar/avatar-2.jpg";
import image3 from "@/public/images/avatar/avatar-3.jpg";

function SwiperDashboard() {
  // Swiper Slider Component
  const [sliders, setSliders] = useState([
    {
      id: 1,
      title: "Slider 1",
      image: image1,
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
    },
    {
      id: 2,
      title: "Slider 2",
      image: image2,
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
    },
    {
      id: 3,
      title: "Slider 3",
      image: image3,
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
    },
    {
      id: 4,
      title: "Slider 2",
      image: image2,
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
    },
  ]);

  const [editing, setEditing] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const addOrUpdateSlider = (slider) => {
    if (slider.id) {
      setSliders((prev) =>
        prev.map((item) => (item.id === slider.id ? slider : item))
      );
    } else {
      setSliders((prev) => [...prev, { ...slider, id: Date.now() }]);
    }
    setOpenModal(false);
  };

  const deleteSlider = (id) => {
    setSliders((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Swiper Dashboard</h1>
          <div className="space-x-2">
            <Button
              onClick={() => {
                setEditing(null);
                setOpenModal(true);
              }}
            >
              Add New Slider
            </Button>
            <Button disabled={sliders.length === 4}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sliders.map((slider) => (
            <SwiperItemCard
              key={slider.id}
              slider={slider}
              onEdit={() => {
                setEditing(slider);
                setOpenModal(true);
              }}
              onDelete={() => deleteSlider(slider.id)}
            />
          ))}
        </div>

        <SliderFormModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={addOrUpdateSlider}
          initialData={editing}
        />
      </div>
    </div>
  );
}

export default SwiperDashboard;
