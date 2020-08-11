import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { tabInfoType } from 'types';
import { profileType } from 'types/common';
import { ProfileTab } from 'shared/constants';
import { FEATURE_USER_REFERRALS } from 'shared/featureFlags';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';
import withTabs from 'utils/hocs/withTabs';
import { fetchProfile } from 'store/actions/gate';

import Content from 'components/common/Content';
import Footer from 'components/common/Footer';
import NavigationTabBar from 'components/common/NavigationTabBar';
import Redirect from 'components/common/Redirect';
import TabLoader from 'components/common/TabLoader';
import ProfileMeta from 'components/meta/ProfileMeta';
import { ProfileHeader } from 'components/pages/profile';
import { LeaderInWidget, UserCommunitiesWidget } from 'components/widgets';
// import FollowingYouWidget from 'components/widgets/FollowingYouWidget';

const UserFeed = dynamic(() => import('containers/profile/Feed'));
const UserCommunities = dynamic(() => import('containers/profile/UserCommunities'));
const ProfileFollowers = dynamic(() => import('containers/profile/Followers'));
const ProfileFollowings = dynamic(() => import('containers/profile/Followings'));
const ProfileReferrals = dynamic(() => import('containers/profile/Referrals'));
const ProfileComments = dynamic(() => import('containers/profile/comments'));

const TABS = [
  {
    id: ProfileTab.FEED,
    tabLocaleKey: 'posts',
    route: 'profile',
    index: true,
    isOwnerRequired: false,
    Component: UserFeed,
  },
  {
    id: ProfileTab.COMMENTS,
    tabLocaleKey: 'comments',
    route: 'profile',
    isOwnerRequired: false,
    Component: ProfileComments,
  },
  {
    id: ProfileTab.COMMUNITIES,
    tabLocaleKey: 'my_communities',
    route: 'profile',
    isOwnerRequired: false,
    Component: UserCommunities,
  },
  {
    id: ProfileTab.FOLLOWERS,
    tabLocaleKey: 'followers',
    route: 'profile',
    isOwnerRequired: false,
    Component: ProfileFollowers,
  },
  {
    id: ProfileTab.FOLLOWINGS,
    tabLocaleKey: 'following',
    route: 'profile',
    isOwnerRequired: false,
    Component: ProfileFollowings,
  },
  {
    id: ProfileTab.REFERRALS,
    featureName: FEATURE_USER_REFERRALS,
    tabLocaleKey: 'referrals',
    route: 'profile',
    isOwnerRequired: true,
    Component: ProfileReferrals,
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

// hack for fixing overflow-y when overflow-x: hidden, need for issue #1768
const ContentStyled = styled(Content)`
  padding-top: 75px;
  margin-top: -75px;
`;

@withRouter
@withTabs(TABS, 'feed')
export default class UserProfile extends PureComponent {
  static propTypes = {
    username: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
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

      if (profile?.leaderIn?.length !== 0) {
        try {
          await LeaderInWidget.getInitialProps({ store, params: { userId: profile.userId } });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('Leader communities failed:', err);
        }
      }
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
    let stats;
    let editedTabs = tabs;

    if (profile) {
      stats = {
        [ProfileTab.FEED]: profile.stats.postsCount,
        [ProfileTab.COMMENTS]: profile.stats.commentsCount,
        [ProfileTab.COMMUNITIES]: profile.subscriptions.communitiesCount,
        [ProfileTab.FOLLOWERS]: profile.subscribers.usersCount,
        [ProfileTab.FOLLOWINGS]: profile.subscriptions.usersCount,
      };
    }

    if (!isOwner) {
      editedTabs = tabs.map(tab => {
        if (tab.id === ProfileTab.COMMUNITIES) {
          return {
            ...tab,
            tabLocaleKey: 'communities',
          };
        }

        return tab;
      });
    }

    return (
      <>
        <ProfileMeta profile={profile} />
        <Wrapper>
          <Header>
            <ProfileHeader profile={profile} isOwner={isOwner} />
            <Tabs>
              <NavigationTabBar
                tabs={isOwner ? tabs : editedTabs}
                tabsLocalePath="components.profile.tabs"
                params={{ username: profile.username }}
                isOwner={isOwner}
                stats={stats}
              />
            </Tabs>
          </Header>
          <ContentStyled
            aside={() => (
              <>
                {/* <FollowingYouWidget profile={profile} /> */}
                <UserCommunitiesWidget userId={profile.userId} />
                <LeaderInWidget userId={profile.userId} />
                <Footer />
              </>
            )}
          >
            {this.renderContent()}
          </ContentStyled>
        </Wrapper>
      </>
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
