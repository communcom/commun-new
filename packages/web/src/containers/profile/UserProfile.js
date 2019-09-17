import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { profileType } from 'types/common';
import { fetchProfile } from 'store/actions/gate';

import NavigationTabBar from 'components/NavigationTabBar';
import TabLoader from 'components/TabLoader';
import Footer from 'components/Footer';
import Redirect from 'components/Redirect';
import { ProfileHeader, Description, SubscriptionsWidget } from 'components/UserProfile';
import withTabs from 'utils/hocs/withTabs';
import { SIDE_BAR_MARGIN } from 'shared/constants';
import { FEATURE_COMMUNITY_CREATE } from 'shared/feature-flags';

const UserFeed = dynamic(() => import('containers/profile/Feed'));
const ProfileSubscriptions = dynamic(() => import('containers/profile/Subscriptions'));
const ProfileFollowers = dynamic(() => import('containers/profile/Followers'));
const ProfileFollowings = dynamic(() => import('containers/profile/Followings'));
const ProfileComments = dynamic(() => import('containers/profile/comments'));
const UserSettings = dynamic(() => import('containers/profile/settings'));
const CreateCommunity = dynamic(() => import('containers/profile/CreateCommunity'));

const TABS = {
  feed: {
    tabName: 'Feed',
    route: 'profile',
    index: true,
    isOwnerRequired: false,
    Component: UserFeed,
  },
  comments: {
    tabName: 'Comments',
    route: 'profileSection',
    isOwnerRequired: false,
    Component: ProfileComments,
  },
  subscriptions: {
    tabName: 'Subscriptions',
    route: 'profileSection',
    isOwnerRequired: false,
    Component: ProfileSubscriptions,
  },
  followers: {
    tabName: 'Followers',
    route: 'profileSection',
    isOwnerRequired: false,
    Component: ProfileFollowers,
  },
  followings: {
    tabName: 'Followings',
    route: 'profileSection',
    isOwnerRequired: false,
    Component: ProfileFollowings,
  },
  settings: {
    tabName: 'Settings',
    route: 'profileSection',
    isOwnerRequired: true,
    Component: UserSettings,
  },
  new_community: {
    tabName: 'Create Community',
    route: 'profileSection',
    isOwnerRequired: true,
    Component: CreateCommunity,
    featureName: FEATURE_COMMUNITY_CREATE,
  },
};

const Wrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Header = styled.div`
  margin-bottom: 8px;

  ${up('tablet')} {
    margin-bottom: 20px;
  }
`;

const Content = styled.div`
  display: flex;
`;

const Tabs = styled.div`
  width: 100%;
`;

const Left = styled.main`
  flex: 1;
  min-width: 288px;
  width: 100%;
`;

const Right = styled.div`
  display: none;
  flex: 0;
  margin-left: ${SIDE_BAR_MARGIN}px;

  ${up('tablet')} {
    display: block;
  }
`;

const Aside = styled.aside`
  display: none;

  ${up('tablet')} {
    display: block;

    & > :not(:last-of-type) {
      margin-bottom: 8px;
    }
  }
`;

@withRouter
@withTabs(TABS, 'feed')
export default class UserProfile extends PureComponent {
  static async getInitialProps({ query, store }) {
    await store.dispatch(fetchProfile(query.userId)).catch(err => {
      // TODO: Temporary catch!
      // eslint-disable-next-line no-console
      console.error('Profile not found:', err);
    });

    return {
      userId: query.userId,
      namespacesRequired: [],
    };
  }

  static propTypes = {
    userId: PropTypes.string.isRequired,
    profile: profileType,
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    subscriptions: PropTypes.arrayOf(PropTypes.object),
    isOwner: PropTypes.bool.isRequired,
    isAutoLogging: PropTypes.bool.isRequired,
    tabs: PropTypes.shape({}).isRequired,
    tab: PropTypes.shape({}).isRequired,
    tabProps: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    profile: null,
    subscriptions: [],
  };

  store = {};

  renderContent() {
    const { userId, isOwner, isAutoLogging, tab, tabProps } = this.props;

    if (!tab || (tab.isOwnerRequired && !isOwner)) {
      return (
        <>
          <TabLoader />
          {tab && isAutoLogging ? null : <Redirect route="profile" params={{ userId }} hidden />}
        </>
      );
    }

    return <tab.Component {...tabProps} accountOwner={userId} />;
  }

  render() {
    const { userId, profile, subscriptions, isOwner, tabs } = this.props;

    return (
      <Wrapper>
        <Header>
          <ProfileHeader userId={userId} profile={profile} isOwner={isOwner} />
          <Tabs>
            <NavigationTabBar tabs={tabs} params={{ userId }} isOwner={isOwner} />
          </Tabs>
        </Header>
        <Content>
          <Left>{this.renderContent()}</Left>
          <Right>
            <Aside>
              <Description isOwner={isOwner} userId={userId} />
              <SubscriptionsWidget subscriptions={subscriptions} />
              <Footer />
            </Aside>
          </Right>
        </Content>
      </Wrapper>
    );
  }
}
