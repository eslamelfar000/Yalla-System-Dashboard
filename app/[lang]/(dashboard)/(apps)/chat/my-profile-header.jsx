import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/lib/auth-utils";

const MyProfileHeader = ({ profile }) => {
  const { user } = getUserData();

  return (
    <>
      <div className="flex  justify-between mb-4">
        <div className="flex   gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image} alt="" />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          <div className="block">
            <div className="text-sm font-medium text-default-900 ">
              <span className="relative before:h-1.5 before:w-1.5 before:rounded-full before:bg-success before:absolute before:top-1.5 before:-right-3">
                {profile?.fullName}
              </span>
            </div>
            <span className="text-xs text-default-600">{profile?.bio}</span>
          </div>
        </div>
      </div>
      {/* search */}
      {/* <InputGroup merged className="hidden lg:flex">
        <InputGroupText>
          <Icon icon="heroicons:magnifying-glass" />
        </InputGroupText>
        <Input type="text" placeholder="Search by name" />
      </InputGroup> */}
      {/* actions */}
      <div className="hidden lg:flex flex-wrap justify-center py-4 border-b border-default-200">
        <Button className="flex flex-col items-center py-7 bg-transparent hover:bg-transparent text-default-600 w-full border border-default-600 rounded-lg">
          <span className="text-xl mb-1">
            <Icon icon="gala:chat" />
          </span>
          <span className="text-xs">Chats</span>
        </Button>
        {/* <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="material-symbols:group" />
          </span>
          <span className="text-xs">Groups</span>
        </Button>
        <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="ci:bell-ring" />
          </span>
          <span className="text-xs">Notification</span>
        </Button> */}
      </div>
    </>
  );
};

export default MyProfileHeader;
