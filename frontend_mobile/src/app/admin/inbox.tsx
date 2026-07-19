import { useState, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import InboxHeader from "../../components/admininbox/InboxHeader";
import SearchBar from "../../components/admininbox/SearchBar";
import FilterTabs from "../../components/admininbox/FilterTabs";
import type { FilterValue } from "../../components/admininbox/FilterTabs";
import InboxList from "../../components/admininbox/InboxList";
import EmptyInbox from "../../components/admininbox/EmptyInbox";
import MessageModal from "../../components/admininbox/MessageModal";
import { useInbox } from "../../context/InboxContext";
import type { InboxMessage } from "../../types/inbox";

console.log = () => {};
console.info = () => {};
console.debug = () => {};
export default function AdminInboxScreen() {
  const { messages, loading, refreshing, refreshMessages, unreadCount, markAsRead, deleteMessage } = useInbox();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);

  useFocusEffect(
    useCallback(() => {
      refreshMessages();
    }, [refreshMessages])
  );

  const displayedMessages = useMemo(() => {
    let result = messages;

    if (filter === "new") {
      result = result.filter((m) => !m.isRead);
    } else if (filter === "read") {
      result = result.filter((m) => m.isRead);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q)
      );
    }

    return result;
  }, [messages, filter, searchQuery]);

  const handleMessagePress = useCallback(
    (msg: InboxMessage) => {
      setSelectedMessage(msg);
      if (!msg.isRead) {
        markAsRead(msg.id);
      }
    },
    [markAsRead]
  );

  const handleDone = useCallback(
    (id: string) => {
      markAsRead(id);
    },
    [markAsRead]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMessage(id);
    },
    [deleteMessage]
  );

  return (
    <AdminLayout refreshing={refreshing} onRefresh={refreshMessages}>
      <InboxHeader unreadCount={unreadCount} />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View className="pt-4">
        <FilterTabs value={filter} onChange={setFilter} />
      </View>
      {loading ? null : displayedMessages.length === 0 ? (
        <EmptyInbox />
      ) : (
        <InboxList messages={displayedMessages} onMessagePress={handleMessagePress} />
      )}
      <MessageModal
        message={selectedMessage}
        visible={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onDone={handleDone}
        onDelete={handleDelete}
      />
    </AdminLayout>
  );
}
