import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import chatApi from "../../api/chatApi";
import useToast from "../../hooks/useToast";

function ChatBox({ conversation, onConversationUpdated }) {
  const { t } = useTranslation();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const pollingRef = useRef(null);
  const bottomRef = useRef(null);

  const loadMessages = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const response = await chatApi.getMessages(conversation.id);
      setMessages(response.data || []);

      if (onConversationUpdated) {
        await onConversationUpdated(conversation.id);
      }
    } catch (error) {
      if (!silent) {
        toast.error(
          t("toast.loadFailed", "Load failed"),
          t("chat.messagesLoadFailed", "Could not load messages."),
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!conversation?.id) return;

    loadMessages(false);

    pollingRef.current = setInterval(() => {
      loadMessages(true);
    }, 8000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [conversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMockAttachment = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    setAttachmentName(file.name);
    setAttachmentUrl(fakeUrl);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!content.trim() && !attachmentUrl) return;

    try {
      setSending(true);

      await chatApi.sendMessage(conversation.id, {
        content: content.trim(),
        attachmentName,
        attachmentUrl,
      });

      setContent("");
      setAttachmentName("");
      setAttachmentUrl("");
      await loadMessages(true);
    } catch (error) {
      toast.error(
        t("chat.sendFailed", "Send failed"),
        error.response?.data?.message ||
          t("chat.couldNotSendMessage", "Could not send message."),
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card chat-box">
      <div className="chat-box-header">
        <h3>{conversation.productTitle}</h3>
        <p className="muted">{conversation.otherUserName}</p>
      </div>

      <div className="chat-messages">
        {loading ? (
          <p className="muted">
            {t("chat.loadingMessages", "Loading messages...")}
          </p>
        ) : messages.length === 0 ? (
          <p className="muted">
            {t(
              "chat.noMessagesDescription",
              "No messages yet. Start the conversation.",
            )}
          </p>
        ) : (
          messages.map((message) => {
            const mine = message.senderId === currentUser?.id;

            return (
              <div
                key={message.id}
                className={`chat-bubble-row ${mine ? "mine" : ""}`}
              >
                <div className={`chat-bubble ${mine ? "mine" : ""}`}>
                  <strong>{message.senderName}</strong>

                  {message.content && <p>{message.content}</p>}

                  {message.attachmentUrl && (
                    <a
                      href={message.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="chat-attachment-link"
                    >
                      📎{" "}
                      {message.attachmentName ||
                        t("chat.attachment", "Attachment")}
                    </a>
                  )}

                  <small>{new Date(message.sentAt).toLocaleTimeString()}</small>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      <form className="chat-form" onSubmit={handleSend}>
        <label className="chat-attach-btn">
          📎
          <input type="file" hidden onChange={handleMockAttachment} />
        </label>

        <input
          className="input"
          placeholder={t("chat.typeMessage", "Type your message...")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? t("chat.sending", "Sending...") : t("chat.send", "Send")}
        </button>
      </form>

      {attachmentName && (
        <div className="chat-attachment-preview">
          {t("chat.selected", "Selected")}: {attachmentName}
        </div>
      )}
    </div>
  );
}

export default ChatBox;
