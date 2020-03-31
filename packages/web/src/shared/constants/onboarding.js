export const OnboardingStep = {
  PICK_AVATAR: 'Pick profile picture',
  CHANGE_AVATAR_POSITION: 'Place photo',
  DESCRIPTION: 'Description',
  BUILD_FEED: 'Build your feed',
};

export const DISABLE_TOOLTIPS_KEY = 'onboarding.isTooltipsDisabled';
export const IS_CHOOSE_COMMUNITY_TOOLTIP_SHOWED = 'onboarding.isChooseCommunityTooltipShowed';

export const ONBOARDING_TOOLTIP_TYPE = {
  VOTE: 'vote',
  COMMENTS: 'comments',
  SHARE: 'share',
  REWARD: 'reward',
  REWARDS_FOR_POST: 'rewardsForPost',
};

export const FEED_ONBOARDING_TOOLTIP_TYPES = {
  [ONBOARDING_TOOLTIP_TYPE.VOTE]: {
    image: '/images/onboarding/likes-tooltip.svg',
  },
  [ONBOARDING_TOOLTIP_TYPE.COMMENTS]: {
    image: '/images/onboarding/comments-reward-tooltip.svg',
  },
  [ONBOARDING_TOOLTIP_TYPE.SHARE]: {
    image: '/images/onboarding/feed-tooltip-image.png',
  },
  [ONBOARDING_TOOLTIP_TYPE.REWARD]: {
    image: '/images/onboarding/rewards-tooltip.svg',
  },
};

export const COMMUNITIES_AIRDROP_COUNT = 3;
