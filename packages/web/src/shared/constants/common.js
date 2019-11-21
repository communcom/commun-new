/* sort by filter */
export const SORT_BY_NEWEST = 'timeDesc';
export const SORT_BY_OLDEST = 'time';
export const SORT_BY_POPULARITY = 'popularity';

/* feed types */
export const FEED_TYPE_SUBSCRIPTIONS = 'subscriptions';
export const FEED_TYPE_SUBSCRIPTIONS_HOT = 'subscriptionsHot';
export const FEED_TYPE_SUBSCRIPTIONS_POPULAR = 'subscriptionsPopular';
export const FEED_TYPE_COMMUNITY = 'community';
export const FEED_TYPE_USER = 'byUser';
export const FEED_TYPE_NEW = 'new';
export const FEED_TYPE_HOT = 'hot';
export const FEED_TYPE_TOP_LIKES = 'topLikes';
export const FEED_TYPE_TOP_COMMENTS = 'topComments';
export const FEED_TYPE_TOP_REWARDS = 'topRewards';

/* feed type groups */
export const FEED_TYPE_GROUP_MY = 'my';
export const FEED_TYPE_GROUP_TRENDING = 'trending';

/* timeframe filter */
export const TIMEFRAME_DAY = 'day';
export const TIMEFRAME_WEEK = 'week';
export const TIMEFRAME_MONTH = 'month';
export const TIMEFRAME_ALL = 'all';

export const FEED_INTERVAL = [TIMEFRAME_DAY, TIMEFRAME_WEEK, TIMEFRAME_MONTH, TIMEFRAME_ALL];

export const FEED_TYPES = {
  [FEED_TYPE_GROUP_MY]: [
    { type: FEED_TYPE_SUBSCRIPTIONS, needUserId: true },
    { type: FEED_TYPE_SUBSCRIPTIONS_HOT, needUserId: true },
    { type: FEED_TYPE_SUBSCRIPTIONS_POPULAR, intervals: FEED_INTERVAL, needUserId: true },
  ],
  [FEED_TYPE_GROUP_TRENDING]: [
    { type: FEED_TYPE_NEW },
    { type: FEED_TYPE_HOT },
    { type: FEED_TYPE_TOP_LIKES, intervals: FEED_INTERVAL },
  ],
};

export const FEED_COMMUNITY_TYPES = [
  { type: FEED_TYPE_COMMUNITY },
  { type: FEED_TYPE_HOT },
  { type: FEED_TYPE_TOP_LIKES, intervals: FEED_INTERVAL },
];

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

export const IMG_HOSTING_URL = process.env.WEB_IMAGE_HOSTING_URL;
export const CAPTCHA_KEY = process.env.WEB_RECAPTCHA_KEY;

export const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const POST_DRAFT_KEY = 'drafts.post';
export const ARTICLE_DRAFT_KEY = 'drafts.article';
export const COMMENT_DRAFT_KEY = 'drafts.comment';
