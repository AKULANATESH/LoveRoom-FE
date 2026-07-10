import type { RelationshipHomeData } from "../types";

export const relationshipHomeMock: RelationshipHomeData = {
  user: {
    id: "user-anjali",
    name: "Anjali",
  },
  partner: {
    id: "partner-aarav",
    name: "Aarav",
    mood: "MISSING_YOU",
    moodLabel: "Missing you",
    presence: {
      isOnline: true,
      lastActiveLabel: "Active now",
      currentActivity: "Looking at your last memory",
    },
  },
  relationship: {
    id: "rel-together-demo",
    daysTogether: 428,
    startedAtLabel: "Together since Apr 20, 2025",
    dailyPrompt: "Send one tiny reminder that they are loved today.",
  },
  milestones: [
    {
      id: "milestone-anniversary",
      title: "Anniversary",
      dateLabel: "Apr 20",
      daysUntil: 302,
    },
    {
      id: "milestone-first-trip",
      title: "First trip memory",
      dateLabel: "Aug 14",
      daysUntil: 53,
    },
  ],
  recentNotification: {
    id: "notification-kiss",
    title: "Aarav sent a kiss",
    body: "A small reminder that you are missed.",
    createdAtLabel: "2 min ago",
    isRead: false,
  },
};
