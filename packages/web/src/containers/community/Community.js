import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { communityType } from 'types/common';
import Redirect from 'components/Redirect';
import Footer from 'components/Footer';
import NavigationTabBar from 'components/NavigationTabBar';
import TrendingCommunities from 'components/TrendingCommunities';
import { CommunityHeader, LeadersWidget, MembersWidget } from 'components/community';
// import Advertisement, { COMMUNITY_PAGE_ADV_ID } from 'components/Advertisement';
import withTabs from 'utils/hocs/withTabs';
import { SIDE_BAR_MARGIN } from 'shared/constants';
import { FEATURE_COMMUNITY_MEMBERS, FEATURE_COMMUNITY_LEADERS } from 'shared/feature-flags';

const CommunityFeed = dynamic(() => import('./CommunityFeed'));
const Description = dynamic(() => import('./Description'));
const Rules = dynamic(() => import('./Rules'));
const Members = dynamic(() => import('./Members'));
const Leaders = dynamic(() => import('./Leaders'));

const TABS = {
  feed: {
    tabName: 'Feed',
    route: 'community',
    index: true,
    Component: CommunityFeed,
  },
  info: {
    tabName: 'Description',
    route: 'communitySection',
    Component: Description,
  },
  rules: {
    tabName: 'Rules',
    route: 'communitySection',
    Component: Rules,
  },
  leaders: {
    tabName: 'Leaders',
    route: 'communitySection',
    Component: Leaders,
    featureName: FEATURE_COMMUNITY_LEADERS,
  },
  members: {
    tabName: 'Members',
    route: 'communitySection',
    Component: Members,
    featureName: FEATURE_COMMUNITY_MEMBERS,
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
export default class Community extends PureComponent {
  static propTypes = {
    communityAlias: PropTypes.string.isRequired,
    community: communityType,
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    tabs: PropTypes.shape({}).isRequired,
    tab: PropTypes.shape({}).isRequired,
    tabProps: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    community: null,
  };

  static async getInitialProps({ query }) {
    return {
      communityAlias: query.communityAlias,
      namespacesRequired: [],
    };
  }

  renderContent() {
    const { tab, tabProps, communityAlias } = this.props;

    if (!tab) {
      return <Redirect route="community" params={{ communityAlias }} isTab />;
    }

    return <tab.Component {...tabProps} />;
  }

  render() {
    const { tabs, community } = this.props;

    if (!community) {
      return 'Community not found';
    }

    return (
      <Wrapper>
        <Header>
          <CommunityHeader community={community} />
          <NavigationTabBar tabs={tabs} params={{ communityId: community.id }} isCommunity />
        </Header>
        <Content>
          <Left>{this.renderContent()}</Left>
          <Right>
            <Aside>
              <MembersWidget communityId={community.id} />
              <TrendingCommunities isCommunity />
              <LeadersWidget communityId={community.id} />
              {/* <Advertisement advId={COMMUNITY_PAGE_ADV_ID} /> */}
              <Footer />
            </Aside>
          </Right>
        </Content>
      </Wrapper>
    );
  }
}
