import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { FEED_TYPE_GROUP_HOT, FEED_TYPE_GROUP_TRENDING } from 'shared/constants';
import { FEATURE_DISCOVER, FEATURE_WALLET } from 'shared/featureFlags';
import LinksList from 'components/common/SideBar/LinksList';

import { withTranslation } from 'shared/i18n';

const getFeeds = (
  currentUser,
  featureFlags,
  openOnboardingWelcome,
  openOnboardingCommunitites,
  t
) => {
  const links = [];

  const trendingLinkTemplate = {
    desc: t('sidebar.trending'),
    icon: {
      name: 'trending',
      width: 12,
      height: 20,
    },
  };

  if (currentUser) {
    links.push(
      {
        route: 'home',
        index: true,
        includeRoute: '/feed',
        desc: t('sidebar.my_feed'),
        avatar: {
          userId: currentUser.userId,
        },
      },
      {
        route: 'feed',
        index: !currentUser,
        includeRoute: '/trending',
        params: {
          feedType: FEED_TYPE_GROUP_TRENDING,
        },
        ...trendingLinkTemplate,
      }
    );
  } else {
    links.push(
      {
        includeRoute: '/feed',
        desc: t('sidebar.my_feed'),
        onClick: e => {
          e.preventDefault();
          openOnboardingCommunitites({ isSignUp: true });
        },
        avatar: {
          userId: undefined,
        },
      },
      {
        route: 'home',
        index: true,
        includeRoute: '/trending',
        ...trendingLinkTemplate,
      }
    );
  }

  links.push({
    route: 'feed',
    includeRoute: '/hot',
    params: {
      feedType: FEED_TYPE_GROUP_HOT,
    },
    desc: t('sidebar.hot'),
    icon: {
      name: 'flame',
      width: 16,
      height: 20,
    },
  });

  if (featureFlags[FEATURE_WALLET]) {
    links.push({
      route: 'wallet',
      desc: t('sidebar.wallet'),
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
      desc: t('sidebar.discovery'),
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
  openOnboardingRegistration,
  t,
}) {
  const items = getFeeds(
    currentUser,
    featureFlags,
    openOnboardingWelcome,
    openOnboardingRegistration,
    t
  );

  return <LinksList items={items} name="sidebar__feed-items" />;
}

FeedItems.propTypes = {
  currentUser: PropTypes.shape({}),
  featureFlags: PropTypes.shape({}).isRequired,
  openOnboardingWelcome: PropTypes.func.isRequired,
  openOnboardingRegistration: PropTypes.func.isRequired,
};

FeedItems.defaultProps = {
  currentUser: null,
};

export default withTranslation()(memo(FeedItems));
