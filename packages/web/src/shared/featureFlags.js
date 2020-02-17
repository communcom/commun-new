// Header
export const FEATURE_SEARCH = 'search';
export const FEATURE_WALLET = 'wallet';
export const FEATURE_DISCOVER = 'discover';
export const FEATURE_SIGN_UP = 'signUp';
export const FEATURE_NOTIFICATIONS_BUTTON = 'notificationsButton';

// Right home sidebar
export const FEATURE_ADVERTISEMENT = 'advertisement';

// Community
export const FEATURE_COMMUNITY_MEMBERS = 'communityMembers';
export const FEATURE_COMMUNITY_LEADERS = 'communityLeaders';
export const FEATURE_COMMUNITY_SETTINGS = 'communitySettings';

// User profile
export const FEATURE_USER_COMMUNITIES_WIDGET = 'userCommunitiesWidget';

// Post
export const FEATURE_POST_VIEW_COUNT = 'postViewCount';
export const FEATURE_POST_FEED_COMMENTS = 'postFeedComments';

export const FEATURE_NOTIFICATION_OPTIONS = 'notificationOptions';

export const FEATURE_ARTICLE = 'article';

// Wallet
export const FEATURE_EXCHANGE_COMMON = 'walletExchangeCommon';
export const FEATURE_EXCHANGE_CARBON = 'walletExchangeCarbon';

// Registration
export const FEATURE_REGISTRATION_ALL = 'registrationAll';

export default {
  // Header
  [FEATURE_SEARCH]: false,
  [FEATURE_WALLET]: true,
  [FEATURE_DISCOVER]: true,
  [FEATURE_SIGN_UP]: true,

  // Right home sidebar
  [FEATURE_ADVERTISEMENT]: false,

  // Community
  [FEATURE_COMMUNITY_MEMBERS]: true,
  [FEATURE_COMMUNITY_LEADERS]: true,
  [FEATURE_COMMUNITY_SETTINGS]: false,

  // User profile
  [FEATURE_USER_COMMUNITIES_WIDGET]: false,

  [FEATURE_NOTIFICATION_OPTIONS]: true,
  [FEATURE_ARTICLE]: false,

  // Post
  [FEATURE_POST_VIEW_COUNT]: true,
  [FEATURE_POST_FEED_COMMENTS]: false,

  // Notifications
  [FEATURE_NOTIFICATIONS_BUTTON]: true,

  // Wallet
  [FEATURE_EXCHANGE_COMMON]: true,
  [FEATURE_EXCHANGE_CARBON]: false || process.env.WEB_HOST_ENV === 'development',

  // Registration
  [FEATURE_REGISTRATION_ALL]: true,
};
