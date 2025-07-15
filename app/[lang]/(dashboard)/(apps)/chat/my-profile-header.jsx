import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserData } from "@/lib/auth-utils";
import { getAvailableUsers } from "./chat-config";

const MyProfileHeader = ({ profile, onCreateChat, isLoading }) => {
  const userData = getUserData();
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (isCreateChatOpen) {
      loadAvailableUsers();
    }
  }, [isCreateChatOpen]);

  const loadAvailableUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await getAvailableUsers();
      if (response.success && response.data) {
        setAvailableUsers(response.data);
      }
    } catch (error) {
      console.error("Error loading available users:", error);
      // Fallback to mock data if API fails
      setAvailableUsers([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com" },
      ]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateChat = () => {
    if (selectedUser) {
      onCreateChat?.({
        user_id: selectedUser,
      });
      setIsCreateChatOpen(false);
      setSelectedUser("");
    }
  };

  const handleCancel = () => {
    setIsCreateChatOpen(false);
    setSelectedUser("");
  };

  console.log(userData, "userData from localStorage");

  return (
    <div className="space-y-4">
      {/* Profile Section */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userData?.image} alt={userData?.name} />
          <AvatarFallback className="text-sm">
            {userData?.name?.slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {profile?.fullName || userData?.name || "User"}
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {profile?.bio || "Online"}
          </p>
        </div>
      </div>

      {/* Create Chat Button */}
      <div className="flex items-center gap-2">
        <Dialog open={isCreateChatOpen} onOpenChange={setIsCreateChatOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
              <Icon icon="heroicons:user-plus" className="w-4 h-4 mr-1" />
              Create Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chat</DialogTitle>
              <DialogDescription>
                Start a new conversation with someone
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user">Select User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        usersLoading
                          ? "Loading users..."
                          : "Choose a user to chat with"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {usersLoading ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Loading users...
                      </div>
                    ) : availableUsers.length > 0 ? (
                      availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {user.name?.slice(0, 2) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">
                                {user.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        No users available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateChat}
                disabled={!selectedUser || isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon
                      icon="heroicons:arrow-path"
                      className="w-4 h-4 mr-2 animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  "Create Chat"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyProfileHeader;
