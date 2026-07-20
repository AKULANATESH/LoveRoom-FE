export type SoloPageKey = "home" | "chat" | "calendar" | "location" | "menu";

export const soloModeCopy: Record<
  SoloPageKey,
  { title: string; description: string; hint?: string }
> = {
  home: {
    title: "Room for two. Occupancy: you.",
    description:
      "The candles are lit, the playlist is ready, and the second chair is doing interpretive dance with emptiness.",
    hint: "Invite someone before the furniture files a complaint.",
  },
  chat: {
    title: "Echo chamber, premium edition",
    description:
      "Messages sent here currently bounce off the void and return as unsolicited life advice from your own brain.",
    hint: "A partner turns this into actual conversation. Revolutionary.",
  },
  calendar: {
    title: "Dates with destiny (TBD)",
    description:
      "Your shared calendar is a blank canvas. Very minimalist. Very 'we'll figure it out later.'",
    hint: "Connect with someone to start blocking out moments worth remembering.",
  },
  location: {
    title: "You are here. They are… elsewhere?",
    description:
      "Live location works best when there are two dots on the map. Right now it's a solo expedition.",
    hint: "Invite your person to share the journey — or at least the pin.",
  },
  menu: {
    title: "Flying solo",
    description: "Full app access. Zero partner. Maximum cryptic energy.",
  },
};
