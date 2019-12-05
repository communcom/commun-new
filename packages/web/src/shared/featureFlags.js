// Header
export const FEATURE_SEARCH = 'search';
export const FEATURE_WALLET = 'wallet';
export const FEATURE_DISCOVER = 'discover';
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

export const FEATURE_NOTIFICATION_OPTIONS = 'notificationOptions';

export const FEATURE_ARTICLE = 'article';

export default {
  // Header
  [FEATURE_SEARCH]: false,
  [FEATURE_WALLET]: true,
  [FEATURE_DISCOVER]: true,

  // Right home sidebar
  [FEATURE_ADVERTISEMENT]: false,

  // Community
  [FEATURE_COMMUNITY_MEMBERS]: true,
  [FEATURE_COMMUNITY_LEADERS]: true,
  [FEATURE_COMMUNITY_SETTINGS]: false,

  // User profile
  [FEATURE_USER_COMMUNITIES_WIDGET]: false,

  [FEATURE_NOTIFICATION_OPTIONS]: false,
  [FEATURE_ARTICLE]: false,

  // Post
  [FEATURE_POST_VIEW_COUNT]: false,
};
