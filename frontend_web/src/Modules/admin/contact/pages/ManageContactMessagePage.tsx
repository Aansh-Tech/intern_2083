import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "@/Modules/admin/components/AdminModal";
import { formatDate } from "@/common/utils/formatDate";
import { getErrorMessage } from "@/common/utils/getErrorMessage";
import { adminContactMessagesService } from "@/Modules/admin/contact/services/adminContact.services";
import type { ContactMessage } from "@/types/contactMessage.types";

export function ManageContactMessagesPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  async function loadMessages() {
    setIsLoading(true);
    setError(null);
    try {
      setMessages(await adminContactMessagesService.getAll());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load messages."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleDelete(message: ContactMessage) {
    if (!confirm(`Delete message from "${message.name}"?`)) return;
    try {
      await adminContactMessagesService.remove(message.id);
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
    } catch (err) {
      alert(getErrorMessage(err, "Failed to delete message."));
    }
  }

  const filteredMessages = messages.filter((m) =>
    String(m.name ?? "").toLowerCase().includes(query) ||
    String(m.email ?? "").toLowerCase().includes(query) ||
    String(m.subject ?? "").toLowerCase().includes(query)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
      <p className="text-muted-foreground mt-1 mb-6">Messages submitted through your contact form.</p>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <AdminTable
        columns={[
          { header: "Name", accessor: (m) => m.name },
          { header: "Email", accessor: (m) => m.email },
          { header: "Subject", accessor: (m) => m.subject ?? "—" },
          { header: "Received", accessor: (m) => (m.created_at ? formatDate(m.created_at) : "—") },
          {
            header: "View",
            accessor: (m) => (
              <button
                onClick={() => setViewingMessage(m)}
                aria-label="View message"
                className="text-slate-500 hover:text-indigo-600"
              >
                <Eye className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        rows={filteredMessages}
        keyExtractor={(m) => m.id}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="No messages yet."
      />

      <AdminModal
        title={viewingMessage?.subject || "Message"}
        open={viewingMessage !== null}
        onClose={() => setViewingMessage(null)}
      >
        {viewingMessage && (
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-foreground">{viewingMessage.name}</p>
              <p className="text-sm text-muted-foreground">{viewingMessage.email}</p>
            </div>
            <div className="rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground">
              {viewingMessage.message}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setViewingMessage(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
              <Trash2
                onClick={() => {
                  if (viewingMessage) handleDelete(viewingMessage);
                  setViewingMessage(null);
                }}
                className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-600"
              />
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}