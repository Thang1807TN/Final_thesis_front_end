import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import chatApi from "../../api/chatApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ChatBox from "../../components/chat/ChatBox";
import useToast from "../../hooks/useToast";

function InboxPage() {
  const toast = useToast();
  const location = useLocation();

  const targetConversationId = useMemo(
    () => location.state?.conversationId || null,
    [location.state],
  );

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadConversations = async (preferredConversationId = null) => {
    try {
      const response = await chatApi.getMyConversations();
      const conversationList = response.data || [];

      setConversations(conversationList);

      if (!conversationList.length) {
        setSelectedConversation(null);
        return;
      }

      if (preferredConversationId) {
        const matched = conversationList.find(
          (item) => item.id === preferredConversationId,
        );
        if (matched) {
          setSelectedConversation(matched);
          return;
        }
      }

      setSelectedConversation((prev) => {
        if (!prev) return conversationList[0];
        const stillExists = conversationList.find(
          (item) => item.id === prev.id,
        );
        return stillExists || conversationList[0];
      });
    } catch (error) {
      toast.error("Load failed", "Could not load conversations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations(targetConversationId);
  }, [targetConversationId]);

  const handleConversationUpdated = async (conversationId) => {
    try {
      const response = await chatApi.getMyConversations();
      const conversationList = response.data || [];
      setConversations(conversationList);

      const matched = conversationList.find(
        (item) => item.id === conversationId,
      );
      if (matched) {
        setSelectedConversation(matched);
      }
    } catch {
      // silent refresh
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        {loading ? (
          <Loader text="Loading inbox..." />
        ) : (
          <section className="page-shell">
            <div className="container">
              <h1 className="page-title">Inbox</h1>
              <p className="page-subtitle">
                Communicate with buyers and sellers about product listings.
              </p>

              {conversations.length === 0 ? (
                <EmptyState
                  title="No conversations yet"
                  description="Start by messaging a seller from a product detail page."
                />
              ) : (
                <div className="chat-layout">
                  <div className="chat-sidebar card">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`chat-sidebar-item ${
                          selectedConversation?.id === conversation.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="chat-sidebar-title">
                          {conversation.productTitle}
                        </div>
                        <div className="chat-sidebar-preview">
                          {conversation.lastMessagePreview || "No messages yet"}
                        </div>

                        {conversation.unreadCount > 0 && (
                          <span className="chat-unread-badge">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="chat-main">
                    {selectedConversation && (
                      <ChatBox
                        conversation={selectedConversation}
                        onConversationUpdated={handleConversationUpdated}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </MainLayout>
    </ProtectedRoute>
  );
}

export default InboxPage;
