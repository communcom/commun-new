import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { tabInfoType } from 'types';
import { LeaderboardTab, ReportsSubTab } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';
import withTabs from 'utils/hocs/withTabs';
import { fetchCommunity } from 'store/actions/gate';

import Proposals from 'containers/leaderboard/proposals';
import Reports from 'containers/leaderboard/reports';
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
    id: LeaderboardTab.PROPOSALS,
    tabLocaleKey: 'proposals',
    route: 'leaderboard',
    params: { communityAlias, section: LeaderboardTab.PROPOSALS },
    Component: Proposals,
    index: true,
  },
  {
    id: LeaderboardTab.REPORTS,
    tabLocaleKey: 'reports',
    route: 'leaderboard',
    params: { communityAlias, section: LeaderboardTab.REPORTS },
    Component: Reports,
    defaultTab: ReportsSubTab.POSTS,
    subRoutes: [
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
  };

  static defaultProps = {
    communityId: undefined,
    communityAlias: undefined,
    tab: null,
    isAuthorized: false,
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
