// Header
export const FEATURE_SEARCH = 'search';
export const FEATURE_WALLET = 'wallet';
export const FEATURE_DISCOVER = 'discover';
export const FEATURE_SIGN_UP = 'signUp';
export const FEATURE_NOTIFICATIONS_BUTTON = 'notificationsButton';

// Right home sidebar
export const FEATURE_ADVERTISEMENT = 'advertisement';
export const FEATURE_AIRDROP_WIDGET = 'airdropWidget';

// Community
export const FEATURE_COMMUNITY_MEMBERS = 'communityMembers';
export const FEATURE_COMMUNITY_LEADERS = 'communityLeaders';
export const FEATURE_COMMUNITY_SETTINGS = 'communitySettings';

// User profile
export const FEATURE_USER_COMMUNITIES_WIDGET = 'userCommunitiesWidget';

// Post
export const FEATURE_POST_VIEW_COUNT = 'postViewCount';
export const FEATURE_POST_FEED_COMMENTS = 'postFeedComments';

// Settings
export const FEATURE_SETTINGS_GENERAL = 'settingsGeneral';
export const FEATURE_SETTINGS_NOTIFICATIONS = 'settingsNotifications';

// Wallet
export const FEATURE_EXCHANGE_COMMON = 'walletExchangeCommon';
export const FEATURE_EXCHANGE_CARBON = 'walletExchangeCarbon';

// Registration
export const FEATURE_REGISTRATION_ALL = 'registrationAll';
export const FEATURE_REGISTRATION_PASSWORD = 'registrationPassword';
export const FEATURE_OAUTH = 'oauth';
export const FEATURE_OAUTH_GOOGLE = 'oauthGoogle';
export const FEATURE_OAUTH_FACEBOOK = 'oauthFacebook';
export const FEATURE_OAUTH_APPLE = 'oauthApple';
export const FEATURE_EMAIL_REGISTRATION = 'emailRegistration';

export const FEATURE_ARTICLE = 'article';

export const FEATURE_USER_REFERRALS = 'userReferrals';

export default {
  // Header
  [FEATURE_SEARCH]: true,
  [FEATURE_WALLET]: true,
  [FEATURE_DISCOVER]: true,
  [FEATURE_SIGN_UP]: true,

  // Right home sidebar
  [FEATURE_ADVERTISEMENT]: false,
  [FEATURE_AIRDROP_WIDGET]: true,

  // Community
  [FEATURE_COMMUNITY_MEMBERS]: true,
  [FEATURE_COMMUNITY_LEADERS]: true,
  [FEATURE_COMMUNITY_SETTINGS]: false,

  // User profile
  [FEATURE_USER_COMMUNITIES_WIDGET]: false,

  [FEATURE_ARTICLE]: false,
  [FEATURE_USER_REFERRALS]: false,

  // Settings
  [FEATURE_SETTINGS_GENERAL]: false,
  [FEATURE_SETTINGS_NOTIFICATIONS]: true,

  // Post
  [FEATURE_POST_VIEW_COUNT]: true,
  [FEATURE_POST_FEED_COMMENTS]: false,

  // Notifications
  [FEATURE_NOTIFICATIONS_BUTTON]: true,

  // Wallet
  [FEATURE_EXCHANGE_COMMON]: true,
  [FEATURE_EXCHANGE_CARBON]: true,

  // Registration
  [FEATURE_REGISTRATION_ALL]: true,
  [FEATURE_REGISTRATION_PASSWORD]: true,
  [FEATURE_OAUTH]: true,
  [FEATURE_OAUTH_GOOGLE]: false,
  [FEATURE_OAUTH_FACEBOOK]: true,
  [FEATURE_OAUTH_APPLE]: false,
  [FEATURE_EMAIL_REGISTRATION]: true,
};
