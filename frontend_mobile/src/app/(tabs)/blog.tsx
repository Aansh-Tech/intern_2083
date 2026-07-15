import { useState, useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import Header from "../../components/homepage/Header";
import JournalHeader from "../../components/blog/BlogHeader";
import FeaturedPost from "../../components/blog/FeaturedPost";
import PostList from "../../components/blog/PostList";
import PostModal from "../../components/blog/PostModal";
import { useTheme } from "../../context/useTheme";

interface Post {
  id: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: string[];
  gradient: [string, string];
}

const posts: Post[] = [
  {
    id: "quiet-interfaces",
    category: "Design",
    date: "Oct 7, 2024",
    readTime: "6 min",
    title: "Designing for Quiet Interfaces",
    excerpt:
      "How restraint, negative space, and disciplined type scales create interfaces that respect their user's attention.",
    body: [
      "Most interfaces fail not because they lack features, but because they refuse to be quiet. Every panel wants to shout, every badge wants attention, every color wants to be the loudest thing on screen. The result is an interface that exhausts before it helps.",
      "Restraint is a design decision, not an absence of one. Choosing not to add a border, not to increase contrast, not to introduce a new color — these are just as deliberate as any addition. The best interfaces I've shipped came from repeatedly asking what could be removed rather than what could be added.",
      "Negative space isn't empty space. It's the room a user's eye needs to move between ideas without friction. When you compress that space to fit more on screen, you're not being efficient — you're borrowing clarity from tomorrow's redesign.",
      "A disciplined type scale does more heavy lifting than most people credit. Four or five sizes, used consistently, communicate hierarchy far better than a dozen sizes used loosely. Consistency reads as confidence; variation without purpose reads as noise.",
    ],
    gradient: ["#6366F1", "#3B82F6"],
  },
  {
    id: "design-system-quarter",
    category: "Design System",
    date: "Aug 21, 2024",
    readTime: "8 min",
    title: "Shipping a Design System in a Quarter",
    excerpt:
      "A pragmatic playbook for launching a token-driven system without pausing product work.",
    body: [
      "Design systems have a reputation for stalling product velocity while teams debate token names. That reputation is earned, but it isn't inevitable. Shipping ours in a single quarter meant treating the system as a byproduct of real screens, not a prerequisite for them.",
      "We started by auditing existing screens for repeated patterns rather than designing components in a vacuum. Anything used in three or more places became a candidate. This kept the system grounded in actual product needs instead of theoretical completeness.",
      "Tokens came before components. Color, spacing, and type scale were locked first, because every component decision downstream depended on them being stable. Changing a token later is cheap; changing forty components later is not.",
      "The system shipped alongside feature work, not before it. Every new component was built to solve a real screen's problem that same sprint, which kept the backlog honest and prevented the system from drifting into speculative generality.",
    ],
    gradient: ["#A855F7", "#EC4899"],
  },
  {
    id: "type-rules",
    category: "Typography",
    date: "Jul 30, 2024",
    readTime: "5 min",
    title: "Type Rules Worth Keeping",
    excerpt:
      "A short list of type rules that consistently earn their keep in dense product UIs.",
    body: [
      "Most typography advice is aesthetic preference dressed up as principle. These are the handful of rules that have actually held up across dense, data-heavy product interfaces.",
      "Line length matters more indoors than out. In a sidebar or table cell, short line lengths force awkward wraps. Give body text room to breathe, or drop to a smaller size before you let lines get too narrow.",
      "Tabular numbers are non-negotiable in any table or dashboard. Proportional digits shifting column widths as values change is a small thing that quietly erodes trust in the data.",
      "Weight does more work than size. Reaching for a heavier font weight to signal hierarchy is often more legible, and more space-efficient, than bumping font size in a dense layout.",
    ],
    gradient: ["#10B981", "#06B6D4"],
  },
  {
    id: "onboarding-notes",
    category: "Product",
    date: "Jun 12, 2024",
    readTime: "4 min",
    title: "Notes on Better Onboarding",
    excerpt:
      "Why the fastest onboarding flow is usually the one with the fewest decisions, not the fewest steps.",
    body: [
      "Teams optimizing onboarding tend to count steps, when they should be counting decisions. A five-step flow with obvious, low-stakes choices at each step will always outperform a two-step flow that asks the user to make one hard decision.",
      "The best onboarding flows I've built front-load the decisions that matter and default everything else. Ask for what's essential, infer or defer the rest, and let the user reach value before you ask for anything else.",
      "Progress indicators help less than people assume. What actually reduces drop-off is showing the user something real — their own data, a preview, a result — as early in the flow as possible.",
    ],
    gradient: ["#F97316", "#F43F5E"],
  },
];

export default function JournalScreen() {
  const { colors } = useTheme();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.resolve();
    setRefreshing(false);
  }, []);

  const openPost = (post: any) => {
    setSelectedPost(post as Post);
    setModalVisible(true);
  };

  const closePost = () => {
    setModalVisible(false);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="pb-10">
          <JournalHeader />
          <FeaturedPost post={posts[0]} onPress={() => openPost(posts[0])} />
          <PostList posts={posts.slice(1)} onSelectPost={openPost} />
        </View>
      </ScrollView>

      <PostModal post={selectedPost} visible={modalVisible} onClose={closePost} />
    </View>
  );
}