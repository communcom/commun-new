export const ReportReason = {
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  NUDITY: 'nudity',
  VIOLENCE: 'violence',
  FALSE_NEWS: 'falsenews',
  TERRORISM: 'terrorism',
  HATE_SPEECH: 'hatespeech',
  UNAUTHORIZED_SALES: 'unauthorizedsales',
};

export const ReportDescription = {
  [ReportReason.SPAM]: 'Spam',
  [ReportReason.HARASSMENT]: 'Harassment',
  [ReportReason.NUDITY]: 'Nudity',
  [ReportReason.VIOLENCE]: 'Violence',
  [ReportReason.FALSE_NEWS]: 'False news',
  [ReportReason.TERRORISM]: 'Terrorism',
  [ReportReason.HATE_SPEECH]: 'Hate speech',
  [ReportReason.UNAUTHORIZED_SALES]: 'Unauthorized sales',
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
    desc: 'False news',
  },
  {
    id: ReportReason.TERRORISM,
    desc: 'Terrorism',
  },
  {
    id: ReportReason.HATE_SPEECH,
    desc: 'Hate speech',
  },
  {
    id: ReportReason.UNAUTHORIZED_SALES,
    desc: 'Unauthorized sales',
  },
];
