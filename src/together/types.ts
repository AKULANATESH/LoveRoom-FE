export type MoodType = "HAPPY" | "SAD" | "EXCITED" | "STRESSED" | "MISSING_YOU" | "SLEEPY";

export type EmotionalActionType = "HUG" | "KISS" | "MISS_YOU" | "THINKING_OF_YOU";

export interface PartnerPresence {
  isOnline: boolean;
  lastActiveLabel: string;
  currentActivity: string;
}

export interface Partner {
  id: string;
  name: string;
  avatarUrl?: string;
  mood: MoodType;
  moodLabel: string;
  presence: PartnerPresence;
}

export interface Milestone {
  id: string;
  title: string;
  dateLabel: string;
  daysUntil?: number;
}

export interface RelationshipHomeData {
  user: {
    id: string;
    name: string;
  };
  partner: Partner;
  relationship: {
    id: string;
    daysTogether: number;
    startedAtLabel: string;
    dailyPrompt: string;
  };
  milestones: Milestone[];
  recentNotification: NotificationItem | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAtLabel: string;
  isRead: boolean;
}

export interface SendEmotionalActionRequest {
  type: EmotionalActionType;
  message?: string;
}

export interface ShareMoodRequest {
  mood: MoodType;
  note?: string;
}

export type PartnerActivityKind = "ACTION" | "MOOD";

export interface PartnerActivityActionItem {
  id: string;
  kind: "ACTION";
  actionType: EmotionalActionType;
  label: string;
  message?: string;
  createdAtLabel: string;
}

export interface PartnerActivityMoodItem {
  id: string;
  kind: "MOOD";
  mood: MoodType;
  moodLabel: string;
  note?: string;
  createdAtLabel: string;
}

export type PartnerActivityItem = PartnerActivityActionItem | PartnerActivityMoodItem;

export interface PartnerActivityFeed {
  partnerName: string;
  items: PartnerActivityItem[];
  emotionStats: EmotionStats;
}

export interface EmotionStats {
  partnerSent: number;
  mySent: number;
  total: number;
  partnerActions: number;
  myActions: number;
  partnerMoods: number;
  myMoods: number;
}

export interface ContactStreak {
  current: number;
  longest: number;
  label: string;
}

export interface HourlyTouchSlot {
  hour: number;
  hourLabel: string;
  mine: boolean;
  partner: boolean;
  both: boolean;
}

export interface LiveLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  locationLabel?: string;
  isSharing: boolean;
  isLive: boolean;
  updatedAtLabel: string;
  mapUrl: string;
}

export interface MyLocationStatus {
  isSharing: boolean;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  locationLabel?: string;
  isLive?: boolean;
  updatedAtLabel?: string;
  mapUrl?: string;
}

export interface ConnectionAwarenessData {
  streak: ContactStreak;
  daytimeHours: number[];
  hourlyTouches: HourlyTouchSlot[];
  myLocation: MyLocationStatus;
  partnerLocation: LiveLocation | null;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  daysUntil: number;
  location?: string;
  note?: string;
}

export interface CreateCalendarEventRequest {
  title: string;
  date: string;
  location?: string;
  note?: string;
}

export interface UpdateLocationRequest {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  isSharing: boolean;
  locationLabel?: string;
}

export interface RecordHourlyTouchRequest {
  hour?: number;
}
