export type SoloPageKey = "home" | "chat" | "calendar" | "location" | "menu";

export const soloModeCopy: Record<
  SoloPageKey,
  { title: string; description: string; hint?: string }
> = {
  home: {
    title: "Room for two. Ippudu neevu matrame.",
    description:
      "Lights on, vibe set, second chair empty — full solo scene ra, partner ledu, drama kuda ledu.",
    hint: "Oka partner ni invite chey, lekapothe room kuda bore aipotundi babu.",
  },
  chat: {
    title: "Solo chat mode — echo hi echo",
    description:
      "Ikkada message pettina reply nee brain nunchi vastundi. Actual chat ki partner kavali ra.",
    hint: "Partner add cheste ee echo chamber close aipotundi — simple.",
  },
  calendar: {
    title: "Plans? Inka pending eh",
    description: "Shared calendar ippudu blank — chala fresh, chala 'tarvata chuddam' type.",
    hint: "Partner connect ayyaka dates and plans proper ga set cheyochu.",
  },
  location: {
    title: "Nuvvu ikkada. Vaadu ekkada?",
    description:
      "Live location ki iddaru kavali. Ippudu map lo nee pin matrame — solo trip vibes ra.",
    hint: "Nee person ni invite chey, location share cheyadam easy avtundi.",
  },
  menu: {
    title: "Flying solo",
    description: "Motham app open. Partner zero. Full masti mode babu.",
  },
};
