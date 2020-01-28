export const ReportReason = {
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  NUDITY: 'nudity',
  VIOLENCE: 'violence',
  FALSE_NEWS: 'falsenews',
  TERRORISM: 'terrorism',
  BREAKS_COMMUNITY_RULES: 'breakscommunityrules',
  HATE_SPEECH: 'hatespeech',
  UNAUTHORIZED_SALES: 'unauthorizedsales',
  ATTEMPT_TO_ABUSE: 'abuse',
  OTHER: 'other',
};

export const ReportDescription = {
  [ReportReason.SPAM]: 'Spam',
  [ReportReason.HARASSMENT]: 'Harassment',
  [ReportReason.NUDITY]: 'Nudity',
  [ReportReason.VIOLENCE]: 'Violence',
  [ReportReason.FALSE_NEWS]: 'False news',
  [ReportReason.TERRORISM]: 'Terrorism',
  [ReportReason.BREAKS_COMMUNITY_RULES]: 'It breaks community rules',
  [ReportReason.HATE_SPEECH]: 'Hate speech',
  [ReportReason.UNAUTHORIZED_SALES]: 'Unauthorized sales',
  [ReportReason.ATTEMPT_TO_ABUSE]: 'Attempt to abuse',
};

export const reportReasons = [
  {
    id: ReportReason.SPAM,
    desc: 'Spam',
  },
  {
    id: ReportReason.HARASSMENT,
    desc: 'Harassment',
  },
  {
    id: ReportReason.NUDITY,
    desc: 'Nudity',
  },
  {
    id: ReportReason.VIOLENCE,
    desc: 'Violence',
  },
  {
    id: ReportReason.FALSE_NEWS,
    desc: 'False News',
  },
  {
    id: ReportReason.TERRORISM,
    desc: 'Terrorism',
  },
  {
    id: ReportReason.BREAKS_COMMUNITY_RULES,
    desc: 'It breaks community rules',
  },
  {
    id: ReportReason.HATE_SPEECH,
    desc: 'Hate speech',
  },
  {
    id: ReportReason.UNAUTHORIZED_SALES,
    desc: 'Unauthorized Sales',
  },
  {
    id: ReportReason.ATTEMPT_TO_ABUSE,
    desc: 'Attempt to abuse',
  },
  {
    id: ReportReason.OTHER,
    desc: 'Other',
  },
];
