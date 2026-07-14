import { useEffect, useState } from "react";
import { Eye, Mail, Trash2, X } from "lucide-react";
import { adminContactMessagesService } from "../services/adminContact.services";
import type { ContactMessage } from "@/types/contactMessage.types";
import { emitNotificationsChanged } from "@/common/utils/notificationEvents";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await adminContactMessagesService.getAll();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
  try {
    const updated = await adminContactMessagesService.markAsRead(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    emitNotificationsChanged();
  } catch (err) {
    console.error(err);
  }
};

  const handleDelete = async (id: number) => {
    try {
      await adminContactMessagesService.remove(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Subject</th>
            <th className="py-3 px-4">Preview</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id} className="border-b">
              <td className="py-3 px-4">{message.name}</td>
              <td className="py-3 px-4">{message.email}</td>
              <td className="py-3 px-4">{message.subject}</td>
              <td className="py-3 px-4 text-gray-500">
                {(message.message ?? "").slice(0, 40)}...
              </td>
              <td className="py-3 px-4">
                {message.is_read ? (
                  <span className="px-3 py-1 rounded-full text-sm border">
                    Read
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm bg-indigo-600 text-white">
                    New
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                {message.created_at
                  ? new Date(message.created_at).toLocaleDateString()
                  : "—"}
              </td>
              <td className="py-3 px-4 flex gap-3">
                <button title="View" onClick={() => handleView(message)}>
                  <Eye size={18} />
                </button>
                <button
                  title={message.is_read ? "Already read" : "Mark as read"}
                  onClick={() => handleMarkAsRead(message.id)}
                  disabled={message.is_read}
                  className={message.is_read ? "opacity-40 cursor-not-allowed" : ""}
                >
                  <Mail size={18} />
                </button>
                <button
                  title="Delete"
                  onClick={() => handleDelete(message.id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setSelectedMessage(null)}
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold mb-2">{selectedMessage.subject}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedMessage.name} &lt;{selectedMessage.email}&gt;
            </p>
            <p className="text-gray-700 whitespace-pre-wrap">
              {selectedMessage.message}
            </p>
          </div>
        </div>
      )}
    </>
  );
}