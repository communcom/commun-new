import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';

import { tabInfoType } from 'types';
import withTabs from 'utils/hocs/withTabs';
import { LeaderBoardTab, ReportsSubTab } from 'shared/constants';
import { Router } from 'shared/routes';

import { CommunityFilterWidget } from 'components/widgets';
import Content, { StickyAside } from 'components/common/Content';
import Reports from 'containers/leaderboard/reports';
import Proposals from 'containers/leaderboard/proposals';
import TabLoader from 'components/common/TabLoader';
import AuthGuard from 'components/common/AuthGuard';
import SideBarNavigation from 'components/common/SideBarNavigation';

const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #fff;
  border-radius: 6px;
`;

const TabContent = styled.div``;

const SideBarNavigationStyled = styled(SideBarNavigation)`
  margin-top: 8px;
`;

const TABS = [
  {
    id: LeaderBoardTab.PROPOSALS,
    title: 'Proposals',
    route: 'leaderboard',
    params: { section: LeaderBoardTab.PROPOSALS },
    Component: Proposals,
    index: true,
  },
  {
    id: LeaderBoardTab.REPORTS,
    title: 'Reports',
    route: 'leaderboard',
    params: { section: LeaderBoardTab.REPORTS },
    Component: Reports,
    subRoutes: [
      {
        id: ReportsSubTab.POSTS,
        title: 'Posts',
        params: { section: LeaderBoardTab.REPORTS, subSection: ReportsSubTab.POSTS },
      },
      {
        id: ReportsSubTab.COMMENTS,
        title: 'Comments',
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

    selectCommunity: PropTypes.func.isRequired,
    clearCommunityFilter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tab: null,
    isAuthorized: false,
    canManage: false,
    isManageCommunitiesLoaded: false,
  };

  componentDidMount() {
    const { router, selectCommunity } = this.props;

    if (router.query.community) {
      const query = { ...router.query };
      delete query.community;

      selectCommunity({
        communityId: router.query.community,
      });

      Router.replaceRoute('leaderboard', query, { shallow: true });
    }
  }

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

    if (!isAuthorized || (isManageCommunitiesLoaded && !canManage)) {
      return <AuthGuard />;
    }

    return (
      <Content
        aside={() => (
          <StickyAside>
            <CommunityFilterWidget />
            <SideBarNavigationStyled sectionKey="section" subSectionKey="subSection" items={TABS} />
          </StickyAside>
        )}
      >
        <Filter>{/* <div>Filters</div> */}</Filter>
        <TabContent>{this.renderContent()}</TabContent>
      </Content>
    );
  }
}
