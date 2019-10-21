import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { up } from '@commun/ui';
import { profileType } from 'types/common';
import { fetchProfile } from 'store/actions/gate';

import NavigationTabBar from 'components/common/NavigationTabBar';
import TabLoader from 'components/common/TabLoader';
import Content from 'components/common/Content';
import Footer from 'components/common/Footer';
import Redirect from 'components/common/Redirect';
import { ProfileHeader } from 'components/profile';
import { UserCommunitiesWidget } from 'components/widgets';
import withTabs from 'utils/hocs/withTabs';
import { FEATURE_COMMUNITY_CREATE } from 'shared/featureFlags';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';
import { tabInfoType } from 'types';

const UserFeed = dynamic(() => import('containers/profile/Feed'));
const UserCommunities = dynamic(() => import('containers/profile/UserCommunities'));
const ProfileFollowers = dynamic(() => import('containers/profile/Followers'));
const ProfileFollowings = dynamic(() => import('containers/profile/Followings'));
const ProfileComments = dynamic(() => import('containers/profile/comments'));
const UserSettings = dynamic(() => import('containers/profile/settings'));
const CreateCommunity = dynamic(() => import('containers/profile/CreateCommunity'));

const TABS = [
  {
    id: 'feed',
    tabName: 'Feed',
    route: 'profile',
    index: true,
    isOwnerRequired: false,
    Component: UserFeed,
  },
  {
    id: 'comments',
    tabName: 'Comments',
    route: 'profile',
    isOwnerRequired: false,
    Component: ProfileComments,
  },
  {
    id: 'communities',
    tabName: 'My Communities',
    route: 'profile',
    isOwnerRequired: false,
    Component: UserCommunities,
  },
  {
    id: 'followers',
    tabName: 'Followers',
    route: 'profile',
    isOwnerRequired: false,
    Component: ProfileFollowers,
  },
  {
    id: 'followings',
    tabName: 'Followings',
    route: 'profile',
    isOwnerRequired: false,
    Component: ProfileFollowings,
  },
  {
    id: 'settings',
    tabName: 'Settings',
    route: 'profile',
    isOwnerRequired: true,
    Component: UserSettings,
  },
  {
    id: 'newCommunity',
    tabName: 'Create Community',
    route: 'profile',
    isOwnerRequired: true,
    Component: CreateCommunity,
    featureName: FEATURE_COMMUNITY_CREATE,
  },
];

const Wrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const NotFound = styled.div`
  padding: 50px 0;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #999;
`;

const Header = styled.div`
  margin-bottom: 8px;

  ${up.tablet} {
    margin-bottom: 20px;
  }
`;

const Tabs = styled.div`
  width: 100%;
`;

@withRouter
@withTabs(TABS, 'feed')
export default class UserProfile extends PureComponent {
  static propTypes = {
    username: PropTypes.string.isRequired,
    profile: profileType.isRequired,
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
    isAutoLogging: PropTypes.bool.isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    tab: null,
  };

  static async getInitialProps({ query, store, res }) {
    let profile = null;

    try {
      profile = await store.dispatch(fetchProfile({ username: query.username }));
    } catch (err) {
      return processErrorWhileGetInitialProps(err, res, []);
    }

    return {
      // userId нужен в connect'е
      userId: profile.userId,
      username: profile.username,
      namespacesRequired: [],
    };
  }

  renderContent() {
    const { profile, isOwner, isAutoLogging, tab, tabProps } = this.props;

    if (!tab || (tab.isOwnerRequired && !isOwner)) {
      return (
        <>
          <TabLoader />
          {tab && isAutoLogging ? null : (
            <Redirect route="profile" params={{ username: profile.username }} hidden />
          )}
        </>
      );
    }

    return <tab.Component {...tabProps} userId={profile.userId} />;
  }

  renderProfile() {
    const { profile, isOwner, tabs } = this.props;

    return (
      <Wrapper>
        <Header>
          <ProfileHeader profile={profile} isOwner={isOwner} />
          <Tabs>
            <NavigationTabBar
              tabs={tabs}
              params={{ username: profile.username }}
              isOwner={isOwner}
            />
          </Tabs>
        </Header>
        <Content
          aside={() => (
            <>
              <UserCommunitiesWidget userId={profile.userId} />
              <Footer />
            </>
          )}
        >
          {this.renderContent()}
        </Content>
      </Wrapper>
    );
  }

  render() {
    const { profile } = this.props;

    if (!profile) {
      return (
        <Wrapper>
          <NotFound>Profile is not found</NotFound>
        </Wrapper>
      );
    }

    return this.renderProfile();
  }
}
