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
export const FEATURE_COMMUNITY_MEMBERS_UNBAN = 'communityMembersUnban';
export const FEATURE_COMMUNITY_LEADERS = 'communityLeaders';
export const FEATURE_COMMUNITY_SETTINGS = 'communitySettings';
export const FEATURE_COMMUNITY_CREATION = 'communityCreation';
export const FEATURE_COMMUNITY_MANAGE = 'communityManage';
export const FEATURE_COMMUNITY_TOPICS = 'communityTopics';

// User profile
export const FEATURE_USER_COMMUNITIES_WIDGET = 'userCommunitiesWidget';
export const FEATURE_USER_REFERRALS = 'referrals';
export const FEATURE_USER_ABOUT = 'about';

// Donate
export const FEATURE_DONATE_MAKE = 'donateMake';
export const FEATURE_DONATE_COUNT = 'donateCount';

// TAGS
export const FEATURE_TAGS = 'tags';
export const FEATURE_TAGS_TRENDING = 'tagsTrending';

// Post
export const FEATURE_POST_VIEW_COUNT = 'postViewCount';
export const FEATURE_POST_FEED_COMMENTS = 'postFeedComments';
export const FEATURE_POST_CONVERTED_REWARD = 'postConvertedReward';
export const FEATURE_POST_GET_REWARD = 'postGetReward';

// Settings
export const FEATURE_SETTINGS_GENERAL = 'settingsGeneral';
export const FEATURE_SETTINGS_GENERAL_COMMON = 'settingsGeneralCommon';
export const FEATURE_SETTINGS_MESSENGERS = 'settingsMessengers';
export const FEATURE_SETTINGS_LINKS = 'settingsLinks';
export const FEATURE_SETTINGS_NOTIFICATIONS = 'settingsNotifications';
export const FEATURE_SETTINGS_CHANGE_KEYS = 'settingsChangeKeys';

// Wallet
export const FEATURE_EXCHANGE_COMMON = 'walletExchangeCommon';
export const FEATURE_EXCHANGE_COMMON_PAYMIR = 'walletExchangeCommonPaymir';
export const FEATURE_EXCHANGE_CARBON = 'walletExchangeCarbon';
export const FEATURE_SELL_COMMON = 'walletSellCommon';

// Registration
export const FEATURE_REGISTRATION_ALL = 'registrationAll';
export const FEATURE_REGISTRATION_PASSWORD = 'registrationPassword';
export const FEATURE_OAUTH = 'oauth';
export const FEATURE_OAUTH_GOOGLE = 'oauthGoogle';
export const FEATURE_OAUTH_FACEBOOK = 'oauthFacebook';
export const FEATURE_OAUTH_APPLE = 'oauthApple';
export const FEATURE_EMAIL_REGISTRATION = 'emailRegistration';
export const FEATURE_OAUTH_TELEGRAM = 'oauthTelegram';

export const FEATURE_ARTICLE = 'article';

export default {
  // Header
  [FEATURE_SEARCH]: true,
  [FEATURE_WALLET]: true,
  [FEATURE_DISCOVER]: true,
  [FEATURE_SIGN_UP]: true,

  // Right home sidebar
  [FEATURE_ADVERTISEMENT]: false,
  [FEATURE_AIRDROP_WIDGET]: false,

  // Community
  [FEATURE_COMMUNITY_MEMBERS]: true,
  [FEATURE_COMMUNITY_MEMBERS_UNBAN]: true,
  [FEATURE_COMMUNITY_LEADERS]: true,
  [FEATURE_COMMUNITY_SETTINGS]: true,
  [FEATURE_COMMUNITY_CREATION]: true,
  [FEATURE_COMMUNITY_MANAGE]: true,
  [FEATURE_COMMUNITY_TOPICS]: false,

  // User profile
  [FEATURE_USER_COMMUNITIES_WIDGET]: false,
  [FEATURE_USER_REFERRALS]: true,
  [FEATURE_USER_ABOUT]: true,

  [FEATURE_ARTICLE]: false,

  // Settings
  [FEATURE_SETTINGS_GENERAL]: true,
  [FEATURE_SETTINGS_GENERAL_COMMON]: true,
  [FEATURE_SETTINGS_MESSENGERS]: true,
  [FEATURE_SETTINGS_LINKS]: true,
  [FEATURE_SETTINGS_NOTIFICATIONS]: true,
  [FEATURE_SETTINGS_CHANGE_KEYS]: true,

  // Donate
  [FEATURE_DONATE_MAKE]: true,
  [FEATURE_DONATE_COUNT]: true,

  // Tags
  [FEATURE_TAGS]: false,
  [FEATURE_TAGS_TRENDING]: true,

  // Post
  [FEATURE_POST_VIEW_COUNT]: true,
  [FEATURE_POST_FEED_COMMENTS]: true,
  [FEATURE_POST_CONVERTED_REWARD]: true,
  [FEATURE_POST_GET_REWARD]: false,

  // Notifications
  [FEATURE_NOTIFICATIONS_BUTTON]: true,

  // Wallet
  [FEATURE_EXCHANGE_COMMON]: true,
  [FEATURE_EXCHANGE_COMMON_PAYMIR]: false,
  [FEATURE_EXCHANGE_CARBON]: false,
  [FEATURE_SELL_COMMON]: false,

  // Registration
  [FEATURE_REGISTRATION_ALL]: true,
  [FEATURE_REGISTRATION_PASSWORD]: true,
  [FEATURE_OAUTH]: true,
  [FEATURE_OAUTH_GOOGLE]: false,
  [FEATURE_OAUTH_FACEBOOK]: true,
  [FEATURE_OAUTH_APPLE]: true,
  [FEATURE_EMAIL_REGISTRATION]: true,
  [FEATURE_OAUTH_TELEGRAM]: false,
};
