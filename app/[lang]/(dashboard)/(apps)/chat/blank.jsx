"use client";
import { Icon } from "@iconify/react";

const Blank = ({ mblChatHandler }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <Icon
          icon="uiw:message"
          className="text-6xl text-muted-foreground mx-auto"
        />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">
            No message yet...
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Select a chat from the sidebar to start a conversation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blank;
