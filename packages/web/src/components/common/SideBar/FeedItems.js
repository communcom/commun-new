import React, { memo } from 'react';
import { FEED_TYPE_GROUP_TRENDING } from 'shared/constants';
import { FEATURE_DISCOVER, FEATURE_WALLET } from 'shared/featureFlags';
import LinksList from 'components/common/SideBar/LinksList';
import PropTypes from 'prop-types';

const getFeeds = (currentUser, featureFlags, openOnboardingWelcome, openOnboardingCommunitites) => {
  const links = [];

  const trendingLinkTemplate = {
    desc: 'Trending',
    icon: {
      name: 'trending',
      width: 12,
      height: 20,
    },
  };

  // if (currentUser) {
  links.push(
    {
      route: 'home',
      index: true,
      includeRoute: '/feed/my',
      desc: 'My feed',
      avatar: {
        userId: currentUser?.userId,
      },
      onClick: !currentUser
        ? e => {
            e.preventDefault();
            openOnboardingCommunitites({ isSignUp: true });
          }
        : undefined,
    },
    {
      route: 'feed',
      includeRoute: '/feed/trending',
      params: {
        feedType: FEED_TYPE_GROUP_TRENDING,
      },
      ...trendingLinkTemplate,
    }
  );
  // } else {
  //   links.push({
  //     route: 'home',
  //     index: true,
  //     includeRoute: '/feed/trending',
  //     ...trendingLinkTemplate,
  //   });
  // }

  if (featureFlags[FEATURE_WALLET]) {
    links.push({
      route: 'wallet',
      desc: 'Wallet',
      icon: {
        name: 'wallet',
      },
      onClick: !currentUser
        ? e => {
            e.preventDefault();
            openOnboardingWelcome();
          }
        : undefined,
    });
  }

  if (featureFlags[FEATURE_DISCOVER]) {
    links.push({
      route: 'communities',
      desc: 'Discovery',
      icon: {
        name: 'compass',
        width: 20,
        height: 20,
      },
    });
  }

  return links;
};

function FeedItems({
  currentUser,
  featureFlags,
  openOnboardingWelcome,
  openOnboardingCommunities,
}) {
  const items = getFeeds(
    currentUser,
    featureFlags,
    openOnboardingWelcome,
    openOnboardingCommunities
  );

  return <LinksList items={items} name="sidebar__feed-items" />;
}

FeedItems.propTypes = {
  currentUser: PropTypes.shape({}),
  featureFlags: PropTypes.shape({}).isRequired,
  openOnboardingWelcome: PropTypes.func.isRequired,
  openOnboardingCommunities: PropTypes.func.isRequired,
};

FeedItems.defaultProps = {
  currentUser: null,
};

export default memo(FeedItems);
