import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { tabInfoType } from 'types';
import {
  CommunitySettingsSubTab,
  LeaderboardTab,
  MembersSubTab,
  ProposalsSubTab,
  ReportsSubTab,
} from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';
import withTabs from 'utils/hocs/withTabs';
import { fetchCommunity } from 'store/actions/gate';

import Leaders from 'containers/common/Leaders';
import Members from 'containers/common/Members';
import Banned from 'containers/leaderboard/members/banned';
import Proposals from 'containers/leaderboard/proposals';
import Reports from 'containers/leaderboard/reports';
import Settings from 'containers/leaderboard/settings';
import AuthGuard from 'components/common/AuthGuard';
import Content, { StickyAside } from 'components/common/Content';
import EmptyList from 'components/common/EmptyList/EmptyList';
import Redirect from 'components/common/Redirect';
import SideBarNavigation from 'components/common/SideBarNavigation/SideBarNavigation.connect';
import TabLoader from 'components/common/TabLoader';
import CommunityLeaderboardWidget from 'components/widgets/CommunityLeaderboardWidget';

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
      // {
      //   id: ProposalsSubTab.BAN,
      //   tabLocaleKey: 'ban',
      //   params: {
      //     communityAlias,
      //     section: LeaderboardTab.PROPOSALS,
      //     subSection: ProposalsSubTab.BAN,
      //   },
      // },
      // {
      //   id: ProposalsSubTab.USERS,
      //   tabLocaleKey: 'users',
      //   params: {
      //     communityAlias,
      //     section: LeaderboardTab.PROPOSALS,
      //     subSection: ProposalsSubTab.USERS,
      //   },
      // },
      // {
      //   id: ProposalsSubTab.UPDATES,
      //   tabLocaleKey: 'updates',
      //   params: {
      //     communityAlias,
      //     section: LeaderboardTab.PROPOSALS,
      //     subSection: ProposalsSubTab.UPDATES,
      //   },
      // },
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
    tabLocaleKey: 'settings',
    route: 'leaderboard',
    params: { communityAlias, section: LeaderboardTab.SETTINGS },
    Component: Settings,
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
      },
      // {
      //   id: CommunitySettingsSubTab.RULES,
      //   tabLocaleKey: 'rules',
      //   params: {
      //     communityAlias,
      //     section: LeaderboardTab.SETTINGS,
      //     subSection: CommunitySettingsSubTab.RULES,
      //   },
      // },
    ],
  }
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
    const { communityId, tab, tabProps, t } = this.props;

    if (!tab) {
      return <TabLoader />;
    }

    if (!communityId) {
      return <EmptyList noIcon subText={t('components.leaderboard.no_found_desc')} />;
    }

    return <tab.Component communityId={communityId} {...tabProps} />;
  }

  render() {
    const { communityId, communityAlias, isAuthorized, isDesktop, canManage } = this.props;

    if (!isAuthorized || !canManage) {
      return <AuthGuard />;
    }

    if (!canManage) {
      return <Redirect route="home" />;
    }

    return (
      <Content
        isMobile={!isDesktop}
        aside={() => (
          <StickyAside>
            <CommunityLeaderboardWidget communityId={communityId}>
              <SideBarNavigationStyled
                sectionKey="section"
                subSectionKey="subSection"
                tabsLocalePath="components.leaderboard.tabs"
                items={TABS(communityAlias)}
              />
            </CommunityLeaderboardWidget>
          </StickyAside>
        )}
      >
        <TabContent>
          {!isDesktop ? (
            <MobileNavigationWrapper>
              <SideBarNavigation
                sectionKey="section"
                subSectionKey="subSection"
                tabsLocalePath="components.leaderboard.tabs"
                items={TABS(communityAlias)}
                isRow
              />
            </MobileNavigationWrapper>
          ) : null}
          {this.renderContent()}
        </TabContent>
      </Content>
    );
  }
}
