import { memo, useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import MessageCard from "./MessageCard";
import type { InboxMessage } from "../../types/inbox";
import { useResponsiveContainer } from "../../utils/responsive";

interface InboxListProps {
  messages: InboxMessage[];
  onMessagePress: (message: InboxMessage) => void;
}

function InboxList({ messages, onMessagePress }: InboxListProps) {
  const container = useResponsiveContainer();

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
      contentContainerStyle={[styles.content, container]}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
});

export default memo(InboxList);
