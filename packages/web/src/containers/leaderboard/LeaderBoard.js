import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';

import { tabInfoType } from 'types';
import withTabs from 'utils/hocs/withTabs';
import { LeaderBoardTab } from 'shared/constants';
import { Router } from 'shared/routes';

import { CommunityFilterWidget } from 'components/widgets';
import Content, { StickyAside } from 'components/common/Content';
import Reports from 'containers/leaderboard/reports';
import Proposals from 'containers/leaderboard/proposals';
import TabLoader from 'components/common/TabLoader';
import NavigationTabBar from 'components/common/NavigationTabBar';
import AuthGuard from 'components/common/AuthGuard';
import { TabLink } from 'components/common/TabBar/TabBar';

const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #ffffff;
  border-radius: 6px;
`;

const TabContent = styled.div`
  margin-top: 20px;
`;

const Container = styled.ul`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(2, auto);
`;

const TabLinkStyled = styled(TabLink)`
  padding: 0;
`;

const TABS = [
  {
    id: LeaderBoardTab.REPORTS,
    tabName: 'Reports',
    route: 'leaderboard',
    index: true,
    Component: Reports,
  },
  {
    id: LeaderBoardTab.PROPOSALS,
    tabName: 'Proposals',
    route: 'leaderboard',
    Component: Proposals,
  },
];

@withRouter
@withTabs(TABS, LeaderBoardTab.REPORTS)
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
    const { tabs, isAuthorized, canManage, isManageCommunitiesLoaded } = this.props;

    if (!isAuthorized || (isManageCommunitiesLoaded && !canManage)) {
      return <AuthGuard />;
    }

    return (
      <Content
        aside={() => (
          <StickyAside>
            <CommunityFilterWidget />
          </StickyAside>
        )}
      >
        <Filter>
          <NavigationTabBar
            tabs={tabs}
            renderContainer={props => <Container {...props} />}
            renderTabLink={props => <TabLinkStyled {...props} />}
          />
          {/* <div>Filters</div> */}
        </Filter>
        <TabContent>{this.renderContent()}</TabContent>
      </Content>
    );
  }
}
