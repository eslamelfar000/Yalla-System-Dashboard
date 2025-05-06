// components/SwiperItemCard.jsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const SwiperItemCard = ({ slider, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden relative shadow-lg">
      <img
        src={slider?.image?.src || slider?.image}
        alt={slider?.title}
        className="w-full h-70 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-md font-semibold">{slider.title}</h2>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className=" h-7 w-7"
              color="primary"
              title="Edit"
              onClick={onEdit}
            >
              <Icon icon="heroicons:pencil-square" className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className=" h-7 w-7"
              color="destructive"
              title="Delete"
              onClick={onDelete}
            >
              <Icon icon="heroicons:trash" className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-default-600">{slider.description}</p>
      </CardContent>
    </Card>
  );
};

export default SwiperItemCard;
