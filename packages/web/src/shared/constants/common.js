/* sort by filter */
export const SORT_BY_NEWEST = 'time';
export const SORT_BY_OLDEST = 'timeDesc';
export const SORT_BY_POPULAR = 'popular';

/* timeframe filter */
export const TIMEFRAME_DAY = 'day';
export const TIMEFRAME_WEEK = 'week';
export const TIMEFRAME_MONTH = 'month';
export const TIMEFRAME_YEAR = 'year';
export const TIMEFRAME_ALL = 'all';
export const TIMEFRAME_WILSONHOT = 'WilsonHot';
export const TIMEFRAME_WILSONTRENDING = 'WilsonTrending';

export const SOCIAL_NETWORKS_LIST = [
  {
    name: 'Facebook',
    fieldName: 'facebook',
    icon: 'facebook-messenger',
  },
  {
    name: 'Telegram',
    fieldName: 'telegram',
    icon: 'telegram',
  },
  {
    name: 'WhatsApp',
    fieldName: 'whatsApp',
    icon: 'whatsapp',
  },
  {
    name: 'WeChat',
    fieldName: 'weChat',
    icon: 'wechat',
  },
];

export const IMG_HOSTING_URL = process.env.IMAGE_HOSTING_URL;
export const CAPTCHA_KEY = process.env.RECAPTCHA_KEY;

export const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const POST_DRAFT_KEY = 'drafts.post';
export const COMMENT_DRAFT_KEY = 'drafts.comment';
