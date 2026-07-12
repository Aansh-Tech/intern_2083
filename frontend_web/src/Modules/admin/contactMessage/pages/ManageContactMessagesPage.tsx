import { useEffect, useState } from "react";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { formatDate } from "@/common/utils/formatDate";
import { getErrorMessage } from "@/common/utils/getErrorMessage";
import { adminContactService } from "@/Modules/admin/contact/services/adminContact.services";
import type { ContactMessage } from "@/types/contactMessage.types";

export function ManageContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMessages() {
    setIsLoading(true);
    setError(null);
    try {
      setMessages(await adminContactService.getAll());
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
      await adminContactService.delete(message.id);
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
    } catch (err) {
      alert(getErrorMessage(err, "Failed to delete message."));
    }
  }

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
          { header: "Received", accessor: (m) => formatDate(m.created_at) },
        ]}
        rows={messages}
        keyExtractor={(m) => m.id}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="No messages yet."
      />
    </div>
  );
}