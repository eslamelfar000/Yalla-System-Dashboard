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
  createChat,
} from "./chat-config";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyProfileHeader from "./my-profile-header";
import EmptyMessage from "./empty-message";
import Loader from "./loader";
import { isObjectNotEmpty } from "@/lib/utils";
import SearchMessages from "./contact-info/search-messages";
import PinnedMessages from "./pin-messages";
import ForwardMessage from "./forward-message";
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

  // search state
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [pinnedMessages, setPinnedMessages] = useState([]);
  // Forward State
  const [isForward, setIsForward] = useState(false);

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

  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["chats"]);
      // If chat was created successfully, open it
      if (data.success && data.data?.id) {
        setSelectedChatId(data.data.id);
        setMessagePage(1);
      }
    },
  });

  const onDelete = (messageId) => {
    deleteMutation.mutate(messageId);

    // Remove the deleted message from pinnedMessages if it exists
    const updatedPinnedMessages = pinnedMessages.filter(
      (msg) => msg.messageId !== messageId
    );

    setPinnedMessages(updatedPinnedMessages);
  };

  const handleCreateChat = (chatData) => {
    createChatMutation.mutate(chatData);
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

  useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [handleSendMessage, chatsData]);

  useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [pinnedMessages]);

  // handle search bar
  const handleSetIsOpenSearch = () => {
    setIsOpenSearch(!isOpenSearch);
  };

  // handle pin note
  const handlePinMessage = (note) => {
    const updatedPinnedMessages = [...pinnedMessages];

    const existingIndex = updatedPinnedMessages.findIndex(
      (msg) => msg.note === note.note
    );

    if (existingIndex !== -1) {
      updatedPinnedMessages.splice(existingIndex, 1); // Remove the message
    } else {
      updatedPinnedMessages.push(note); // Add the message
    }

    setPinnedMessages(updatedPinnedMessages);
  };

  const handleUnpinMessage = (pinnedMessage) => {
    // Create a copy of the current pinned messages array
    const updatedPinnedMessages = [...pinnedMessages];

    // Find the index of the message to unpin in the updatedPinnedMessages array
    const index = updatedPinnedMessages.findIndex(
      (msg) =>
        msg.note === pinnedMessage.note && msg.avatar === pinnedMessage.avatar
    );

    if (index !== -1) {
      updatedPinnedMessages.splice(index, 1); // Remove the message
      setPinnedMessages(updatedPinnedMessages);
    }
  };

  const handleForward = () => {
    setIsForward(!isForward);
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  const chats = chatsData?.data || [];
  const messages = messagesData?.data || [];
  const chatInfo = chatInfoData?.data || {};
  const profile = profileData?.data || {};

  if (chatsLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen flex">
      {/* Contact List Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 border-r border-border flex flex-col">
        <Card className="h-full rounded-none border-0">
          <CardContent className="p-0 h-full flex flex-col">
            {/* User Profile Header */}
            <div className="p-4 border-b border-border">
              <MyProfileHeader
                profile={profile}
                onCreateChat={handleCreateChat}
                isLoading={createChatMutation.isLoading}
              />
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <ContactList
                    key={chat.id}
                    contact={chat}
                    openChat={openChat}
                    selectedChatId={selectedChatId}
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
      <div className="flex-1 flex flex-col">
        <Card className="h-full rounded-none border-0">
          <CardContent className="p-0 h-full flex flex-col">
            {selectedChatId ? (
              <>
                {/* Message Header */}
                <MessageHeader
                  contact={chatInfo}
                  handleShowInfo={handleShowInfo}
                  showInfo={showInfo}
                  handleSetIsOpenSearch={handleSetIsOpenSearch}
                  isOpenSearch={isOpenSearch}
                  handlePinMessage={handlePinMessage}
                  handleForward={handleForward}
                  isForward={isForward}
                />

                {/* Messages Area */}
                <div className="flex-1 relative overflow-hidden">
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
                      pinnedMessages={pinnedMessages}
                      handleUnpinMessage={handleUnpinMessage}
                      chatHeightRef={chatHeightRef}
                    />
                  )}
                </div>

                {/* Message Footer */}
                <MessageFooter
                  handleSendMessage={handleSendMessage}
                  replay={replay}
                  setReply={setReply}
                  replayData={replayData}
                  setReplyData={setReplyData}
                />
              </>
            ) : (
              <Blank />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Info Sidebar */}
      {showInfo && selectedChatId && (
        <div className="w-80 border-l border-border">
          <ContactInfo
            contact={chatInfo}
            handleShowInfo={handleShowInfo}
            showInfo={showInfo}
          />
        </div>
      )}

      {/* Search Messages */}
      {isOpenSearch && (
        <SearchMessages
          handleSetIsOpenSearch={handleSetIsOpenSearch}
          isOpenSearch={isOpenSearch}
        />
      )}

      {/* Pinned Messages */}
      {pinnedMessages.length > 0 && (
        <PinnedMessages
          pinnedMessages={pinnedMessages}
          handleUnpinMessage={handleUnpinMessage}
        />
      )}

      {/* Forward Message */}
      {isForward && (
        <ForwardMessage handleForward={handleForward} isForward={isForward} />
      )}
    </div>
  );
};

export default ChatPage;
