/* eslint-disable import/prefer-default-export */
import React from 'react';

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
    title: 'Rewards for likes',
    desc:
      'Yes, you get rewards for likes as well, and they have more value than you think! Upvoting or downvoting of posts decides if it’s going to be successful and receive the reward.',
    image: '/images/onboarding/likes-tooltip.svg',
  },
  [ONBOARDING_TOOLTIP_TYPE.COMMENTS]: {
    title: 'Rewards for comments',
    desc: 'Comments get rewards too! Participate in discussions and receive more rewards!',
    image: '/images/onboarding/comments-reward-tooltip.svg',
  },
  [ONBOARDING_TOOLTIP_TYPE.SHARE]: {
    title: 'Share your post',
    desc:
      'Great, your post is successfully published! Share it with your friends to receive more rewards!',
    image: '/images/onboarding/feed-tooltip-image.png',
  },
  [ONBOARDING_TOOLTIP_TYPE.REWARD]: {
    title: 'What does it mean?',
    desc: (
      <>
        Wow, this post will get the reward! <br />
        Do you want to get rewards too? Create a post - it’s the best way to get them!
      </>
    ),
    image: '/images/onboarding/rewards-tooltip.svg',
  },
};

export const COMMUNITIES_AIRDROP_COUNT = 3;
