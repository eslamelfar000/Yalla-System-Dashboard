"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import ContactList from "./contact-list";
import { useState } from "react";
import Blank from "./blank";
import MessageHeader from "./message-header";
import MessageFooter from "./message-footer";

import Messages from "./messages";
import {
  getAllChats,
  getChatMessages,
  getChatInfo,
  getUserProfile,
  sendMessage,
  deleteChatMessage,
  markMessagesAsRead,
} from "./chat-config";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyProfileHeader from "./my-profile-header";
import Loader from "./loader";
import { isObjectNotEmpty } from "@/lib/utils";
import ContactInfo from "./contact-info";
import { useAuth } from "@/hooks/use-auth";

const ChatPage = () => {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const queryClient = useQueryClient();

  // Get user role for API calls
  const userRole = user?.role || null;

  // Memoize getMessages using useCallback with user role
  const getMessagesCallback = useCallback(
    (chatId, page) => getChatMessages(chatId, page, userRole),
    [userRole]
  );

  // reply state
  const [replay, setReply] = useState(false);
  const [replayData, setReplyData] = useState({});

  // ===== REAL-TIME POLLING CONFIGURATION =====
  // All queries are configured with 5-second polling intervals
  // This creates a real-time-like experience without WebSocket complexity

  // Get all chats with 5-second polling
  // This ensures the chat list stays updated with new messages and unread counts
  const { isLoading: chatsLoading, data: chatsData } = useQuery({
    queryKey: ["chats", userRole],
    queryFn: () => {
      console.log("🔄 Polling chats...");
      return getAllChats(1, userRole);
    },
    keepPreviousData: true,
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true, // Continue polling even when tab is not active
  });

  // Get chat messages with 5-second polling when chat is open
  // Only polls when a chat is selected to avoid unnecessary API calls
  const { isLoading: messageLoading, data: messagesData } = useQuery({
    queryKey: ["messages", selectedChatId, userRole],
    queryFn: () => {
      console.log("🔄 Polling messages for chat:", selectedChatId);
      return getMessagesCallback(selectedChatId, 1);
    },
    enabled: !!selectedChatId,
    keepPreviousData: true,
    refetchInterval: selectedChatId ? 5000 : false, // Only poll when chat is open
    refetchIntervalInBackground: true,
  });

  // Get chat info with 5-second polling when chat is open
  // Updates chat information like participant status, etc.
  const { isLoading: chatInfoLoading, data: chatInfoData } = useQuery({
    queryKey: ["chatInfo", selectedChatId, userRole],
    queryFn: () => {
      console.log("🔄 Polling chat info for chat:", selectedChatId);
      return getChatInfo(selectedChatId, userRole);
    },
    enabled: !!selectedChatId,
    keepPreviousData: true,
    refetchInterval: selectedChatId ? 5000 : false, // Only poll when chat is open
    refetchIntervalInBackground: true,
  });

  // Get user profile (no polling needed for profile)
  const { isLoading: profileLoading, data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getUserProfile(),
    keepPreviousData: true,
  });

  const messageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", selectedChatId]);
      queryClient.invalidateQueries(["chats"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", selectedChatId]);
    },
  });

  const onDelete = (messageId) => {
    deleteMutation.mutate(messageId);
  };

  const openChat = (chatId) => {
    setSelectedChatId(chatId);
    setReply(false);

    // Mark messages as read when opening a chat
    markMessagesAsReadCallback(chatId);
  };

  // ===== READ/UNREAD MESSAGE HANDLING =====
  // Messages are considered unread if read_at is null
  // This function marks all messages in a chat as read
  const markMessagesAsReadCallback = useCallback(
    async (chatId) => {
      if (!chatId || !userRole) return;

      try {
        // Call the API to mark messages as read
        await markMessagesAsRead(chatId, userRole);
        // Refresh the data after marking as read
        queryClient.invalidateQueries(["messages", chatId]);
        queryClient.invalidateQueries(["chats"]);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    },
    [queryClient, userRole]
  );

  const handleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleSendMessage = (messageData) => {
    if (!selectedChatId) return;

    // Handle both old string format and new object format
    let messageText = "";
    let attachments = [];

    if (typeof messageData === "string") {
      // Old format - just text
      messageText = messageData;
    } else if (typeof messageData === "object") {
      // New format - object with message and attachments
      messageText = messageData.message || "";
      attachments = messageData.attachments || [];
    }

    if (!messageText.trim() && attachments.length === 0) return;

    const newMessage = {
      chat_id: selectedChatId,
      message: messageText,
      time: messageData.time || new Date().toISOString(),
      replayMetadata:
        messageData.replayMetadata || isObjectNotEmpty(replayData),
      attachments: attachments,
    };

    messageMutation.mutate(newMessage);
  };

  const chatHeightRef = useRef(null);

  // replay message
  const handleReply = (data, contact) => {
    const newObj = {
      message: data,
      contact,
    };
    setReply(true);
    setReplyData(newObj);
  };

  const chats = chatsData?.data || [];
  const messages = messagesData?.data || [];
  const chatInfo = chatInfoData?.data || {};
  const profile = profileData?.data || {};

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, handleSendMessage, chatsData]);

  // ===== AUTO-MARK AS READ =====
  // Automatically mark messages as read when:
  // 1. User opens a chat (handled in openChat function)
  // 2. New messages arrive while chat is open
  useEffect(() => {
    if (selectedChatId && messages.length > 0) {
      // Check if there are unread messages (messages without read_at)
      const hasUnreadMessages = messages.some((message) => !message.read_at);
      if (hasUnreadMessages) {
        markMessagesAsReadCallback(selectedChatId);
      }
    }
  }, [selectedChatId, messages, markMessagesAsReadCallback]);

  return (
    <div className="h-[calc(100vh-250px)] flex flex-col lg:flex-row gap-5 overflow-hidden">
      {/* Contact List Sidebar */}
      <div className="w-full lg:w-80 xl:w-86 border-r border-border flex flex-col h-full">
        <Card className="h-full rounded-md border-0">
          <CardContent className="p-0 h-full flex flex-col">
            {/* User Profile Header */}
            <div className="p-4 border-b border-border flex-shrink-0">
              <MyProfileHeader profile={profile} />
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {chatsLoading ? (
                // Show skeleton loading for multiple chat items
                Array.from({ length: 4 }).map((_, index) => (
                  <ContactList
                    key={`skeleton-${index}`}
                    contact={{}}
                    openChat={() => {}}
                    selectedChatId={null}
                    isLoading={true}
                  />
                ))
              ) : chats.length > 0 ? (
                chats.map((chat) => (
                  <ContactList
                    key={chat.id}
                    contact={chat}
                    openChat={openChat}
                    selectedChatId={selectedChatId}
                    isLoading={false}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No chats available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col h-full">
        <Card className="h-full rounded-md border-0">
          <CardContent className="p-0 h-full flex flex-col">
            {selectedChatId ? (
              <>
                {/* Message Header */}
                <MessageHeader
                  contact={chatInfo}
                  handleShowInfo={handleShowInfo}
                  showInfo={showInfo}
                  isPolling={!!selectedChatId}
                />

                {/* Messages Area */}
                <div className="flex-1 relative overflow-hidden min-h-0">
                  {messageLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader />
                    </div>
                  ) : (
                    <Messages
                      messages={messages}
                      selectedChatId={selectedChatId}
                      onDelete={onDelete}
                      handleReply={handleReply}
                      chatHeightRef={chatHeightRef}
                      chatInfo={chatInfo}
                    />
                  )}
                </div>

                {/* Message Footer - Only show for teachers, admin can only view */}
                {userRole === "teacher" && (
                  <MessageFooter
                    handleSendMessage={handleSendMessage}
                    replay={replay}
                    setReply={setReply}
                    replayData={replayData}
                    setReplyData={setReplyData}
                    isSending={messageMutation.isPending}
                  />
                )}
              </>
            ) : (
              <Blank />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Info Sidebar */}
      {showInfo && selectedChatId && (
        <div className="hidden xl:block w-80 border-l border-border h-full">
          <ContactInfo
            contact={chatInfo}
            handleShowInfo={handleShowInfo}
            showInfo={showInfo}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
