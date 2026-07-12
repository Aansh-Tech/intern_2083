import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { adminContactMessagesService } from "../services/adminContact.services";
import type { ContactMessage } from "../../../../types/contactMessage.types";

export function ManageContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    const data = await adminContactMessagesService.getAll();
    setMessages(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this message?")) return;
    await adminContactMessagesService.remove(id);
    loadMessages();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Contact Messages</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Messages submitted through the contact form.
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <AdminTable
            data={messages}
            keyExtractor={(m) => String(m.id)}
            emptyMessage="No messages yet."
            columns={[
              { header: "Name", render: (m) => m.name },
              { header: "Email", render: (m) => m.email },
              { header: "Subject", render: (m) => m.subject ?? "—" },
              {
                header: "Actions",
                render: (m) => (
                  <button onClick={() => handleDelete(m.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                  </button>
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}