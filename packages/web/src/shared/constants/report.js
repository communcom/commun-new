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
    desc: ReportDescription[ReportReason.SPAM],
  },
  {
    id: ReportReason.HARASSMENT,
    desc: ReportDescription[ReportReason.HARASSMENT],
  },
  {
    id: ReportReason.NUDITY,
    desc: ReportDescription[ReportReason.NUDITY],
  },
  {
    id: ReportReason.VIOLENCE,
    desc: ReportDescription[ReportReason.VIOLENCE],
  },
  {
    id: ReportReason.FALSE_NEWS,
    desc: ReportDescription[ReportReason.FALSE_NEWS],
  },
  {
    id: ReportReason.TERRORISM,
    desc: ReportDescription[ReportReason.TERRORISM],
  },
  {
    id: ReportReason.BREAKS_COMMUNITY_RULES,
    desc: ReportDescription[ReportReason.BREAKS_COMMUNITY_RULES],
  },
  {
    id: ReportReason.HATE_SPEECH,
    desc: ReportDescription[ReportReason.HATE_SPEECH],
  },
  {
    id: ReportReason.UNAUTHORIZED_SALES,
    desc: ReportDescription[ReportReason.UNAUTHORIZED_SALES],
  },
  {
    id: ReportReason.ATTEMPT_TO_ABUSE,
    desc: ReportDescription[ReportReason.ATTEMPT_TO_ABUSE],
  },
  {
    id: ReportReason.OTHER,
    desc: 'Other',
  },
];
