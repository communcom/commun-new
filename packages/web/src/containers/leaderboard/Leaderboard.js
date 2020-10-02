import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { Icon } from '@commun/icons';

import { tabInfoType } from 'types';
import {
  CommunitySettingsSubTab,
  LeaderboardTab,
  MembersSubTab,
  ProposalsSubTab,
  ReportsSubTab,
} from 'shared/constants';
import { FEATURE_COMMUNITY_MANAGE } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';
import withTabs from 'utils/hocs/withTabs';
import { fetchCommunity } from 'store/actions/gate';

import Leaders from 'containers/common/Leaders';
import ManagedCommunities from 'containers/leaderboard/common/ManagedCommunities';
import Banned from 'containers/leaderboard/members/banned';
import Members from 'containers/leaderboard/members/members';
import Proposals from 'containers/leaderboard/proposals';
import Reports from 'containers/leaderboard/reports';
import General from 'containers/leaderboard/settings/general';
import Rules from 'containers/leaderboard/settings/rules';
import AuthGuard from 'components/common/AuthGuard';
import Content, { StickyAside } from 'components/common/Content';
import Redirect from 'components/common/Redirect';
import SideBarNavigation from 'components/common/SideBarNavigation/SideBarNavigation.connect';
import TabLoader from 'components/common/TabLoader';
import { CommunityLink } from 'components/links';
import CommunityLeaderboardWidget from 'components/widgets/CommunityLeaderboardWidget';

const ContentStyled = styled(Content)`
  overflow: hidden;
`;

const MobileHeader = styled.header`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px 15px;
  background-color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
`;

const BackLink = styled.a`
  position: absolute;
  top: 10px;
  left: 0;
  display: flex;
  padding: 10px 20px;
  color: ${({ theme }) => theme.colors.black};
`;

const BackIcon = styled(Icon).attrs({ name: 'arrow-back' })`
  width: 12px;
  height: 20px;
`;

const MobileNavigationWrapper = styled.div`
  display: flex;
  padding: 10px 0 10px 15px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const SideBarNavigationStyled = styled(SideBarNavigation)`
  margin-bottom: 8px;
