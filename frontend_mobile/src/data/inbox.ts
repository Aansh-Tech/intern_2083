import type { InboxMessage } from "../types/inbox";

export const seedMessages: InboxMessage[] = [
  {
    id: "inbox-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@gmail.com",
    subject: "Portfolio Collaboration",
    message:
      "Hi, I came across your portfolio and I'm really impressed by your work, especially the Nebula Design System. I'm working on something similar and would love to collaborate on a few open-source components. Let me know if you're interested!",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
  },
  {
    id: "inbox-2",
    name: "Marcus Aurelius",
    email: "marcus.aurelius@gmail.com",
    subject: "Speaking Opportunity",
    message:
      "Greetings. I am organizing a design systems conference in Rome and would like to invite you as a speaker. Your work on token-driven design aligns well with our theme. Please let me know if you'd be available in October.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
  },
  {
    id: "inbox-3",
    name: "Lena Khatri",
    email: "lena.khatri@gmail.com",
    subject: "Freelance Project Inquiry",
    message:
      "Hey! We're a small startup based in Berlin looking for a React Native developer to help build our MVP. Your Aura Mobile project looks exactly like the quality we need. Would you be open to a quick call this week?",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
  },
  {
    id: "inbox-4",
    name: "John Smith",
    email: "john.smith@gmail.com",
    subject: "Thank You",
    message:
      "Just wanted to say thank you for the insightful blog post on design tokens. I've been implementing your approach in our design system at Acme Corp and it's been a game changer. Really appreciate you sharing your knowledge.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    isRead: true,
  },
];
