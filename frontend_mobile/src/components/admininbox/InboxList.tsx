import { memo, useCallback } from "react";
import { FlatList } from "react-native";
import MessageCard from "./MessageCard";
import type { InboxMessage } from "../../types/inbox";

interface InboxListProps {
  messages: InboxMessage[];
  onMessagePress: (message: InboxMessage) => void;
}

function InboxList({ messages, onMessagePress }: InboxListProps) {
  const renderItem = useCallback(
    ({ item }: { item: InboxMessage }) => (
      <MessageCard message={item} onPress={onMessagePress} />
    ),
    [onMessagePress]
  );

  const keyExtractor = useCallback((item: InboxMessage) => item.id, []);

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerClassName="px-5 pt-4 pb-8 gap-4"
      scrollEnabled={false}
    />
  );
}

export default memo(InboxList);