`;

const TabContent = styled.div``;

const TABS = communityAlias => [
  {
    id: LeaderboardTab.REPORTS,
    tabLocaleKey: 'reports',
    route: 'leaderboard',
    params: { communityAlias, section: LeaderboardTab.REPORTS },
    Component: Reports,
    defaultTab: ReportsSubTab.POSTS,
    subRoutes: [
      // {
      //   id: ReportsSubTab.ALL,
      //   tabLocaleKey: 'all',
      //   params: {
      //     communityAlias,
      //     section: LeaderboardTab.REPORTS,
      //     subSection: ReportsSubTab.ALL,
      //   },
      // },
      {
        id: ReportsSubTab.POSTS,
        tabLocaleKey: 'posts',
        params: {
          communityAlias,
          section: LeaderboardTab.REPORTS,
          subSection: ReportsSubTab.POSTS,
        },
      },
      {
        id: ReportsSubTab.COMMENTS,
        tabLocaleKey: 'comments',
        params: {
          communityAlias,
          section: LeaderboardTab.REPORTS,
          subSection: ReportsSubTab.COMMENTS,
        },
      },
      // {
      //   id: ReportsSubTab.ARCHIVE,
      //   tabLocaleKey: 'archive',
      //   params: {
      //     communityAlias,
      //     section: LeaderboardTab.REPORTS,
      //     subSection: ReportsSubTab.ARCHIVE,
      //   },
      // },
    ],
  },
  {
    id: LeaderboardTab.PROPOSALS,
    tabLocaleKey: 'proposals',
    index: true,
    route: 'leaderboard',
    params: { communityAlias, section: LeaderboardTab.PROPOSALS },
    Component: Proposals,
    defaultTab: ProposalsSubTab.ALL,
    subRoutes: [
      {
        id: ProposalsSubTab.ALL,
        tabLocaleKey: 'all',
        params: {
          communityAlias,
          section: LeaderboardTab.PROPOSALS,
          subSection: ProposalsSubTab.ALL,
        },
      },
      {
        id: ProposalsSubTab.BAN,
        tabLocaleKey: 'ban',
        params: {
          communityAlias,
          section: LeaderboardTab.PROPOSALS,
          subSection: ProposalsSubTab.BAN,
        },
      },
      {
        id: ProposalsSubTab.USERS,
        tabLocaleKey: 'users',
        params: {
          communityAlias,
          section: LeaderboardTab.PROPOSALS,
          subSection: ProposalsSubTab.USERS,
        },
      },
      {
        id: ProposalsSubTab.UPDATES,
        tabLocaleKey: 'updates',
        params: {
          communityAlias,
          section: LeaderboardTab.PROPOSALS,
          subSection: ProposalsSubTab.UPDATES,
        },
      },
      // {
      //   id: ProposalsSubTab.ARCHIVE,
      //   tabLocaleKey: 'archive',
      //   params: {
      //     communityAlias,
      //     section: LeaderboardTab.PROPOSALS,
      //     subSection: ProposalsSubTab.ARCHIVE,
      //   },
      // },
    ],
  },
  {
    id: LeaderboardTab.MEMBERS,
    featureName: FEATURE_COMMUNITY_MANAGE,
    tabLocaleKey: 'members',
    route: 'leaderboard',
    params: { communityAlias, section: LeaderboardTab.MEMBERS },
    defaultTab: MembersSubTab.MEMBERS,
    subRoutes: [
      {
        id: MembersSubTab.LEADERS,
        tabLocaleKey: 'leaders',
        params: {
          communityAlias,
          section: LeaderboardTab.MEMBERS,
          subSection: MembersSubTab.LEADERS,
        },
        Component: Leaders,
      },
      {
        id: MembersSubTab.MEMBERS,
        tabLocaleKey: 'members',
        params: {
          communityAlias,
          section: LeaderboardTab.MEMBERS,
          subSection: MembersSubTab.MEMBERS,
        },
        Component: Members,
      },
      {
        id: MembersSubTab.BANNED,
        tabLocaleKey: 'banned',
        params: {
          communityAlias,
          section: LeaderboardTab.MEMBERS,
          subSection: MembersSubTab.BANNED,
        },
        Component: Banned,
      },
    ],
  },
  {
    id: LeaderboardTab.SETTINGS,
    featureName: FEATURE_COMMUNITY_MANAGE,
    tabLocaleKey: 'settings',
    route: 'leaderboard',
    params: { communityAlias, section: LeaderboardTab.SETTINGS },
    defaultTab: CommunitySettingsSubTab.GENERAL,
    subRoutes: [
      {
        id: CommunitySettingsSubTab.GENERAL,
        tabLocaleKey: 'general',
        params: {
          communityAlias,
          section: LeaderboardTab.SETTINGS,
          subSection: CommunitySettingsSubTab.GENERAL,
        },
        Component: General,
      },
      {
        id: CommunitySettingsSubTab.RULES,
        tabLocaleKey: 'rules',
        params: {
          communityAlias,
          section: LeaderboardTab.SETTINGS,
          subSection: CommunitySettingsSubTab.RULES,
        },
        Component: Rules,
      },
    ],
  },
];

@withRouter
@withTranslation()
@withTabs(TABS(), LeaderboardTab.PROPOSALS)
export default class Leaderboard extends Component {
  static propTypes = {
    communityId: PropTypes.string,
    communityAlias: PropTypes.string,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.object.isRequired,
    isAuthorized: PropTypes.bool,
    isDesktop: PropTypes.bool,
    canManage: PropTypes.bool,
    router: PropTypes.shape({
      query: PropTypes.object,
    }).isRequired,
  };

  static defaultProps = {
    communityId: undefined,
    communityAlias: undefined,
    tab: null,
    isAuthorized: false,
    isDesktop: false,
    canManage: false,
  };

  static async getInitialProps({ query, store, res }) {
    let community = {};

    if (query.communityAlias) {
      try {
        community = await store.dispatch(
          fetchCommunity({
            communityAlias: query.communityAlias,
          })
        );
      } catch (err) {
        return processErrorWhileGetInitialProps(err, res, []);
      }
    }

    return {
      communityId: community.communityId,
      communityAlias: community.alias,
      namespacesRequired: [],
    };
  }

  renderContent() {
    const { communityId, tab, tabProps, router } = this.props;

    if (!tab) {
      return <TabLoader />;
    }

    if (!communityId) {
      return <ManagedCommunities />;
    }

    return (
      <tab.Component communityId={communityId} subSection={router.query.subSection} {...tabProps} />
    );
  }

  renderSidebarWidgets() {
    const { communityId, communityAlias } = this.props;

    return (
      <CommunityLeaderboardWidget communityId={communityId}>
        <SideBarNavigationStyled
          sectionKey="section"
          subSectionKey="subSection"
          tabsLocalePath="components.leaderboard.tabs"
          items={TABS(communityAlias)}
        />
      </CommunityLeaderboardWidget>
    );
  }

  render() {
    const { communityAlias, isAuthorized, isDesktop, canManage, t } = this.props;

    if (!isAuthorized || !canManage) {
      return <AuthGuard />;
    }

    if (!canManage) {
      return <Redirect route="home" />;
    }

    return (
      <ContentStyled
        isMobile={!isDesktop}
        aside={() => <StickyAside>{this.renderSidebarWidgets()}</StickyAside>}
      >
        <TabContent>
          {!isDesktop ? (
            <>
              <MobileHeader>
                <CommunityLink community={communityAlias}>
                  <BackLink>
                    <BackIcon />
                  </BackLink>
                </CommunityLink>
                {t('components.leaderboard.title')}
              </MobileHeader>
              <MobileNavigationWrapper>
                <SideBarNavigation
                  sectionKey="section"
                  subSectionKey="subSection"
                  tabsLocalePath="components.leaderboard.tabs"
                  items={TABS(communityAlias)}
                  isRow
                />
              </MobileNavigationWrapper>
            </>
          ) : null}
          {this.renderContent()}
        </TabContent>
      </ContentStyled>
    );
  }
}
