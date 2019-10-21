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
export const FEATURE_MEMBERS_WIDGET = 'membersWidget';
export const FEATURE_LEADERS_WIDGET = 'leadersWidget';

// User profile
export const FEATURE_USER_COMMUNITIES_WIDGET = 'userCommunitiesWidget';
export const FEATURE_COMMUNITY_CREATE = 'communityCreate';

export const FEATURE_NOTIFICATION_OPTIONS = 'notificationOptions';

export default {
  // Header
  [FEATURE_SEARCH]: false,
  [FEATURE_WALLET]: false,
  [FEATURE_DISCOVER]: false,

  // Right home sidebar
  [FEATURE_ADVERTISEMENT]: false,

  // Community
  [FEATURE_COMMUNITY_MEMBERS]: true,
  [FEATURE_COMMUNITY_LEADERS]: true,
  [FEATURE_COMMUNITY_SETTINGS]: false,

  // Widgets
  [FEATURE_MEMBERS_WIDGET]: true,
  [FEATURE_LEADERS_WIDGET]: true,

  // User profile
  [FEATURE_USER_COMMUNITIES_WIDGET]: false,
  [FEATURE_COMMUNITY_CREATE]: false,

  [FEATURE_NOTIFICATION_OPTIONS]: false,
};
