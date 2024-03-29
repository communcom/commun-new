import env from 'shared/env';

export const COMMUN_HOST = 'commun.com';

// META
export const OG_NAME = 'Commun';
export const OG_DESCRIPTION = 'Social network of the people, by the people, and for the people.';
export const OG_IMAGE = 'https://commun.com/images/og.png';
export const OG_BASE_URL = 'https://commun.com';

// Social
export const TWITTER_NAME = 'communcom';

// Docs
export const DOC_USER_AGREEMENT_LINK = '/doc/agreement';
export const DOC_PRIVACY_POLICY_LINK = '/doc/privacy';
export const DOC_COOKIES_POLICY_LINK = '/doc/cookies';
export const DOC_BLOCKCHAIN_DISCLAIMER_LINK = '/doc/disclaimer';
export const DOC_WHITEPAPER_LINK = '/doc/whitepaper';

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
export const FEED_TYPE_GROUP_FEED = 'feed';
export const FEED_TYPE_GROUP_TRENDING = 'trending';
export const FEED_TYPE_GROUP_HOT = 'hot';

/* timeframe filter */
export const TIMEFRAME_DAY = 'day';
export const TIMEFRAME_WEEK = 'week';
export const TIMEFRAME_MONTH = 'month';
export const TIMEFRAME_ALL = 'all';

export const FEED_INTERVAL = [TIMEFRAME_DAY, TIMEFRAME_WEEK, TIMEFRAME_MONTH, TIMEFRAME_ALL];

export const FEED_TYPES = {
  [FEED_TYPE_GROUP_FEED]: [
    { type: FEED_TYPE_SUBSCRIPTIONS, needUserId: true },
    { type: FEED_TYPE_SUBSCRIPTIONS_HOT, needUserId: true },
    { type: FEED_TYPE_SUBSCRIPTIONS_POPULAR, intervals: FEED_INTERVAL, needUserId: true },
  ],
  [FEED_TYPE_GROUP_TRENDING]: [
    { type: FEED_TYPE_TOP_LIKES, intervals: FEED_INTERVAL },
    { type: FEED_TYPE_NEW },
  ],
  [FEED_TYPE_GROUP_HOT]: [{ type: FEED_TYPE_HOT }],
};

export const FEED_TYPES_MOBILE = {
  [FEED_TYPE_GROUP_FEED]: [
    { type: FEED_TYPE_SUBSCRIPTIONS, needUserId: true },
    { type: FEED_TYPE_SUBSCRIPTIONS_HOT, needUserId: true },
    { type: FEED_TYPE_SUBSCRIPTIONS_POPULAR, intervals: FEED_INTERVAL, needUserId: true },
  ],
  [FEED_TYPE_GROUP_TRENDING]: [
    { type: FEED_TYPE_TOP_LIKES, intervals: FEED_INTERVAL },
    { type: FEED_TYPE_HOT },
    { type: FEED_TYPE_NEW },
  ],
};

export const FEED_COMMUNITY_TYPES = [
  { type: FEED_TYPE_COMMUNITY },
  { type: FEED_TYPE_HOT },
  { type: FEED_TYPE_TOP_LIKES, intervals: FEED_INTERVAL },
];

export const SOCIAL_MESSENGERS_LIST = [
  {
    contactId: 'telegram',
    name: 'Telegram',
    iconName: 'telegram',
    type: 'username',
  },
  // {
  //   contactId: 'weChat',
  //   name: 'WeChat',
  //   iconName: 'wechat',
  //   type: 'phone',
  // },
  // {
  //   contactId: 'facebook',
  //   name: 'Facebook messenger',
  //   iconName: 'facebook-messenger',
  //   placeholderLocaleKey: 'Phone',
  // },
];

export const SOCIAL_LINKS_LIST = [
  {
    contactId: 'twitter',
    name: 'Twitter',
    iconName: 'twitter',
    type: 'username',
  },
  {
    contactId: 'facebook',
    name: 'Facebook',
    iconName: 'facebook',
    type: 'username',
  },
  // {
  //   contactId: 'youtube',
  //   name: 'Youtube',
  //   iconName: 'youtube',
  //   type: 'link',
  // },
  {
    contactId: 'instagram',
    name: 'Instagram',
    iconName: 'instagram',
    type: 'username',
  },
  {
    contactId: 'linkedin',
    name: 'Linkedin',
    iconName: 'linkedin',
    type: 'username',
  },
  {
    contactId: 'gitHub',
    name: 'Github',
    iconName: 'github',
    type: 'username',
  },
];

export const SYSTEM_COMMUNITY_NAMES = [
  '_next',
  'hot',
  'trending',
  'feed',
  'faq',
  'agreement',
  'communities',
  'community',
  'policies',
  'search',
  'wallet',
  'settings',
  'blacklist',
  'notifications',
  'leaderboard',
  'payment',
];

export const IMG_HOSTING_URL = env.WEB_IMAGE_HOSTING_URL;
export const CAPTCHA_KEY = env.WEB_RECAPTCHA_KEY;
export const AMPLITUDE_KEY = env.WEB_AMPLITUDE_KEY;
export const FACEBOOK_KEY = env.WEB_FACEBOOK_KEY;
export const GTM_KEY = env.WEB_GTM_KEY;
export const GTAG_KEYS = env.WEB_GTAG_KEYS;

export const STATUS_CARBON_SUCCESS = 'success';

export const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const POST_DRAFT_KEY = 'drafts.post';
export const ARTICLE_DRAFT_KEY = 'drafts.article';
export const COMMENT_DRAFT_KEY = 'drafts.comment';
export const ONBOARDING_WELCOME_DONE_KEY = 'onboarding.welcome.done';
export const ONBOARDING_REGISTRATION_WAIT_KEY = 'onboarding.registration.wait';

export const COOKIE_ALL_FEATURES = 'commun_all_features';
