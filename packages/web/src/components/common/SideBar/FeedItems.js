import React, { memo } from 'react';
import { FEED_TYPE_GROUP_TRENDING } from 'shared/constants';
import { FEATURE_DISCOVER, FEATURE_WALLET } from 'shared/featureFlags';
import LinksList from 'components/common/SideBar/LinksList';
import PropTypes from 'prop-types';

const getFeeds = (currentUser, featureFlags) => {
  const links = [];

  if (currentUser) {
    links.push({
      route: 'home',
      index: true,
      includeRoute: '/feed/my',
      desc: 'My feed',
      avatar: {
        userId: currentUser.userId,
      },
    });
  }

  links.push({
    route: 'feed',
    params: {
      feedType: FEED_TYPE_GROUP_TRENDING,
    },
    desc: 'Trending',
    icon: {
      name: 'trending',
      width: 12,
      height: 20,
    },
  });

  if (featureFlags[FEATURE_WALLET] && currentUser) {
    links.push({
      route: 'wallet',
      desc: 'Wallet',
      icon: {
        name: 'wallet',
      },
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

function FeedItems({ currentUser, featureFlags }) {
  const items = getFeeds(currentUser, featureFlags);

  return <LinksList items={items} />;
}

FeedItems.propTypes = {
  currentUser: PropTypes.shape({}),
  featureFlags: PropTypes.shape({}).isRequired,
};

FeedItems.defaultProps = {
  currentUser: null,
};

export default memo(FeedItems);
