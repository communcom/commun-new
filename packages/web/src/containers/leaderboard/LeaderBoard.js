import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';
import { withRouter } from 'next/router';

import { CONTAINER_DESKTOP_PADDING } from '@commun/ui';

import { tabInfoType } from 'types';
import withTabs from 'utils/hocs/withTabs';
import { LeaderBoardTab, RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';

import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import { LeaderCommunitiesWidget } from 'components/widgets';
import Content from 'components/common/Content';
import Reports from 'containers/leaderboard/reports';
import Proposals from 'containers/leaderboard/proposals';
import TabLoader from 'components/common/TabLoader/TabLoader';
import NavigationTabBar from 'components/common/NavigationTabBar';
import { TabLink } from 'components/common/TabBar/TabBar';

const RightWrapper = styled.div`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
`;

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
    tabProps: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    tab: null,
  };

  renderContent() {
    const { tab, tabProps } = this.props;

    if (!tab) {
      return <TabLoader />;
    }

    return <tab.Component {...tabProps} />;
  }

  render() {
    const { tabs } = this.props;

    return (
      <Content
        aside={() => (
          <RightWrapper>
            <Sticky top={HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING}>
              <LeaderCommunitiesWidget />
            </Sticky>
          </RightWrapper>
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
