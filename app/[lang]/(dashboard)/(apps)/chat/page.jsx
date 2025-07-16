"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";

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
} from "./chat-config";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyProfileHeader from "./my-profile-header";
import EmptyMessage from "./empty-message";
import Loader from "./loader";
import { isObjectNotEmpty } from "@/lib/utils";
import ContactInfo from "./contact-info";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const ChatPage = () => {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showContactSidebar, setShowContactSidebar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);

  const queryClient = useQueryClient();

  // Memoize getMessages using useCallback
  const getMessagesCallback = useCallback(
    (chatId, page) => getChatMessages(chatId, page),
    []
  );

  // reply state
  const [replay, setReply] = useState(false);
  const [replayData, setReplyData] = useState({});

  // Get all chats
  const {
    isLoading: chatsLoading,
    isError: chatsError,
    data: chatsData,
    error: chatsErrorData,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ["chats", currentPage],
    queryFn: () => getAllChats(currentPage),
    keepPreviousData: true,
  });

  // Get chat messages
  const {
    isLoading: messageLoading,
    isError: messageIsError,
    data: messagesData,
    error: messageError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", selectedChatId, messagePage],
    queryFn: () => getMessagesCallback(selectedChatId, messagePage),
    enabled: !!selectedChatId,
    keepPreviousData: true,
  });

  // Get chat info
  const {
    isLoading: chatInfoLoading,
    isError: chatInfoError,
    data: chatInfoData,
    error: chatInfoErrorData,
    refetch: refetchChatInfo,
  } = useQuery({
    queryKey: ["chatInfo", selectedChatId],
    queryFn: () => getChatInfo(selectedChatId),
    enabled: !!selectedChatId,
    keepPreviousData: true,
  });

  // Get user profile
  const {
    isLoading: profileLoading,
    isError: profileIsError,
    data: profileData,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
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
    setMessagePage(1); // Reset to first page when opening new chat
    setReply(false);
    if (showContactSidebar) {
      setShowContactSidebar(false);
    }
  };

  const handleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleSendMessage = (message) => {
    if (!selectedChatId || !message) return;

    const newMessage = {
      chat_id: selectedChatId,
      message: message,
      time: new Date().toISOString(),
      replayMetadata: isObjectNotEmpty(replayData),
    };
    messageMutation.mutate(newMessage);
    console.log(message, "ami msg");
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

  const isMobile = useMediaQuery("(max-width: 768px)");

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
                    />
                  )}
                </div>

                {/* Message Footer */}
                {user?.role === "teacher" && (
                <MessageFooter
                  handleSendMessage={handleSendMessage}
                  replay={replay}
                  setReply={setReply}
                  replayData={replayData}
                    setReplyData={setReplyData}
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
