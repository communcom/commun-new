import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { tabInfoType } from 'types';
import { LeaderBoardTab, ReportsSubTab, SettingsdTab } from 'shared/constants';
import withTabs from 'utils/hocs/withTabs';

import Proposals from 'containers/leaderboard/proposals';
import Reports from 'containers/leaderboard/reports';
import AuthGuard from 'components/common/AuthGuard';
import Content, { StickyAside } from 'components/common/Content';
import Redirect from 'components/common/Redirect';
import SideBarNavigation from 'components/common/SideBarNavigation';
import TabLoader from 'components/common/TabLoader';
import { CommunityFilterWidget } from 'components/widgets';

const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
`;

const TabContent = styled.div``;

const SideBarNavigationStyled = styled(SideBarNavigation)`
  margin-bottom: 8px;
`;

const TABS = [
  {
    id: LeaderBoardTab.PROPOSALS,
    tabLocaleKey: 'proposals',
    route: 'leaderboard',
    params: { section: LeaderBoardTab.PROPOSALS },
    Component: Proposals,
    index: true,
  },
  {
    id: LeaderBoardTab.REPORTS,
    tabLocaleKey: 'reports',
    route: 'leaderboard',
    params: { section: LeaderBoardTab.REPORTS },
    Component: Reports,
    defaultTab: ReportsSubTab.POSTS,
    subRoutes: [
      {
        id: ReportsSubTab.POSTS,
        tabLocaleKey: 'posts',
        params: { section: LeaderBoardTab.REPORTS, subSection: ReportsSubTab.POSTS },
      },
      {
        id: ReportsSubTab.COMMENTS,
        tabLocaleKey: 'comments',
        params: { section: LeaderBoardTab.REPORTS, subSection: ReportsSubTab.COMMENTS },
      },
    ],
  },
];

@withRouter
@withTabs(TABS, LeaderBoardTab.PROPOSALS)
export default class LeaderBoard extends Component {
  static propTypes = {
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.object.isRequired,
    isAuthorized: PropTypes.bool,
    canManage: PropTypes.bool,
    isManageCommunitiesLoaded: PropTypes.bool,

    clearCommunityFilter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tab: null,
    isAuthorized: false,
    canManage: false,
    isManageCommunitiesLoaded: false,
  };

  componentWillUnmount() {
    const { clearCommunityFilter } = this.props;
    clearCommunityFilter();
  }

  renderContent() {
    const { tab, tabProps } = this.props;

    if (!tab) {
      return <TabLoader />;
    }

    return <tab.Component {...tabProps} />;
  }

  render() {
    const { isAuthorized, canManage, isManageCommunitiesLoaded } = this.props;

    if (!isAuthorized || (!isManageCommunitiesLoaded && !canManage)) {
      return <AuthGuard />;
    }

    if (isManageCommunitiesLoaded && !canManage) {
      return <Redirect route="home" />;
    }

    return (
      <Content
        aside={() => (
          <StickyAside>
            <SideBarNavigationStyled
              sectionKey="section"
              subSectionKey="subSection"
              tabsLocalePath="components.leaderboard.tabs"
              items={TABS}
            />
            <CommunityFilterWidget />
          </StickyAside>
        )}
      >
        <Filter>{/* <div>Filters</div> */}</Filter>
        <TabContent>{this.renderContent()}</TabContent>
      </Content>
    );
  }
}
